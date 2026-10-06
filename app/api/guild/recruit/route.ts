import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET: Lista os Novatos disponíveis para adoção
export async function GET(request: Request) {
  try {
    const newbies = await prisma.user.findMany({
      where: { 
        role: 'criativo', 
        rank: 'novato',
        accountStatus: 'awaiting_sponsor',
        sponsorId: null
      },
      select: {
        id: true,
        name: true,
        portfolioUrl: true,
        createdAt: true
      },
      orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json({ success: true, newbies });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao listar candidatos' }, { status: 500 });
  }
}

// POST: O Veterano apadrinha um Novato
export async function POST(request: Request) {
  try {
    // 1. Auth check
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = getJwtSecret();
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const veteranId = payload.sub as string;

    // 2. Verificar se quem chama é realmente um Veterano Opt-in
    const veteran = await prisma.user.findUnique({ where: { id: veteranId } });
    if (!veteran || veteran.rank !== 'veterano' || !veteran.isMentorOptIn) {
      return NextResponse.json({ error: 'Apenas Veteranos com Opt-In ativo podem apadrinhar.' }, { status: 403 });
    }

    const { novatoId } = await request.json();
    if (!novatoId) return NextResponse.json({ error: 'ID do novato não fornecido.' }, { status: 400 });

    // 3. Confirmar se o Novato ainda está disponível
    const newbie = await prisma.user.findUnique({ where: { id: novatoId } });
    if (!newbie || newbie.accountStatus !== 'awaiting_sponsor' || newbie.sponsorId) {
      return NextResponse.json({ error: 'Este novato já foi apadrinhado ou não está elegível.' }, { status: 409 });
    }

    // 4. Executar o Vínculo de Sangue (Skin in the Game)
    const updatedNewbie = await prisma.user.update({
      where: { id: novatoId },
      data: {
        sponsorId: veteran.id,
        accountStatus: 'active' // Agora ele pode receber Jobs pelo Matchmaking
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Você apadrinhou ${updatedNewbie.name} com sucesso. Ele agora pode operar.` 
    });

  } catch (error) {
    console.error('Erro no apadrinhamento:', error);
    return NextResponse.json({ error: 'Erro interno ao processar apadrinhamento' }, { status: 500 });
  }
}
