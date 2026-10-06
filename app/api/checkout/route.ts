import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    // Se não tiver chave configurada, retorna um aviso para o Front-end usar o modo de simulação
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: 'STRIPE_KEYS_MISSING', message: 'Modo Simulação Ativo' }, { status: 400 });
    }

    // Inicializa o Stripe (Só vai funcionar se tiver a chave no .env)
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const body = await request.json();
    const { plan, tokens, amount } = body;

    // Criando a sessão do Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // No Brasil aceita PIX tbm se configurado na dashboard
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Pacote Iuaix DaaS: ${plan}`,
              description: `Recarga de ${tokens} TKNS para uso em infraestrutura criativa.`,
            },
            unit_amount: amount * 100, // Stripe usa centavos (Ex: R$ 150,00 = 15000)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Redirecionamentos pós-pagamento
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?payment_success=true&tokens=${tokens}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout?plan=${plan}&canceled=true`,
      metadata: {
        planName: plan,
        tokensQuantity: tokens
      }
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Erro no Stripe:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
