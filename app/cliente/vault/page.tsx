"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, UploadCloud, Image as ImageIcon, Palette, Type, Shield, Lock, X, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function EditarBrandVault() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Mock dados iniciais (simulando fetch do DB)
  const [vaultData, setVaultData] = useState({
    name: 'Minha Empresa',
    slogan: 'Inovação em cada detalhe',
    targetAudience: 'Jovens adultos, tech-savvy',
    toneOfVoice: 'Moderno, direto e arrojado',
    colors: ['#0f3cc9', '#22c55e', '#0f172a'],
    fonts: ['Inter', 'Space Grotesk'],
    imageUrl: '' // Upload da imagem vai pra cá
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    // Autenticação básica simulação
    const role = localStorage.getItem('userRole');
    if (!role) {
      router.push('/login');
    }
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Preview local instantâneo
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);

      // Simular upload para a API
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        // Exemplo: const res = await fetch('/api/upload', { method: 'POST', body: formData });
        // const data = await res.json();
        // setVaultData({ ...vaultData, imageUrl: data.url });

        // Simulação de sucesso
        setTimeout(() => {
          setVaultData({ ...vaultData, imageUrl: objectUrl });
        }, 1000);
      } catch (error) {
        alert("Erro no upload da imagem");
      }
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    setVaultData({ ...vaultData, imageUrl: '' });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simular chamada API
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  const updateColor = (index: number, newColor: string) => {
    const newColors = [...vaultData.colors];
    newColors[index] = newColor;
    setVaultData({ ...vaultData, colors: newColors });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-brutal-black selection:bg-royal selection:text-white flex flex-col">
      {/* Header Brutalista */}
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b-4 border-brutal-black">
        <div className="flex items-center gap-4">
          <Link href="/cliente" className="p-2 hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-brutal-black">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3 border-l-4 border-royal pl-4">
            <Shield size={32} className="text-royal" />
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest leading-none">Editar Brand Vault</h1>
              <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Acesso de Cliente</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 lg:p-12">
        <form onSubmit={handleSave} className="bg-white border-4 border-brutal-black shadow-brutal-dark p-8 md:p-12 animate-in fade-in duration-500">
          
          <div className="mb-10 pb-8 border-b-4 border-brutal-black">
            <h2 className="text-3xl font-black uppercase mb-2">Seus Ativos de Marca</h2>
            <p className="font-bold text-gray-500">Atualize as informações do seu cofre. A célula criativa será notificada das mudanças.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-10">
            {/* Informações Básicas */}
            <div className="space-y-6">
              <div>
                <label className="block font-black uppercase text-gray-500 mb-2">Nome da Marca</label>
                <input 
                  type="text" 
                  value={vaultData.name}
                  onChange={(e) => setVaultData({...vaultData, name: e.target.value})}
                  className="w-full text-2xl font-black uppercase border-b-4 border-brutal-black bg-transparent py-2 focus:outline-none focus:border-royal transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block font-black uppercase text-gray-500 mb-2">Slogan / Promessa</label>
                <input 
                  type="text" 
                  value={vaultData.slogan}
                  onChange={(e) => setVaultData({...vaultData, slogan: e.target.value})}
                  className="w-full text-lg font-bold border-b-4 border-brutal-black bg-transparent py-2 focus:outline-none focus:border-royal transition-colors"
                />
              </div>
              <div>
                <label className="block font-black uppercase text-gray-500 mb-2">Público-Alvo</label>
                <textarea 
                  value={vaultData.targetAudience}
                  onChange={(e) => setVaultData({...vaultData, targetAudience: e.target.value})}
                  className="w-full text-sm font-bold border-4 border-brutal-black bg-white p-3 focus:outline-none focus:bg-blue-50 transition-colors resize-none h-24"
                />
              </div>
              <div>
                <label className="block font-black uppercase text-gray-500 mb-2">Tom de Voz</label>
                <textarea 
                  value={vaultData.toneOfVoice}
                  onChange={(e) => setVaultData({...vaultData, toneOfVoice: e.target.value})}
                  className="w-full text-sm font-bold border-4 border-brutal-black bg-white p-3 focus:outline-none focus:bg-blue-50 transition-colors resize-none h-24"
                />
              </div>
            </div>

            {/* Identidade Visual & Upload */}
            <div className="space-y-8">
              
              {/* Upload de Imagem (Logo/Reference) */}
              <div>
                <label className="block font-black uppercase text-gray-500 mb-2">Imagem Principal (Logo/Reference)</label>
                {!previewImage ? (
                  <div className="border-4 border-dashed border-brutal-black bg-gray-50 p-8 text-center hover:bg-yellow-50 hover:border-royal transition-colors cursor-pointer group relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                      onChange={handleImageUpload}
                    />
                    <UploadCloud size={40} className="mx-auto text-gray-400 group-hover:text-royal mb-2 transition-colors relative z-0" />
                    <h3 className="text-lg font-black uppercase mb-1 relative z-0">Upload de Imagem</h3>
                    <p className="font-bold text-xs text-gray-500 relative z-0">JPG, PNG ou SVG</p>
                  </div>
                ) : (
                  <div className="relative border-4 border-brutal-black bg-gray-100 p-2 group">
                    <img src={previewImage} alt="Preview" className="w-full h-48 object-contain" />
                    <button 
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-2 border-2 border-brutal-black hover:bg-red-600 shadow-brutal-sm transition-transform active:translate-y-1"
                    >
                      <X size={20} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-white border-2 border-brutal-black px-2 py-1 text-xs font-black flex items-center gap-2">
                      <ImageIcon size={14}/> Imagem Carregada
                    </div>
                  </div>
                )}
              </div>

              {/* Cores */}
              <div>
                <label className="flex items-center gap-2 font-black uppercase text-gray-500 mb-4">
                  <Palette size={20} /> Cores Primárias (Hex)
                </label>
                <div className="flex gap-4">
                  {vaultData.colors.map((color, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-2">
                      <div 
                        className="w-16 h-16 border-4 border-brutal-black shadow-brutal-sm relative overflow-hidden"
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
                        className="w-16 text-center font-bold text-xs border-2 border-brutal-black p-1 uppercase"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Fontes */}
              <div>
                <label className="flex items-center gap-2 font-black uppercase text-gray-500 mb-4">
                  <Type size={20} /> Tipografia
                </label>
                <div className="space-y-3">
                  {vaultData.fonts.map((font, idx) => (
                    <input 
                      key={idx}
                      type="text" 
                      value={font}
                      onChange={(e) => {
                        const newFonts = [...vaultData.fonts];
                        newFonts[idx] = e.target.value;
                        setVaultData({...vaultData, fonts: newFonts});
                      }}
                      className="w-full text-lg font-black border-4 border-brutal-black p-2 focus:outline-none focus:bg-yellow-50 transition-colors"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-8 border-t-4 border-brutal-black">
            <button 
              type="submit"
              disabled={isSaving}
              className="bg-green-500 disabled:bg-gray-400 disabled:shadow-none text-brutal-black px-10 py-4 font-black uppercase text-xl border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex items-center gap-3"
            >
              {isSaving ? (
                <>Salvando...</>
              ) : (
                <><Save size={24} /> Atualizar Cofre</>
              )}
            </button>
          </div>
        </form>
      </main>

      {/* TOAST DE SUCESSO */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-brutal-black text-white p-6 border-4 border-green-400 shadow-[8px_8px_0px_#22c55e] animate-in slide-in-from-bottom-5 z-50 flex items-center gap-4">
          <CheckCircle size={32} className="text-green-400" />
          <div>
            <h4 className="font-black uppercase tracking-widest text-lg">Cofre Atualizado</h4>
            <p className="font-bold text-gray-300 text-sm">Mudanças salvas com sucesso no Brand Vault.</p>
          </div>
        </div>
      )}
    </div>
  );
}
