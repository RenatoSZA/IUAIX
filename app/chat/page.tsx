"use client";
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Paperclip, Send, AlertTriangle, Fingerprint, Search, ShieldCheck, CheckCircle2, FileText, Database, FolderSync, Star, X, Lock } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkspaceChat() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  
  useEffect(() => {
    const savedRole = localStorage.getItem('userRole');
    if (!savedRole) {
      router.push('/login');
    } else {
      setRole(savedRole);
    }
  }, [router]);

  const [messages, setMessages] = useState([
    { id: 1, text: "Escopo congelado. Arquivos base e Brand Vault recebidos com sucesso.", sender: "system", time: "09:41" },
    { id: 2, text: "Estou iniciando a montagem da estrutura base. Devo focar mais na variante escura ou clara do logo?", sender: "pro", time: "10:15" }
  ]);
  const [inputMsg, setInputMsg] = useState("");
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  if (!role) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-black uppercase text-xl">Autenticando Sessão...</div>;
  }

  const handleSend = () => {
    if (!inputMsg.trim()) return;
    setMessages([...messages, { id: Date.now(), text: inputMsg, sender: "client", time: "Agora" }]);
    setInputMsg("");
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-brutal-black flex flex-col">
      
      {/* Header Workspace */}
      <header className="bg-white border-b-4 border-brutal-black px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/cliente" className="p-2 border-2 border-transparent hover:border-brutal-black transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 border-4 border-brutal-black flex items-center justify-center font-black text-royal shadow-[2px_2px_0px_#0f172a]">
              SA
            </div>
            <div>
              <h1 className="font-black uppercase tracking-tight text-xl leading-none">Squad Alpha</h1>
              <span className="text-xs font-black text-green-600 uppercase tracking-widest flex items-center gap-1 mt-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online no Arquivo
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {role === 'criativo' && (
            <button 
              onClick={() => setShowDeliveryModal(true)}
              className="hidden md:flex bg-yellow-300 border-4 border-brutal-black px-6 py-2 font-black uppercase text-sm hover:bg-yellow-400 transition-colors shadow-brutal-sm items-center gap-2"
            >
              Entregar Job Final
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
            
            <div className="space-y-4 flex-1 overflow-y-auto">
              <div className="bg-gray-100 p-4 border-2 border-gray-200">
                <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Status do Escrow</span>
                <span className="font-bold text-sm text-brutal-black flex items-center gap-2">Bloqueado <Lock size={12}/></span>
              </div>
              
              <div className="bg-gray-100 p-4 border-2 border-gray-200">
                <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Políticas</span>
                <span className="font-bold text-sm text-brutal-black block mb-1">Refatorações: 3 restantes</span>
                <span className="font-bold text-sm text-brutal-black block">Pivotagem: Custo extra ativado</span>
              </div>

              <h3 className="font-black uppercase tracking-widest text-xs mt-6 mb-3 flex items-center gap-2">
                <FolderSync size={16} /> Central de Arquivos
              </h3>
              
              <div className="flex items-center justify-between p-3 border-2 border-brutal-black hover:bg-blue-50 cursor-pointer transition-colors bg-white">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-royal" />
                  <span className="font-bold text-xs uppercase">Brand_Vault.json</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border-2 border-brutal-black hover:bg-blue-50 cursor-pointer transition-colors bg-white">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-royal" />
                  <span className="font-bold text-xs uppercase">Ref_Concorrente.png</span>
                </div>
              </div>

            </div>

            {/* Help / Suporte Action (Inspirado em Uber/iFood Help Center) */}
            <div className="mt-4 pt-4 border-t-4 border-brutal-black">
              <button className="w-full bg-red-50 text-red-700 border-4 border-red-700 p-4 font-black uppercase text-xs flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-colors">
                <AlertTriangle size={16} /> Acionar Suporte (S.W.A.T)
              </button>
              <p className="text-[10px] text-gray-500 font-bold text-center mt-2">Profissional não responde ou quebrou regras? A Célula será substituída sem custo.</p>
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
              <button className="p-4 bg-gray-100 border-4 border-brutal-black hover:bg-yellow-300 transition-colors shadow-brutal-sm">
                <Paperclip size={24} />
              </button>
              
              <div className="flex-1 relative border-4 border-brutal-black shadow-brutal-sm bg-white focus-within:border-royal transition-colors">
                <textarea 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  placeholder="Escreva uma mensagem ou diretriz..."
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
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Aviso: Mudanças solicitadas aqui consomem pontos de refatoração se alterarem mais de 80% da arte.</p>
              {role === 'empresa' && (
                <button onClick={() => setShowRatingModal(true)} className="text-[10px] font-black uppercase text-green-600 tracking-widest hover:underline">Simular Aprovação Final</button>
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
               <h2 className="text-3xl font-black uppercase tracking-widest">Entrega Aprovada!</h2>
               <p className="font-bold mt-2">O Escrow de 5 TKNS foi liberado para o profissional. Os direitos autorais (IP) foram transferidos com sucesso para a sua empresa.</p>
            </div>

            <div className="p-8 text-center">
               <h3 className="font-black uppercase text-xl mb-6">Como foi trabalhar com Squad Alpha?</h3>
               <div className="flex justify-center gap-2 mb-8">
                 {[1, 2, 3, 4, 5].map((star) => (
                   <button key={star} className="text-gray-300 hover:text-yellow-400 transition-colors focus:text-yellow-400">
                     <Star size={48} strokeWidth={1.5} className="fill-current" />
                   </button>
                 ))}
               </div>

               <div className="space-y-4">
                 <Link href="/cliente/roi" className="w-full flex items-center justify-center gap-2 bg-brutal-black text-white px-8 py-4 font-black uppercase text-lg border-4 border-brutal-black shadow-[4px_4px_0px_#0f3cc9] hover:bg-royal transition-all hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                   Ver Comprovante de ROI <ArrowRight size={20} />
                 </Link>
                 <Link href="/matchmaking" className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-500 px-8 py-4 font-black uppercase text-sm border-4 border-brutal-black hover:text-brutal-black hover:bg-white transition-all shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none">
                   Recontratar para outro Job
                 </Link>
               </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE ENTREGA (Forensic UI) - Mesma lógica de antes, mas re-estilizado brutalista */}
      {showDeliveryModal && (
        <div className="fixed inset-0 bg-brutal-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl border-4 border-white shadow-[16px_16px_0px_#0f3cc9] flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
            
            <div className="bg-brutal-black text-white p-6 border-b-4 border-white flex justify-between items-center">
               <div className="flex items-center gap-3">
                 <ShieldCheck size={28} className="text-green-400" />
                 <h2 className="text-2xl font-black uppercase tracking-widest">Protocolo de Entrega Final</h2>
               </div>
               <button onClick={() => setShowDeliveryModal(false)} className="text-gray-400 hover:text-white transition-colors">
                 Fechar
               </button>
            </div>

            <div className="p-8 overflow-y-auto">
               <p className="font-bold text-gray-600 mb-8">
                 Você está prestes a submeter o arquivo final. O sistema realizará uma auditoria automatizada para garantir os direitos autorais e as diretrizes do Brand Vault antes de disparar o timer de 48h para a liberação do Escrow.
               </p>

               <div className="border-4 border-dashed border-gray-300 p-12 text-center bg-gray-50 hover:bg-white hover:border-royal transition-colors cursor-pointer group mb-8">
                  <div className="w-16 h-16 bg-blue-100 border-4 border-brutal-black flex items-center justify-center mx-auto mb-4 group-hover:bg-royal group-hover:text-white transition-colors">
                    <Paperclip size={32} />
                  </div>
                  <p className="font-black uppercase text-lg">Subir Arquivo Final (.ZIP ou Link)</p>
                  <p className="font-bold text-sm text-gray-500">Máx 500MB</p>
               </div>

               <div className="bg-yellow-50 border-4 border-brutal-black p-6">
                 <h4 className="font-black uppercase text-sm mb-4 flex items-center gap-2">
                   <Search size={16} /> Simulação de Forense (IA Auditora)
                 </h4>
                 <ul className="space-y-3 font-bold text-sm text-gray-700">
                   <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-green-600" /> Checagem de plágio no Getty Images/Shutterstock.</li>
                   <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-green-600" /> Verificação de Cores vs Brand Vault.</li>
                   <li className="flex items-center gap-3"><CheckCircle2 size={16} className="text-green-600" /> Injeção de Watermark VDI no preview.</li>
                 </ul>
               </div>
            </div>

            <div className="p-6 border-t-4 border-brutal-black bg-gray-100 flex justify-end gap-4">
               <button onClick={() => setShowDeliveryModal(false)} className="px-6 py-4 font-black uppercase border-4 border-brutal-black hover:bg-gray-200 transition-colors bg-white">
                 Cancelar
               </button>
               <button className="bg-green-500 text-brutal-black px-8 py-4 font-black uppercase text-lg border-4 border-brutal-black shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-2">
                 <Fingerprint size={20} /> Assinar e Entregar
               </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
