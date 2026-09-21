"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, TrendingDown, Clock, DollarSign, BarChart3, ShieldCheck, Download } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ROIDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role) {
      router.push('/login');
    } else if (role === 'criativo') {
      router.push('/dashboard');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-black uppercase text-xl">Autenticando Sessão...</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-brutal-black selection:bg-royal selection:text-white flex flex-col">
      
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b-4 border-brutal-black">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-brutal-black">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3 border-l-4 border-green-500 pl-4">
            <BarChart3 size={32} className="text-green-500" />
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest leading-none">Acervo Gerencial</h1>
              <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Métricas de ROI & Auditoria</span>
            </div>
          </div>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-brutal-black text-white px-4 py-2 font-black uppercase text-xs hover:bg-royal transition-colors">
          <Download size={14} /> Exportar PDF
        </button>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full p-6 lg:p-12">
        
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-2">Visão Executiva</h2>
          <p className="font-bold text-gray-500">
            Comparativo de capital e tempo economizados utilizando a infraestrutura DaaS da Iuaix contra modelos tradicionais de agências (Média mercado: R$ 150/h).
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Economia de Capital */}
          <div className="bg-green-500 border-4 border-brutal-black p-8 shadow-[8px_8px_0px_#0f172a] flex flex-col justify-between">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="font-black uppercase text-sm text-green-900 mb-1">Capital Preservado</p>
                <h3 className="text-5xl md:text-6xl font-black text-brutal-black leading-none tracking-tight">R$ 14.500</h3>
              </div>
              <div className="bg-white border-2 border-brutal-black p-3">
                <DollarSign size={32} className="text-green-600" />
              </div>
            </div>
            <div className="bg-white border-2 border-brutal-black p-4 font-bold text-sm flex items-center gap-3">
              <TrendingDown size={24} className="text-green-500" />
              <span>Custo <strong>65% menor</strong> do que manter uma agência ou CLT interno neste trimestre.</span>
            </div>
          </div>

          {/* Economia de Tempo */}
          <div className="bg-royal border-4 border-brutal-black p-8 shadow-[8px_8px_0px_#0f172a] flex flex-col justify-between text-white">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="font-black uppercase text-sm text-blue-200 mb-1">Horas Operacionais Salvas</p>
                <h3 className="text-5xl md:text-6xl font-black leading-none tracking-tight">120 hrs</h3>
              </div>
              <div className="bg-brutal-black border-2 border-white p-3">
                <Clock size={32} className="text-royal" />
              </div>
            </div>
            <div className="bg-brutal-black border-2 border-white p-4 font-bold text-sm flex items-center gap-3">
              <TrendingDown size={24} className="text-blue-400" />
              <span>Tempo não gasto com recrutamento, reuniões de briefing ou refações manuais.</span>
            </div>
          </div>
        </div>

        {/* Tabela de Auditoria (IP) */}
        <div className="bg-white border-4 border-brutal-black shadow-brutal-dark overflow-hidden">
          <div className="bg-brutal-black text-white p-6 flex justify-between items-center border-b-4 border-brutal-black">
            <h3 className="font-black uppercase text-xl">Registro Legal (Propriedade Intelectual)</h3>
            <ShieldCheck size={24} className="text-green-400" />
          </div>
          
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-4 border-brutal-black text-xs font-black uppercase tracking-widest text-gray-500">
                  <th className="p-4 border-r-2 border-gray-200">Hash de Transferência</th>
                  <th className="p-4 border-r-2 border-gray-200">Job</th>
                  <th className="p-4 border-r-2 border-gray-200">Status de IP</th>
                  <th className="p-4">Data</th>
                </tr>
              </thead>
              <tbody className="font-bold text-sm">
                <tr className="border-b-2 border-gray-200 hover:bg-yellow-50 transition-colors">
                  <td className="p-4 border-r-2 border-gray-200 font-mono text-royal">0x8F9A2B4C...</td>
                  <td className="p-4 border-r-2 border-gray-200">Criação de Logo (Startup)</td>
                  <td className="p-4 border-r-2 border-gray-200"><span className="bg-green-100 text-green-700 px-2 py-1 uppercase text-[10px] border border-green-700">100% Transferido</span></td>
                  <td className="p-4">Hoje, 14:30</td>
                </tr>
                <tr className="border-b-2 border-gray-200 hover:bg-yellow-50 transition-colors">
                  <td className="p-4 border-r-2 border-gray-200 font-mono text-royal">0x3E1F99D1...</td>
                  <td className="p-4 border-r-2 border-gray-200">Edição Reels Institucional</td>
                  <td className="p-4 border-r-2 border-gray-200"><span className="bg-green-100 text-green-700 px-2 py-1 uppercase text-[10px] border border-green-700">100% Transferido</span></td>
                  <td className="p-4">12 Set, 09:15</td>
                </tr>
                <tr className="hover:bg-yellow-50 transition-colors">
                  <td className="p-4 border-r-2 border-gray-200 font-mono text-gray-400">Em andamento</td>
                  <td className="p-4 border-r-2 border-gray-200 text-gray-400">Key Visual (SaaS)</td>
                  <td className="p-4 border-r-2 border-gray-200"><span className="bg-yellow-100 text-yellow-700 px-2 py-1 uppercase text-[10px] border border-yellow-700">Escrow Trancado</span></td>
                  <td className="p-4 text-gray-400">-</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
