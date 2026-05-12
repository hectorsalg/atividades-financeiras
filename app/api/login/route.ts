import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (email === 'admin@admin.com' && password === '123456') {
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
}