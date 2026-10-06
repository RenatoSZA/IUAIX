"use client";
import { supabase } from '@/lib/supabase';
import React, { useState, useEffect } from 'react';
import { Zap, Clock, ShieldAlert, CheckCircle, ArrowRight, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RadarOperacional() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role) {
      router.push('/login');
    } else if (role === 'empresa') {
      router.push('/dashboard');
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  const [timeLeft, setTimeLeft] = useState(180); // 3 minutos em segundos
  const [status, setStatus] = useState<'config' | 'ping' | 'accepted' | 'missed' | 'searching'>('config');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const JOB_CATEGORIES = ['Criação de Logo', 'Identidade Visual', 'UI/UX Design', 'Web Design', 'Social Media', 'Edição de Vídeo', 'Motion Graphics', 'Design Gráfico', 'Ilustração', 'Pitch Deck', 'Design 3D', 'Copywriting', 'Topa Tudo'];
  const toggleCategory = (cat: string) => { setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]); };
  const enterRadar = async () => { 
    try { 
      await fetch('/api/user/active-categories', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ categories: selectedCategories }) 
      }); 
    } catch(e) {} 
    setStatus('searching'); 
  };
  const [activeJob, setActiveJob] = useState<any>(null);

  // Busca jobs pendentes a cada 5 segundos enquanto estiver em "searching"
  useEffect(() => {
    if (status !== 'searching') return;
    
    const fetchJob = async () => {
      try {
        const res = await fetch('/api/jobs/radar');
        if (res.ok) {
          const data = await res.json();
          if (data.job) {
            setActiveJob(data.job);
            setStatus('ping');
            setTimeLeft(180); // Reinicia o cronÃ´metro para o novo job
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchJob();
    const interval = setInterval(fetchJob, 5000);
    return () => clearInterval(interval);
  }, [status]);

  // LÃ³gica do cronÃ´metro
  useEffect(() => {
    if (status !== 'ping') return;
    
    if (timeLeft <= 0) {
      setStatus('missed');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

    const handleReject = async () => {
    if (!activeJob) return;
    try {
      await fetch('/api/jobs/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: activeJob.id })
      });
      
      supabase.channel(`job-${activeJob.id}`).send({
        type: 'broadcast', event: 'job-updated',
        payload: { job: { id: activeJob.id, status: 'canceled' } }
      });
      
      setStatus('missed');
    } catch (e) {
      console.error(e);
      setStatus('missed');
    }
  };

  const handleAccept = async () => {
    if (!activeJob) return;
    try {
      const res = await fetch('/api/jobs/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: activeJob.id })
      });
      if (res.ok) {
        setStatus('accepted');
        setTimeout(() => {
          router.push(`/chat?id=${activeJob.id}`);
        }, 2000);
      } else {
        alert('Erro ao aceitar o trabalho. Ele pode ter expirado.');
        setStatus('missed');
      }
    } catch(e) {
      alert('Erro de conexÃ£o ao aceitar trabalho.');
    }
  };

  // Movi o early return para o fim, apÃ³s todas as declaraÃ§Ãµes de Hooks, para respeitar as regras do React.
  if (!isAuthorized) return <div className="min-h-screen bg-brutal-black flex items-center justify-center text-white font-black uppercase text-xl">Inicializando Radar...</div>;

  return (
    <div className="min-h-screen bg-brutal-black text-white font-sans selection:bg-yellow-300 selection:text-brutal-black flex flex-col items-center justify-center p-6">
      
      {/* Header Fixo */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center border-b-4 border-gray-800">
        <div className="font-black tracking-widest uppercase text-xl">Iuaix <span className="text-royal">Radar</span></div>
        <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Voltar ao QG</Link>
      </div>

      <div className="w-full max-w-2xl relative">
                {/* Estado Configuração Inicial */}
        {status === 'config' && (
          <div className="bg-white text-brutal-black border-4 border-brutal-black shadow-[16px_16px_0px_#0F3CC9] animate-in zoom-in-95 p-8 md:p-12 mb-8">
            <h2 className="text-3xl font-black uppercase mb-4">Em quais áreas você atuará hoje?</h2>
            <p className="font-bold text-gray-600 mb-8 uppercase text-sm">Selecione as categorias que deseja receber no radar agora. Esta seleção ajuda a IA a enviar os jobs certos para o momento.</p>
            
            <div className="flex flex-wrap gap-3 mb-10">
              {JOB_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`px-4 py-2 border-4 font-black uppercase text-xs transition-colors shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none ${selectedCategories.includes(cat) ? 'bg-royal text-white border-brutal-black' : 'bg-gray-100 text-gray-500 border-gray-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button 
              onClick={enterRadar}
              disabled={selectedCategories.length === 0}
              className="w-full bg-brutal-black text-white px-6 py-4 font-black uppercase tracking-widest hover:bg-yellow-300 hover:text-brutal-black transition-colors disabled:opacity-50 border-4 border-transparent"
            >
              Ligar Radar de Demanda
            </button>
          </div>
        )}

        {/* Estado 0: Searching */}
        {status === 'searching' && (
          <div className="flex flex-col items-center text-center animate-pulse">
            <div className="w-24 h-24 rounded-full border-4 border-royal border-t-transparent animate-spin mb-6"></div>
            <h2 className="text-2xl font-black uppercase tracking-widest text-gray-400">Varrendo a Rede...</h2>
            <p className="text-gray-600 font-bold uppercase text-xs mt-2">Aguardando IA conectar um pedido ao seu perfil</p>
          </div>
        )}

        {/* Estado 1: Ping do Radar (DecisÃ£o RÃ¡pida) */}
        {status === 'ping' && activeJob && (
          <div className="bg-white text-brutal-black border-4 border-white shadow-[16px_16px_0px_#0F3CC9] animate-in zoom-in-95 duration-500 overflow-hidden relative">
            
            {/* Overlay de UrgÃªncia (Pulso Vermelho se < 30s) */}
            <div className={`absolute top-0 left-0 w-full h-2 ${timeLeft < 30 ? 'bg-red-600 animate-pulse' : 'bg-royal'}`}></div>

            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="bg-yellow-300 px-3 py-1 font-black uppercase text-xs border-2 border-brutal-black shadow-brutal-sm">
                        Nova Alocação via IA
                      </span>
                      <span className="bg-white px-3 py-1 font-black uppercase text-xs border-2 border-brutal-black shadow-brutal-sm text-gray-500">
                        {activeJob.title}
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-tight mb-2 line-clamp-4 text-brutal-black">
                      {activeJob.description}
                    </h2>
                </div>
                
                {/* CronÃ´metro */}
                <div className={`flex flex-col items-end ${timeLeft < 30 ? 'text-red-600' : 'text-brutal-black'}`}>
                  <div className="flex items-center gap-2 font-black text-3xl">
                    <Clock size={28} />
                    {formatTime(timeLeft)}
                  </div>
                  <span className="font-bold uppercase text-[10px] tracking-widest">Tempo para aceite</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-100 p-4 border-2 border-gray-200">
                  <span className="block text-[10px] font-black uppercase text-gray-400 mb-1">Recompensa</span>
                  <span className="text-2xl font-black flex items-center gap-2"><Zap size={20} className="text-yellow-500" /> {activeJob.tokensValue} TKNS</span>
                </div>
                <div className="bg-gray-100 p-4 border-2 border-gray-200">
                  <span className="block text-[10px] font-black uppercase text-gray-400 mb-1">Cliente</span>
                  <span className="text-2xl font-black truncate">{activeJob.client?.name || "Empresa"}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={handleAccept}
                  className="flex-1 bg-royal text-white px-6 py-4 font-black uppercase tracking-widest hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
                >
                  <CheckCircle size={20} /> Aceitar OperaÃ§Ã£o
                </button>
                <button 
                  onClick={handleReject}
                  className="bg-gray-200 text-gray-500 px-6 py-4 font-black uppercase hover:bg-red-100 hover:text-red-600 transition-colors border-2 border-transparent hover:border-red-600 flex items-center justify-center"
                >
                  Recusar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estado 2: Aceite Confirmado */}
        {status === 'accepted' && (
          <div className="bg-green-500 text-white border-4 border-green-500 p-12 text-center animate-in slide-in-from-bottom-10">
            <CheckCircle size={80} className="mx-auto mb-6" />
            <h2 className="text-4xl font-black uppercase mb-4">Contrato Firmado!</h2>
            <p className="font-bold text-green-100 mb-8 tracking-widest uppercase">Redirecionando para a Sala de ProduÃ§Ã£o...</p>
          </div>
        )}

        {/* Estado 3: Tempo Esgotado ou Recusado */}
        {status === 'missed' && (
          <div className="bg-gray-900 border-4 border-gray-800 p-12 text-center animate-in slide-in-from-bottom-10">
            <XCircle size={80} className="mx-auto mb-6 text-gray-600" />
            <h2 className="text-4xl font-black uppercase text-white mb-4">Oportunidade Perdida</h2>
            <p className="font-bold text-gray-500 mb-8 tracking-widest uppercase">Este job foi repassado para o prÃ³ximo da fila.</p>
            <button 
              onClick={() => {
                setStatus('searching');
                setActiveJob(null);
              }}
              className="bg-transparent border-4 border-white text-white px-8 py-4 font-black uppercase tracking-widest hover:bg-white hover:text-brutal-black transition-colors"
            >
              Voltar ao Radar
            </button>
          </div>
        )}

      </div>

      <div className="absolute bottom-6 text-center text-gray-600 text-xs font-bold uppercase tracking-widest">
        Iuaix DaaS â€¢ Matchmaking Ativo
      </div>
    </div>
  );
}





