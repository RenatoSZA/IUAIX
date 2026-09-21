"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Clock, Zap, Shield, FileText, Lock, LayoutGrid, Terminal } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Cliente() {
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
    <div className="min-h-screen bg-gray-100 font-sans text-brutal-black p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header - Enterprise Style */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6 border-b-4 border-brutal-black pb-6">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-3 bg-white border-4 border-brutal-black hover:bg-yellow-300 transition-colors shadow-brutal-sm">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-royal text-white font-black uppercase text-[10px] tracking-widest px-2 py-1">Contrato Inteligente #4928</span>
                <span className="bg-green-500 text-brutal-black font-black uppercase text-[10px] tracking-widest px-2 py-1">Escrow Ativo</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none">Painel de Operação</h1>
            </div>
          </div>
          <div className="bg-brutal-black text-white p-4 flex items-center gap-4 border-4 border-brutal-black shadow-[8px_8px_0px_#0f3cc9]">
            <Clock size={32} className="text-yellow-300 animate-pulse" />
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Tempo de SLA Restante</p>
              <p className="text-3xl font-black tracking-widest text-yellow-300">47:12:05</p>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Pipeline (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Workflow / Pipeline */}
            <div className="bg-white border-4 border-brutal-black p-8 shadow-[8px_8px_0px_#0f172a]">
              <h2 className="text-2xl font-black uppercase mb-8 flex items-center gap-3">
                <LayoutGrid size={28} /> Pipeline de Entrega
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Stage 1 */}
                <div className="bg-gray-100 border-4 border-brutal-black p-4 relative">
                  <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-brutal-black text-white p-1 border-2 border-white rounded-full">
                    <CheckCircle2 size={16} />
                  </div>
                  <h3 className="font-black uppercase text-sm mb-2">1. Escopo</h3>
                  <p className="text-xs font-bold text-gray-500">Congelado via IA Inquisidora. Briefing aprovado.</p>
                </div>

                {/* Stage 2 */}
                <div className="bg-yellow-300 border-4 border-brutal-black p-4 relative shadow-[4px_4px_0px_#0f172a] transform -translate-y-1">
                  <div className="absolute top-0 right-0 -mt-3 -mr-3 bg-white text-brutal-black p-1 border-2 border-brutal-black rounded-full animate-spin-slow">
                    <Zap size={16} />
                  </div>
                  <h3 className="font-black uppercase text-sm mb-2">2. Execução</h3>
                  <p className="text-xs font-bold text-brutal-black">Profissional operando no arquivo final.</p>
                </div>

                {/* Stage 3 */}
                <div className="bg-white border-4 border-dashed border-gray-300 p-4 opacity-50">
                  <h3 className="font-black uppercase text-sm mb-2 text-gray-400">3. Auditoria</h3>
                  <p className="text-xs font-bold text-gray-400">Verificação automática de Brand Vault pendente.</p>
                </div>

                {/* Stage 4 */}
                <div className="bg-white border-4 border-dashed border-gray-300 p-4 opacity-50">
                  <h3 className="font-black uppercase text-sm mb-2 text-gray-400">4. Liquidação</h3>
                  <p className="text-xs font-bold text-gray-400">Transferência de IP e liberação do Escrow.</p>
                </div>
              </div>
            </div>

            {/* Ação Principal: Workspace */}
            <div className="bg-brutal-black text-white border-4 border-brutal-black p-8 shadow-[8px_8px_0px_#0f3cc9]">
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                 <div>
                   <h3 className="text-2xl font-black uppercase mb-2 flex items-center gap-3"><Terminal size={28}/> Ambiente de Trabalho (Workspace)</h3>
                   <p className="text-gray-400 font-bold text-sm">Comunique-se com a célula alocada, envie referências e aprove arquivos.</p>
                 </div>
                 <Link href="/chat" className="w-full md:w-auto bg-royal hover:bg-blue-800 text-white px-8 py-5 font-black uppercase text-lg border-4 border-white shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all text-center whitespace-nowrap">
                   Acessar Workspace
                 </Link>
               </div>
            </div>

          </div>

          {/* Sidebar (Right Col) */}
          <div className="space-y-8">
            
            {/* Squad Info */}
            <div className="bg-white border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] p-6">
              <h3 className="font-black uppercase text-xs text-gray-500 tracking-widest mb-4 border-b-2 border-gray-100 pb-2">Célula Alocada</h3>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 border-4 border-brutal-black flex items-center justify-center font-black text-2xl text-royal shadow-brutal-sm">
                  SA
                </div>
                <div>
                  <h4 className="font-black text-xl uppercase tracking-tight leading-none mb-1">Squad Alpha</h4>
                  <div className="flex items-center gap-1 text-xs font-black text-brutal-black bg-yellow-300 w-fit px-2 py-0.5 border-2 border-brutal-black">
                     <Zap size={12} className="fill-brutal-black"/> GOD TIER (4.9)
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-gray-50 p-3 border-2 border-gray-200">
                  <Shield size={18} className="text-green-500" />
                  <span className="font-bold text-xs uppercase">NDA Assinado Criptograficamente</span>
                </div>
                <div className="flex items-center gap-3 bg-gray-50 p-3 border-2 border-gray-200">
                  <FileText size={18} className="text-royal" />
                  <span className="font-bold text-xs uppercase">Acesso ao Brand Vault: Concedido</span>
                </div>
              </div>
            </div>

            {/* Resumo do Job */}
            <div className="bg-gray-100 border-4 border-brutal-black p-6">
              <h3 className="font-black uppercase text-xs text-gray-500 tracking-widest mb-4 border-b-2 border-gray-200 pb-2">Dados do Serviço</h3>
              <ul className="space-y-4 font-bold text-sm">
                <li>
                  <span className="block text-gray-400 uppercase text-[10px] mb-1">Categoria</span>
                  Criação de Logo (Identidade Visual)
                </li>
                <li>
                  <span className="block text-gray-400 uppercase text-[10px] mb-1">Custo Bloqueado</span>
                  <span className="flex items-center gap-2"><Lock size={14} /> 5 TKNS (Em Escrow)</span>
                </li>
                <li>
                  <span className="block text-gray-400 uppercase text-[10px] mb-1">Políticas Acordadas</span>
                  3 Pontos de Refatoração Ativos. Pivotagem &gt; 50% incorre em Reset Fee.
                </li>
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
