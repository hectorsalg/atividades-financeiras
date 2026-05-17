import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("Erro: ADMIN_EMAIL ou ADMIN_PASSWORD não foram configurados no ambiente.");
      return NextResponse.json(
        { error: 'Erro de configuração no servidor' },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      const cookieStore = await cookies();

      const token = await signToken({
        email,
        role: 'admin',
      });

      cookieStore.set('jwt-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 2,
        path: '/',
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Credenciais inválidas' },
      { status: 401 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}