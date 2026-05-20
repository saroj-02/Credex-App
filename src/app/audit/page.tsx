'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AuditFlow() {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Form State
  const [provider, setProvider] = useState<string | null>(null);
  const [monthlySpend, setMonthlySpend] = useState('');
  const [llmUsage, setLlmUsage] = useState('');

  const handleConnect = (selectedProvider: string) => {
    setProvider(selectedProvider);
    setStep(2);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(3);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans selection:bg-blue-500/30">
      <header className="border-b border-[#27272a] p-6 glass sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">C</div>
            <span className="text-xl font-semibold tracking-tight">Credex</span>
          </Link>
          <div className="text-sm text-gray-400 font-medium tracking-wide">
            AUDIT STEP {step} OF 3
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-xl z-10">
          {/* Step 1: Connect Provider */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold mb-2">Connect your Cloud Provider</h1>
              <p className="text-gray-400 mb-8">Select your primary infrastructure provider to grant read-only access for the audit.</p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'AWS', color: 'from-orange-500/20 to-orange-600/20', border: 'hover:border-orange-500/50' },
                  { name: 'GCP', color: 'from-blue-500/20 to-green-500/20', border: 'hover:border-blue-500/50' },
                  { name: 'Anthropic', color: 'from-amber-700/20 to-amber-900/20', border: 'hover:border-amber-700/50' },
                  { name: 'OpenAI', color: 'from-emerald-600/20 to-emerald-800/20', border: 'hover:border-emerald-500/50' }
                ].map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handleConnect(p.name)}
                    className={`p-6 rounded-xl border border-[#27272a] bg-gradient-to-br ${p.color} ${p.border} transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:scale-105`}
                  >
                    <span className="text-xl font-semibold">{p.name}</span>
                    <span className="text-xs text-gray-400 px-2 py-1 bg-black/40 rounded-full border border-white/5">Connect securely &rarr;</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Usage Input */}
          {step === 2 && !isAnalyzing && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass p-8 rounded-2xl border border-[#27272a]">
              <h1 className="text-3xl font-bold mb-2">Configure {provider} Audit</h1>
              <p className="text-gray-400 mb-8">Since this is a demo, please provide rough estimates of your monthly usage.</p>
              
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Monthly Spend ($)</label>
                  <input 
                    type="number" 
                    required
                    value={monthlySpend}
                    onChange={(e) => setMonthlySpend(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="e.g. 5000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Estimated LLM Tokens per month (Millions)</label>
                  <input 
                    type="number" 
                    required
                    value={llmUsage}
                    onChange={(e) => setLlmUsage(e.target.value)}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="e.g. 150"
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-lg transition-colors shadow-lg shadow-blue-500/25"
                >
                  Run Deep Analysis
                </button>
              </form>
            </div>
          )}

          {/* Analyzing State */}
          {isAnalyzing && (
            <div className="text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 border-4 border-[#27272a] border-t-blue-500 rounded-full animate-spin mx-auto mb-8" />
              <h2 className="text-2xl font-semibold mb-2">Analyzing {provider} Infrastructure</h2>
              <p className="text-gray-400">Scanning for unoptimized instances and matching startup credit programs...</p>
            </div>
          )}

          {/* Step 3: Results Dashboard */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="glass p-8 rounded-2xl border border-blue-500/30 shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)]">
                <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold tracking-wider mb-6 border border-blue-500/20">
                  AUDIT COMPLETE
                </div>
                <h1 className="text-4xl font-extrabold mb-8">We found <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">${(Number(monthlySpend) * 0.35).toLocaleString()}</span> in potential monthly savings.</h1>
                
                <div className="space-y-4 mb-8">
                  <div className="bg-[#09090b] border border-[#27272a] p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-medium">Unoptimized Compute (AWS)</p>
                      <p className="text-sm text-gray-500">Migration to Graviton3 possible</p>
                    </div>
                    <span className="text-emerald-400 font-bold">+${(Number(monthlySpend) * 0.15).toLocaleString()}/mo</span>
                  </div>
                  <div className="bg-[#09090b] border border-[#27272a] p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="font-medium">LLM Token Routing</p>
                      <p className="text-sm text-gray-500">Based on {llmUsage}M tokens/mo via Anthropic</p>
                    </div>
                    <span className="text-emerald-400 font-bold">+${(Number(monthlySpend) * 0.20).toLocaleString()}/mo</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-900/40 to-violet-900/40 border border-blue-500/30 p-6 rounded-xl mb-8">
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <span className="text-blue-400">★</span> You qualify for $50k in Startup Credits
                  </h3>
                  <p className="text-sm text-gray-300">
                    Based on your usage, we can secure active startup grants from AWS Activate and Anthropic's startup program. 
                    <a href="https://aws.amazon.com/activate/" target="_blank" className="text-blue-400 hover:underline ml-1">(Source)</a>
                  </p>
                </div>

                <Link 
                  href="/book" 
                  className="block text-center w-full py-4 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg text-lg transition-colors"
                >
                  Book Consultation to Activate Savings
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
