"use client";
import React, { useState, Suspense } from 'react';
import { ArrowLeft, ArrowRight, Paperclip, Send, AlertTriangle, Fingerprint, Search, ShieldCheck, CheckCircle2, FileText, Database, FolderSync, Star, X, Lock } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { supabase } from '@/lib/supabase';

function WorkspaceChat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('id') || 'demo-job-123'; // Puxa o ID real da URL, cai pro demo caso acesse direto

  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  
  const [messages, setMessages] = useState<any[]>([]);
  const [jobContext, setJobContext] = useState<any>(null);
  const [inputMsg, setInputMsg] = useState("");
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showClientReviewModal, setShowClientReviewModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Busca usuário real da API segura em vez de confiar no LocalStorage apenas
    const fetchUserAndMessages = async () => {
      try {
        const resUser = await fetch('/api/user/me');
        if (!resUser.ok) throw new Error('Não autorizado');
        const userData = await resUser.json();
        setUser(userData.user);
        setRole(userData.user.role);

        // Busca o histórico do SQLite
        const resMsgs = await fetch(`/api/messages?jobId=${jobId}`);
        if (resMsgs.ok) {
          const data = await resMsgs.json();
          // Mapeia os dados do BD pro formato do Front
          const formattedMsgs = data.messages.map((m: any) => ({
            id: m.id,
            text: m.content,
            sender: m.senderId === userData.user.id ? 'client' : 'pro',
            time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            mediaUrl: m.mediaUrl,
            mediaType: m.mediaType
          }));
          setMessages(formattedMsgs);
          if (data.job) {
            setJobContext(data.job);
          }
        }
      } catch {
        router.push('/login');
      }
    };
    fetchUserAndMessages();

    // 📡 LIGAÇÃO DOS WEBSOCKETS DO SUPABASE (TEMPO REAL)
    const channel = supabase.channel(`job-${jobId}`);
    
    channel.on('broadcast', { event: 'new-message' }, (payload: any) => {
      // Recebe mensagem do outro usuário via WebSocket instantâneo
      setMessages((prev: any[]) => [...prev, payload.payload]);
    }).subscribe();

    channel.on('broadcast', { event: 'job-updated' }, (payload: any) => {
      if (payload.payload?.job) {
        setJobContext(payload.payload.job);
        if (payload.payload.job.status === 'completed' || payload.payload.job.status === 'canceled') {
          alert(payload.payload.job.status === 'completed' ? 'O job foi finalizado!' : 'O job foi cancelado pelo outro usuário.');
          router.push('/dashboard');
        }
      }
    }).subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, jobId]);

  if (!role) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-black uppercase text-xl">Conectando WebSockets...</div>;
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Falha no upload');
      const data = await res.json();
      
      if (data.url) {
        const newMessage = {
          id: Date.now(),
          text: `Arquivo enviado: ${file.name}`,
          mediaUrl: data.url,
          mediaType: file.type,
          sender: "client",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages((prev: any[]) => [...prev, newMessage]);

        supabase.channel(`job-${jobId}`).send({
          type: 'broadcast',
          event: 'new-message',
          payload: { ...newMessage, sender: "pro" }
        });

        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            jobId: jobId, 
            content: `Arquivo enviado: ${file.name}`,
            mediaUrl: data.url,
            mediaType: file.type
          })
        });
      }
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar arquivo.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSend = async () => {
    if (!inputMsg.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      text: inputMsg,
      sender: "client", // Quem envia sempre aparece à direita visualmente
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Atualiza a tela instantaneamente (Optimistic UI)
    setMessages((prev: any[]) => [...prev, newMessage]);
    const messageContent = inputMsg;
    setInputMsg("");

    // 2. Dispara pelo WebSocket (Tempo Real pro outro lado)
    supabase.channel(`job-${jobId}`).send({
      type: 'broadcast',
      event: 'new-message',
      payload: { ...newMessage, sender: "pro" } // Para o outro lado, vai aparecer como 'pro' (à esquerda)
    });

    // 3. Salva no Banco de Dados (SQLite)
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId: jobId, content: messageContent })
      });
    } catch (e) {
      console.error('Erro ao salvar no banco:', e);
    }
  };
  const handleCancelJob = async () => {
    if (!confirm("Tem certeza que deseja cancelar este job? Esta ação é irreversível.")) return;
    try {
      const res = await fetch('/api/jobs/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId })
      });
      if (res.ok) {
        alert("Job cancelado com sucesso.");
        router.push('/dashboard');
        
        supabase.channel(`job-${jobId}`).send({
          type: 'broadcast', event: 'job-updated',
          payload: { job: { ...jobContext, status: 'canceled' } }
        });
      } else {
        alert("Erro ao cancelar o job.");
      }
    } catch (e) {
      alert("Erro de conexão ao cancelar.");
    }
  };


  return (
    <div className="min-h-screen bg-gray-100 font-sans text-brutal-black flex flex-col">
      
      {/* Header Workspace */}
      <header className="bg-white border-b-4 border-brutal-black px-4 py-4 flex items-center justify-between sticky top-0 z-30 flex-wrap gap-4">
        <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
          <Link href="/cliente" className="p-2 border-2 border-transparent hover:border-brutal-black transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 border-4 border-brutal-black flex items-center justify-center font-black text-royal shadow-[2px_2px_0px_#0f172a] uppercase">
              {jobContext ? (role === 'criativo' ? jobContext.client?.name?.substring(0,2) : jobContext.creative?.name?.substring(0,2)) : '...'}
            </div>
            <div>
              <h1 className="font-black uppercase tracking-tight text-xl leading-none">
                {jobContext ? (role === 'criativo' ? jobContext.client?.name : jobContext.creative?.name) : 'Carregando...'}
              </h1>
              <span className="text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Sala Ativa
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-auto mt-2 md:mt-0">
          {jobContext?.status !== 'completed' && jobContext?.status !== 'canceled' && (
            <button 
              onClick={handleCancelJob}
              className="flex bg-red-500 text-white border-4 border-brutal-black px-3 py-2 md:px-4 font-black uppercase text-xs md:text-sm hover:bg-red-600 transition-colors shadow-brutal-sm items-center gap-2 flex-1 md:flex-none justify-center"
            >
              Cancelar Job
            </button>
          )}
          {role === 'criativo' && jobContext?.status !== 'reviewing' && jobContext?.status !== 'completed' && (
            <button 
              onClick={() => setShowDeliveryModal(true)}
              className="flex bg-green-500 text-white border-4 border-brutal-black px-3 py-2 md:px-6 font-black uppercase text-xs md:text-sm hover:bg-green-600 transition-colors shadow-brutal-sm items-center gap-2 flex-1 md:flex-none justify-center"
            >
              Entregar Job Final
            </button>
          )}
          {role === 'criativo' && jobContext?.status === 'reviewing' && (
            <div className="flex bg-gray-300 text-gray-700 border-4 border-brutal-black px-3 py-2 md:px-6 font-black uppercase text-xs md:text-sm items-center gap-2 flex-1 md:flex-none justify-center">
              Waiting...
            </div>
          )}
          {role === 'empresa' && (
            <button 
              onClick={() => setShowClientReviewModal(true)}
              className="relative flex bg-green-500 text-white border-4 border-brutal-black px-3 py-2 md:px-6 font-black uppercase text-xs md:text-sm hover:bg-green-600 transition-colors shadow-brutal-sm items-center gap-2 flex-1 md:flex-none justify-center"
            >
              Ver Entrega
              {jobContext?.status === 'reviewing' && (
                <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-2 border-brutal-black animate-pulse"></span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Main Layout Split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1400px] w-full mx-auto p-4 md:p-8 gap-8 h-[calc(100vh-88px)]">
        
        {/* Left Col: Asset Manager / Context */}
        <div className="hidden lg:flex flex-col w-[350px] shrink-0 gap-6">
          
          <div className="bg-white border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] p-6 flex-1 flex flex-col">
            <h3 className="font-black uppercase tracking-widest text-sm mb-4 border-b-4 border-brutal-black pb-2 flex items-center gap-2">
              <Database size={18} /> Contexto Operacional
            </h3>
            
            <div>
              <h2 className="font-black text-2xl uppercase leading-tight mb-2">
                {jobContext?.title || 'Carregando...'}
              </h2>
              <p className="font-bold text-sm text-gray-600 border-l-4 border-royal pl-3 mb-4">
                {jobContext?.description?.substring(0, 120) || 'Detalhes do job...'}...
              </p>
            </div>
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="bg-gray-100 p-4 border-2 border-gray-200">
                <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Pagamento (Seguro)</span>
                <span className="font-bold text-sm text-brutal-black flex items-center gap-2">Retido pela Plataforma <Lock size={12}/></span>
              </div>
              
              <div className="bg-gray-100 p-4 border-2 border-gray-200">
                <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Regras</span>
                <span className="font-bold text-sm text-brutal-black block mb-1">Alterações Grátis: 3 restantes</span>
                <span className="font-bold text-sm text-brutal-black block">Refazer tudo: Custo extra ativado</span>
              </div>

              <h3 className="font-black uppercase tracking-widest text-xs mt-6 mb-3 flex items-center gap-2">
                <FolderSync size={16} /> Central de Arquivos
              </h3>
              
              <div className="flex items-center justify-between p-3 border-2 border-brutal-black hover:bg-blue-50 cursor-pointer transition-colors bg-white">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-royal" />
                  <span className="font-bold text-xs uppercase">Guia_da_Marca.pdf</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border-2 border-brutal-black hover:bg-blue-50 cursor-pointer transition-colors bg-white">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-royal" />
                  <span className="font-bold text-xs uppercase">Ref_Concorrente.png</span>
                </div>
              </div>

            </div>

            {/* Help / Suporte Action */}
            <div className="mt-4 pt-4 border-t-4 border-brutal-black">
              <button className="w-full bg-red-50 text-red-700 border-4 border-red-700 p-4 font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-colors">
                <AlertTriangle size={16} /> Acionar Suporte
              </button>
              <p className="text-[10px] text-gray-500 font-bold text-center mt-2">Profissional não responde ou sumiu? A equipe será substituída sem custo.</p>
            </div>
          </div>
        </div>

        {/* Right Col: Chat Area */}
        <div className="flex-1 flex flex-col bg-white border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] overflow-hidden">
          
          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col ${msg.sender === 'client' ? 'items-end' : 'items-start'}`}>
                {msg.sender === 'system' ? (
                  <div className="w-full flex justify-center my-4">
                    <span className="bg-brutal-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 border-2 border-white shadow-[2px_2px_0px_rgba(0,0,0,0.2)]">
                      SISTEMA: {msg.text}
                    </span>
                  </div>
                ) : (
                    <div className={`max-w-[85%] lg:max-w-[70%] border-4 border-brutal-black p-4 relative ${
                      msg.sender === 'client' ? 'bg-royal text-white shadow-[-4px_4px_0px_#0f172a]' : 'bg-white text-brutal-black shadow-[4px_4px_0px_#0f172a]'
                    }`}>
                      {msg.mediaUrl && (
                        <div className="mb-2">
                          {msg.mediaType?.startsWith('image/') ? (
                            <img src={msg.mediaUrl} alt="Anexo" className="max-w-full h-auto border-2 border-brutal-black rounded" />
                          ) : (
                            <a href={msg.mediaUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline text-sm">
                              <FileText size={16} /> Ver Arquivo Anexado
                            </a>
                          )}
                        </div>
                      )}
                      <p className="font-bold text-sm md:text-base leading-relaxed">{msg.text}</p>
                      <span className={`text-[10px] font-black uppercase tracking-widest absolute -bottom-5 ${msg.sender === 'client' ? 'right-0 text-gray-500' : 'left-0 text-gray-500'}`}>
                        {msg.time}
                      </span>
                    </div>
                )}
              </div>
            ))}
          </div>

          {/* Area de Input B2B */}
          <div className="p-4 bg-white border-t-4 border-brutal-black">
            <div className="flex items-end gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
                accept="image/jpeg, image/png, image/webp, image/svg+xml, application/pdf"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="p-4 bg-gray-100 border-4 border-brutal-black hover:bg-yellow-300 transition-colors shadow-brutal-sm disabled:opacity-50 flex items-center justify-center"
              >
                {isUploading ? <FolderSync className="animate-spin" size={24} /> : <Paperclip size={24} />}
              </button>
              
              <div className="flex-1 relative border-4 border-brutal-black shadow-brutal-sm bg-white focus-within:border-royal transition-colors">
                <textarea 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Escreva uma mensagem ou envie uma instrução..."
                  className="w-full bg-transparent p-4 font-bold text-sm outline-none resize-none h-[56px] flex items-center"
                  rows={1}
                />
              </div>

              <button 
                onClick={handleSend}
                className="bg-royal text-white p-4 font-black uppercase border-4 border-brutal-black hover:bg-blue-800 transition-colors shadow-brutal-sm active:translate-y-1 active:translate-x-1 active:shadow-none"
              >
                <Send size={24} />
              </button>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Aviso: Mudanças muito grandes (refazer tudo do zero) podem consumir seus créditos de alteração.</p>
              {role === 'empresa' && (
                <button onClick={() => setShowRatingModal(true)} className="text-[10px] font-black uppercase text-green-600 tracking-widest hover:underline">Aprovar e Liberar Pagamento</button>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* MODAL DE AVALIAÇÃO E APROVAÇÃO (Inspirado no Rate Your Driver do Uber) */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-brutal-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg border-4 border-white shadow-[16px_16px_0px_#22c55e] flex flex-col animate-in zoom-in-95 duration-300">
            
            <div className="bg-green-500 text-brutal-black p-8 text-center border-b-4 border-brutal-black relative">
               <button onClick={() => setShowRatingModal(false)} className="absolute top-4 right-4 text-brutal-black hover:bg-white border-2 border-transparent hover:border-brutal-black p-1 transition-all">
                 <X size={24} />
               </button>
               <CheckCircle2 size={64} className="mx-auto mb-4" />
               <h2 className="text-3xl font-black uppercase tracking-widest">Trabalho Aprovado!</h2>
               <p className="font-bold mt-2">O dinheiro foi liberado para o profissional. O documento que comprova que você é o dono da arte foi gerado com sucesso.</p>
            </div>

            <div className="p-8 text-center">
               <h3 className="font-black uppercase text-xl mb-6">Quantas estrelas você dá para o serviço?</h3>
               <div className="flex justify-center gap-2 mb-8" onMouseLeave={() => setHoveredStar(0)}>
                 {[1, 2, 3, 4, 5].map((star) => (
                   <button 
                     key={star} 
                     onMouseEnter={() => setHoveredStar(star)}
                     onClick={async () => {
                       setSelectedStar(star);
                       try {
                         const res = await fetch('/api/reviews', {
                           method: 'POST',
                           headers: { 'Content-Type': 'application/json' },
                           body: JSON.stringify({ jobId: jobId, stars: star, comment: "Ótima experiência" })
                         });
                         if(res.ok) {
                             alert('Sua avaliação foi salva! O job foi finalizado com sucesso.');
                             const sysMsg = "O cliente avaliou o trabalho e o job foi finalizado.";
                             setMessages((prev: any[]) => [...prev, { id: Date.now(), text: sysMsg, sender: "system", time: new Date().toLocaleTimeString() }]);
                             
                             supabase.channel(`job-${jobId}`).send({
                               type: 'broadcast', event: 'job-updated',
                               payload: { job: { ...jobContext, status: 'completed' } }
                             });
                             
                             router.push('/dashboard');
                           }
                       } catch(e) {
                         alert('Erro ao enviar avaliação.');
                       }
                     }}
                     className={`${(hoveredStar || selectedStar) >= star ? 'text-yellow-400' : 'text-gray-300'} transition-colors hover:scale-110`}
                   >
                     <Star size={48} strokeWidth={1.5} className="fill-current" />
                   </button>
                 ))}
               </div>

               <div className="space-y-4">
                 <Link href="/cliente/roi" className="w-full flex items-center justify-center gap-2 bg-brutal-black text-white px-8 py-4 font-black uppercase text-lg border-4 border-brutal-black shadow-[4px_4px_0px_#0f3cc9] hover:bg-royal transition-all hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                   Ver Recibo e Documentos <ArrowRight size={20} />
                 </Link>
                 <Link href="/matchmaking" className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-500 px-8 py-4 font-black uppercase text-sm border-4 border-brutal-black hover:text-brutal-black hover:bg-white transition-all shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                   Pedir um novo trabalho
                 </Link>
               </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE ENTREGA */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-brutal-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl border-4 border-white shadow-[16px_16px_0px_#0f3cc9] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            
            <div className="bg-brutal-black text-white p-6 border-b-4 border-white flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <ShieldCheck size={28} className="text-green-400" />
                 <h2 className="text-2xl font-black uppercase tracking-widest">Enviar Arquivo Final</h2>
               </div>
               <button onClick={() => setShowDeliveryModal(false)} className="text-gray-400 hover:text-white transition-colors">
                 Fechar
               </button>
            </div>

            <div className="p-8 overflow-y-auto">
               <p className="font-bold text-gray-600 mb-8">
                 Você está prestes a enviar o trabalho final. O sistema vai analisar o arquivo e gerar um <strong>Certificado de Autoria</strong> garantindo os direitos para o cliente.
               </p>

               <div className="border-4 border-dashed border-gray-300 p-12 text-center bg-gray-50 hover:bg-white hover:border-royal transition-colors cursor-pointer group mb-8 relative">
                  <input 
                    type="file" 
                    id="finalDeliveryFile"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    onChange={() => alert("Arquivo selecionado e pronto para envio seguro.")}
                  />
                  <div className="w-16 h-16 bg-blue-100 border-4 border-brutal-black flex items-center justify-center mx-auto mb-4 group-hover:bg-royal group-hover:text-white transition-colors relative z-0">
                    <Paperclip size={32} />
                  </div>
                  <p className="font-black uppercase text-lg relative z-0">Subir Arquivo Final (.ZIP ou PDF)</p>
                  <p className="font-bold text-sm text-gray-500 relative z-0">Isso criará uma proteção legal para você e para o cliente.</p>
               </div>

               <div className="bg-yellow-50 border-4 border-brutal-black p-6">
                 <h4 className="font-black uppercase text-sm mb-4 flex items-center gap-2">
                   <Search size={16} /> Verificação de Segurança
                 </h4>
                 <ul className="space-y-3 font-bold text-sm text-gray-700">
                   <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-green-600" /> Proteção contra cópias.</li>
                   <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-green-600" /> Registro oficial da data e hora da entrega.</li>
                   <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-green-600" /> Geração do contrato final em PDF.</li>
                 </ul>
               </div>
            </div>

            <div className="p-6 border-t-4 border-brutal-black bg-gray-100 flex justify-end gap-4">
               <button onClick={() => setShowDeliveryModal(false)} className="px-6 py-4 font-black uppercase border-4 border-brutal-black hover:bg-gray-200 transition-colors bg-white">
                 Cancelar
               </button>
               <button 
                 onClick={async () => {
                   const fileInput = document.getElementById('finalDeliveryFile') as HTMLInputElement;
                   if (!fileInput?.files?.[0]) { alert('Selecione um arquivo primeiro.'); return; }
                   
                   try {
                     const formData = new FormData();
                     formData.append('file', fileInput.files[0]);
                     formData.append('jobId', jobId || '');

                     const res = await fetch('/api/delivery/certify', {
                       method: 'POST',
                       body: formData
                     });

                                            if (res.ok) {
                         const jsonRes = await res.json();
                         alert("Arquivo salvo e Certificado gerado com sucesso!");
                         setShowDeliveryModal(false);
                         if (jsonRes.job) setJobContext(jsonRes.job);
                         
                         // Dispara mensagem automática no chat informando o cliente
                         const systemMsg = "Trabalho final entregue. O documento de direitos autorais foi gerado e você tem até 48 horas para aprovar.";
                         setMessages((prev: any[]) => [...prev, { id: Date.now(), text: systemMsg, sender: "system", time: "Agora" }]);
                         
                         supabase.channel(`job-${jobId}`).send({
                           type: 'broadcast', event: 'new-message',
                           payload: { id: Date.now(), text: systemMsg, sender: "system", time: new Date().toLocaleTimeString() }
                         });

                         if (jsonRes.job) {
                           supabase.channel(`job-${jobId}`).send({
                             type: 'broadcast', event: 'job-updated',
                             payload: { job: jsonRes.job }
                           });
                         }
                       } else {
                       alert("Erro ao salvar arquivo.");
                     }
                   } catch(e) {
                     alert("Falha de conexão com o sistema.");
                   }
                 }}
                 className="bg-green-500 text-brutal-black px-8 py-4 font-black uppercase text-lg border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-2"
               >
                 <Fingerprint size={20} /> Assinar e Entregar
               </button>
            </div>

          </div>
        </div>
      )}


      {/* MODAL DO CLIENTE: REVISÃO DA ENTREGA */}
      {showClientReviewModal && (
        <div className="fixed inset-0 bg-brutal-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl border-4 border-white shadow-[16px_16px_0px_#22c55e] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            
            <div className="bg-brutal-black text-white p-6 border-b-4 border-white flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <ShieldCheck size={28} className="text-green-400" />
                 <h2 className="text-2xl font-black uppercase tracking-widest">Revisão da Entrega</h2>
               </div>
               <button onClick={() => setShowClientReviewModal(false)} className="text-gray-400 hover:text-white transition-colors">
                 Fechar
               </button>
            </div>

            <div className="p-8 overflow-y-auto">
               <p className="font-bold text-gray-600 mb-8">
                 O profissional entregou os arquivos finais. Por favor, revise o material.
               </p>

               {jobContext?.finalAssetUrl ? (
                 <div className="border-4 border-brutal-black p-6 bg-gray-50 flex items-center justify-between mb-8 hover:bg-gray-100 transition-colors">
                   <div className="flex items-center gap-4">
                     <FileText size={32} className="text-royal" />
                     <div>
                       <h4 className="font-black uppercase text-lg">Arquivo Final</h4>
                       <a href={jobContext.finalAssetUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-600 hover:underline">
                         Clique para baixar/visualizar
                       </a>
                     </div>
                   </div>
                 </div>
               ) : (
                 <div className="mb-8 font-bold text-gray-500">Nenhum arquivo encontrado. (O profissional pode não ter enviado o arquivo pela plataforma corretamente).</div>
               )}
            </div>

            <div className="p-6 border-t-4 border-brutal-black bg-gray-100 flex justify-end gap-4">
               <button 
                 onClick={() => {
                   setShowClientReviewModal(false);
                   setJobContext((prev: any) => ({ ...prev, status: 'in_progress' }));
                   const sysMsg = "O cliente solicitou mudanças na entrega. Por favor, revise e envie novamente.";
                   setMessages((prev: any[]) => [...prev, { id: Date.now(), text: sysMsg, sender: "system", time: new Date().toLocaleTimeString() }]);
                   supabase.channel(`job-${jobId}`).send({
                     type: 'broadcast', event: 'new-message',
                     payload: { id: Date.now(), text: sysMsg, sender: "system", time: new Date().toLocaleTimeString() }
                   });
                 }}
                 className="px-6 py-4 font-black uppercase border-4 border-brutal-black hover:bg-yellow-300 transition-colors bg-white"
               >
                 Pedir Mudança
               </button>
               <button 
                 onClick={() => {
                   setShowClientReviewModal(false);
                   setShowRatingModal(true);
                 }}
                 className="bg-green-500 text-white px-8 py-4 font-black uppercase text-lg border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-2"
               >
                 <CheckCircle2 size={20} /> Confirmar Entrega
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function WorkspaceChatPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black uppercase text-xl">Carregando Chat...</div>}>
      <WorkspaceChat />
    </Suspense>
  );
}
