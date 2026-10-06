import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // 1. Verificação de Segurança
    const token = cookies().get('iuaix_token')?.value;
    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });

    const JWT_SECRET = getJwtSecret();
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const giverId = payload.sub as string;

    const body = await request.json();
    const { jobId, stars, comment } = body;

    if (!jobId || typeof stars !== 'number' || stars < 1 || stars > 5) {
      return NextResponse.json({ error: 'Dados de avaliação inválidos.' }, { status: 400 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) return NextResponse.json({ error: 'Job não encontrado' }, { status: 404 });

    // Descobre quem é o receiverId baseado em quem está dando a nota
    const receiverId = (giverId === job.clientId) ? job.creativeId : job.clientId;
    if (!receiverId) return NextResponse.json({ error: 'Recebedor não encontrado' }, { status: 400 });

    // Marca o Job como concluído e finaliza o SLA
    await prisma.job.update({
      where: { id: jobId },
      data: { status: 'completed' }
    });

    // 2. Salva o Review individual
    const review = await prisma.review.create({
      data: {
        jobId,
        giverId,
        receiverId,
        stars,
        comment
      }
    });

    // 3. Recalcula a Nota Média (SLA) do Usuário que recebeu a nota
    const allReviews = await prisma.review.findMany({
      where: { receiverId },
      select: { stars: true }
    });

    const totalStars = allReviews.reduce((acc, curr) => acc + curr.stars, 0);
    const newAverage = totalStars / allReviews.length;

    const updatedUser = await prisma.user.update({
      where: { id: receiverId },
      data: {
        ratingScore: newAverage,
        reviewsCount: allReviews.length
      },
      include: { sponsor: true } // Puxa o Padrinho junto para analisar
    });

    // 4. Lógica de Skin in the Game (O Risco do Padrinho)
    // Se o criativo tem um Padrinho (sponsor), o padrinho é afetado.
    if (updatedUser.role === 'criativo' && updatedUser.sponsorId) {
      const sponsor = updatedUser.sponsor;
      
      // Se a entrega foi EXCELENTE (5 estrelas): Bônus pro Padrinho
      if (stars === 5) {
        await prisma.user.update({
          where: { id: updatedUser.sponsorId },
          data: { tokens: { increment: 1 } } // Bônus simbólico (1 token) pelo ótimo desempenho do afilhado
        });
        console.log(`Bônus concedido ao padrinho ${updatedUser.sponsorId} pela entrega excelente.`);
      }
      
      // Se a entrega foi RUIM ou MÁ FÉ (1 ou 2 estrelas): Penalidade pro Padrinho
      if (stars <= 2) {
        // Reduz o ratingScore do Veterano levemente, impactando o Matchmaking dele no futuro
        const penaltyScore = sponsor!.ratingScore > 1 ? sponsor!.ratingScore - 0.1 : 1;
        await prisma.user.update({
          where: { id: updatedUser.sponsorId },
          data: { ratingScore: penaltyScore }
        });
        console.log(`Penalidade aplicada ao padrinho ${updatedUser.sponsorId}. Novo SLA dele: ${penaltyScore}`);
      }
    }

    // 5. Promoção Automática na Guilda (Novato -> Veterano)
    if (updatedUser.role === 'criativo' && updatedUser.rank === 'novato' && allReviews.length >= 5 && newAverage >= 4.8) {
      await prisma.user.update({
        where: { id: receiverId },
        data: { rank: 'veterano', sponsorId: null } // Se gradua e não precisa mais do padrinho
      });
      console.log(`Profissional ${receiverId} promovido a VETERANO!`);
    }

    return NextResponse.json({ success: true, newAverage });

  } catch (error) {
    console.error('Erro ao salvar review:', error);
    return NextResponse.json({ error: 'Erro interno no motor de avaliação' }, { status: 500 });
  }
}
