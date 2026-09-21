"use client";
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
  const [status, setStatus] = useState<'ping' | 'accepted' | 'missed'>('ping');

  if (!isAuthorized) return <div className="min-h-screen bg-brutal-black flex items-center justify-center text-white font-black uppercase text-xl">Inicializando Radar...</div>;

  // Lógica do cronômetro
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

  const handleAccept = () => {
    setStatus('accepted');
  };

  return (
    <div className="min-h-screen bg-brutal-black text-white font-sans selection:bg-yellow-300 selection:text-brutal-black flex flex-col items-center justify-center p-6">
      
      {/* Header Fixo */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center border-b-4 border-gray-800">
        <div className="font-black tracking-widest uppercase text-xl">Iuaix <span className="text-royal">Radar</span></div>
        <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Voltar ao QG</Link>
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Estado 1: Ping do Radar (Decisão Rápida) */}
        {status === 'ping' && (
          <div className="bg-white text-brutal-black border-4 border-white shadow-[16px_16px_0px_#0F3CC9] animate-in zoom-in-95 duration-500 overflow-hidden relative">
            
            {/* Overlay de Urgência (Pulso Vermelho se < 30s) */}
            <div className={`absolute top-0 left-0 w-full h-2 ${timeLeft < 30 ? 'bg-red-600 animate-pulse' : 'bg-royal'}`}></div>

            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <span className="bg-yellow-300 px-3 py-1 font-black uppercase text-xs border-2 border-brutal-black mb-4 inline-block shadow-brutal-sm">
                    Nova Alocação via IA
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight mb-2">Criação de Logo</h2>
                  <p className="font-bold text-gray-500 uppercase tracking-widest text-sm">Escopo B2B - Brand Vault Prontos</p>
                </div>
                
                {/* Cronômetro */}
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
                  <span className="text-2xl font-black flex items-center gap-2"><Zap size={20} className="text-yellow-500" /> 5 TKNS</span>
                </div>
                <div className="bg-gray-100 p-4 border-2 border-gray-200">
                  <span className="block text-[10px] font-black uppercase text-gray-400 mb-1">SLA Exigido</span>
                  <span className="text-2xl font-black">48 Horas</span>
                </div>
              </div>

              <p className="text-sm font-bold text-gray-500 mb-8 p-4 bg-blue-50 border-l-4 border-royal">
                A IA Inquisidora já congelou o escopo com o cliente. Você não perderá tempo com briefing. Aceite para liberar o depósito em Escrow.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleAccept}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-brutal-black px-8 py-6 font-black uppercase text-xl border-4 border-brutal-black text-center flex items-center justify-center gap-3 shadow-brutal-sm hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  <CheckCircle size={28} /> Assumir Job
                </button>
                <button 
                  onClick={() => setStatus('missed')}
                  className="w-full sm:w-auto bg-white text-gray-500 px-6 py-6 font-black uppercase text-sm border-4 border-gray-200 hover:border-red-600 hover:text-red-600 hover:bg-red-50 transition-all"
                >
                  Passar Adiante
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Estado 2: Job Aceito */}
        {status === 'accepted' && (
          <div className="bg-green-500 text-brutal-black border-4 border-green-500 shadow-[16px_16px_0px_#ffffff] p-8 md:p-12 animate-in slide-in-from-bottom duration-500 text-center">
            <CheckCircle size={80} className="mx-auto mb-6" />
            <h2 className="text-4xl font-black uppercase mb-4">Job Confirmado!</h2>
            <p className="font-bold text-lg mb-8 max-w-md mx-auto">
              O Escrow de 5 TKNS foi travado. O chat com o cliente foi aberto e as diretrizes do Brand Vault estão disponíveis no Workplace.
            </p>
            <Link 
              href="/chat"
              className="bg-brutal-black text-white px-8 py-5 font-black uppercase text-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-3 shadow-brutal-sm"
            >
              Ir para o Workplace <ArrowRight size={24} />
            </Link>
          </div>
        )}

        {/* Estado 3: Tempo Esgotado ou Recusado */}
        {status === 'missed' && (
          <div className="bg-gray-900 text-white border-4 border-gray-700 shadow-[16px_16px_0px_#000000] p-8 md:p-12 animate-in fade-in duration-500 text-center relative overflow-hidden">
            <XCircle size={80} className="mx-auto mb-6 text-red-600 relative z-10" />
            <h2 className="text-4xl font-black uppercase mb-4 relative z-10">Oportunidade Perdida</h2>
            <p className="font-bold text-gray-400 mb-8 max-w-md mx-auto relative z-10">
              Você não aceitou a tempo ou recusou o ping. A Inteligência Artificial já rotacionou a fila e alocou o job para o próximo profissional com maior aderência.
            </p>
            <button 
              onClick={() => { setStatus('ping'); setTimeLeft(180); }}
              className="bg-white text-brutal-black px-8 py-5 font-black uppercase text-lg border-4 border-brutal-black hover:bg-gray-200 transition-colors inline-block relative z-10"
            >
              Aguardar Novo Ping
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
