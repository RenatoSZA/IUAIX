"use client";
import React, { useState } from 'react';
import { Menu, X, Zap, Users, Lock, CreditCard, Check, ArrowRight, Paintbrush, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [jobInput, setJobInput] = useState('');
  const [deadlineInput, setDeadlineInput] = useState('');

  return (
    <div className="min-h-screen bg-gray-100 text-brutal-black font-sans selection:bg-royal selection:text-white">
      
      {/* Navbar Brutalista */}
      <nav className="bg-white border-b-4 border-brutal-black flex items-center justify-between px-4 md:px-12 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="inline-flex items-center gap-2 font-black text-xl tracking-tighter uppercase hover:text-royal transition-colors">
            <div className="w-8 h-8 bg-royal border-2 border-brutal-black flex items-center justify-center text-white text-sm">IX</div>
            Iuaix
          </Link>
          <div className="hidden lg:flex items-center gap-6 text-sm font-black uppercase tracking-widest text-brutal-black">
            <Link href="/assinaturas" className="hover:bg-gray-100 px-3 py-2 border-2 border-transparent hover:border-brutal-black transition-all">Preços</Link>
            <Link href="/cadastro" className="hover:bg-gray-100 px-3 py-2 border-2 border-transparent hover:border-brutal-black transition-all">Trabalhe Conosco</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 text-sm font-black uppercase tracking-widest">
          <Link href="/login" className="hidden md:block hover:bg-gray-100 px-3 py-2 border-2 border-transparent hover:border-brutal-black transition-all">
            Fazer login
          </Link>
          <Link href="/cadastro" className="bg-brutal-black text-white px-6 py-3 border-4 border-brutal-black hover:bg-royal hover:text-white transition-colors shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
            Cadastre-se
          </Link>
          
          <button className="lg:hidden p-2 border-2 border-brutal-black bg-gray-100" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white border-b-4 border-t-4 border-brutal-black p-4 flex flex-col gap-2 lg:hidden font-black uppercase">
            <Link href="/assinaturas" className="p-4 border-2 border-transparent hover:border-brutal-black hover:bg-gray-50">Preços</Link>
            <Link href="/cadastro" className="p-4 border-2 border-transparent hover:border-brutal-black hover:bg-gray-50">Trabalhe Conosco</Link>
            <Link href="/login" className="p-4 border-2 border-transparent hover:border-brutal-black hover:bg-gray-50">Fazer login</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="px-4 md:px-12 pt-20 pb-32 flex flex-col items-center text-center gap-6 max-w-[1200px] mx-auto">
        
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tight leading-[1]">
          Crie qualquer <span className="text-royal">Coisa.</span>
        </h1>
        <p className="font-bold text-gray-500 mb-12 text-xl max-w-2xl">
          A plataforma que conecta você ou sua empresa ao designer perfeito em segundos.
        </p>

        {/* Form Box - Brutalismo Puro & Expositivo (Centralizado e Largo) */}
        <div className="bg-white p-6 md:p-10 border-4 border-brutal-black shadow-[12px_12px_0px_#0f172a] w-full max-w-4xl text-left relative">
          
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            <div className="flex items-center bg-gray-50 border-4 border-brutal-black p-4 focus-within:bg-blue-50 transition-colors">
              <Paintbrush size={28} strokeWidth={2} className="text-royal mr-4 flex-shrink-0" />
              <input 
                type="text" 
                value={jobInput}
                onChange={(e) => setJobInput(e.target.value)}
                placeholder="Ex: UI Design, Logo..." 
                className="bg-transparent w-full outline-none text-brutal-black font-black text-lg placeholder-gray-400 uppercase tracking-wide" 
              />
            </div>

            <div className="flex items-center bg-gray-50 border-4 border-brutal-black p-4 focus-within:bg-blue-50 transition-colors">
              <Clock size={28} strokeWidth={2} className="text-brutal-black mr-4 flex-shrink-0" />
              <input 
                type="text" 
                value={deadlineInput}
                onChange={(e) => setDeadlineInput(e.target.value)}
                placeholder="Prazo (Ex: Urgente, 48h)" 
                className="bg-transparent w-full outline-none text-brutal-black font-black text-lg placeholder-gray-400 uppercase tracking-wide" 
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 items-stretch">
            <button 
              onClick={() => {
                if(jobInput) {
                  router.push(`/matchmaking?q=${encodeURIComponent(jobInput)}`);
                } else {
                  router.push('/matchmaking');
                }
              }}
              className="flex-1 bg-brutal-black text-white px-8 py-5 font-black uppercase tracking-widest text-center border-4 border-brutal-black hover:bg-royal transition-colors shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none flex items-center justify-center gap-3 text-lg"
            >
              Começar um Projeto <ArrowRight size={24} />
            </button>
            <Link href="/assinaturas" className="flex items-center justify-center font-bold text-gray-500 hover:text-brutal-black underline decoration-2 underline-offset-4 hover:bg-gray-100 px-8 py-5 border-4 border-transparent hover:border-brutal-black transition-all uppercase tracking-widest text-sm">
              Ver Tabela de Preços
            </Link>
          </div>
          
          {/* Como Funciona Aberto */}
          <div className="mt-10 pt-8 border-t-4 border-brutal-black flex flex-col sm:flex-row justify-between gap-6 sm:gap-8">
            <div className="flex-1 border-l-4 border-royal pl-4">
              <p className="font-black uppercase text-royal text-base mb-1">1. Faça o Pedido</p>
              <p className="font-bold text-sm text-gray-500 uppercase tracking-wider">Explique o que precisa</p>
            </div>
            <div className="flex-1 border-l-4 border-royal pl-4">
              <p className="font-black uppercase text-royal text-base mb-1">2. IA encontra o Designer</p>
              <p className="font-bold text-sm text-gray-500 uppercase tracking-wider">Te conectamos ao melhor perfil</p>
            </div>
            <div className="flex-1 border-l-4 border-royal pl-4">
              <p className="font-black uppercase text-royal text-base mb-1">3. Pagamento 100% Seguro</p>
              <p className="font-bold text-sm text-gray-500 uppercase tracking-wider">Só pague quando aprovar a arte</p>
            </div>
          </div>

        </div>
      </header>

      {/* Feature Cards Section Expositiva */}
      <section className="px-4 md:px-12 py-20 max-w-[1600px] mx-auto border-t-4 border-brutal-black bg-white">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-brutal-black mb-6 max-w-2xl">
          Como você quer trabalhar?
        </h2>
        <p className="font-bold text-xl text-gray-500 mb-12 max-w-3xl">Contrate um profissional apenas quando precisar, ou assine um pacote para ter sua própria equipe de design.</p>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          
          {/* Card 1: Sob Demanda */}
          <div className="bg-white border-4 border-brutal-black p-8 flex flex-col justify-between shadow-brutal-dark">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-black uppercase text-brutal-black mb-2">Trabalhos Avulsos</h3>
                <p className="font-bold text-gray-500 leading-relaxed max-w-md">
                  Perfeito para tarefas pontuais ou urgentes. Você paga apenas pelo que pedir.
                </p>
              </div>
              <Zap size={48} className="text-yellow-500 hidden sm:block" strokeWidth={2} />
            </div>

            <ul className="space-y-4 mb-10 font-bold text-gray-700 bg-gray-50 p-6 border-2 border-brutal-black">
              <li className="flex items-center gap-3"><Check size={20} className="text-royal flex-shrink-0"/> <strong>Seleção Inteligente:</strong> O sistema analisa seu pedido e encontra o profissional qualificado na mesma hora.</li>
              <li className="flex items-center gap-3"><Check size={20} className="text-royal flex-shrink-0"/> <strong>Prazo Garantido:</strong> Entregas rápidas garantidas, variando de 2 a 48 horas.</li>
              <li className="flex items-center gap-3"><Check size={20} className="text-royal flex-shrink-0"/> <strong>Sem Mensalidades:</strong> Você compra pacotes de "Fichas" e gasta apenas no trabalho que solicitar.</li>
            </ul>

            <Link href="/matchmaking" className="w-full sm:w-auto self-start bg-white text-brutal-black border-4 border-brutal-black px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-yellow-400 transition-colors shadow-brutal-sm hover:-translate-y-1 hover:-translate-x-1 flex items-center justify-center gap-3">
              Fazer um Pedido <ArrowRight size={18} />
            </Link>
          </div>

          {/* Card 2: Células */}
          <div className="bg-white border-4 border-brutal-black p-8 flex flex-col justify-between shadow-brutal-dark">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-black uppercase text-brutal-black mb-2">Equipe Dedicada</h3>
                <p className="font-bold text-gray-500 leading-relaxed max-w-md">
                  Assinatura mensal para empresas que precisam de designs todos os dias.
                </p>
              </div>
              <Users size={48} className="text-blue-500 hidden sm:block" strokeWidth={2} />
            </div>

            <ul className="space-y-4 mb-10 font-bold text-gray-700 bg-gray-50 p-6 border-2 border-brutal-black">
              <li className="flex items-center gap-3"><Check size={20} className="text-royal flex-shrink-0"/> <strong>Sempre Disponível:</strong> Um time fixo para a sua marca. Se alguém ficar doente, substituímos sem atrasar seu prazo.</li>
              <li className="flex items-center gap-3"><Check size={20} className="text-royal flex-shrink-0"/> <strong>Mais Barato:</strong> Comprando o plano mensal, cada Ficha custa bem menos.</li>
              <li className="flex items-center gap-3"><Check size={20} className="text-royal flex-shrink-0"/> <strong>Prioridade Máxima:</strong> Seus pedidos são atendidos antes de todos os outros.</li>
            </ul>

            <Link href="/assinaturas" className="w-full sm:w-auto self-start bg-white text-brutal-black border-4 border-brutal-black px-8 py-4 font-black uppercase tracking-widest text-sm hover:bg-royal hover:text-white transition-colors shadow-brutal-sm hover:-translate-y-1 hover:-translate-x-1 flex items-center justify-center gap-3">
              Ver Planos Mensais <ArrowRight size={18} />
            </Link>
          </div>

        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Card 3: Brand Vault */}
          <div className="bg-white border-4 border-brutal-black p-8 flex flex-col justify-between shadow-brutal-dark lg:col-span-1">
            <div className="mb-6">
              <Lock size={40} className="text-green-500 mb-4" strokeWidth={2} />
              <h3 className="text-3xl font-black uppercase text-brutal-black mb-2">Cofre da Marca</h3>
              <p className="font-bold text-gray-500 leading-relaxed">
                Um lugar seguro onde guardamos o logotipo e as cores da sua empresa.
              </p>
            </div>

            <ul className="space-y-3 mb-8 font-bold text-sm text-gray-700 bg-gray-50 p-4 border-2 border-brutal-black">
              <li className="flex items-start gap-2"><Check size={16} className="text-royal mt-1 flex-shrink-0"/> O profissional não precisa ficar te pedindo a logo toda hora.</li>
              <li className="flex items-start gap-2"><Check size={16} className="text-royal mt-1 flex-shrink-0"/> A inteligência artificial garante que as cores e fontes não saiam do padrão.</li>
            </ul>

            <Link href="/vault" className="w-full text-center bg-white text-brutal-black border-4 border-brutal-black px-6 py-4 font-black uppercase tracking-widest text-xs hover:bg-green-400 transition-colors shadow-brutal-sm">
              Configurar Cofre da Marca
            </Link>
          </div>

          {/* Card 4: Economia Tokenizada */}
          <div className="bg-royal border-4 border-brutal-black p-8 flex flex-col shadow-brutal-dark lg:col-span-2 text-white relative overflow-hidden">
            <CreditCard size={180} className="text-white opacity-10 absolute -right-10 -bottom-10 pointer-events-none" strokeWidth={1} />
            
            <div className="relative z-10 mb-8 max-w-2xl">
              <h3 className="text-4xl font-black uppercase mb-4">Como funcionam as "Fichas"?</h3>
              <p className="font-bold text-gray-200 leading-relaxed text-lg mb-6">
                Para evitar orçamentos surpresa, todo trabalho na plataforma custa um número fixo de fichas. Assim você sabe exatamente quanto vai gastar antes mesmo de começar.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-10 relative z-10">
               <div className="bg-white/10 p-5 border-2 border-white/20 backdrop-blur-sm">
                 <p className="text-yellow-300 font-black uppercase mb-1">Fichas Acumulam</p>
                 <p className="text-sm font-medium">As fichas que você comprar e não usar não desaparecem. Elas valem por até 90 dias na sua conta.</p>
               </div>
               <div className="bg-white/10 p-5 border-2 border-white/20 backdrop-blur-sm">
                 <p className="text-yellow-300 font-black uppercase mb-1">Pagamento Seguro</p>
                 <p className="text-sm font-medium">Quando você pede um trabalho, a ficha fica guardada com a Iuaix. O profissional só recebe a ficha se você aprovar a arte final.</p>
               </div>
            </div>

            <div className="mt-auto relative z-10">
              <Link href="/assinaturas" className="inline-block bg-brutal-black text-white border-4 border-brutal-black px-10 py-5 font-black uppercase text-base hover:bg-yellow-400 hover:text-brutal-black transition-colors shadow-brutal-sm">
                Entender como pagar
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Puro Brutalismo */}
      <footer className="bg-brutal-black text-white px-4 md:px-12 py-16 border-t-8 border-royal flex flex-col md:flex-row justify-between items-start gap-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-royal border-2 border-white flex items-center justify-center text-white text-lg font-black">IX</div>
            <span className="text-4xl font-black uppercase tracking-tighter text-white">Iuaix</span>
          </div>
          <p className="text-gray-500 font-bold max-w-sm mb-6 text-sm">
            Trazendo segurança, qualidade e velocidade para quem precisa de design e para quem cria.
          </p>
          <p className="text-xs font-bold text-gray-700 uppercase tracking-widest">© 2026 Iuaix</p>
        </div>
        
        <div className="flex gap-12 md:gap-24 font-bold uppercase tracking-widest text-sm relative z-10 flex-wrap">
          <div className="flex flex-col gap-4">
            <span className="text-gray-600 mb-2 border-b-2 border-gray-800 pb-2">Plataforma</span>
            <Link href="/assinaturas" className="hover:text-royal transition-colors">Preços</Link>
            <Link href="/cadastro" className="hover:text-royal transition-colors">Criar Conta</Link>
            <Link href="/dashboard" className="hover:text-royal transition-colors">Entrar</Link>
          </div>
          
          <div className="flex flex-col gap-4">
            <span className="text-gray-600 mb-2 border-b-2 border-gray-800 pb-2">Como funciona</span>
            <Link href="/matchmaking" className="hover:text-royal transition-colors">Como achamos seu designer</Link>
            <Link href="/vault" className="hover:text-royal transition-colors">Cofre da sua Marca</Link>
            <Link href="/assinaturas" className="hover:text-royal transition-colors">Pacotes para Empresas</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
