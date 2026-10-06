"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { CreditCard, Lock, ShieldCheck, ArrowRight, ArrowLeft, Terminal, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Detalhes do Plano
  const planQuery = searchParams.get('plan') || 'avulso';
  let planName = 'Demanda Avulsa';
  let planTokens = 5;
  let planPrice = 'R$ 750,00';
  
  if (planQuery === 'startup') {
    planName = 'Pack Startup';
    planTokens = 30;
    planPrice = 'R$ 4.200,00';
  } else if (planQuery === 'mensal') {
    planName = 'Equipe Dedicada (Mensal)';
    planTokens = 120;
    planPrice = 'R$ 15.000,00';
  }

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

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Tenta chamar o Backend Real do Stripe
      const amountNumber = parseInt(planPrice.replace(/\D/g, '')) / 100; // Extrai "15000" de "R$ 15.000,00"
      
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: planName,
          tokens: planTokens,
          amount: amountNumber
        })
      });

      const data = await response.json();

      if (data.url) {
        // Redireciona para a página segura de pagamento da Stripe!
        window.location.href = data.url;
        return;
      }
      
      if (data.error === 'STRIPE_KEYS_MISSING') {
        throw new Error('Chaves ausentes. Iniciando modo simulação.');
      }

    } catch (err) {
      console.log('Stripe não configurado. Rodando simulação local do MVP e salvando no Banco de Dados...');
      
      // FALLBACK MVP: Chama a API de simulação segura
      try {
        await fetch('/api/checkout/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: planName,
            tokens: planTokens,
            amount: planPrice
          })
        });
        
        // Simula o tempo de rede do Gateway
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } catch (simErr) {
        alert('Erro ao processar simulação.');
        setLoading(false);
      }
    }
  };

  if (!isAuthorized) return <div className="min-h-screen bg-gray-100 flex items-center justify-center font-black uppercase text-xl text-brutal-black">Autenticando Sessão...</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-brutal-black selection:bg-royal selection:text-white pb-20">
      
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 border-b-4 border-brutal-black">
        <div className="flex items-center gap-4">
          <Link href="/assinaturas" className="p-2 hover:bg-gray-100 transition-colors border-2 border-transparent hover:border-brutal-black">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-3 border-l-4 border-brutal-black pl-4">
            <Lock size={32} className="text-royal" />
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-widest leading-none">Checkout Seguro</h1>
              <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">Ambiente Criptografado 256-bit</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto mt-12 px-4 grid md:grid-cols-2 gap-8 items-start">
        
        {/* Resumo do Pedido */}
        <div className="bg-white border-4 border-brutal-black p-8 shadow-[8px_8px_0px_#0f172a]">
          <h2 className="font-black uppercase text-2xl mb-6 border-b-4 border-brutal-black pb-4 flex items-center gap-3">
            <Terminal size={24} /> Resumo da Fatura
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center bg-gray-50 p-4 border-2 border-brutal-black">
              <div>
                <p className="font-bold text-gray-500 text-xs uppercase tracking-widest mb-1">Produto</p>
                <p className="font-black text-lg uppercase">{planName}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-500 text-xs uppercase tracking-widest mb-1">Custo</p>
                <p className="font-black text-lg">{planPrice}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center bg-yellow-100 p-4 border-2 border-yellow-400">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-brutal-black text-white flex items-center justify-center font-black text-xs">IX</div>
                <p className="font-black uppercase text-sm">Volume Adquirido</p>
              </div>
              <p className="font-black text-2xl text-royal">+{planTokens} TKNS</p>
            </div>
          </div>

          <div className="bg-brutal-black text-white p-6 border-4 border-transparent flex flex-col gap-2">
            <div className="flex items-center gap-2 text-green-400">
              <ShieldCheck size={20} />
              <p className="font-black uppercase text-xs tracking-widest">Escrow Ativo</p>
            </div>
            <p className="font-bold text-sm text-gray-400">
              Seus fundos não são transferidos aos profissionais até a sua aprovação final do Job. O valor fica retido no contrato inteligente.
            </p>
          </div>
        </div>

        {/* Formulário de Pagamento */}
        <div className="bg-white border-4 border-brutal-black p-8 shadow-[8px_8px_0px_#0f172a]">
          <h2 className="font-black uppercase text-2xl mb-6 border-b-4 border-brutal-black pb-4 flex items-center gap-3">
            <CreditCard size={24} /> Pagamento
          </h2>
          
          <form onSubmit={handlePayment} className="space-y-6">
            
            <div className="bg-blue-50 border-2 border-blue-200 p-4 flex gap-3 text-blue-900 mb-6">
              <AlertTriangle size={24} className="flex-shrink-0" />
              <p className="font-bold text-sm">
                Ambiente de Simulação. Nenhum cartão real será cobrado. Digite qualquer número para testar o fluxo.
              </p>
            </div>

            <div>
              <label className="block font-black uppercase tracking-widest text-gray-500 text-xs mb-2">Número do Cartão Corporativo</label>
              <input 
                type="text" 
                required
                maxLength={19}
                placeholder="0000 0000 0000 0000" 
                className="w-full border-4 border-brutal-black p-4 font-black text-lg focus:outline-none focus:border-royal transition-colors font-mono placeholder-gray-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block font-black uppercase tracking-widest text-gray-500 text-xs mb-2">Validade</label>
                <input 
                  type="text" 
                  required
                  placeholder="MM/AA" 
                  className="w-full border-4 border-brutal-black p-4 font-black text-lg focus:outline-none focus:border-royal transition-colors font-mono placeholder-gray-300"
                />
              </div>
              <div>
                <label className="block font-black uppercase tracking-widest text-gray-500 text-xs mb-2">CVC</label>
                <input 
                  type="text" 
                  required
                  placeholder="123" 
                  className="w-full border-4 border-brutal-black p-4 font-black text-lg focus:outline-none focus:border-royal transition-colors font-mono placeholder-gray-300"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-black uppercase tracking-widest text-gray-500 text-xs mb-2">Nome Impresso no Cartão</label>
              <input 
                type="text" 
                required
                placeholder="EMPRESA XYZ LTDA" 
                className="w-full border-4 border-brutal-black p-4 font-black text-lg focus:outline-none focus:border-royal transition-colors uppercase placeholder-gray-300"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-gray-400 border-gray-400' : 'bg-green-500 hover:bg-green-600 border-brutal-black shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none'} text-brutal-black px-8 py-5 font-black uppercase tracking-widest text-center border-4 transition-all flex items-center justify-center gap-3 text-lg mt-8`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> Processando Transação...
                </>
              ) : (
                <>
                  Pagar {planPrice} <ArrowRight size={24} />
                </>
              )}
            </button>
            <div className="text-center flex justify-center items-center gap-2 opacity-50 mt-4">
              <Lock size={14} /> <span className="font-bold text-xs uppercase">Powered by Stripe Connect</span>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 flex items-center justify-center font-black uppercase text-xl">Iniciando Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
