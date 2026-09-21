"use client";
import React, { useState } from 'react';
import { Building2, Paintbrush, ArrowRight, ArrowLeft, UploadCloud, ShieldCheck, CheckSquare, Coins, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OnboardingCadastro() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<'empresa' | 'criativo' | null>(null);
  
  // Dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    document: '' // CNPJ ou PIX
  });

  const handleNext = () => setStep((s) => s + 1);
  const handlePrev = () => setStep((s) => s - 1);

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-brutal-black flex flex-col md:flex-row">
      
      {/* Coluna Esquerda - Contexto & Copy */}
      <div className="bg-brutal-black text-white w-full md:w-1/3 p-8 lg:p-16 flex flex-col justify-between border-r-4 border-brutal-black relative overflow-hidden hidden md:flex">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 font-black text-xl tracking-tighter uppercase mb-16 hover:text-royal transition-colors">
            <div className="w-8 h-8 bg-royal border-2 border-white flex items-center justify-center text-white text-sm">IX</div>
            Iuaix
          </Link>

          <h2 className="text-4xl lg:text-5xl font-black uppercase leading-tight mb-8">
            Cadastro<br/><span className="text-royal">Operacional.</span>
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-royal p-2 border-2 border-white mt-1"><CheckSquare size={20} /></div>
              <div>
                <h4 className="font-black uppercase tracking-widest text-sm mb-1">Onboarding Único</h4>
                <p className="text-gray-400 font-bold text-sm">Preencha uma vez. Nosso sistema memoriza suas preferências para todas as interações futuras.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-green-500 p-2 border-2 border-white mt-1"><ShieldCheck size={20} className="text-brutal-black"/></div>
              <div>
                <h4 className="font-black uppercase tracking-widest text-sm mb-1">Criptografia B2B</h4>
                <p className="text-gray-400 font-bold text-sm">NDAs assinado na fonte. Nenhum arquivo trafega sem blindagem jurídica.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t-4 border-gray-800 pt-8 mt-12">
          <p className="font-bold text-xs text-gray-500 uppercase tracking-widest">Suporte Dedicado: swat@iuaix.com</p>
        </div>
      </div>

      {/* Coluna Direita - Formulário Dinâmico */}
      <div className="flex-1 p-8 md:p-16 relative flex items-center justify-center">
        
        <div className="w-full max-w-xl pb-24"> {/* pb-24 para compensar footer */}
          
          {/* Indicador de Passos Brutalista */}
          {step < 5 && (
            <div className="flex items-center gap-2 mb-12">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`flex-1 h-3 border-2 border-brutal-black ${step >= i ? 'bg-royal' : 'bg-gray-200'} transition-colors`}></div>
              ))}
            </div>
          )}

          {/* === ETAPA 1: TIPO DE CONTA === */}
          {step === 1 && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl sm:text-4xl font-black uppercase mb-2">Defina seu papel</h2>
              <p className="text-gray-500 font-bold mb-8 text-sm sm:text-base">A infraestrutura se adapta ao seu objetivo na rede.</p>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className={`cursor-pointer border-4 p-6 transition-all shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none ${accountType === 'empresa' ? 'border-royal bg-blue-50' : 'border-brutal-black bg-white'}`}>
                  <input type="radio" name="account" className="hidden" onClick={() => setAccountType('empresa')} />
                  <Building2 size={32} className={`mb-4 ${accountType === 'empresa' ? 'text-royal' : 'text-brutal-black'}`} />
                  <h3 className="font-black uppercase text-xl mb-2">Contratante</h3>
                  <p className="font-bold text-gray-500 text-sm">Empresa, Agência ou Startup precisando de execução criativa instantânea.</p>
                </label>

                <label className={`cursor-pointer border-4 p-6 transition-all shadow-[4px_4px_0px_#0f172a] hover:translate-y-1 hover:translate-x-1 hover:shadow-none ${accountType === 'criativo' ? 'border-green-500 bg-green-50' : 'border-brutal-black bg-white'}`}>
                  <input type="radio" name="account" className="hidden" onClick={() => setAccountType('criativo')} />
                  <Paintbrush size={32} className={`mb-4 ${accountType === 'criativo' ? 'text-green-600' : 'text-brutal-black'}`} />
                  <h3 className="font-black uppercase text-xl mb-2">Célula Executora</h3>
                  <p className="font-bold text-gray-500 text-sm">Profissional ou Squad buscando demandas já formatadas e com pagamento blindado.</p>
                </label>
              </div>
            </div>
          )}

          {/* === ETAPA 2: DADOS CADASTRAIS MESTRE === */}
          {step === 2 && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl sm:text-4xl font-black uppercase mb-2">Identidade Operacional</h2>
              <p className="text-gray-500 font-bold mb-8 text-sm sm:text-base border-l-4 border-royal pl-4 bg-gray-50 p-3">
                {accountType === 'empresa' 
                  ? 'Os direitos autorais serão transferidos para este CNPJ.' 
                  : 'Os repasses em Escrow serão liquidados nesta chave PIX.'}
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Nome / Razão Social</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Sua Empresa LTDA" 
                    className="w-full border-4 border-brutal-black p-4 font-bold text-lg focus:bg-blue-50 focus:outline-none transition-colors" 
                  />
                </div>
                
                <div>
                  <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">E-mail Corporativo</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="operacao@empresa.com" 
                    className="w-full border-4 border-brutal-black p-4 font-bold text-lg focus:bg-blue-50 focus:outline-none transition-colors" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">
                      {accountType === 'empresa' ? 'CNPJ' : 'Chave PIX (CPF/CNPJ)'}
                    </label>
                    <input 
                      type="text" 
                      value={formData.document}
                      onChange={(e) => setFormData({...formData, document: e.target.value})}
                      placeholder={accountType === 'empresa' ? "00.000.000/0001-00" : "pix@email.com"} 
                      className="w-full border-4 border-brutal-black p-4 font-bold text-lg focus:bg-blue-50 focus:outline-none transition-colors" 
                    />
                  </div>
                  <div>
                    <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Senha Master</label>
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••" 
                      className="w-full border-4 border-brutal-black p-4 font-bold text-lg focus:bg-blue-50 focus:outline-none transition-colors" 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === ETAPA 3: SETUP ESPECÍFICO === */}
          {step === 3 && accountType === 'empresa' && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl sm:text-4xl font-black uppercase mb-2">Upload de Brand Vault</h2>
              <p className="text-gray-500 font-bold mb-8 text-sm sm:text-base border-l-4 border-royal pl-4 bg-gray-50 p-3">
                Suba os manuais da sua marca. A IA vai extrair as diretrizes e trancar no cofre para abastecer as futuras células.
              </p>

              <div className="border-4 border-dashed border-gray-400 bg-gray-50 hover:bg-white hover:border-brutal-black transition-colors p-12 text-center cursor-pointer mb-6 group">
                <UploadCloud size={48} className="mx-auto mb-4 text-gray-400 group-hover:text-royal transition-colors" />
                <p className="font-black uppercase text-xl mb-2">Arraste seus assets (Opcional)</p>
                <p className="font-bold text-gray-500 text-sm">Logos (AI, SVG), Tipografias, Manuais (PDF)</p>
              </div>
            </div>
          )}

          {step === 3 && accountType === 'criativo' && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <h2 className="text-3xl sm:text-4xl font-black uppercase mb-2">Curadoria de Algoritmo</h2>
              <p className="text-gray-500 font-bold mb-8 text-sm sm:text-base border-l-4 border-yellow-500 pl-4 bg-gray-50 p-3">
                Preencha corretamente. Nosso sistema de IA fará o matchmaking dos jobs exclusivamente baseado nessas tags.
              </p>

              <div className="space-y-6">
                <div>
                  <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Tags de Especialidade (Máx 3)</label>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {['Criação de Logo', 'Edição de Vídeo', 'Arte pra Instagram', 'UI Design', 'Copywriting'].map(tag => (
                      <label key={tag} className="flex items-center gap-2 border-2 border-brutal-black p-3 font-bold uppercase text-xs cursor-pointer hover:bg-yellow-50 has-[:checked]:bg-yellow-300 has-[:checked]:shadow-[2px_2px_0px_#0f172a] transition-all">
                        <input type="checkbox" className="accent-brutal-black w-4 h-4" />
                        {tag}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-black uppercase text-xs tracking-widest mb-2 text-gray-500">Link do Portfólio Central</label>
                  <input type="url" placeholder="https://behance.net/seu-perfil" className="w-full border-4 border-brutal-black p-4 font-bold text-lg focus:bg-blue-50 focus:outline-none transition-colors" />
                </div>
              </div>
            </div>
          )}

          {/* === ETAPA 4: COMPLIANCE E FINALIZAÇÃO === */}
          {step === 4 && (
            <div className="animate-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-10">
                <ShieldCheck size={80} strokeWidth={1} className="mx-auto text-green-500 mb-6" />
                <h2 className="text-4xl font-black uppercase mb-2">Assinatura Mestra</h2>
                <p className="text-gray-500 font-bold text-lg max-w-lg mx-auto">
                  Este é o único contrato que você precisará ler na plataforma. Ele blinda todas as suas futuras operações.
                </p>
              </div>

              <div className="border-4 border-brutal-black bg-gray-50 p-6 h-48 overflow-y-auto mb-8 font-mono text-sm leading-relaxed text-gray-600">
                TERMO DE CONFIDENCIALIDADE (NDA) E CESSÃO DE DIREITOS GUARDA-CHUVA.<br/><br/>
                1. OBJETO. A plataforma IUAIX atua como infraestrutura DaaS e custodiante de ativos.<br/>
                2. TRANSFERÊNCIA AUTOMÁTICA. Ao final da arbitragem de 48h com liberação do pagamento em Escrow, a propriedade intelectual é integralmente transferida e vinculada ao CNPJ do contratante.<br/>
                3. ANTIPIRATARIA. Fica proibida a injeção de imagens sem a devida licença repassada no metadado...
              </div>

              <label className="flex items-start gap-4 p-6 border-4 border-brutal-black cursor-pointer hover:bg-gray-50 transition-colors mb-12 bg-white">
                <input type="checkbox" className="mt-1 accent-royal w-6 h-6 border-brutal-black" />
                <div>
                  <h4 className="font-black uppercase mb-1">Concordo com o NDA Guarda-Chuva</h4>
                  <p className="font-bold text-gray-500 text-sm">Assinatura digital válida e irrevogável.</p>
                </div>
              </label>
            </div>
          )}

          {/* === SUCESSO === */}
          {step === 5 && (
            <div className="text-center animate-in zoom-in-95 duration-500 py-12">
              <div className="w-32 h-32 bg-green-500 border-4 border-brutal-black rounded-full flex items-center justify-center mx-auto mb-8 shadow-brutal-dark">
                <CheckCircle size={64} className="text-brutal-black" strokeWidth={3} />
              </div>
              <h2 className="text-5xl font-black uppercase mb-4 tracking-tight">100% Configurado</h2>
              <p className="text-gray-500 font-bold text-xl mb-12">
                A partir de agora, o sistema nunca mais pedirá essas informações. Fluxo operacional desbloqueado.
              </p>
              
              <Link href="/dashboard" className="inline-block bg-brutal-black text-white px-12 py-6 font-black uppercase text-2xl hover:bg-royal transition-colors border-4 border-brutal-black shadow-[8px_8px_0px_#0f3cc9]">
                Acessar Plataforma
              </Link>
            </div>
          )}

          {/* Footer de Navegação */}
          {step < 5 && (
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 flex justify-between items-center bg-white border-t-4 border-brutal-black">
              {step > 1 ? (
                <button onClick={handlePrev} className="flex items-center gap-2 font-black uppercase tracking-widest text-sm hover:text-royal transition-colors">
                  <ArrowLeft size={16} /> Voltar
                </button>
              ) : <div></div>}
              
              {step < 4 ? (
                <button 
                  onClick={handleNext}
                  disabled={!accountType}
                  className="bg-brutal-black text-white px-8 py-4 font-black uppercase text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-royal transition-colors flex items-center gap-2 shadow-[4px_4px_0px_#0f172a] active:translate-y-1 active:shadow-none"
                >
                  Continuar <ArrowRight size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => {
                    // Salvar funcionalmente no LocalStorage
                    const users = JSON.parse(localStorage.getItem('iuaix_users') || '[]');
                    const newUser = {
                      ...formData,
                      role: accountType,
                      id: Date.now()
                    };
                    users.push(newUser);
                    localStorage.setItem('iuaix_users', JSON.stringify(users));
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    localStorage.setItem('userRole', accountType || 'empresa');
                    
                    // Cookie Syncing (para o Middleware ler no servidor)
                    document.cookie = `iuaix_role=${accountType}; path=/; max-age=86400; SameSite=Strict`;
                    
                    setStep(5);
                  }}
                  className="bg-green-500 text-brutal-black px-8 py-4 font-black uppercase text-lg border-4 border-brutal-black hover:bg-green-600 transition-colors flex items-center gap-2 shadow-[4px_4px_0px_#0f172a] active:translate-y-1 active:shadow-none"
                >
                  Finalizar Cadastro <CheckSquare size={20} />
                </button>
              )}
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
