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
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setStep(2);
    } catch (err) {
      setError('Acesso à câmera negado. É necessário reconhecimento facial.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Preencha email e senha');
      return;
    }
    setError('');
    // startCamera();
    // --- BIOMETRIA EM STANDBY ---
    handleLogin();
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    /* --- BIOMETRIA EM STANDBY ---
    let photoBase64 = '';
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        photoBase64 = canvasRef.current.toDataURL('image/jpeg', 0.8);
      }
    }

    if (!photoBase64) {
      setError('Falha ao capturar a imagem.');
      setLoading(false);
      return;
    }

    stopCamera();
    */

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao fazer login');
      }

      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('userRole', data.user.role);

      const redirectUrl = searchParams.get('redirect') || '/dashboard';
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message);
      setStep(1); // volta pro formulário se der erro
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brutal-black font-sans text-white flex items-center justify-center p-6 selection:bg-yellow-300 selection:text-brutal-black">
      <div className="w-full max-w-md bg-white text-brutal-black border-4 border-white shadow-[16px_16px_0px_#0f3cc9] p-8 md:p-12 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="mb-10 text-center">
          <Link href="/dashboard" className="inline-flex items-center justify-center w-16 h-16 bg-royal border-4 border-brutal-black text-white font-black text-2xl shadow-brutal-sm hover:translate-y-1 hover:shadow-none transition-all mb-6">
            IX
          </Link>
          <h1 className="text-3xl font-black uppercase tracking-tight">Acesso de Segurança</h1>
          {/* --- BIOMETRIA EM STANDBY --- */}
          {/* <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mt-2">Validação Biométrica IA</p> */}
        </div>

        {error && (
          <div className="bg-red-100 border-4 border-red-600 p-4 mb-6 text-red-800 font-bold text-sm flex items-start gap-3">
            <AlertTriangle size={20} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-6">
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
              disabled={loading}
              className="w-full bg-royal text-white border-4 border-brutal-black py-4 font-black uppercase text-xl shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex justify-center items-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'} <ArrowRight size={20} />
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-6 flex flex-col items-center">
            <p className="font-bold text-sm text-center text-gray-600">Por favor, posicione seu rosto na câmera para validação via Inteligência Artificial.</p>
            <div className="w-full bg-black border-4 border-brutal-black relative overflow-hidden flex items-center justify-center min-h-[240px]">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-auto"
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            
            <button 
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-green-500 text-brutal-black border-4 border-brutal-black py-4 font-black uppercase text-lg shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none transition-all flex justify-center items-center gap-3 disabled:opacity-50"
            >
              {loading ? 'Analisando Rosto...' : 'Capturar e Entrar'}
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="mt-8 pt-8 border-t-4 border-gray-100 text-center">
            <p className="font-bold text-gray-500 text-sm mb-4">Ainda não possui uma conta?</p>
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
        )}

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
