"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Home, LayoutGrid, Clock, CheckCircle, AlertTriangle, Play, Coins, Users, Lock, Shield, Folder, Zap, Database, Navigation, BarChart3, Palette, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>('loading');
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>('Operador');

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!currentUser && typeof window !== 'undefined') {
      router.push('/login');
    } else {
      setUser(currentUser);
      setRole(localStorage.getItem('userRole') || currentUser?.role || 'empresa');
      if (currentUser?.name) {
        setUserName(currentUser.name.split(' ')[0]);
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    document.cookie = "iuaix_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white text-brutal-black font-sans flex flex-col md:flex-row selection:bg-royal selection:text-white">
      
      {/* Botão Hambúrguer Mobile */}
      <div className="md:hidden p-4 bg-white border-b-4 border-brutal-black flex justify-between items-center z-50 sticky top-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-royal border-2 border-brutal-black flex items-center justify-center text-white font-black text-sm">IX</div>
          <span className="font-black uppercase tracking-widest text-lg">Iuaix</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-brutal-black border-2 border-brutal-black p-2 hover:bg-yellow-300">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Brutalista */}
      <aside className={`
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300
        w-full md:w-72 bg-gray-100 border-r-4 border-brutal-black flex flex-col fixed md:sticky top-0 h-screen z-40
      `}>
        <div className="p-8 hidden md:flex items-center gap-3 border-b-4 border-brutal-black bg-white">
          <div className="w-10 h-10 bg-royal border-4 border-brutal-black flex items-center justify-center text-white font-black text-lg shadow-brutal-sm">IX</div>
          <span className="text-2xl font-black uppercase tracking-widest">Iuaix</span>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <nav className="flex flex-col gap-4">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 border-b-2 border-gray-300 pb-2">Workspace</p>
            
            <Link href="/dashboard" className="flex items-center gap-3 bg-brutal-black text-white font-black uppercase tracking-widest p-3 border-4 border-brutal-black hover:bg-royal transition-colors shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
              <Database size={20} />
              Hub Central
            </Link>
            
            {role === 'empresa' && (
              <Link href="/matchmaking" className="flex items-center gap-3 bg-white text-brutal-black font-black uppercase tracking-widest p-3 border-4 border-brutal-black hover:bg-yellow-300 transition-colors shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                <Zap size={20} />
                Pedir Job
              </Link>
            )}
            
            {role === 'criativo' && (
              <Link href="/profissional" className="flex items-center gap-3 bg-white text-brutal-black font-black uppercase tracking-widest p-3 border-4 border-brutal-black hover:bg-yellow-300 transition-colors shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                <Navigation size={20} />
                Radar de Jobs
              </Link>
            )}
            
            <Link href="/assinaturas" className="flex items-center gap-3 bg-white text-brutal-black font-black uppercase tracking-widest p-3 border-4 border-brutal-black hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
              <Folder size={20} />
              Assinaturas
            </Link>
            
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 border-b-2 border-gray-300 pb-2 mt-8">Governança</p>
            
            <Link href="/vault" className="flex items-center gap-3 bg-white text-brutal-black font-black uppercase tracking-widest p-3 border-4 border-brutal-black hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
              <Palette size={20} />
              Brand Vault
            </Link>
            
            <Link href="/cliente/roi" className="flex items-center gap-3 bg-white text-brutal-black font-black uppercase tracking-widest p-3 border-4 border-brutal-black hover:bg-gray-200 transition-colors shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
              <BarChart3 size={20} />
              Acervo de ROI
            </Link>
          </nav>
        </div>
        
        <div className="p-6 border-t-4 border-brutal-black bg-white flex flex-col gap-4">
          <Link href="/assinaturas" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gray-200 border-2 border-brutal-black overflow-hidden flex items-center justify-center">
              <img src="https://i.pravatar.cc/150?img=11" alt="Perfil" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
            </div>
            <div>
              <p className="font-black uppercase text-brutal-black leading-none truncate max-w-[120px]">{user?.name || (role === 'criativo' ? 'Profissional' : 'Sua Empresa')}</p>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1">Plano Base</p>
            </div>
          </Link>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 font-black uppercase tracking-widest text-xs hover:bg-red-50 p-2 border-2 border-transparent hover:border-red-600 transition-colors"
          >
            <LogOut size={16} /> Desconectar
          </button>
        </div>
      </aside>

      {/* Main Content Area Clean */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto bg-gray-50">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4 border-b-4 border-brutal-black pb-8">
          <div>
            <span className="text-royal font-black uppercase tracking-widest text-sm mb-2 block">Bem-vindo(a), {userName}</span>
            <h1 className="text-4xl md:text-5xl font-black uppercase text-brutal-black tracking-tight leading-none mb-2">QG Operacional</h1>
            <p className="text-gray-500 font-bold text-lg uppercase tracking-widest">Resumo da sua carteira tokenizada.</p>
          </div>
          
          {role === 'empresa' ? (
            <Link href="/matchmaking" className="bg-royal hover:bg-blue-800 text-white px-8 py-4 font-black uppercase text-lg border-4 border-brutal-black shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-3">
              <Play size={20} /> Pedir Job
            </Link>
          ) : (
             <Link href="/profissional" className="bg-brutal-black hover:bg-gray-800 text-white px-8 py-4 font-black uppercase text-lg border-4 border-brutal-black shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-3">
              <Navigation size={20} /> Abrir Radar
            </Link>
          )}
        </header>

        {/* Info Cards (Métricas Brutalistas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-white p-6 border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#0f172a] transition-all">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 font-black text-xs uppercase tracking-widest">Saldo em Tokens</p>
              <Coins className="text-royal" size={32} />
            </div>
            <p className="text-5xl font-black text-brutal-black tracking-tight mb-2">420</p>
            <p className="text-xs font-bold uppercase tracking-widest text-brutal-black bg-yellow-300 inline-block px-2 py-1 border-2 border-brutal-black">Rollover de 90 dias</p>
          </div>

          <div className="bg-white p-6 border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#0f172a] transition-all">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 font-black text-xs uppercase tracking-widest">Em Arbitragem</p>
              <Lock className="text-brutal-black" size={32} />
            </div>
            <p className="text-5xl font-black text-brutal-black tracking-tight mb-2">85</p>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">TKNS retidos em Escrow</p>
          </div>

          <div className="bg-royal text-white p-6 border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#0f172a] transition-all">
            <div className="flex justify-between items-center mb-6">
              <p className="text-blue-200 font-black text-xs uppercase tracking-widest">S.W.A.T. Fund</p>
              <Shield className="text-white" size={32} />
            </div>
            <p className="text-5xl font-black tracking-tight mb-2 uppercase">Ativo</p>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Proteção contra quebra de escopo</p>
          </div>

        </div>

        {/* Listagem de Jobs Brutalista (Com Empty State focado em Conversão) */}
        <div className="bg-white border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] overflow-hidden">
          <div className="p-6 border-b-4 border-brutal-black bg-brutal-black text-white flex justify-between items-center">
            <h2 className="text-xl font-black uppercase tracking-widest">Células Ativas</h2>
            <span className="bg-yellow-300 text-brutal-black font-black text-xs px-2 py-1 uppercase">0 Operações</span>
          </div>
          
          <div className="p-0">
            {/* Empty State B2B (Inspirado no "Blank Slate" de apps de serviço) */}
            <div className="p-16 text-center flex flex-col items-center justify-center bg-gray-50 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:20px_20px]">
              <div className="w-24 h-24 bg-white border-4 border-brutal-black flex items-center justify-center shadow-brutal-sm mb-6 rotate-3">
                <Database size={40} className="text-gray-300" />
              </div>
              <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-400 mb-4">
                Nenhum Job em Execução
              </h3>
              <p className="font-bold text-gray-500 max-w-md mb-8">
                Sua infraestrutura criativa está ociosa. Acione a Inteligência Artificial para alocar um especialista instantaneamente.
              </p>
              
              <Link href="/matchmaking" className="bg-royal hover:bg-blue-800 text-white px-8 py-5 font-black uppercase text-lg border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-3">
                <Play size={20} /> Simular Primeira Demanda
              </Link>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
