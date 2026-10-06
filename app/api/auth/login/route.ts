import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { SignJWT } from 'jose';
import rateLimit from '@/lib/rate-limit';
import { headers } from 'next/headers';
import OpenAI from 'openai';

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

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback_secret_for_dev_only');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-mock-key-for-build',
});

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

    // 4. Validação Biométrica (OpenAI GPT-4o Vision)
    if (process.env.OPENAI_API_KEY) {
      const base64Data = validatedData.photoBase64.split(',')[1] || validatedData.photoBase64;
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é um sistema de segurança biométrica. Retorne JSON: { \"approved\": boolean, \"reason\": string }. aprove apenas se houver um rosto humano claro e visível."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Verifique se há um rosto humano claro nesta foto da webcam." },
              { type: "image_url", image_url: { url: `data:image/jpeg;base64,${base64Data}` } }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 150
      });

      const aiResponse = JSON.parse(completion.choices[0].message.content || '{}');
      
      if (!aiResponse.approved) {
        return NextResponse.json({ error: `Acesso Negado pela IA: ${aiResponse.reason || 'Rosto não detectado ou imagem inválida.'}` }, { status: 403 });
      }
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
