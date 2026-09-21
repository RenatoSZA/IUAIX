"use client";
import React, { useState } from 'react';
import { ArrowRight, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Preencha todos os campos.');
      return;
    }

    // Pega os usuários do LocalStorage
    const users = JSON.parse(localStorage.getItem('iuaix_users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      // Sucesso
      localStorage.setItem('currentUser', JSON.stringify(user));
      localStorage.setItem('userRole', user.role); // Para compatibilidade com as outras telas
      
      // Cookie Syncing
      document.cookie = `iuaix_role=${user.role}; path=/; max-age=86400; SameSite=Strict`;
      
      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
    } else {
      // Falha
      setError('Credenciais inválidas. Tente novamente ou cadastre-se.');
    }
  };

  return (
    <div className="min-h-screen bg-brutal-black font-sans text-white flex items-center justify-center p-6 selection:bg-yellow-300 selection:text-brutal-black">
      <div className="w-full max-w-md bg-white text-brutal-black border-4 border-white shadow-[16px_16px_0px_#0f3cc9] p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center justify-center w-16 h-16 bg-royal border-4 border-brutal-black text-white font-black text-2xl shadow-brutal-sm hover:translate-y-1 hover:shadow-none transition-all mb-6">
            IX
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight">Acesso Remoto</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">DaaS Enterprise Hub</p>
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-red-600 p-4 mb-6 text-red-800 font-bold text-sm flex items-start gap-3">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block font-black uppercase tracking-widest text-gray-500 text-xs mb-2">E-mail de Acesso</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-4 border-brutal-black p-4 font-bold text-lg focus:outline-none focus:bg-yellow-50 transition-colors"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block font-black uppercase tracking-widest text-gray-500 text-xs mb-2">Senha Criptográfica</label>
            <div className="relative">
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-4 border-brutal-black p-4 font-bold text-lg focus:outline-none focus:bg-yellow-50 transition-colors"
                placeholder="••••••••"
              />
              <Lock size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-royal text-white border-4 border-brutal-black py-4 font-black uppercase text-xl shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex justify-center items-center gap-3"
          >
            Autenticar <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t-4 border-gray-100 text-center">
          <p className="font-bold text-gray-500 text-sm mb-4">Ainda não possui infraestrutura criativa?</p>
          <button 
            onClick={() => {
              const redirectUrl = searchParams.get('redirect');
              router.push(redirectUrl ? `/cadastro?redirect=${encodeURIComponent(redirectUrl)}` : '/cadastro');
            }} 
            className="bg-white text-brutal-black border-4 border-brutal-black py-3 px-6 font-black uppercase text-sm hover:bg-yellow-300 transition-colors inline-block shadow-brutal-sm"
          >
            Iniciar Cadastro
          </button>
        </div>

      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brutal-black text-white flex items-center justify-center font-black uppercase">Carregando Módulo de Segurança...</div>}>
      <LoginContent />
    </Suspense>
  );
}
