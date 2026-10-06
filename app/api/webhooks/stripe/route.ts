import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  const body = await request.text();
  const sig = headers().get('stripe-signature');
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!sig || !endpointSecret || !process.env.STRIPE_SECRET_KEY) {
      // Em modo local/simulação, podemos não ter as chaves configuradas
      return NextResponse.json({ error: 'Faltam assinaturas de segurança' }, { status: 400 });
    }
    
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    // Verifica criptograficamente se o evento veio mesmo da Stripe (Anti-Fraude)
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
  }

  // Lida com o evento de pagamento com sucesso
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const tokensBought = parseInt(session.metadata?.tokensQuantity || '0');
    const planName = session.metadata?.planName || 'Avulso';
    // Precisaríamos do ID do cliente no metadata para atualizar a conta correta
    const userId = session.client_reference_id; 

    if (userId && tokensBought > 0) {
      try {
        // Atualiza no Banco de Dados Seguro
        await prisma.user.update({
          where: { id: userId },
          data: {
            tokens: { increment: tokensBought }
          }
        });

        await prisma.transaction.create({
          data: {
            userId: userId,
            plan: planName,
            tokens: tokensBought,
            amount: (session.amount_total || 0) / 100,
            status: 'completed'
          }
        });
      } catch (dbError) {
        console.error('Erro ao salvar no banco:', dbError);
        return NextResponse.json({ error: 'Erro de Banco de Dados' }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
