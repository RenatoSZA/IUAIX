"use client";
import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Search, AlertTriangle, ShieldCheck, Star, Users, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

export default function VeteranoDashboard() {
  const [activeTab, setActiveTab] = useState<'apadrinhamento' | 'auditoria'>('apadrinhamento');

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-brutal-black selection:bg-royal selection:text-white">
      
      {/* Navbar do Curador */}
      <nav className="bg-brutal-black text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b-4 border-royal">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-white/10 hover:bg-white/20 transition-colors border-2 border-transparent hover:border-white">
             <div className="w-8 h-8 bg-royal border-2 border-white flex items-center justify-center font-black text-xs">IX</div>
          </Link>
          <div className="border-l-4 border-royal pl-4">
            <h1 className="text-xl font-black uppercase tracking-widest leading-none">Painel do Curador</h1>
            <span className="text-[10px] font-black tracking-widest text-yellow-400 uppercase">Acesso Nível Veterano</span>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-4 font-black uppercase text-xs">
           <span className="bg-royal px-3 py-1 border-2 border-white">Score: 9.98</span>
           <span className="bg-green-500 text-brutal-black px-3 py-1 border-2 border-white">Bônus Pendente: 120 TKNS</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 sm:p-8">
        
        {/* Header de Boas Vindas */}
        <div className="bg-white border-4 border-brutal-black p-8 mb-8 shadow-brutal-dark flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase mb-2">Bem-vindo, Veterano.</h2>
            <p className="font-bold text-gray-500 max-w-2xl">
              Sua expertise humana é a segunda camada de proteção da plataforma. Avalie portfólios semanticamente e assuma projetos onde a IA encontrou impasses subjetivos.
            </p>
          </div>
          <ShieldCheck size={64} className="text-royal flex-shrink-0" strokeWidth={1.5} />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <button 
            onClick={() => setActiveTab('apadrinhamento')}
            className={`whitespace-nowrap px-8 py-4 font-black uppercase tracking-widest text-sm border-4 border-brutal-black flex items-center gap-2 transition-all ${activeTab === 'apadrinhamento' ? 'bg-brutal-black text-white shadow-brutal-sm' : 'bg-white text-gray-500 hover:text-brutal-black'}`}
          >
            <Users size={18} /> Apadrinhamento (Novatos)
          </button>
          <button 
            onClick={() => setActiveTab('auditoria')}
            className={`whitespace-nowrap px-8 py-4 font-black uppercase tracking-widest text-sm border-4 border-brutal-black flex items-center gap-2 transition-all ${activeTab === 'auditoria' ? 'bg-brutal-black text-white shadow-brutal-sm' : 'bg-white text-gray-500 hover:text-brutal-black'}`}
          >
            <AlertTriangle size={18} /> Auditoria de Recusas Subjetivas
          </button>
        </div>

        {/* CONTEÚDO: APADRINHAMENTO */}
        {activeTab === 'apadrinhamento' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-yellow-100 border-4 border-yellow-500 p-6 flex items-start gap-4">
               <BrainCircuit className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
               <div>
                 <h4 className="font-black uppercase text-yellow-800 mb-1">Cuidado com Testes Cegos</h4>
                 <p className="font-bold text-yellow-700 text-sm">A IA injeta portfólios "armadilha" (Testes Cegos) nesta fila. Aprovar um portfólio intencionalmente ruim resultará na perda dos seus privilégios de Veterano.</p>
               </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card Novato 1 */}
              <div className="bg-white border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] p-6 hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-gray-200 text-gray-600 font-black uppercase text-[10px] px-2 py-1">Na Fila: 2h</span>
                  <span className="bg-green-100 text-green-700 border-2 border-green-700 font-black uppercase text-[10px] px-2 py-1">IA Aprovou (Plágio O.K.)</span>
                </div>
                <h3 className="font-black uppercase text-xl mb-1">Candidato #8842</h3>
                <p className="font-bold text-gray-500 text-sm mb-4">Especialidade: UI Design, Landing Pages</p>
                <div className="h-32 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
                  <span className="font-bold text-gray-400">Preview do Portfólio (Behance)</span>
                </div>
                <button className="w-full bg-white text-brutal-black border-4 border-brutal-black py-3 font-black uppercase text-sm hover:bg-royal hover:text-white transition-colors">
                  Avaliar Semântica
                </button>
              </div>

              {/* Card Novato 2 */}
              <div className="bg-white border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] p-6 hover:-translate-y-1 transition-transform">
                <div className="flex justify-between items-start mb-4">
                  <span className="bg-gray-200 text-gray-600 font-black uppercase text-[10px] px-2 py-1">Na Fila: 4h</span>
                  <span className="bg-green-100 text-green-700 border-2 border-green-700 font-black uppercase text-[10px] px-2 py-1">IA Aprovou (Plágio O.K.)</span>
                </div>
                <h3 className="font-black uppercase text-xl mb-1">Candidato #9103</h3>
                <p className="font-bold text-gray-500 text-sm mb-4">Especialidade: Motion Graphics, 3D</p>
                <div className="h-32 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
                  <span className="font-bold text-gray-400">Preview do Portfólio (Vimeo)</span>
                </div>
                <button className="w-full bg-white text-brutal-black border-4 border-brutal-black py-3 font-black uppercase text-sm hover:bg-royal hover:text-white transition-colors">
                  Avaliar Semântica
                </button>
              </div>
            </div>
          </div>
        )}

        {/* CONTEÚDO: AUDITORIA */}
        {activeTab === 'auditoria' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="bg-white border-4 border-brutal-black shadow-brutal-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-red-600 text-white font-black uppercase text-[10px] px-2 py-1 border-2 border-brutal-black">Impasse de Qualidade</span>
                  <h3 className="font-black uppercase text-2xl">Job #44A9 - Rebranding XYZ</h3>
                </div>
                <p className="font-bold text-gray-600 max-w-3xl text-sm">
                  O cliente recusou a entrega alegando que "ficou ruim e sem sal". A IA analisou o arquivo e confirmou que 100% do Brand Vault e do Escopo Congelado foram respeitados tecnicamente. O profissional original foi liberado, o pagamento em Escrow foi retido parcialmente.
                </p>
              </div>
              <button className="whitespace-nowrap bg-brutal-black text-white px-6 py-4 font-black uppercase border-4 border-brutal-black hover:bg-royal transition-colors shadow-[4px_4px_0px_#0f3cc9]">
                Assumir Projeto
              </button>
            </div>

            <div className="bg-white border-4 border-brutal-black shadow-brutal-sm p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 opacity-60">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-yellow-400 text-brutal-black font-black uppercase text-[10px] px-2 py-1 border-2 border-brutal-black">Pivotagem Excessiva</span>
                  <h3 className="font-black uppercase text-2xl">Job #21B7 - Edição de Vídeo Institucional</h3>
                </div>
                <p className="font-bold text-gray-600 max-w-3xl text-sm">
                  A IA Juíza detectou uma divergência de 45% (Pivotagem de Rota) nas solicitações do cliente em relação ao briefing original. O profissional primário recusou a Reset Fee.
                </p>
              </div>
              <button className="whitespace-nowrap bg-white text-brutal-black px-6 py-4 font-black uppercase border-4 border-brutal-black hover:bg-gray-100 transition-colors">
                Ver Logs de Chat
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
