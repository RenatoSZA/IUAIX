"use client";
import React, { useState, useEffect } from 'react';
import { Menu, X, Home, LayoutGrid, Clock, CheckCircle, AlertTriangle, Play, Coins, Users, Lock, Shield, Folder, Zap, Database, Navigation, BarChart3, Palette, LogOut, ArrowRight, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>('loading');
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>('Operador');

  const [tokenBalance, setTokenBalance] = useState('0');
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchUserAndJobs = async () => {
      try {
        const response = await fetch('/api/user/me');
        if (!response.ok) throw new Error('Não autorizado');
        
        const data = await response.json();
        setUser(data.user);
        setRole(data.user.role);
        setUserName(data.user.name.split(' ')[0]);
        setTokenBalance(data.user.tokens.toString());

        // Busca jobs ativos
        const jobsResponse = await fetch('/api/jobs/active');
        if (jobsResponse.ok) {
          const jobsData = await jobsResponse.json();
          setActiveJobs(jobsData.jobs || []);
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchUserAndJobs();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-white text-brutal-black font-sans flex flex-col md:flex-row selection:bg-royal selection:text-white">
      
      {/* Botão Hambúrguer Mobile */}
      <div className="md:hidden p-4 bg-white border-b-4 border-brutal-black flex justify-between items-center z-50 sticky top-0">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-royal border-2 border-brutal-black flex items-center justify-center text-white font-black text-sm">IX</div>
          <span className="font-black uppercase tracking-widest text-lg">Iuaix</span>
        </Link>
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
        <Link href="/dashboard" className="p-8 hidden md:flex items-center gap-3 border-b-4 border-brutal-black bg-white cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 bg-royal border-4 border-brutal-black flex items-center justify-center text-white font-black text-lg shadow-brutal-sm">IX</div>
          <span className="text-2xl font-black uppercase tracking-widest">Iuaix</span>
        </Link>
        
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
                Aberto a Jobs
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
          <Link href="/perfil" className="flex items-center gap-3 group hover:bg-gray-50 p-2 border-2 border-transparent hover:border-brutal-black transition-colors">
            <div className="w-12 h-12 bg-brutal-black border-2 border-brutal-black overflow-hidden flex items-center justify-center text-xl font-black text-white group-hover:bg-royal transition-colors">
              {user?.profilePic ? (
                <img src={user.profilePic} alt="Perfil" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
              ) : (
                <span className="uppercase">{user?.name ? user.name.charAt(0) : (role === 'criativo' ? 'P' : 'C')}</span>
              )}
            </div>
            <div>
              <p className="font-black uppercase text-brutal-black leading-none truncate max-w-[120px]">{user?.name || (role === 'criativo' ? 'Profissional' : 'Sua Conta')}</p>
              <p className="text-xs font-bold text-gray-500 uppercase mt-1 flex items-center gap-1"><Settings size={12}/> Editar Perfil</p>
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
            <h1 className="text-4xl md:text-5xl font-black uppercase text-brutal-black tracking-tight leading-none mb-2">Painel de Controle</h1>
            <p className="text-gray-500 font-bold text-lg uppercase tracking-widest">Resumo do seu saldo e andamento dos trabalhos.</p>
          </div>
          
          {role === 'empresa' ? (
            <Link href="/matchmaking" className="bg-royal hover:bg-blue-800 text-white px-8 py-4 font-black uppercase text-lg border-4 border-brutal-black shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-3">
              <Play size={20} /> Pedir Job
            </Link>
          ) : (
             <Link href="/profissional" className="bg-brutal-black hover:bg-gray-800 text-white px-8 py-4 font-black uppercase text-lg border-4 border-brutal-black shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-3">
              <Navigation size={20} /> Estou Aberto a Jobs
            </Link>
          )}
        </header>

        {/* Info Cards (Métricas Brutalistas) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          
          <div className="bg-white p-6 border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#0f172a] transition-all">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 font-black text-xs uppercase tracking-widest">Saldo em Fichas</p>
              <Coins className="text-royal" size={32} />
            </div>
            <p className="text-5xl font-black text-brutal-black tracking-tight mb-2">{tokenBalance}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-brutal-black bg-yellow-300 inline-block px-2 py-1 border-2 border-brutal-black">Fichas disponíveis</p>
          </div>

          <div className="bg-white p-6 border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#0f172a] transition-all">
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500 font-black text-xs uppercase tracking-widest">Pagamento Retido</p>
              <Lock className="text-brutal-black" size={32} />
            </div>
            <p className="text-5xl font-black text-brutal-black tracking-tight mb-2">
              {activeJobs.reduce((acc, job) => acc + (job.tokensValue || 0), 0)}
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Fichas em Escrow</p>
          </div>

          <div className="bg-royal text-white p-6 border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] hover:-translate-y-1 hover:shadow-[12px_12px_0px_#0f172a] transition-all">
            <div className="flex justify-between items-center mb-6">
              <p className="text-blue-200 font-black text-xs uppercase tracking-widest">Garantia Iuaix</p>
              <Shield className="text-white" size={32} />
            </div>
            <p className="text-5xl font-black tracking-tight mb-2 uppercase">Ativa</p>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-200">Proteção total no pagamento</p>
          </div>

        </div>

        {/* Listagem de Jobs Brutalista */}
        <div className="bg-white border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] overflow-hidden">
          <div className="p-6 border-b-4 border-brutal-black bg-brutal-black text-white flex justify-between items-center">
            <h2 className="text-xl font-black uppercase tracking-widest">Células Ativas</h2>
            <span className="bg-yellow-300 text-brutal-black font-black text-xs px-2 py-1 uppercase">{activeJobs.length} Operações</span>
          </div>
          
          <div className="p-0">
            {isLoadingJobs ? (
              <div className="p-16 text-center text-gray-500 font-black uppercase">Sincronizando infraestrutura...</div>
            ) : activeJobs.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center justify-center bg-gray-50 bg-[radial-gradient(#e5e7eb_2px,transparent_2px)] [background-size:20px_20px]">
                <div className="w-24 h-24 bg-white border-4 border-brutal-black flex items-center justify-center shadow-brutal-sm mb-6 rotate-3">
                  <Database size={40} className="text-gray-300" />
                </div>
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-400 mb-4">
                  Nenhum Job em Execução
                </h3>
                <p className="font-bold text-gray-500 max-w-md mb-8">
                  {role === 'empresa' 
                    ? "Sua infraestrutura criativa está ociosa. Acione a Inteligência Artificial para alocar um especialista instantaneamente."
                    : "Sua agenda está limpa. Conecte-se ao Radar para receber novas missões da Inteligência Artificial."}
                </p>
                
                {role === 'empresa' ? (
                  <Link href="/matchmaking" className="bg-royal hover:bg-blue-800 text-white px-8 py-5 font-black uppercase text-lg border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-3">
                    <Play size={20} /> Acionar Motor IA
                  </Link>
                ) : (
                  <Link href="/profissional" className="bg-brutal-black hover:bg-gray-800 text-white px-8 py-5 font-black uppercase text-lg border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-3">
                    <Navigation size={20} /> Abrir Radar de Jobs
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col">
                {activeJobs.map(job => (
                  <div key={job.id} className="p-6 border-b-4 border-gray-200 hover:bg-yellow-50 transition-colors flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-black text-[10px] uppercase px-2 py-0.5 border-2 border-brutal-black ${job.status === 'pending_accept' ? 'bg-yellow-300 text-brutal-black' : 'bg-green-500 text-brutal-black'}`}>
                          {job.status === 'active' ? 'Em Progresso' : job.status === 'reviewing' ? 'Em Revisão' : 'Aguardando Aceite'}
                        </span>
                        <span className="bg-gray-100 text-gray-500 font-bold text-[10px] uppercase px-2 py-0.5 border-2 border-gray-200">{job.title}</span>
                          <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">{job.tokensValue} Tokens</span>
                        </div>
                        <h3 className="text-xl font-black uppercase text-brutal-black truncate max-w-lg" title={job.description}>{job.description}</h3>
                      <p className="text-sm font-bold text-gray-500 mt-1">
                        {role === 'empresa' ? `Profissional: ${job.creative?.name}` : `Cliente: ${job.client?.name}`}
                      </p>
                    </div>
                    <Link href={`/chat?id=${job.id}`} className="bg-white text-brutal-black border-4 border-brutal-black px-6 py-3 font-black uppercase tracking-widest text-sm hover:bg-brutal-black hover:text-white transition-colors shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none whitespace-nowrap text-center">
                      Acessar Sala <ArrowRight size={16} className="inline ml-1 mb-0.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
