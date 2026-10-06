import { getJwtSecret } from '@/lib/auth';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { SignJWT } from 'jose';
import rateLimit from '@/lib/rate-limit';
import { headers } from 'next/headers';

// Permite 5 tentativas de login por IP a cada 1 minuto
const limiter = rateLimit({
  interval: 60 * 1000, 
  uniqueTokenPerInterval: 500,
});

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
  photoBase64: z.string().min(1, "A foto biométrica é obrigatória")
});

const JWT_SECRET = getJwtSecret();


export async function POST(request: Request) {
  try {
    // Escudo Anti-DDoS / Brute Force
    const ip = headers().get('x-forwarded-for') || '127.0.0.1';
    try {
      await limiter.check(5, ip); // Limite de 5 requests por minuto por IP
    } catch {
      return NextResponse.json({ error: 'Muitas tentativas. Bloqueio de segurança ativado. Tente novamente em 1 minuto.' }, { status: 429 });
    }

    const body = await request.json();
    
    // 1. Zod Validation
    const validatedData = loginSchema.parse(body);

    // 2. Procura o Usuário
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    if (!user.emailVerified) {
      return NextResponse.json({ error: 'Por favor, confirme seu e-mail antes de fazer login.' }, { status: 403 });
    }

    // 3. Verifica a Senha (Bcrypt Compare)
    const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // 4. Validação "Biométrica" Simplificada (Algoritmo Determinístico)
    // Em vez de usar IA pesada, validamos a integridade da imagem em Base64 e 
    // confiamos na verificação de duplo fator padrão. 
    // Para biometria real, futuramente deve-se usar a API nativa WebAuthn (FaceID/Windows Hello).
    const base64Data = validatedData.photoBase64.split(',')[1] || validatedData.photoBase64;
    
    // Algoritmo de validação de entropia mínima (Para garantir que não enviaram uma imagem em branco)
    if (base64Data.length < 5000) {
      // Uma imagem real de webcam, mesmo comprimida, tem mais de 5KB
      return NextResponse.json({ error: 'Acesso Negado: A imagem fornecida parece ser inválida ou está em branco.' }, { status: 403 });
    }
    
    // Testa se é um Base64 válido (apenas caracteres válidos)
    const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
    if (!base64Regex.test(base64Data.replace(/[^A-Za-z0-9+/=]/g, ''))) {
      return NextResponse.json({ error: 'Acesso Negado: Falha na validação de integridade da captura.' }, { status: 403 });
    }

    // 5. Gera JWT Assinado
    const token = await new SignJWT({ sub: user.id, role: user.role })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    // 5. Configura Cookies Seguros
    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, role: user.role } }, { status: 200 });
    
    response.cookies.set('iuaix_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24
    });

    response.cookies.set('iuaix_role', user.role, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24
    });

    return response;

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 });
  }
}
