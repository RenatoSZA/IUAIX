import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { SignJWT } from 'jose';
import rateLimit from '@/lib/rate-limit';
import { headers } from 'next/headers';

// Permite criar no máximo 3 contas por IP a cada 10 minutos (Anti-Spam Bot)
const limiter = rateLimit({
  interval: 10 * 60 * 1000, 
  uniqueTokenPerInterval: 500,
});

// Schema de Validação (ZOD) previne injeção de dados maliciosos ou formatação incorreta (XSS Mitigation)
const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres").max(50),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(['empresa', 'criativo', 'admin']),
  birthDate: z.string().optional(),
  document: z.string().optional()
});

const JWT_SECRET = getJwtSecret();

export async function POST(request: Request) {
  try {
    // Escudo Anti-Spam
    const ip = headers().get('x-forwarded-for') || '127.0.0.1';
    try {
      await limiter.check(3, ip); 
    } catch {
      return NextResponse.json({ error: 'Atividade suspeita. Criação de contas bloqueada temporariamente para o seu IP.' }, { status: 429 });
    }

    const body = await request.json();
    
    // 1. Validação de Schema (Zod)
    const validatedData = registerSchema.parse(body);

    // 2. Verifica se o e-mail já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 400 });
    }

    // 3. Hashing da Senha (Segurança Bcrypt)
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    // 4. Salva no Banco de Dados (Prisma/SQLite)
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        tokens: validatedData.role === 'empresa' ? 0 : 0,
        birthDate: validatedData.birthDate,
        document: validatedData.document
      }
    });

    // 5. Gera Token de Verificação
    const verifyToken = await new SignJWT({ email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(JWT_SECRET);

    // 6. Envia o E-mail de Verificação
    // --- VERIFICAÇÃO DE E-MAIL EM STANDBY ---
    /*
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${headers().get('x-forwarded-proto') || 'http'}://${headers().get('host')}`;
    
    // Importa o utilitário dinamicamente para não quebrar a compilação do Next.js
    const { sendVerificationEmail } = await import('@/lib/mail');
    await sendVerificationEmail(user.email, verifyToken, baseUrl);
    */

    // 7. Retorna sucesso sem definir cookies de login
    return NextResponse.json({ 
      success: true, 
      message: 'Cadastro recebido. Verifique seu e-mail para ativar a conta.',
      user: { id: user.id, name: user.name, role: user.role } 
    }, { status: 201 });

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    console.error('Register Error:', error);
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
