import React from 'react';
import { Shield, Zap, Lock, Folder, AlertTriangle, Play, CheckCircle, Database, Search, PlusCircle, Coins, Activity } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white text-brutal-black selection:bg-royal selection:text-white flex">
      {/* Sidebar */}
      <aside className="w-72 border-r-4 border-brutal-black p-6 flex flex-col justify-between fixed h-full bg-white z-10">
        <div>
          <div className="flex items-center gap-2 mb-12">
            <div className="w-12 h-12 bg-royal border-4 border-brutal-black shadow-brutal-dark flex items-center justify-center text-white font-black text-2xl">
              IX
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter text-brutal-black">Iuaix</h1>
          </div>

          <nav className="space-y-4 font-bold text-lg">
            <a href="#" className="flex items-center gap-3 text-royal bg-blue-50 border-4 border-royal p-3 shadow-brutal-sm">
              <Database size={24} strokeWidth={3} />
              Visão Executiva
            </a>
            <a href="#" className="flex items-center gap-3 hover:translate-x-2 transition-transform p-3 border-4 border-transparent hover:border-brutal-black">
              <Zap size={24} strokeWidth={2.5} />
              Pronto-Socorro
            </a>
            <a href="#" className="flex items-center gap-3 hover:translate-x-2 transition-transform p-3 border-4 border-transparent hover:border-brutal-black">
              <Folder size={24} strokeWidth={2.5} />
              Células (Squads)
            </a>
            <a href="#" className="flex items-center gap-3 hover:translate-x-2 transition-transform p-3 border-4 border-transparent hover:border-brutal-black">
              <Lock size={24} strokeWidth={2.5} />
              Brand Vault
            </a>
            <a href="#" className="flex items-center gap-3 hover:translate-x-2 transition-transform p-3 border-4 border-transparent hover:border-brutal-black">
              <Shield size={24} strokeWidth={2.5} />
              Auditoria & IP
            </a>
          </nav>
        </div>

        <div className="mt-12">
          <button className="w-full bg-red-600 hover:bg-red-700 text-white border-4 border-brutal-black p-4 font-black uppercase flex items-center justify-center gap-2 shadow-brutal-dark transition-all active:translate-x-1 active:translate-y-1 active:shadow-none">
            <AlertTriangle size={24} strokeWidth={3} />
            Botão S.W.A.T.
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 p-12">
        <header className="flex justify-between items-end mb-16 border-b-4 border-brutal-black pb-8">
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tight mb-2 text-brutal-black">Dashboard</h2>
            <p className="text-gray-500 font-bold text-xl uppercase tracking-wide">Plataforma Enterprise DaaS</p>
          </div>
          <div className="flex gap-6">
            <div className="border-4 border-brutal-black p-4 flex flex-col items-end shadow-brutal-dark bg-white">
              <span className="text-sm font-bold uppercase text-gray-500 mb-1">Carteira Tokenizada</span>
              <div className="flex items-center gap-2 text-4xl font-black text-royal">
                <Coins size={36} strokeWidth={3} />
                845 TKNS
              </div>
            </div>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          <div className="border-4 border-brutal-black p-6 bg-white shadow-brutal hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3 mb-6 text-royal border-b-4 border-brutal-black pb-4">
              <Activity size={32} strokeWidth={3} />
              <h3 className="font-black uppercase text-xl text-brutal-black">Escopo Ativo</h3>
            </div>
            <p className="text-6xl font-black mb-2 text-brutal-black">12</p>
            <p className="text-sm font-bold text-gray-500 uppercase">Projetos em Andamento</p>
          </div>

          <div className="border-4 border-brutal-black p-6 bg-white shadow-brutal hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3 mb-6 text-green-600 border-b-4 border-brutal-black pb-4">
              <CheckCircle size={32} strokeWidth={3} />
              <h3 className="font-black uppercase text-xl text-brutal-black">Arbitragem</h3>
            </div>
            <p className="text-6xl font-black mb-2 text-brutal-black">3</p>
            <p className="text-sm font-bold text-gray-500 uppercase">Liberações Escrow 48h</p>
          </div>

          <div className="border-4 border-brutal-black p-6 bg-white shadow-brutal hover:-translate-y-1 transition-transform">
            <div className="flex items-center gap-3 mb-6 text-purple-600 border-b-4 border-brutal-black pb-4">
              <Search size={32} strokeWidth={3} />
              <h3 className="font-black uppercase text-xl text-brutal-black">Compliance</h3>
            </div>
            <p className="text-6xl font-black mb-2 text-brutal-black">100%</p>
            <p className="text-sm font-bold text-gray-500 uppercase">Auditoria Copyright (IP)</p>
          </div>
        </div>

        {/* Active Projects Table - Brutalist style */}
        <div className="border-4 border-brutal-black bg-white shadow-brutal-dark">
          <div className="border-b-4 border-brutal-black p-6 bg-royal text-white flex justify-between items-center">
            <h3 className="text-2xl font-black uppercase tracking-wide">Monitoramento de Projetos</h3>
            <button className="bg-white text-royal border-4 border-brutal-black hover:bg-brutal-black hover:text-white px-6 py-3 font-black uppercase transition-colors flex gap-2 items-center shadow-brutal-sm">
              <PlusCircle size={24} strokeWidth={3} />
              Novo Job
            </button>
          </div>
          <div className="p-0">
            {/* Item 1 */}
            <div className="border-b-4 border-brutal-black p-6 flex items-center justify-between hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 border-4 border-brutal-black flex items-center justify-center bg-yellow-300 font-black text-2xl shadow-brutal-sm text-brutal-black">
                  Q3
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase text-brutal-black">Campanha Out-of-Home</h4>
                  <p className="text-brutal-black font-bold flex items-center gap-2 mt-2 bg-yellow-100 p-2 border-2 border-brutal-black w-fit text-sm uppercase">
                    <Lock size={16} strokeWidth={3} /> IA Inquisidora: Congelamento de Escopo
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right border-r-4 border-brutal-black pr-8">
                  <span className="block font-black text-3xl text-brutal-black">15 TKNS</span>
                  <span className="text-sm font-bold text-gray-500 uppercase">Retido em Escrow</span>
                </div>
                <button className="p-4 border-4 border-brutal-black bg-white hover:bg-royal hover:text-white transition-colors shadow-brutal-sm">
                  <Play size={28} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="border-b-4 border-brutal-black p-6 flex items-center justify-between hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 border-4 border-brutal-black flex items-center justify-center bg-blue-300 font-black text-2xl shadow-brutal-sm text-brutal-black">
                  RB
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase text-brutal-black">Rebranding Institucional</h4>
                  <p className="text-brutal-black font-bold flex items-center gap-2 mt-2 bg-green-200 p-2 border-2 border-brutal-black w-fit text-sm uppercase">
                    <Shield size={16} strokeWidth={3} /> Brand Vault: Validação Sistêmica Ok
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right border-r-4 border-brutal-black pr-8">
                  <span className="block font-black text-3xl text-brutal-black">45 TKNS</span>
                  <span className="text-sm font-bold text-gray-500 uppercase">Retido em Escrow</span>
                </div>
                <button className="p-4 border-4 border-brutal-black bg-white hover:bg-royal hover:text-white transition-colors shadow-brutal-sm">
                  <Play size={28} strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-6 flex items-center justify-between hover:bg-blue-50 transition-colors">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 border-4 border-brutal-black flex items-center justify-center bg-purple-300 font-black text-2xl shadow-brutal-sm text-brutal-black">
                  VD
                </div>
                <div>
                  <h4 className="text-2xl font-black uppercase text-brutal-black">Edição Institucional</h4>
                  <p className="text-brutal-black font-bold flex items-center gap-2 mt-2 bg-purple-200 p-2 border-2 border-brutal-black w-fit text-sm uppercase">
                    <Search size={16} strokeWidth={3} /> Auditoria Reverse Search
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right border-r-4 border-brutal-black pr-8">
                  <span className="block font-black text-3xl text-brutal-black">10 TKNS</span>
                  <span className="text-sm font-bold text-gray-500 uppercase">Retido em Escrow</span>
                </div>
                <button className="p-4 border-4 border-brutal-black bg-white hover:bg-royal hover:text-white transition-colors shadow-brutal-sm">
                  <Play size={28} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
