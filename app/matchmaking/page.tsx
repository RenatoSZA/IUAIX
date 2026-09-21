"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { Search, Zap, Clock, Shield, CheckCircle, ArrowLeft, Loader2, ArrowRight, ShieldAlert, Star, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

// ... (DB mantido)
// ==========================================
// BANCO DE DADOS SIMULADO DOS PROFISSIONAIS
// ==========================================
const PROFESSIONALS_POOL = [
  { 
    id: 1, 
    name: 'Squad Alpha', 
    level: 'God Tier', 
    rating: 4.9,
    successRate: 98,
    activeJobs: 1, // Max: 3
    tags: ['Criação de Logo', 'Identidade Visual', 'Key Visual'],
    avatar: "SA",
    color: "bg-blue-300",
    portfolio: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80'
    ]
  },
  { 
    id: 2, 
    name: 'Beto Motion', 
    level: 'Sênior', 
    rating: 4.7,
    successRate: 92,
    activeJobs: 0,
    tags: ['Edição de Vídeo', 'Reels', 'TikTok', 'Animação'],
    avatar: "BM",
    color: "bg-green-300",
    portfolio: [
      'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&q=80',
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
      'https://images.unsplash.com/photo-1586899028174-e7098604235b?w=800&q=80'
    ]
  },
  { 
    id: 3, 
    name: 'Sarah UI', 
    level: 'Especialista', 
    rating: 4.8,
    successRate: 95,
    activeJobs: 2, // Quase cheia
    tags: ['Criação de Logo', 'UI Design', 'Landing Page'],
    avatar: "SU",
    color: "bg-yellow-300",
    portfolio: [
      'https://images.unsplash.com/photo-1561070791-36c11767b26a?w=800&q=80',
      'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&q=80',
      'https://images.unsplash.com/photo-1600132806608-231446b2e7af?w=800&q=80'
    ]
  },
  { 
    id: 4, 
    name: 'Agência Trix', 
    level: 'Sênior', 
    rating: 4.5,
    successRate: 88,
    activeJobs: 0, // Livre
    tags: ['Criação de Logo', 'Copywriting', 'Social Media'],
    avatar: "AT",
    color: "bg-red-300",
    portfolio: [
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=500&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&q=80',
      'https://images.unsplash.com/photo-1563089145-599997674d42?w=500&q=80'
    ]
  }
];

const JOB_REQUESTS = [
  { id: 'Criação de Logo', label: 'Criação de Logo', tokens: 5, desc: 'Identidade visual do zero.' },
  { id: 'Edição de Vídeo', label: 'Edição de Vídeo', tokens: 3, desc: 'Reels e vídeos institucionais.' },
  { id: 'UI Design', label: 'UI Design', tokens: 4, desc: 'Interfaces e Landing Pages.' }
];

function MatchmakingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [step, setStep] = useState<'idle' | 'briefing_analysis' | 'scanning' | 'portfolio_review' | 'matched'>('idle');
  const [selectedJob, setSelectedJob] = useState('');
  const [matchedPro, setMatchedPro] = useState<any>(null);
  const [rejectedIds, setRejectedIds] = useState<number[]>([]);
  const [matchScore, setMatchScore] = useState(0);

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

  useEffect(() => {
    // Ler os inputs do form da Landing Page
    const q = searchParams.get('q');
    if (q && step === 'idle' && isAuthorized) {
      setSelectedJob(q);
      setStep('briefing_analysis');
    }
  }, [searchParams, step, isAuthorized]);

  if (!isAuthorized) return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-black uppercase text-xl text-brutal-black">Autenticando Sessão...</div>;

  const handleSelectJob = (jobTitle: string) => {
    setSelectedJob(jobTitle);
    setStep('briefing_analysis');
  };

  const handleFreezeScope = () => {
    executeScan();
  };

  const reset = () => {
    setStep('idle');
    setSelectedJob('');
    setMatchedPro(null);
    setRejectedIds([]);
  };

  // ==========================================
  // MOTOR DE MATCHMAKING (ALGORITMO DE SCORING)
  // ==========================================
  const executeScan = () => {
    setStep('scanning');

    setTimeout(() => {
      const MAX_CAPACITY = 3; // Limite de jobs simultâneos por profissional

      // 1. Filtragem Inicial (Segurança & Disponibilidade)
      const eligiblePros = PROFESSIONALS_POOL.filter(pro => 
        !rejectedIds.includes(pro.id) && // Não pode ter sido rejeitado na mesma sessão
        pro.activeJobs < MAX_CAPACITY    // Não pode estar sobrecarregado
      );

      if (eligiblePros.length === 0) {
        alert("Nenhum profissional disponível com este perfil no momento. Aumentaremos o raio de busca.");
        setRejectedIds([]); // Reset de fallback
        setStep('idle');
        return;
      }

      // 2. Cálculo de Aderência (Scoring System)
      const scoredPros = eligiblePros.map(pro => {
        let score = 0;

        // A) Skill Match (Peso: 50 pts)
        if (pro.tags.includes(selectedJob)) score += 50;
        else if (pro.tags.some(t => selectedJob.includes(t.split(' ')[0]))) score += 20; // Match Parcial

        // B) Rating Match (Peso: 30 pts)
        // Rating 5.0 = 30 pts, Rating 4.0 = 24 pts
        score += (pro.rating / 5) * 30;

        // C) Disponibilidade/Carga (Peso: 10 pts)
        // Mais livre = Maior score
        score += ((MAX_CAPACITY - pro.activeJobs) / MAX_CAPACITY) * 10;

        // D) Histórico de Sucesso / SLA (Peso: 10 pts)
        score += (pro.successRate / 100) * 10;

        return { ...pro, finalScore: Math.round(score) };
      });

      // 3. Ordenação & Seleção
      scoredPros.sort((a, b) => b.finalScore - a.finalScore);
      
      const bestMatch = scoredPros[0];
      setMatchedPro(bestMatch);
      setMatchScore(bestMatch.finalScore);
      setStep('portfolio_review');

    }, 3500); // delay fake para simular processamento
  };

  const handleRejectPortfolio = () => {
    if (matchedPro) {
      setRejectedIds(prev => [...prev, matchedPro.id]);
    }
    // Gira a roleta de novo ignorando os rejeitados
    executeScan();
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-brutal-black selection:bg-royal selection:text-white flex flex-col">
      
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b-4 border-brutal-black">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-brutal-black">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3 border-l-4 border-royal pl-4">
            <Zap size={32} className="text-royal" />
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest leading-none">Matchmaking</h1>
              <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Roteamento IA de Alta Precisão</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-12">
        
        {/* Etapa 0: Selecionar Categoria */}
        {step === 'idle' && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-10">
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 leading-tight">Acionar Célula Criativa.</h2>
              <p className="font-bold text-gray-500 text-lg max-w-3xl">
                Selecione o escopo exato do trabalho. Nossa IA varrerá o globo para rotear sua demanda aos talentos com a maior nota no sistema para a tag selecionada.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {JOB_REQUESTS.map(job => (
                <button 
                  key={job.id}
                  onClick={() => handleSelectJob(job.id)}
                  className="bg-white border-4 border-brutal-black p-8 text-left hover:bg-royal hover:text-white transition-all shadow-[8px_8px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none group flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{job.label}</h3>
                    <p className="font-bold text-gray-500 group-hover:text-blue-200 text-sm mb-6">{job.desc}</p>
                  </div>
                  <div className="flex items-center gap-2 font-black uppercase text-sm bg-gray-100 group-hover:bg-brutal-black group-hover:text-white px-3 py-1 w-fit border-2 border-brutal-black group-hover:border-white">
                    <Zap size={14} className="group-hover:text-yellow-400" />
                    {job.tokens} TKNS
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Etapa 1: IA Inquisidora (Escopo) */}
        {step === 'briefing_analysis' && (
          <div className="bg-white border-4 border-brutal-black shadow-[16px_16px_0px_#0f172a] animate-in slide-in-from-right-8 duration-500">
            
            <div className="bg-brutal-black p-8 flex items-start gap-6 border-b-4 border-brutal-black">
              <div className="w-16 h-16 bg-red-600 rounded-none border-4 border-white flex items-center justify-center shrink-0">
                <ShieldAlert size={32} className="text-white" />
              </div>
              <div className="text-white">
                <span className="bg-yellow-300 text-brutal-black font-black uppercase text-[10px] px-2 py-1 mb-2 inline-block border-2 border-white">
                  Etapa Obrigatória de Compliance
                </span>
                <h2 className="text-3xl font-black uppercase tracking-widest">Congelamento de Escopo</h2>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <p className="font-bold text-gray-600 text-lg mb-8 max-w-3xl">
                Antes de alocarmos o especialista para <strong className="text-brutal-black uppercase bg-yellow-300 px-2">{selectedJob}</strong>, precisamos do seu <strong>Aceite Criptográfico</strong>. Ao congelar o escopo, você ativa o SLA e garante as regras de governança da plataforma.
              </p>

              <div className="bg-gray-50 border-4 border-brutal-black p-6 mb-8 grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-black uppercase mb-4 text-sm text-gray-500 tracking-widest">Parâmetros de Início:</h4>
                  <ul className="space-y-3 font-bold text-sm">
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Diretrizes (Brand Vault) anexadas.</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Fontes Oficiais anexadas.</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> SLA máximo de 48 horas identificado.</li>
                  </ul>
                </div>
                <div className="border-t-4 md:border-t-0 md:border-l-4 border-brutal-black pt-4 md:pt-0 md:pl-6">
                  <h4 className="font-black uppercase mb-4 text-sm text-gray-500 tracking-widest">Políticas de Alteração:</h4>
                  <ul className="space-y-3 font-bold text-sm">
                    <li className="flex items-start gap-2"><Zap size={16} className="text-yellow-500 mt-1 shrink-0" /> <span><strong>Mudanças Comuns:</strong> Ajustes normais não são cobrados.</span></li>
                    <li className="flex items-start gap-2"><Zap size={16} className="text-yellow-500 mt-1 shrink-0" /> <span><strong>Refatoração (3 por Job):</strong> Consumidas apenas se alterar &gt; 80% da arte.</span></li>
                    <li className="flex items-start gap-2"><Shield size={16} className="text-red-600 mt-1 shrink-0" /> <span className="text-red-700"><strong>Pivotagem (Reset Fee):</strong> Cobrada apenas se mudar &gt; 50% quando o prazo acabar.</span></li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleFreezeScope}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-8 py-5 font-black uppercase text-lg border-4 border-brutal-black text-center flex items-center justify-center gap-3 shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all"
                >
                  Assinar e Congelar Escopo <ArrowRight size={24} />
                </button>
                <button 
                  onClick={reset}
                  className="w-full sm:w-auto bg-white text-gray-500 px-8 py-5 font-black uppercase text-sm hover:text-brutal-black transition-all border-4 border-brutal-black text-center hover:bg-gray-100"
                >
                  Cancelar Solicitação
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Etapa 2: Procurando Motorista (Oculto/Scanner) */}
        {step === 'scanning' && (
          <div className="flex flex-col items-center justify-center py-32 bg-white border-4 border-brutal-black shadow-brutal-dark animate-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#0f3cc9 2px, transparent 2px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative flex items-center justify-center mb-12">
              <div className="w-48 h-48 rounded-full border-4 border-royal/30 absolute animate-ping"></div>
              <div className="w-32 h-32 rounded-full border-4 border-royal/60 absolute animate-pulse"></div>
              <div className="w-20 h-20 bg-royal border-4 border-brutal-black rounded-full flex items-center justify-center relative z-10 text-white shadow-[0_0_40px_rgba(15,60,201,0.5)]">
                <Search size={32} className="animate-spin-slow" />
              </div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-black uppercase text-brutal-black mb-4 tracking-tight relative z-10 text-center">Calculando Aderência de Hubs</h2>
            <p className="font-bold text-gray-500 uppercase tracking-widest text-center relative z-10 bg-yellow-300 text-brutal-black px-4 py-1 border-4 border-brutal-black shadow-[2px_2px_0px_#0f172a]">
              Cruzando Skills x Rating x Disponibilidade...
            </p>
          </div>
        )}

        {/* Etapa 2.5: Revisão Anônima de Portfólio */}
        {step === 'portfolio_review' && matchedPro && (
          <div className="bg-white border-4 border-brutal-black shadow-brutal-dark p-8 md:p-12 animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-3xl md:text-4xl font-black uppercase leading-tight">Talento Pré-Alocado</h2>
              <div className="bg-green-500 text-brutal-black border-4 border-brutal-black px-4 py-2 flex flex-col items-center shadow-[4px_4px_0px_#0f172a]">
                 <span className="text-[10px] font-black uppercase tracking-widest">Match Score</span>
                 <span className="text-3xl font-black">{matchScore}/100</span>
              </div>
            </div>
            <p className="font-bold text-gray-600 mb-8 max-w-3xl text-lg">
              A IA cruzou os dados e isolou o talento com maior aderência para este Job. Nível: <strong className="text-brutal-black uppercase bg-yellow-300 px-1 border-b-2 border-brutal-black">{matchedPro.level}</strong> (Nota: {matchedPro.rating}). Avalie o portfólio cego antes de revelar a identidade.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {matchedPro.portfolio.map((img: string, idx: number) => (
                 <div key={idx} className="aspect-video bg-gray-200 border-4 border-brutal-black overflow-hidden relative group shadow-[4px_4px_0px_#0f172a]">
                    <img src={img} alt="Amostra de Portfólio" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                 </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
               <button 
                 onClick={() => setStep('matched')} 
                 className="flex-1 bg-green-500 text-brutal-black px-8 py-5 font-black uppercase text-lg border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
               >
                 <CheckCircle size={24} /> Aprovar Estilo & Alocar
               </button>
               <button 
                 onClick={handleRejectPortfolio} 
                 className="w-full sm:w-auto bg-white text-gray-600 px-8 py-5 font-black uppercase text-sm border-4 border-brutal-black hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-3"
               >
                 <X size={18} /> Rejeitar (Girar Roleta)
               </button>
            </div>
          </div>
        )}

        {/* Etapa 3: Match! (Mostra quem aceitou) */}
        {step === 'matched' && matchedPro && (
          <div className="bg-white border-4 border-brutal-black shadow-[16px_16px_0px_#0f3cc9] animate-in slide-in-from-bottom-8 duration-500">
            
            <div className="p-8 md:p-12 border-b-4 border-brutal-black flex flex-col md:flex-row justify-between items-start gap-8 bg-blue-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CheckCircle size={200} />
              </div>

              <div className="relative z-10">
                <span className="bg-green-500 text-brutal-black font-black uppercase tracking-widest text-xs px-3 py-1 mb-6 inline-block border-2 border-brutal-black shadow-[2px_2px_0px_#0f172a]">
                  Conexão Estabelecida
                </span>
                <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 leading-none tracking-tight">
                  <span className="text-royal">{matchedPro.name}</span> alocado!
                </h2>
                <p className="font-bold text-gray-600 max-w-xl text-lg mb-6">
                  Nossa IA localizou este profissional com <strong className="text-brutal-black uppercase bg-yellow-300 px-1 border-b-2 border-brutal-black">Score de {matchScore}/100</strong> para a tag "{selectedJob}". O Escrow já está garantindo a operação.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-white border-2 border-brutal-black px-3 py-1">
                    <Star size={16} className="fill-yellow-400 text-yellow-400" />
                    <span className="font-black uppercase text-sm">Nota {matchedPro.rating}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white border-2 border-brutal-black px-3 py-1">
                    <Shield size={16} className="text-green-500" />
                    <span className="font-black uppercase text-sm">{matchedPro.level} Verified</span>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex-shrink-0">
                <div className={`w-32 h-32 ${matchedPro.color} border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] flex items-center justify-center font-black text-4xl text-brutal-black`}>
                  {matchedPro.avatar}
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12 flex flex-col sm:flex-row gap-6">
              <Link href="/cliente" className="flex-1 bg-brutal-black text-white px-8 py-6 font-black uppercase text-xl hover:bg-royal transition-colors border-4 border-brutal-black text-center flex items-center justify-center gap-3 shadow-[8px_8px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                Acompanhar Entrega <ArrowRight size={24} />
              </Link>
              <button 
                onClick={reset}
                className="w-full sm:w-auto bg-gray-100 text-gray-500 px-8 py-6 font-black uppercase text-lg hover:text-brutal-black hover:bg-gray-200 transition-all border-4 border-brutal-black text-center shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none"
              >
                Voltar
              </button>
            </div>
            
          </div>
        )}

      </main>
    </div>
  );
}

export default function Matchmaking() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brutal-black text-white p-12 text-center font-black uppercase text-2xl">Carregando Hub...</div>}>
      <MatchmakingContent />
    </Suspense>
  );
}
