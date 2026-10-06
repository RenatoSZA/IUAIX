"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Link as LinkIcon, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PerfilPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  useEffect(() => {
    fetch('/api/perfil')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setName(data.user.name || '');
          setPortfolioUrl(data.user.portfolioUrl || '');
          setRole(data.user.role || '');
        } else {
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    try {
      const res = await fetch('/api/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, portfolioUrl })
      });
      if (res.ok) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('idle');
        alert("Erro ao salvar perfil");
      }
    } catch {
      setStatus('idle');
      alert("Erro de conexão");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-brutal-black">
      <header className="bg-white border-b-4 border-brutal-black px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 border-2 border-transparent hover:border-brutal-black transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="font-black uppercase tracking-tight text-xl leading-none">Personalização de Perfil</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 mt-10">
        <form onSubmit={handleSave} className="bg-white border-4 border-brutal-black shadow-[8px_8px_0px_#0f172a] p-8 flex flex-col gap-6">
          
          <div>
            <label className="block font-black uppercase text-sm mb-2 flex items-center gap-2">
              <User size={16} /> Nome / Razão Social
            </label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-50 border-4 border-brutal-black p-4 font-bold outline-none focus:bg-white focus:border-royal transition-colors"
              required
            />
          </div>

          {role === 'criativo' && (
            <div>
              <label className="block font-black uppercase text-sm mb-2 flex items-center gap-2">
                <LinkIcon size={16} /> URL do Portfólio (Behance, Dribbble, Site)
              </label>
              <input 
                type="url" 
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://behance.net/seu-perfil"
                className="w-full bg-gray-50 border-4 border-brutal-black p-4 font-bold outline-none focus:bg-white focus:border-royal transition-colors"
              />
            </div>
          )}

          <div className="mt-4 pt-6 border-t-4 border-brutal-black flex items-center justify-between">
            {status === 'success' ? (
              <span className="font-black text-green-600 uppercase flex items-center gap-2">
                <CheckCircle size={20} /> Perfil Atualizado!
              </span>
            ) : (
              <span></span>
            )}
            <button 
              type="submit" 
              disabled={status === 'saving'}
              className="bg-royal text-white border-4 border-brutal-black px-8 py-3 font-black uppercase tracking-widest hover:bg-brutal-black transition-colors shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none disabled:opacity-50"
            >
              {status === 'saving' ? 'Salvando...' : 'Salvar Perfil'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
