"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { Search, Zap, Clock, Shield, CheckCircle, ArrowLeft, Loader2, ArrowRight, ShieldAlert, Star, X, Lock } from 'lucide-react';
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
  { id: 'Criação de Logo', label: 'Criação de Logo', tokens: 5, desc: 'Marca base e conceito criativo do zero.' },
  { id: 'Identidade Visual', label: 'Identidade Visual', tokens: 8, desc: 'Manual da marca, aplicações, paleta e tipografia.' },
  { id: 'UI/UX Design', label: 'UI/UX Design', tokens: 6, desc: 'Interfaces de aplicativos e Landing Pages.' },
  { id: 'Web Design', label: 'Web Design', tokens: 5, desc: 'Design de sites e portais institucionais.' },
  { id: 'Social Media', label: 'Social Media', tokens: 3, desc: 'Posts, carrosséis e stories para redes sociais.' },
  { id: 'Edição de Vídeo', label: 'Edição de Vídeo', tokens: 4, desc: 'Cortes, color grading para YouTube e Reels.' },
  { id: 'Motion Graphics', label: 'Motion Graphics', tokens: 5, desc: 'Animações, vinhetas e letterings animados.' },
  { id: 'Design Gráfico', label: 'Design Gráfico', tokens: 3, desc: 'Banners, flyers, cartões de visita e impressos.' },
  { id: 'Ilustração', label: 'Ilustração', tokens: 6, desc: 'Ilustrações exclusivas, vetores e mascotes.' },
  { id: 'Apresentação Corporativa', label: 'Pitch Deck', tokens: 4, desc: 'Apresentações de impacto e propostas comerciais.' },
  { id: 'Design 3D', label: 'Design 3D', tokens: 10, desc: 'Modelagem de produto, cenários e renderização.' },
  { id: 'Copywriting', label: 'Copywriting', tokens: 3, desc: 'Textos persuasivos, roteiros e slogans.' },
  { id: 'Topa Tudo', label: 'Topa Tudo', tokens: 5, desc: 'Perfil generalista: ataca problemas de múltiplos ângulos.' }
];

function MatchmakingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [step, setStep] = useState<'idle' | 'briefing_analysis' | 'scanning' | 'portfolio_review' | 'matched'>('idle');
  const [selectedJob, setSelectedJob] = useState('');
  const [matchedPro, setMatchedPro] = useState<any>(null);
  const [activeJob, setActiveJob] = useState<any>(null);
  const [rejectedIds, setRejectedIds] = useState<number[]>([]);
  const [matchScore, setMatchScore] = useState(0);

  // Novos campos de Briefing Avulso
  const [briefingText, setBriefingText] = useState('');
  const [briefingFile, setBriefingFile] = useState<File | null>(null);
  const [deadline, setDeadline] = useState('7 dias');
  
  // Estados da IA Orçamentista
  const [pricingData, setPricingData] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

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

  const reset = () => {
    setStep('idle');
    setSelectedJob('');
    setMatchedPro(null);
    setActiveJob(null);
    setRejectedIds([]);
    setBriefingText('');
    setPricingData(null);
  };

  // ==========================================
  // IA ORÇAMENTISTA
  // ==========================================
  const calculatePricing = async () => {
    if (!briefingText.trim()) {
      alert("Por favor, descreva os detalhes do seu pedido no campo de texto.");
      return;
    }

    setIsCalculating(true);
    try {
      const response = await fetch('/api/ai/pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedJob,
          briefing: briefingText,
          deadline: deadline,
          userId: localStorage.getItem('userId')
        })
      });

      const data = await response.json();
      setPricingData(data);
    } catch (err) {
      alert("Erro ao calcular orçamento via IA.");
    } finally {
      setIsCalculating(false);
    }
  };

  // ==========================================
  // MOTOR DE MATCHMAKING (ALGORITMO DE SCORING)
  // ==========================================
  const executeScan = async () => {
    setStep('scanning');

    try {
      const selectedJobData = JOB_REQUESTS.find(j => j.id === selectedJob);
      // O tokensValue agora reflete o preço real. Se o valor for em BRL puro, usamos direto ou convertemos.
      // Pra simplificar internamente, vamos salvar tokens = BRL / 50
      let tokensValue = selectedJobData ? selectedJobData.tokens : 5;
      
      if (pricingData && pricingData.estimatedPriceBRL) {
        tokensValue = Math.max(1, Math.round(pricingData.estimatedPriceBRL / 50));
      }

      const response = await fetch('/api/ai/matchmaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: selectedJob,
          description: `ESCOPO DO JOB:\n${selectedJobData?.desc}\n\nBRIEFING DO CLIENTE:\n${briefingText || "Nenhum detalhe adicional fornecido."}\n\nPRAZO ESTIPULADO: ${deadline}\nCOMPLEXIDADE AVALIADA: ${pricingData?.complexity || 'Não avaliada'}\nVALOR (BRL): R$ ${pricingData?.estimatedPriceBRL || tokensValue * 50}`,
          tokensValue: tokensValue,
          rejectedIds: rejectedIds,
          userId: localStorage.getItem('userId')
        })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Erro ao alocar criativo via IA.");
        setStep('idle');
        return;
      }

      // Converte os dados do DB para o formato esperado pelo UI
      const creative = data.match.creative;
      const bestMatch = {
        id: creative.id,
        name: creative.name,
        level: creative.rank === 'veterano' ? 'Especialista' : 'Pleno/Júnior',
        rating: creative.ratingScore,
        portfolio: [
          'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80',
          'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
          'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80'
        ] // Imagens genéricas para demonstração do portfólio cego
      };

      setMatchedPro(bestMatch);
      setActiveJob(data.match);
      // Simula um Match Score alto para o talento escolhido pela IA
      setMatchScore(Math.floor(Math.random() * (99 - 88 + 1)) + 88); 
      setStep('portfolio_review');

    } catch (error) {
      console.error("Erro no Matchmaking", error);
      alert("Falha de conexão com a IA.");
      setStep('idle');
    }
  };

  const handleRejectPortfolio = async () => {
    if (activeJob) {
      try {
        await fetch('/api/jobs/cancel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId: activeJob.id })
        });
      } catch (e) {
        console.error("Erro ao cancelar job", e);
      }
    }

    if (matchedPro) {
      setRejectedIds(prev => [...prev, matchedPro.id]);
    }
    // Limpa o job ativo e gira a roleta de novo
    setActiveJob(null);
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
                Antes de acionarmos o motor de IA para achar o melhor especialista em <strong className="text-brutal-black uppercase bg-yellow-300 px-2">{selectedJob}</strong>, descreva exatamente o que você precisa.
              </p>

              {/* Formulário de Briefing */}
              <div className="bg-gray-50 border-4 border-brutal-black p-6 mb-8">
                <div>
                  <label className="block font-black uppercase text-sm mb-2">Detalhe seu pedido:</label>
                  <textarea 
                    value={briefingText}
                    onChange={(e) => setBriefingText(e.target.value)}
                    placeholder="Ex: Quero uma logo minimalista para minha nova marca de roupas sustentáveis, nas cores verde escuro e areia..."
                    className="w-full bg-white border-4 border-brutal-black p-4 font-bold text-gray-700 h-32 outline-none focus:border-royal transition-colors mb-6"
                    disabled={!!pricingData}
                  />

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-black uppercase text-sm mb-2">Prazo de Entrega:</label>
                      <select
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        disabled={!!pricingData}
                        className="w-full bg-white border-4 border-brutal-black p-4 font-bold text-gray-700 outline-none focus:border-royal"
                      >
                        <option value="24 horas">Urgentíssimo (24 horas) - Rush Fee</option>
                        <option value="48 horas">Urgente (48 horas) - Rush Fee</option>
                        <option value="7 dias">Padrão (7 dias)</option>
                        <option value="15 dias">Flexível (15 dias) - Desconto</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-black uppercase text-sm mb-2">Imagens de Referência (Opcional):</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        disabled={!!pricingData}
                        onChange={(e) => setBriefingFile(e.target.files?.[0] || null)}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:border-4 file:border-brutal-black
                          file:text-sm file:font-black file:uppercase
                          file:bg-white file:text-brutal-black
                          hover:file:bg-gray-100 cursor-pointer"
                      />
                      {briefingFile && <p className="mt-2 text-xs font-bold text-green-600">Arquivo anexado: {briefingFile.name}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Parâmetros de Início e Checkout */}
              {pricingData ? (
                <div className="bg-yellow-50 border-4 border-brutal-black p-6 mb-8">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-6">
                    <div>
                      <h4 className="font-black uppercase mb-2 text-sm tracking-widest flex items-center gap-2">
                        <Zap size={18} className="text-yellow-600" /> Análise da IA Orçamentista:
                      </h4>
                      <p className="font-bold text-sm text-gray-700 bg-white p-4 border-2 border-brutal-black">
                        &quot;{pricingData.reasoning}&quot;
                      </p>
                      <div className="mt-4 flex gap-4">
                        <span className="bg-brutal-black text-white px-3 py-1 text-xs font-black uppercase">
                          Complexidade: {pricingData.complexity}
                        </span>
                        <span className="bg-green-500 text-brutal-black px-3 py-1 text-xs font-black uppercase">
                          Prazo: {deadline}
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right w-full md:w-auto shrink-0 md:pl-6 md:border-l-4 border-brutal-black">
                      <p className="font-black text-gray-500 uppercase text-xs">Valor do Serviço</p>
                      <p className="text-5xl font-black tracking-tighter text-brutal-black">
                        R$ {pricingData.estimatedPriceBRL},00
                      </p>
                      <p className="text-xs font-bold text-gray-400 uppercase mt-2">Valor Fixo & Protegido (Escrow)</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={() => executeScan()} 
                      className="flex-1 bg-green-500 text-brutal-black px-8 py-5 font-black uppercase text-xl border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
                    >
                      <Lock size={24} /> Pagar R$ {pricingData.estimatedPriceBRL} e Iniciar
                    </button>
                    <button 
                      onClick={() => setPricingData(null)}
                      className="w-full sm:w-auto bg-gray-100 text-gray-500 px-8 py-5 font-black uppercase text-sm border-4 border-brutal-black hover:text-brutal-black hover:bg-white transition-all text-center"
                    >
                      Refazer Briefing
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={calculatePricing}
                    disabled={isCalculating}
                    className="flex-1 bg-royal text-white px-8 py-5 font-black uppercase text-xl border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isCalculating ? <Loader2 className="animate-spin" size={24} /> : <Search size={24} />}
                    Calcular Orçamento via IA
                  </button>
                  <button 
                    onClick={reset}
                    className="w-full sm:w-auto bg-gray-100 text-gray-500 px-8 py-5 font-black uppercase text-lg border-4 border-brutal-black hover:text-brutal-black hover:bg-white shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all text-center"
                  >
                    Cancelar
                  </button>
                </div>
              )}
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
                  Nossa IA localizou este profissional com <strong className="text-brutal-black uppercase bg-yellow-300 px-1 border-b-2 border-brutal-black">Score de {matchScore}/100</strong> para a tag &quot;{selectedJob}&quot;. O Escrow já está garantindo a operação.
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
              <Link href={activeJob ? `/chat?id=${activeJob.id}` : "/cliente"} className="flex-1 bg-brutal-black text-white px-8 py-6 font-black uppercase text-xl hover:bg-royal transition-colors border-4 border-brutal-black text-center flex items-center justify-center gap-3 shadow-[8px_8px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
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
