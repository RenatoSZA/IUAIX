"use client";
import React, { useState } from 'react';
import { UploadCloud, Link as LinkIcon, Wand2, Palette, Type, CheckCircle, RefreshCw, ArrowLeft, Image as ImageIcon, Sparkles, X, Lock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BrandVault() {
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('userRole')) {
      router.push('/login');
    }
  }, [router]);

  const [status, setStatus] = useState<'idle' | 'analyzing' | 'ready'>('idle');
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);

  // Dados extraídos pela IA (Editáveis pelo usuário)
  const [brandData, setBrandData] = useState({
    name: '',
    slogan: '',
    targetAudience: '',
    toneOfVoice: '',
    colors: ['#000000', '#FFFFFF', '#CCCCCC'],
    fonts: ['Inter', 'Helvetica'],
    vibe: ['Moderno'],
    rules: [] as { type: 'do' | 'dont', text: string }[]
  });

  const [showToast, setShowToast] = useState(false);

  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleAddInput = () => {
    if (!inputValue.trim()) return;
    setAttachments([...attachments, inputValue]);
    setInputValue('');
  };

  const simulateAIExtraction = () => {
    if (attachments.length === 0) {
      alert("Anexe pelo menos um link ou arquivo para a IA analisar.");
      return;
    }
    
    setStatus('analyzing');
    
    setTimeout(() => {
      // Mock da IA preenchendo os dados baseados no "input"
      setBrandData({
        name: 'Minha Startup',
        slogan: 'Infraestrutura criativa B2B',
        targetAudience: 'Fundadores, C-Levels e Diretores de Marketing de empresas tech e SaaS buscando escalar design.',
        toneOfVoice: 'Direto, pragmático, sem jargões de marketing e altamente profissional. Sem excesso de emojis.',
        colors: ['#0f172a', '#0F3CC9', '#FDE047'], // brutal-black, royal, yellow
        fonts: ['Space Grotesk', 'Inter'],
        vibe: ['Arrojado', 'B2B', 'Tech', 'Minimalista', 'Brutalista'],
        rules: [
          { type: 'do', text: 'Sempre usar alto contraste entre fundo e texto.' },
          { type: 'do', text: 'Aplicar borders grossas e cantos quadrados.' },
          { type: 'dont', text: 'Nunca usar degradês complexos ou sombras suaves.' },
          { type: 'dont', text: 'Evitar fotos clichês de banco de imagens (pessoas sorrindo para o nada).' }
        ]
      });
      setStatus('ready');
    }, 4000);
  };

  const updateColor = (index: number, newColor: string) => {
    const newColors = [...brandData.colors];
    newColors[index] = newColor;
    setBrandData({ ...brandData, colors: newColors });
  };

  const removeVibe = (tagToRemove: string) => {
    setBrandData({ ...brandData, vibe: brandData.vibe.filter(v => v !== tagToRemove) });
  };

  const removeRule = (idxToRemove: number) => {
    setBrandData({ ...brandData, rules: brandData.rules.filter((_, idx) => idx !== idxToRemove) });
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
            <Palette size={32} className="text-royal" />
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest leading-none">Brand Vault</h1>
              <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Cofre de Identidade</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-12">
        
        {/* Etapa 1: Jogue Tudo Aqui (Dump Zone) */}
        {status === 'idle' && (
          <div className="animate-in fade-in duration-500">
            <div className="mb-8">
              <h2 className="text-4xl md:text-5xl font-black uppercase mb-4 leading-tight">Chega de preencher formulários chatos.</h2>
              <p className="font-bold text-gray-500 text-lg max-w-3xl">
                Jogue o link do seu Instagram, site, ou arraste prints de artes antigas aqui. Nossa Inteligência Artificial vai varrer suas referências e montar seu Brand Vault (Cores, Fontes e Vibe) automaticamente.
              </p>
            </div>

            {/* Drag & Drop Zone */}
            <div className="border-4 border-dashed border-brutal-black bg-white p-12 text-center hover:bg-blue-50 hover:border-royal transition-colors cursor-pointer group mb-6 relative">
              <UploadCloud size={64} className="mx-auto text-gray-400 group-hover:text-royal mb-4 transition-colors" />
              <h3 className="text-2xl font-black uppercase mb-2">Arraste Arquivos Aqui</h3>
              <p className="font-bold text-gray-500">PDFs, SVGs, PNGs ou JPGs suportados.</p>
              
              {/* Overlay Simulado de Arquivos Anexados */}
              <button 
                onClick={(e) => { e.stopPropagation(); setAttachments([...attachments, 'print_antigo_01.png']); }}
                className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 px-3 py-1 text-xs font-bold uppercase border-2 border-brutal-black"
              >
                + Simular Upload
              </button>
            </div>

            {/* Input de Links */}
            <div className="flex gap-2 mb-8">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LinkIcon size={20} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddInput()}
                  placeholder="Cole o link do seu Instagram, Site ou Referência..." 
                  className="w-full border-4 border-brutal-black py-4 pl-12 pr-4 font-bold text-lg focus:outline-none focus:bg-yellow-50 transition-colors"
                />
              </div>
              <button 
                onClick={handleAddInput}
                className="bg-brutal-black text-white px-8 font-black uppercase hover:bg-royal transition-colors border-4 border-brutal-black shadow-brutal-sm active:translate-y-1 active:shadow-none"
              >
                Adicionar
              </button>
            </div>

            {/* Lista de Anexos */}
            {attachments.length > 0 && (
              <div className="mb-10">
                <h4 className="font-black uppercase text-sm mb-3 text-gray-500">Anexos Prontos para Análise:</h4>
                <div className="flex flex-wrap gap-3">
                  {attachments.map((att, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-white border-2 border-brutal-black px-4 py-2 font-bold text-sm shadow-[2px_2px_0px_#0f172a]">
                      {att.includes('.png') || att.includes('.jpg') ? <ImageIcon size={16} className="text-royal" /> : <LinkIcon size={16} className="text-royal" />}
                      {att}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={simulateAIExtraction}
              disabled={attachments.length === 0}
              className="w-full bg-royal disabled:bg-gray-300 disabled:border-gray-400 disabled:text-gray-500 disabled:shadow-none text-white border-4 border-brutal-black py-6 text-2xl font-black uppercase tracking-widest hover:bg-blue-800 transition-all shadow-[8px_8px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_#0f172a] flex justify-center items-center gap-4"
            >
              <Wand2 size={28} />
              Extrair Identidade Visual
            </button>
          </div>
        )}

        {/* Etapa 2: Analisando (Carregamento) */}
        {status === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-32 bg-white border-4 border-brutal-black shadow-brutal-dark animate-in zoom-in duration-500">
            <Sparkles size={64} className="text-royal animate-pulse mb-8" />
            <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 text-center">Mágica Acontecendo</h2>
            <div className="space-y-2 text-center font-bold text-gray-500 uppercase tracking-widest text-sm">
              <p className="animate-pulse">Varrendo links fornecidos...</p>
              <p className="animate-pulse delay-75">Extraindo paletas hexadecimais...</p>
              <p className="animate-pulse delay-150">Identificando famílias tipográficas...</p>
            </div>
          </div>
        )}

        {/* Etapa 3: Editável (Resultado da IA) */}
        {status === 'ready' && (
          <div className="animate-in slide-in-from-bottom-8 duration-500">
            <div className="bg-green-500 text-brutal-black p-4 border-4 border-brutal-black flex items-center justify-between mb-8 shadow-brutal-sm">
              <div className="flex items-center gap-3">
                <CheckCircle size={24} />
                <div>
                  <h3 className="font-black uppercase">Extração Concluída</h3>
                  <p className="font-bold text-sm">Você pode alterar qualquer valor que a IA tenha lido errado.</p>
                </div>
              </div>
              <button onClick={() => setStatus('idle')} className="p-2 hover:bg-green-600 border-2 border-transparent hover:border-brutal-black transition-colors">
                <RefreshCw size={20} />
              </button>
            </div>

            <div className="bg-white border-4 border-brutal-black shadow-brutal-dark p-8 md:p-12">
              
              <div className="grid md:grid-cols-2 gap-12 mb-10">
                {/* Nome da Marca e Slogan */}
                <div>
                  <div className="mb-6">
                    <label className="block font-black uppercase text-gray-500 mb-2">Nome da Marca</label>
                    <input 
                      type="text" 
                      value={brandData.name}
                      onChange={(e) => setBrandData({...brandData, name: e.target.value})}
                      className="w-full text-3xl font-black uppercase border-b-4 border-brutal-black bg-transparent py-2 focus:outline-none focus:border-royal transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-gray-500 mb-2">Slogan / Promessa Principal</label>
                    <input 
                      type="text" 
                      value={brandData.slogan}
                      onChange={(e) => setBrandData({...brandData, slogan: e.target.value})}
                      className="w-full text-xl font-bold border-b-4 border-brutal-black bg-transparent py-2 focus:outline-none focus:border-royal transition-colors"
                    />
                  </div>
                </div>

                {/* Público e Tom de Voz */}
                <div className="space-y-6">
                  <div>
                    <label className="block font-black uppercase text-gray-500 mb-2">Público-Alvo (Persona)</label>
                    <textarea 
                      value={brandData.targetAudience}
                      onChange={(e) => setBrandData({...brandData, targetAudience: e.target.value})}
                      className="w-full text-sm font-bold border-4 border-brutal-black bg-white p-3 focus:outline-none focus:bg-blue-50 transition-colors resize-none h-20"
                    />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-gray-500 mb-2">Tom de Voz da Marca</label>
                    <textarea 
                      value={brandData.toneOfVoice}
                      onChange={(e) => setBrandData({...brandData, toneOfVoice: e.target.value})}
                      className="w-full text-sm font-bold border-4 border-brutal-black bg-white p-3 focus:outline-none focus:bg-blue-50 transition-colors resize-none h-20"
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-12 mb-10">
                {/* Cores */}
                <div>
                  <label className="flex items-center gap-2 font-black uppercase text-gray-500 mb-4">
                    <Palette size={20} /> Cores Chave (Hex)
                  </label>
                  <div className="flex gap-4">
                    {brandData.colors.map((color, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <div 
                          className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-brutal-black shadow-brutal-sm relative group overflow-hidden"
                          style={{ backgroundColor: color }}
                        >
                          <input 
                            type="color" 
                            value={color}
                            onChange={(e) => updateColor(idx, e.target.value)}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </div>
                        <input 
                          type="text" 
                          value={color}
                          onChange={(e) => updateColor(idx, e.target.value)}
                          className="w-20 sm:w-24 text-center font-bold text-xs sm:text-sm border-2 border-brutal-black p-1 uppercase"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fontes */}
                <div>
                  <label className="flex items-center gap-2 font-black uppercase text-gray-500 mb-4">
                    <Type size={20} /> Família Tipográfica
                  </label>
                  <div className="space-y-3">
                    {brandData.fonts.map((font, idx) => (
                      <input 
                        key={idx}
                        type="text" 
                        value={font}
                        onChange={(e) => {
                          const newFonts = [...brandData.fonts];
                          newFonts[idx] = e.target.value;
                          setBrandData({...brandData, fonts: newFonts});
                        }}
                        className="w-full text-xl font-black border-4 border-brutal-black p-3 focus:outline-none focus:bg-blue-50"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Vibe / Tags */}
              <div className="mb-10">
                <label className="block font-black uppercase text-gray-500 mb-4">Direção Criativa (Vibe Lida pela IA)</label>
                <div className="flex flex-wrap gap-3">
                  {brandData.vibe.map((v, idx) => (
                    <span key={idx} className="bg-yellow-300 border-2 border-brutal-black px-4 py-2 font-black uppercase flex items-center gap-2 text-sm">
                      {v}
                      <button onClick={() => removeVibe(v)} className="hover:text-red-600"><X size={16} /></button>
                    </span>
                  ))}
                  <button className="bg-gray-100 border-2 border-dashed border-gray-400 px-4 py-2 font-bold uppercase text-gray-500 hover:border-brutal-black hover:text-brutal-black transition-colors text-sm">
                    + Adicionar Tag
                  </button>
                </div>
              </div>

              {/* Regras de Ouro (Do's and Don'ts) */}
              <div className="mb-12 border-t-4 border-brutal-black pt-8">
                <label className="block font-black uppercase text-gray-900 mb-6 text-xl">Regras de Ouro (Do's & Don'ts)</label>
                <div className="space-y-3">
                  {brandData.rules.map((rule, idx) => (
                    <div key={idx} className={`flex items-start gap-3 p-4 border-4 border-brutal-black ${rule.type === 'do' ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="mt-1">
                        {rule.type === 'do' ? <CheckCircle size={20} className="text-green-600" /> : <X size={20} className="text-red-600" />}
                      </div>
                      <div className="flex-1">
                        <input 
                          type="text"
                          value={rule.text}
                          onChange={(e) => {
                            const newRules = [...brandData.rules];
                            newRules[idx].text = e.target.value;
                            setBrandData({...brandData, rules: newRules});
                          }}
                          className="w-full bg-transparent font-bold text-sm sm:text-base focus:outline-none"
                        />
                      </div>
                      <button onClick={() => removeRule(idx)} className="text-gray-400 hover:text-brutal-black"><X size={20}/></button>
                    </div>
                  ))}
                  <div className="flex gap-4 mt-4">
                    <button className="flex-1 bg-gray-100 border-2 border-dashed border-green-600 text-green-700 py-3 font-bold uppercase text-sm hover:bg-green-100 transition-colors flex items-center justify-center gap-2">
                       + Regra do que Fazer (DO)
                    </button>
                    <button className="flex-1 bg-gray-100 border-2 border-dashed border-red-600 text-red-700 py-3 font-bold uppercase text-sm hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                       + O que Evitar (DON'T)
                    </button>
                  </div>
                </div>
              </div>

              {/* Botão de Salvar Master */}
              <div className="flex justify-end pt-8 border-t-4 border-brutal-black mt-8">
                <button 
                  onClick={handleSave}
                  className="bg-green-500 text-brutal-black px-12 py-5 font-black uppercase text-xl border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-3"
                >
                  <Lock size={24} /> Salvar e Trancar Cofre
                </button>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* TOAST DE SUCESSO (Brutalista) */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-brutal-black text-white p-6 border-4 border-green-400 shadow-[8px_8px_0px_#22c55e] animate-in slide-in-from-bottom-5 z-50 flex items-center gap-4">
          <CheckCircle size={32} className="text-green-400" />
          <div>
            <h4 className="font-black uppercase tracking-widest text-lg">Cofre Atualizado</h4>
            <p className="font-bold text-gray-300 text-sm">Sua Célula Criativa já tem acesso imediato aos novos dados.</p>
          </div>
        </div>
      )}
    </div>
  );
}
