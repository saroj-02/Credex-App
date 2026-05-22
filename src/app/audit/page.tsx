'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { runSpendAudit, PRICING_DB, ToolInput, AuditReport } from '@/lib/calculator';

export default function AuditFlow() {
  const [step, setStep] = useState(1);
  const [teamSize, setTeamSize] = useState('1');
  const [primaryUseCase, setPrimaryUseCase] = useState('coding');
  
  // Active stack of tools
  const [selectedTools, setSelectedTools] = useState<Record<string, { plan: string; seats: number; monthlySpend: number }>>({});
  
  // API analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [aiSummary, setAiSummary] = useState('');
  
  // Lead state
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [role, setRole] = useState('Founder');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // 1. Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('credex_profile');
      if (savedProfile) {
        const { size, useCase } = JSON.parse(savedProfile);
        setTimeout(() => {
          setTeamSize(size || '1');
          setPrimaryUseCase(useCase || 'coding');
        }, 0);
      }

      const savedStack = localStorage.getItem('credex_stack');
      if (savedStack) {
        setTimeout(() => {
          setSelectedTools(JSON.parse(savedStack));
        }, 0);
      }
    } catch (e) {
      console.error('Failed to load cache from localStorage', e);
    }
  }, []);

  // 2. Persist state to localStorage on state changes
  const saveStateToCache = (updatedStack = selectedTools) => {
    try {
      localStorage.setItem('credex_profile', JSON.stringify({ size: teamSize, useCase: primaryUseCase }));
      localStorage.setItem('credex_stack', JSON.stringify(updatedStack));
    } catch (e) {
      console.error('Failed to write cache to localStorage', e);
    }
  };

  const toggleTool = (toolName: string) => {
    const updated = { ...selectedTools };
    if (updated[toolName]) {
      delete updated[toolName];
    } else {
      // Pick first plan as default
      const plans = Object.keys(PRICING_DB[toolName] || {});
      const defaultPlan = plans[0] || 'Usage-based';
      const defaultPrice = PRICING_DB[toolName]?.[defaultPlan] ?? 0;
      const numSeats = Number(teamSize) || 1;

      updated[toolName] = {
        plan: defaultPlan,
        seats: numSeats,
        monthlySpend: defaultPrice > 0 ? defaultPrice * numSeats : 50 // default API estimate
      };
    }
    setSelectedTools(updated);
    saveStateToCache(updated);
  };

  const handleToolPlanChange = (toolName: string, plan: string) => {
    const updated = { ...selectedTools };
    if (updated[toolName]) {
      const defaultPrice = PRICING_DB[toolName]?.[plan] ?? 0;
      const numSeats = updated[toolName].seats;
      updated[toolName] = {
        ...updated[toolName],
        plan,
        monthlySpend: defaultPrice > 0 ? defaultPrice * numSeats : updated[toolName].monthlySpend
      };
      setSelectedTools(updated);
      saveStateToCache(updated);
    }
  };

  const handleToolSeatsChange = (toolName: string, seats: number) => {
    const updated = { ...selectedTools };
    if (updated[toolName]) {
      const plan = updated[toolName].plan;
      const defaultPrice = PRICING_DB[toolName]?.[plan] ?? 0;
      updated[toolName] = {
        ...updated[toolName],
        seats,
        monthlySpend: defaultPrice > 0 ? defaultPrice * seats : updated[toolName].monthlySpend
      };
      setSelectedTools(updated);
      saveStateToCache(updated);
    }
  };

  const handleToolSpendChange = (toolName: string, monthlySpend: number) => {
    const updated = { ...selectedTools };
    if (updated[toolName]) {
      updated[toolName] = {
        ...updated[toolName],
        monthlySpend
      };
      setSelectedTools(updated);
      saveStateToCache(updated);
    }
  };

  const executeAudit = async () => {
    saveStateToCache();
    setIsAnalyzing(true);
    setStep(3);

    // Format stack into Audit Engine inputs
    const formattedTools: ToolInput[] = Object.entries(selectedTools).map(([name, config]) => ({
      name,
      plan: config.plan,
      monthlySpend: config.monthlySpend,
      seats: config.seats
    }));

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: formattedTools,
          teamSize: Number(teamSize),
          primaryUseCase,
          email: '',
          companyName: '',
          role: ''
        })
      });

      const data = await response.json();
      if (data.success) {
        setReport(data.report);
        setAiSummary(data.summary);
      } else {
        // Safe local fallback computation
        const fallbackReport = runSpendAudit(formattedTools, Number(teamSize), primaryUseCase);
        setReport(fallbackReport);
        setAiSummary('Audit calculated locally. Fill in your details below to save the report.');
      }
    } catch (e) {
      console.error('Audit API failed, running in local fallback', e);
      const fallbackReport = runSpendAudit(formattedTools, Number(teamSize), primaryUseCase);
      setReport(fallbackReport);
      setAiSummary('Audit compiled locally in offline fallback mode.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!report) return;

    const formattedTools = Object.entries(selectedTools).map(([name, config]) => ({
      name,
      plan: config.plan,
      monthlySpend: config.monthlySpend,
      seats: config.seats
    }));

    try {
      await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tools: formattedTools,
          teamSize: Number(teamSize),
          primaryUseCase,
          email,
          companyName,
          role
        })
      });
    } catch (err) {
      console.error('Lead storage dispatch failed', err);
    } finally {
      setLeadSubmitted(true);
    }
  };

  // Generate public anonymized shareable link encoded in Base64
  const copyShareLink = () => {
    if (!report) return;

    try {
      const payload = {
        tools: Object.entries(selectedTools).map(([name, config]) => ({
          name,
          plan: config.plan,
          monthlySpend: config.monthlySpend,
          seats: config.seats
        })),
        teamSize: Number(teamSize),
        primaryUseCase,
        savings: report.totalSavings,
        annualSavings: report.annualSavings
      };

      const b64 = btoa(JSON.stringify(payload));
      const url = `${window.location.origin}/audit/share?data=${b64}`;
      navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2500);
    } catch (err) {
      console.error('Failed to construct shareable link', err);
    }
  };

  const availableToolsList = Object.keys(PRICING_DB);

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans selection:bg-blue-500/30">
      <header className="border-b border-[#27272a] p-6 glass sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">C</div>
            <span className="text-xl font-semibold tracking-tight">Credex</span>
          </Link>
          <div className="text-xs text-gray-400 font-semibold tracking-widest uppercase">
            AUDIT STAGE {step} OF 3
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="w-full max-w-3xl z-10">
          
          {/* STEP 1: Company Profile Info */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass p-8 md:p-10 rounded-2xl border border-[#27272a]">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Let&apos;s audit your AI Spend</h1>
              <p className="text-gray-400 mb-8">First, give us brief details about your company stage and primary usage.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Team Size (Seats)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={teamSize}
                    onChange={(e) => {
                      setTeamSize(e.target.value);
                      saveStateToCache();
                    }}
                    className="w-full bg-[#0c0c0e] border border-[#27272a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-medium"
                    placeholder="e.g. 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Primary Use Case</label>
                  <select
                    value={primaryUseCase}
                    onChange={(e) => {
                      setPrimaryUseCase(e.target.value);
                      saveStateToCache();
                    }}
                    className="w-full bg-[#0c0c0e] border border-[#27272a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-medium"
                  >
                    <option value="coding">Coding & Software Development (IDE, API models)</option>
                    <option value="writing">Content Writing & Marketing</option>
                    <option value="data">Data Analysis & Modeling</option>
                    <option value="research">Academic & Business Research</option>
                    <option value="mixed">Mixed Stack / Enterprise-wide Use Cases</option>
                  </select>
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg transition-colors mt-8 shadow-lg shadow-blue-500/20"
                >
                  Configure AI Stack &rarr;
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Configure Active AI Tool Subscriptions */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 glass p-8 md:p-10 rounded-2xl border border-[#27272a]">
              <h1 className="text-3xl font-bold tracking-tight mb-2">Select your AI Stack</h1>
              <p className="text-gray-400 mb-8">Toggle the tools your team currently pays for to configure their plans.</p>

              {/* Grid of Tool Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                {availableToolsList.map((toolName) => {
                  const isActive = !!selectedTools[toolName];
                  return (
                    <button
                      key={toolName}
                      onClick={() => toggleTool(toolName)}
                      className={`p-4 rounded-xl border text-center transition-all duration-200 cursor-pointer flex flex-col items-center justify-center gap-2 ${
                        isActive 
                          ? 'bg-blue-600/10 border-blue-500/50 text-blue-400 shadow-[0_0_15px_-4px_rgba(59,130,246,0.25)] font-semibold' 
                          : 'bg-[#0c0c0e] border-[#27272a] text-gray-400 hover:border-gray-700 hover:text-white'
                      }`}
                    >
                      <span className="text-sm tracking-tight">{toolName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${isActive ? 'bg-blue-500 text-white' : 'bg-[#18181b] border border-white/5'}`}>
                        {isActive ? 'Active' : 'Add'}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Inline Tool Plan/Seat Options */}
              {Object.keys(selectedTools).length > 0 ? (
                <div className="space-y-6 border-t border-[#27272a] pt-6 mb-8 max-h-[350px] overflow-y-auto pr-2">
                  <h3 className="font-semibold text-gray-200 text-sm mb-4">Configure Plan Details</h3>
                  
                  {Object.entries(selectedTools).map(([toolName, config]) => {
                    const plans = Object.keys(PRICING_DB[toolName] || {});
                    const hasSeats = PRICING_DB[toolName]?.[config.plan] !== -1; // API tools don't have catalog seats
                    
                    return (
                      <div key={toolName} className="p-4 bg-[#0c0c0e]/50 border border-[#27272a] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="font-bold text-gray-200 md:w-1/4">{toolName}</div>
                        
                        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-3">
                          {/* Plan Dropdown */}
                          <div>
                            <span className="block text-[10px] text-gray-500 mb-1 font-medium">PLAN</span>
                            <select
                              value={config.plan}
                              onChange={(e) => handleToolPlanChange(toolName, e.target.value)}
                              className="w-full bg-[#09090b] border border-[#27272a] rounded px-2.5 py-1.5 text-xs text-white"
                            >
                              {plans.map(p => (
                                <option key={p} value={p}>{p}</option>
                              ))}
                            </select>
                          </div>

                          {/* Seats count if applicable */}
                          {hasSeats ? (
                            <div>
                              <span className="block text-[10px] text-gray-500 mb-1 font-medium">SEATS</span>
                              <input
                                type="number"
                                min="1"
                                value={config.seats}
                                onChange={(e) => handleToolSeatsChange(toolName, Math.max(1, Number(e.target.value)))}
                                className="w-full bg-[#09090b] border border-[#27272a] rounded px-2.5 py-1.5 text-xs text-white"
                              />
                            </div>
                          ) : (
                            <div className="opacity-40">
                              <span className="block text-[10px] text-gray-500 mb-1 font-medium">SEATS</span>
                              <input disabled value="N/A" className="w-full bg-[#09090b] border border-[#27272a]/20 rounded px-2.5 py-1.5 text-xs text-gray-600" />
                            </div>
                          )}

                          {/* Monthly Spend */}
                          <div>
                            <span className="block text-[10px] text-gray-500 mb-1 font-medium">SPEND ($/MO)</span>
                            <input
                              type="number"
                              min="0"
                              value={config.monthlySpend}
                              onChange={(e) => handleToolSpendChange(toolName, Math.max(0, Number(e.target.value)))}
                              className="w-full bg-[#09090b] border border-[#27272a] rounded px-2.5 py-1.5 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 border border-dashed border-[#27272a] rounded-xl text-center text-gray-500 text-sm mb-8">
                  Your active stack is empty. Toggle any tool card above to configure it.
                </div>
              )}

              {/* Navigation */}
              <div className="flex gap-4 border-t border-[#27272a] pt-6">
                <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 border border-[#27272a] hover:bg-[#18181b] rounded-lg text-sm text-gray-300 font-medium transition-colors"
                >
                  &larr; Profile
                </button>
                <button
                  onClick={executeAudit}
                  disabled={Object.keys(selectedTools).length === 0}
                  className={`flex-grow py-3 text-white font-semibold rounded-lg text-base transition-colors ${
                    Object.keys(selectedTools).length === 0 
                      ? 'bg-blue-800/40 border border-[#27272a] text-gray-500 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20'
                  }`}
                >
                  Analyze My AI Spend
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Results Dashboard */}
          {step === 3 && (
            <div className="space-y-6">
              {isAnalyzing ? (
                <div className="glass p-12 rounded-2xl border border-[#27272a] text-center animate-in fade-in duration-500">
                  <div className="w-16 h-16 border-4 border-[#27272a] border-t-blue-500 rounded-full animate-spin mx-auto mb-8" />
                  <h2 className="text-2xl font-bold mb-2">Analyzing AI Subscription Stack</h2>
                  <p className="text-gray-400">Evaluating plan sizes, overlapping packages, and credit alignments...</p>
                </div>
              ) : report && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                  
                  {/* Hero Savings Summary card */}
                  <div className="glass p-8 rounded-2xl border border-blue-500/30 shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)] relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-blue-500/20 border-b border-l border-blue-500/30 px-3.5 py-1.5 rounded-bl-xl text-[10px] font-bold text-blue-400 tracking-wider">
                      AUDIT COMPILED
                    </div>

                    <span className="text-xs font-bold text-blue-500 tracking-wider block mb-2 uppercase">TOTAL SAVINGS AVAILABLE</span>
                    
                    {report.totalSavings > 0 ? (
                      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        Save <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">${report.totalSavings.toLocaleString()}/mo</span>
                      </h1>
                    ) : (
                      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-emerald-400 mb-4">
                        Stack fully optimal!
                      </h1>
                    )}

                    <p className="text-sm text-gray-300 leading-relaxed max-w-xl">
                      Based on your inputs, we calculated your current AI stack spend of <strong className="text-white">${report.totalCurrentSpend.toLocaleString()}/mo</strong> 
                      &nbsp;can be reduced to <strong className="text-white">${report.totalRecommendedSpend.toLocaleString()}/mo</strong>, saving your business &nbsp;
                      <strong className="text-emerald-400">${report.annualSavings.toLocaleString()}</strong> every single year.
                    </p>
                  </div>

                  {/* AI Generated personalized summary */}
                  <div className="bg-[#0c0c0e] border border-[#27272a] p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/5 blur-[50px] rounded-full pointer-events-none" />
                    
                    <h3 className="font-semibold text-sm text-purple-400 mb-2 flex items-center gap-2">
                      <span className="animate-pulse">✨</span> AI-Generated Spend Strategy
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans relative z-10 italic">
                      &ldquo;{aiSummary}&rdquo;
                    </p>
                  </div>

                  {/* Per Tool Breakdown Details */}
                  <div className="glass p-6 md:p-8 rounded-2xl border border-[#27272a] space-y-4">
                    <h3 className="font-bold text-lg text-gray-200">Per-Tool Breakdown</h3>
                    
                    <div className="space-y-3">
                      {report.results.map((res) => {
                        const hasSavings = res.savings > 0;
                        return (
                          <div key={res.toolName} className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="sm:w-1/3">
                              <div className="font-bold text-white flex items-center gap-2 text-sm md:text-base">
                                {res.toolName}
                                <span className={`text-[9px] px-2 py-0.5 rounded-full border ${
                                  hasSavings 
                                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                }`}>
                                  {res.action}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500 block mt-0.5">CURRENT PLAN: {res.recommendedPlan === 'None' ? 'Unused' : res.recommendedPlan}</span>
                            </div>

                            <div className="sm:w-1/2 text-left">
                              <p className="text-xs text-gray-400 leading-relaxed">{res.reason}</p>
                            </div>

                            <div className="text-right flex-shrink-0 flex flex-col justify-center">
                              <span className="text-xs text-gray-500">SAVINGS</span>
                              <span className={`font-bold ${hasSavings ? 'text-emerald-400' : 'text-gray-500'}`}>
                                {hasSavings ? `+$${res.savings}/mo` : '$0/mo'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Non-dilutive Credits Callout */}
                  {report.isEligibleForCredits && (
                    <div className="bg-gradient-to-r from-blue-900/40 to-violet-900/40 border border-blue-500/30 p-6 rounded-xl">
                      <h3 className="font-semibold text-base text-blue-400 mb-1 flex items-center gap-2">
                        <span>🚀</span> High credit eligibility detected
                      </h3>
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {report.creditDetails} By coordinating with the Credex consultant team, we can expedite approval vectors for your startup.
                      </p>
                    </div>
                  )}

                  {/* Lead Capture Gate Form */}
                  <div className="glass p-6 md:p-8 rounded-2xl border border-[#27272a]">
                    {leadSubmitted ? (
                      <div className="text-center p-6 animate-in fade-in duration-300">
                        <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">✓</div>
                        <h4 className="font-bold text-lg text-white mb-2">Audit Report Secured!</h4>
                        <p className="text-xs text-gray-400 leading-relaxed max-w-md mx-auto">
                          We&apos;ve compiled your data and simulated storing this lead to the CRM database backend. Check your simulated terminal logs for transactional email confirmation details!
                        </p>
                      </div>
                    ) : (
                      <div>
                        <h3 className="font-bold text-lg text-gray-200 mb-2">Capture your Detailed Report</h3>
                        <p className="text-xs text-gray-400 mb-6">
                          {report.totalSavings >= 500 
                            ? 'Book a consultation to unlock up to $100k cloud credits and activate these savings.'
                            : 'Sign up to lock in optimizations and stay ahead of AI pricing tier modifications.'}
                        </p>

                        <form onSubmit={handleLeadSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-gray-500 font-semibold mb-1 uppercase">Work Email</label>
                              <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-xs text-white"
                                placeholder="founder@startup.com"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-[10px] text-gray-500 font-semibold mb-1 uppercase">Company Name</label>
                              <input
                                type="text"
                                required
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-xs text-white"
                                placeholder="VectorML"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] text-gray-500 font-semibold mb-1 uppercase">Your Role</label>
                              <input
                                type="text"
                                required
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-[#09090b] border border-[#27272a] rounded px-3 py-2 text-xs text-white"
                                placeholder="Founder / CTO"
                              />
                            </div>

                            <div className="flex items-end">
                              <button
                                type="submit"
                                className="w-full py-2 bg-white hover:bg-gray-200 text-black font-semibold rounded text-xs transition-colors h-[38px] cursor-pointer"
                              >
                                {report.totalSavings >= 500 ? 'Book consultations' : 'Secure my audit'}
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}
                  </div>

                  {/* Actions / Sharing Footer */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 border border-[#27272a] hover:bg-[#18181b] rounded-lg text-sm text-gray-300 font-medium transition-colors"
                    >
                      &larr; Modify Stack
                    </button>
                    
                    <button
                      onClick={copyShareLink}
                      className="flex-grow py-3 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-white font-medium rounded-lg text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {shareCopied ? '✓ Link Copied!' : '🔗 Share Anonymized Report Link'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
