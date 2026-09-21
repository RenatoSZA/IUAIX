"use client";
import React from 'react';
import { Coins, Zap, Users, ArrowRight, ArrowLeft, RefreshCw, ShieldCheck, CheckCircle, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function Assinaturas() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-brutal-black selection:bg-royal selection:text-white">
      
      {/* Navbar Minimalista */}
      <nav className="flex items-center justify-between p-4 sm:p-6 border-b-4 border-brutal-black sticky top-0 bg-white z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 bg-gray-100 hover:bg-gray-200 transition-colors border-2 border-transparent hover:border-brutal-black">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-2 border-l-4 border-brutal-black pl-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-royal border-2 border-brutal-black flex items-center justify-center text-white font-black text-lg">IX</div>
            <span className="text-xl sm:text-2xl font-black uppercase tracking-tighter hidden sm:block">Iuaix</span>
          </div>
        </div>
        <div className="font-black uppercase tracking-widest text-xs sm:text-sm">
          Modelagem Financeira
        </div>
      </nav>

      <main className="max-w-[90rem] mx-auto p-4 sm:p-8 lg:p-16">
        
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 lg:mb-24">
          <div className="inline-flex items-center justify-center gap-2 bg-yellow-300 text-brutal-black border-4 border-brutal-black px-4 py-2 font-black uppercase text-xs tracking-widest mb-6 shadow-brutal-sm">
            <Coins size={16} /> Governança de Créditos
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black uppercase leading-[0.9] mb-8 tracking-tight">
            Assinaturas<br/>
            <span className="text-royal">Cadenciadas.</span>
          </h1>
          <p className="text-lg sm:text-2xl font-bold text-gray-600 leading-relaxed">
            Contrate por semana, mês ou ano. O sistema de assinaturas distribui seu volume contratado em <strong>recargas de tokens a cada 3 dias</strong>, garantindo um fluxo contínuo e escalável de produção.
          </p>
        </div>

        {/* Como Funciona a Complexidade */}
        <div className="bg-white border-4 border-brutal-black shadow-brutal-dark mb-16 lg:mb-32">
          <div className="bg-brutal-black text-white p-6 sm:p-8 border-b-4 border-brutal-black flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wide flex items-center gap-3">
              <Coins size={32} /> Economia de Tokens
            </h2>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 border-2 border-white/20">
              <RefreshCw size={16} className="text-green-400" />
              <span className="font-bold text-sm uppercase">Rollover Ativo: Seus créditos não expiram por 90 dias.</span>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 divide-y-4 md:divide-y-0 md:divide-x-4 divide-brutal-black">
            {/* TKN 1 */}
            <div className="p-8 sm:p-12 hover:bg-gray-50 transition-colors">
              <p className="text-6xl font-black text-brutal-black mb-2">1 <span className="text-2xl text-gray-400">TKN</span></p>
              <h3 className="font-black text-xl uppercase mb-4 text-royal">Baixa Complexidade</h3>
              <ul className="space-y-3 font-bold text-gray-600 text-sm">
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-brutal-black flex-shrink-0" /> Arte Simples (Post / Stories)</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-brutal-black flex-shrink-0" /> Adaptação de Formatos (Resize)</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-brutal-black flex-shrink-0" /> Vetorização Básica</li>
              </ul>
            </div>
            {/* TKN 5 */}
            <div className="p-8 sm:p-12 hover:bg-gray-50 transition-colors">
              <p className="text-6xl font-black text-brutal-black mb-2">5 <span className="text-2xl text-gray-400">TKNS</span></p>
              <h3 className="font-black text-xl uppercase mb-4 text-purple-600">Média Complexidade</h3>
              <ul className="space-y-3 font-bold text-gray-600 text-sm">
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-brutal-black flex-shrink-0" /> Edição de Vídeo (Reels / TikTok)</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-brutal-black flex-shrink-0" /> Diagramação (E-books / Apres.)</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-brutal-black flex-shrink-0" /> Motion Graphics Básico</li>
              </ul>
            </div>
            {/* TKN 15 */}
            <div className="p-8 sm:p-12 hover:bg-gray-50 transition-colors">
              <p className="text-6xl font-black text-brutal-black mb-2">15 <span className="text-2xl text-gray-400">TKNS</span></p>
              <h3 className="font-black text-xl uppercase mb-4 text-red-600">Alta Complexidade</h3>
              <ul className="space-y-3 font-bold text-gray-600 text-sm">
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-brutal-black flex-shrink-0" /> Planejamento e Estratégia</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-brutal-black flex-shrink-0" /> Criação de Key Visual / Branding</li>
                <li className="flex items-start gap-2"><CheckCircle size={18} className="text-brutal-black flex-shrink-0" /> UX/UI Design Complexo</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Planos (Segmentação de Produto) */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch">
          
          {/* Card 1: Avulso */}
          <div className="bg-white border-4 border-brutal-black p-8 sm:p-10 flex flex-col shadow-[8px_8px_0px_#0f172a] hover:-translate-y-2 hover:shadow-[16px_16px_0px_#0f172a] transition-all">
            <div className="mb-8 border-b-4 border-brutal-black pb-8">
              <div className="w-16 h-16 bg-yellow-300 border-4 border-brutal-black flex items-center justify-center mb-6 shadow-brutal-sm">
                <Zap size={32} strokeWidth={2} />
              </div>
              <h2 className="text-4xl font-black uppercase leading-tight mb-4">Demanda<br/>Avulsa</h2>
              <p className="text-lg font-bold text-gray-500">Para SLA de curtíssimo prazo e urgência extrema. Sem necessidade de assinatura.</p>
            </div>
            
            <div className="flex-1 space-y-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-brutal-black rounded-full text-white flex items-center justify-center font-black flex-shrink-0">1</div>
                <p className="font-bold text-sm uppercase">Orçamento Dinâmico Direto em Reais (R$)</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-brutal-black rounded-full text-white flex items-center justify-center font-black flex-shrink-0">2</div>
                <p className="font-bold text-sm uppercase">Valor calculado via IA com base na urgência e complexidade</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-brutal-black rounded-full text-white flex items-center justify-center font-black flex-shrink-0">3</div>
                <p className="font-bold text-sm uppercase text-gray-500">Matchmaking instantâneo após liberação do pagamento</p>
              </div>
            </div>

            <Link href="/dashboard" className="w-full bg-white text-brutal-black border-4 border-brutal-black py-5 text-xl font-black uppercase tracking-widest hover:bg-yellow-300 transition-colors shadow-brutal-sm flex justify-center items-center gap-3">
              Calcular Job <ArrowRight size={24} />
            </Link>
          </div>

          {/* Card 2: Pacotes Prontos (NOVO) */}
          <div className="bg-green-400 text-brutal-black border-4 border-brutal-black p-8 sm:p-10 flex flex-col shadow-[8px_8px_0px_#0f172a] hover:-translate-y-2 hover:shadow-[16px_16px_0px_#0f172a] transition-all">
            <div className="mb-8 border-b-4 border-brutal-black pb-8">
              <div className="w-16 h-16 bg-white border-4 border-brutal-black flex items-center justify-center mb-6 shadow-brutal-sm">
                <Rocket size={32} strokeWidth={2} />
              </div>
              <h2 className="text-4xl font-black uppercase leading-tight mb-4">Pacotes<br/>Prontos</h2>
              <p className="text-lg font-bold text-green-900">Escopos fechados. Ideal para tirar projetos do papel sem calcular tokens.</p>
            </div>
            
            <div className="flex-1 space-y-4 mb-12">
              <div className="bg-white border-2 border-brutal-black p-4 hover:bg-yellow-100 transition-colors cursor-pointer">
                <p className="font-black uppercase text-base mb-1">Pack Startup</p>
                <p className="font-bold text-xs text-gray-600">Logo + Brandbook + 1 mês de conteúdo (3 artes/semana).</p>
              </div>
              <div className="bg-white border-2 border-brutal-black p-4 hover:bg-yellow-100 transition-colors cursor-pointer">
                <p className="font-black uppercase text-base mb-1">Pack Audiovisual</p>
                <p className="font-bold text-xs text-gray-600">Idealização e edição de vídeo (2 Reels/TikTok por semana).</p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <div className="w-6 h-6 bg-brutal-black rounded-full text-white flex items-center justify-center font-black text-xs flex-shrink-0">✓</div>
                <p className="font-bold text-xs uppercase text-green-900">Alocação de Especialistas Inclusa</p>
              </div>
            </div>

            <Link href="/dashboard" className="w-full bg-brutal-black text-white border-4 border-brutal-black py-5 text-xl font-black uppercase tracking-widest hover:bg-royal transition-colors shadow-brutal-sm flex justify-center items-center gap-3">
              Ver Catálogo <ArrowRight size={24} />
            </Link>
          </div>

          {/* Card 3: Assinatura */}
          <div className="bg-royal text-white border-4 border-brutal-black p-8 sm:p-10 flex flex-col shadow-[8px_8px_0px_#0f172a] hover:-translate-y-2 hover:shadow-[16px_16px_0px_#0f172a] transition-all relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
            
            <div className="mb-8 border-b-4 border-white/20 pb-8 relative z-10">
              <div className="w-16 h-16 bg-white border-4 border-brutal-black flex items-center justify-center mb-6 shadow-brutal-dark">
                <Users size={32} className="text-royal" strokeWidth={2} />
              </div>
              <h2 className="text-4xl font-black uppercase leading-tight mb-4">Equipes<br/>Dedicadas</h2>
              <p className="text-lg font-bold text-gray-300">Automação na alocação com recargas cadenciadas de tokens.</p>
            </div>
            
            <div className="flex-1 space-y-6 mb-12 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-white rounded-full text-brutal-black flex items-center justify-center font-black flex-shrink-0">1</div>
                <p className="font-bold text-sm uppercase">Planos Fixos: Semanal, Mensal ou Anual</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-white rounded-full text-brutal-black flex items-center justify-center font-black flex-shrink-0">2</div>
                <p className="font-bold text-sm uppercase">Fidelidade B2B: Assine o mês e receba X tokens por semana no cofre</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-400 rounded-full text-brutal-black flex items-center justify-center font-black flex-shrink-0">3</div>
                <p className="font-bold text-sm uppercase text-green-400">Desconto progressivo no valor do Token</p>
              </div>
            </div>

            <Link href="/dashboard" className="relative z-10 w-full bg-white text-brutal-black border-4 border-brutal-black py-5 text-xl font-black uppercase tracking-widest hover:bg-gray-200 transition-colors shadow-brutal-dark flex justify-center items-center gap-3">
              Assinar Plano <ArrowRight size={24} />
            </Link>
          </div>

        </div>

        {/* Fundo de Contingência Banner */}
        <div className="mt-16 bg-brutal-black text-white p-6 sm:p-10 border-4 border-brutal-black flex flex-col md:flex-row items-center justify-between gap-8 shadow-brutal-sm">
          <div className="flex items-start gap-4">
            <ShieldCheck size={48} className="text-green-400 flex-shrink-0 mt-2" />
            <div>
              <h3 className="font-black uppercase text-xl sm:text-2xl mb-2">Proteção Sistêmica Ativa</h3>
              <p className="text-gray-400 font-bold max-w-2xl">
                Nossa infraestrutura conta com uma <strong>Blindagem de SLA</strong>. Em caso de qualquer imprevisto crítico com o profissional alocado, nossa equipe de contingência interna intervém imediatamente para garantir a entrega sem nenhum custo adicional. Seu job <em>nunca</em> cai.
              </p>
            </div>
          </div>
          <Link href="/cadastro" className="whitespace-nowrap bg-green-400 text-brutal-black font-black uppercase px-8 py-4 border-4 border-transparent hover:border-white transition-colors">
            Abrir Conta
          </Link>
        </div>

      </main>
    </div>
  );
}
