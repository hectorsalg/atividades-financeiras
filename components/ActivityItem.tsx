'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Activity {
  id: number;
  description: string;
  amount: number;
  date: string;
  status: string;
}

export function ActivityItem({ activity }: { activity: Activity }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    description: activity.description,
    amount: activity.amount,
    status: activity.status
  });

  const isIncome = activity.amount > 0;

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/atividades', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: activity.id })
      });
      if (res.ok) router.refresh();
      else alert('Erro ao excluir transação');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/atividades', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activity.id,
          description: editForm.description,
          amount: Number(editForm.amount),
          status: editForm.status
        })
      });

      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        alert('Erro ao atualizar transação');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
  
        <div className="md:col-span-4">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Descrição
          </label>

          <input
            type="text"
            value={editForm.description}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                description: e.target.value
              })
            }
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal transition-shadow"
            placeholder="Ex: Venda de licença anual"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Valor (R$)
          </label>

          <input
            type="number"
            step="0.01"
            value={editForm.amount}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                amount: Number(e.target.value)
              })
            }
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal transition-shadow"
            placeholder="Ex: 150.00 ou -50.00"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Valor (R$)
          </label>

          <input
            type="number"
            step="0.01"
            value={editForm.amount}
            onChange={(e) => {
              const newAmount = Number(e.target.value);
              setEditForm({
                ...editForm,
                amount: newAmount,
                status: newAmount < 0 && editForm.status === 'Recebido' ? 'Pendente' : editForm.status
              });
            }}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal transition-shadow"
            placeholder="Ex: 150.00 ou -50.00"
          />
        </div>

        <div className="md:col-span-3 flex gap-2">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center"
          >
            {loading ? 'A guardar...' : 'Salvar'}
          </button>

          <button
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
        </div>

      </div>
      </div>
    );
  }

  return (
    <div className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {isIncome ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" /></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" /></svg>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{activity.description}</p>
          <p className="text-xs text-slate-500 mt-0.5">{activity.date}</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className={`text-sm font-bold ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
            {isIncome ? '+' : '-'} R$ {Math.abs(activity.amount).toFixed(2)}
          </p>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-24 justify-center ${activity.status === 'Recebido' || activity.status === 'Concluído' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
          {activity.status}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-indigo-600" title="Editar">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          </button>
          <button onClick={handleDelete} disabled={loading} className="text-slate-400 hover:text-rose-600" title="Excluir">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}