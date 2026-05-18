import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import { AddActivityForm } from '@/components/AddActivityForm';
import { ActivityItem } from '@/components/ActivityItem';

interface Activity {
  id: number;
  description: string;
  amount: number;
  date: string;
  status: string;
}

async function getFinancialActivities(token: string | undefined): Promise<Activity[]> {
  if (!token) return [];

  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';

  try {
    const res = await fetch(`${baseUrl}/api/atividades`, {
      headers: {
        Cookie: `jwt-token=${token}`
      },
      cache: 'no-store'
    });

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Erro ao buscar atividades:", error);
    return [];
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt-token')?.value;

  if (!token) redirect('/login');
  
  const user = await verifyToken(token);
  const activities = await getFinancialActivities(token);

  const totalIncome = activities.filter(a => a.amount > 0).reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = activities.filter(a => a.amount < 0).reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome + totalExpense;

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl leading-none">S</span>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">SaaS Finance</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-slate-500 hidden sm:block">
                {user?.email as string}
              </span>
              <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
                {typeof user?.email === 'string' ? user.email.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Visão Geral</h1>
          <p className="text-slate-500 text-sm mt-1">Acompanhe suas métricas e atividades recentes.</p>
        </div>

        <AddActivityForm />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Saldo Atual</h3>
            <p className="text-3xl font-bold text-slate-900">
              R$ {balance.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Receitas do Mês</h3>
            <p className="text-3xl font-bold text-emerald-600">
              + R$ {totalIncome.toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-sm font-medium text-slate-500 mb-2">Despesas do Mês</h3>
            <p className="text-3xl font-bold text-rose-600">
              - R$ {Math.abs(totalExpense).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-900">Últimas Transações</h2>
          </div>
          
          <div className="divide-y divide-slate-100">
            {activities.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                Nenhuma transação encontrada.
              </div>
            ) : (
              activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}