import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, assetType, content, assetUrl } = body;

    if (!userId || !content) {
      return NextResponse.json({ error: 'Usuário e conteúdo são obrigatórios.' }, { status: 400 });
    }

    const vault = await prisma.brandVault.create({
      data: {
        clientId: userId,
        assetUrl: assetUrl || 'generative-ai',
        assetType: assetType || 'rules',
        content: JSON.stringify(content)
      }
    });

    return NextResponse.json({ success: true, vault });
  } catch (error: any) {
    console.error('Erro ao salvar Brand Vault:', error);
    return NextResponse.json({ error: 'Erro ao salvar regras no banco de dados.' }, { status: 500 });
  }
}
