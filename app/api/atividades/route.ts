import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';
import { kv } from '@vercel/kv';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt-token')?.value;

    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    
    const user = await verifyToken(token);
    const userEmail = user?.email as string;

    const activities = await kv.get(`activities:${userEmail}`);

    return NextResponse.json(activities || []);
    
  } catch (error) {
    console.error('Erro na API GET:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt-token')?.value;

    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    
    const user = await verifyToken(token);
    const userEmail = user?.email as string;

    const body = await request.json();
    
    const newActivity = {
      id: Date.now(),
      description: body.description,
      amount: Number(body.amount),
      date: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date()),
      status: body.status || 'Pendente'
    };

    const currentActivities: any[] = (await kv.get(`activities:${userEmail}`)) || [];
    currentActivities.unshift(newActivity);

    await kv.set(`activities:${userEmail}`, currentActivities);

    return NextResponse.json(newActivity, { status: 201 });
    
  } catch (error) {
    console.error('Erro na API POST:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt-token')?.value;

    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    
    const user = await verifyToken(token);
    const userEmail = user?.email as string;

    const body = await request.json();
    const currentActivities: any[] = (await kv.get(`activities:${userEmail}`)) || [];
    
    const index = currentActivities.findIndex(a => a.id === body.id);
    
    if (index !== -1) {
      currentActivities[index] = {
        ...currentActivities[index],
        description: body.description,
        amount: Number(body.amount),
        status: body.status
      };
      
      await kv.set(`activities:${userEmail}`, currentActivities);
      return NextResponse.json(currentActivities[index]);
    }

    return NextResponse.json({ error: 'Atividade não encontrada' }, { status: 404 });
  } catch (error) {
    console.error('Erro na API PUT:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt-token')?.value;

    if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    
    const user = await verifyToken(token);
    const userEmail = user?.email as string;

    const { id } = await request.json();
    const currentActivities: any[] = (await kv.get(`activities:${userEmail}`)) || [];
    
    const newActivities = currentActivities.filter(a => a.id !== id);
    await kv.set(`activities:${userEmail}`, newActivities);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro na API DELETE:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}