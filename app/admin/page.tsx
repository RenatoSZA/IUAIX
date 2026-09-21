import React from 'react';
import { ShieldAlert, Users, Activity, DollarSign, Terminal, Lock, Search, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-brutal-black font-sans text-white selection:bg-yellow-300 selection:text-brutal-black">
      
      {/* Navbar Admin */}
      <header className="border-b-4 border-white p-6 flex justify-between items-center bg-brutal-black sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-red-600 border-2 border-white flex items-center justify-center font-black">
            <Terminal size={20} />
          </div>
          <div>
            <h1 className="font-black uppercase tracking-widest text-xl">Iuaix Root</h1>
            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Painel de Controle S.W.A.T</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="hidden md:flex bg-gray-900 border-2 border-gray-700 px-4 py-2 items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-bold text-xs uppercase tracking-widest text-gray-400">Sistema Operante</span>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <button className="bg-white text-brutal-black p-4 font-black uppercase text-sm border-4 border-white flex items-center gap-3 shadow-[4px_4px_0px_#ef4444] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all">
            <ShieldAlert size={18} className="text-red-600" /> Alertas S.W.A.T (1)
          </button>
          <button className="bg-gray-900 text-gray-400 hover:text-white p-4 font-black uppercase text-sm border-4 border-gray-800 hover:border-white transition-all flex items-center gap-3">
            <Activity size={18} /> Escrows Ativos
          </button>
          <button className="bg-gray-900 text-gray-400 hover:text-white p-4 font-black uppercase text-sm border-4 border-gray-800 hover:border-white transition-all flex items-center gap-3">
            <Users size={18} /> Base de Usuários
          </button>
          <button className="bg-gray-900 text-gray-400 hover:text-white p-4 font-black uppercase text-sm border-4 border-gray-800 hover:border-white transition-all flex items-center gap-3">
            <DollarSign size={18} /> Caixa & Faturamento
          </button>
        </div>

        {/* Área Principal */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          
          {/* Métricas Globais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border-4 border-white p-6 bg-gray-900">
              <p className="font-black text-gray-500 text-xs uppercase tracking-widest mb-2">Total em Escrow (TKNS)</p>
              <p className="text-4xl font-black text-white">1,450</p>
            </div>
            <div className="border-4 border-white p-6 bg-gray-900">
              <p className="font-black text-gray-500 text-xs uppercase tracking-widest mb-2">Células Ativas</p>
              <p className="text-4xl font-black text-white">42</p>
            </div>
            <div className="border-4 border-red-600 p-6 bg-red-950">
              <p className="font-black text-red-400 text-xs uppercase tracking-widest mb-2">Disputas Abertas</p>
              <p className="text-4xl font-black text-white">1</p>
            </div>
          </div>

          {/* Fila S.W.A.T */}
          <div>
            <h2 className="font-black uppercase tracking-widest text-lg mb-4 flex items-center gap-2 border-b-4 border-gray-800 pb-2">
              <AlertTriangle className="text-yellow-400" /> Mediação de Conflitos
            </h2>
            
            <div className="bg-white text-brutal-black border-4 border-white p-6">
              <div className="flex justify-between items-start mb-4 border-b-4 border-brutal-black pb-4">
                <div>
                  <h3 className="font-black uppercase text-xl">Job #892 - UI Design Base</h3>
                  <p className="font-bold text-gray-500 text-sm">Cliente: Empresa XYZ LTDA | Profissional: Squad Alpha</p>
                </div>
                <div className="bg-red-600 text-white px-3 py-1 font-black uppercase text-xs animate-pulse">S.W.A.T Acionado</div>
              </div>
              
              <div className="mb-6">
                <p className="font-bold text-sm mb-2">Motivo da Abertura:</p>
                <div className="bg-gray-100 border-2 border-gray-300 p-4 font-mono text-xs">
                  "Profissional entregou a tela fora da paleta do Brand Vault e não responde há 12 horas. Solicito rollback do Escrow ou troca de célula."
                </div>
              </div>

              <div className="flex gap-4">
                <button className="bg-brutal-black text-white px-6 py-3 font-black uppercase text-xs hover:bg-royal transition-colors border-2 border-transparent">
                  Ler Histórico do Chat
                </button>
                <button className="bg-yellow-300 text-brutal-black px-6 py-3 font-black uppercase text-xs border-2 border-brutal-black shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:shadow-none transition-all">
                  Intervir Manualmente
                </button>
                <button className="bg-red-100 text-red-700 px-6 py-3 font-black uppercase text-xs border-2 border-red-700 hover:bg-red-600 hover:text-white transition-colors">
                  Cancelar & Devolver Tokens
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
