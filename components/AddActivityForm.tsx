'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AddActivityForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    status: 'Recebido'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/atividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: formData.description,
          amount: Number(formData.amount),
          status: formData.status
        })
      });

      if (res.ok) {
        setFormData({ description: '', amount: '', status: 'Recebido' });
        router.refresh(); 
      } else {
        alert('Erro ao guardar a transação');
      }
    } catch (error) {
      console.error(error);
      alert('Erro de ligação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
      {/* Utilizamos CSS Grid para garantir um alinhamento perfeito em qualquer ecrã */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        <div className="md:col-span-5">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descrição</label>
          <input 
            required
            type="text" 
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal transition-shadow"
            placeholder="Ex: Venda de licença anual"
          />
        </div>
        
        <div className="md:col-span-3">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Valor (R$)</label>
          <input 
            required
            type="number" 
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal transition-shadow"
            placeholder="Ex: 150.00 ou -50.00"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Status</label>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-900 font-medium bg-white transition-shadow cursor-pointer"
          >
            <option value="Recebido" className="font-medium text-slate-900">Recebido</option>
            <option value="Pendente" className="font-medium text-slate-900">Pendente</option>
            <option value="Concluído" className="font-medium text-slate-900">Concluído</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                A guardar...
              </span>
            ) : 'Adicionar'}
          </button>
        </div>

      </div>
    </form>
  );
}