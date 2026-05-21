'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { runSpendAudit, AuditReport, ToolInput } from '@/lib/calculator';

function SharedAuditDashboard() {
  const searchParams = useSearchParams();
  const [report, setReport] = useState<AuditReport | null>(null);
  const [teamSize, setTeamSize] = useState(1);
  const [useCase, setUseCase] = useState('coding');
  const [decodeError, setDecodeError] = useState(false);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (!dataParam) {
      setDecodeError(true);
      return;
    }

    try {
      // Decode Base64 string safely
      const decodedJson = atob(dataParam);
      const parsed = JSON.parse(decodedJson);
      
      const { tools, teamSize: parsedTeamSize, primaryUseCase } = parsed;
      
      if (tools && Array.isArray(tools)) {
        const formattedTools: ToolInput[] = tools.map((t: any) => ({
          name: t.name,
          plan: t.plan,
          monthlySpend: t.monthlySpend,
          seats: t.seats
        }));
        
        const compiledReport = runSpendAudit(
          formattedTools, 
          Number(parsedTeamSize) || 1, 
          primaryUseCase || 'coding'
        );
        
        setReport(compiledReport);
        setTeamSize(Number(parsedTeamSize) || 1);
        setUseCase(primaryUseCase || 'coding');
      } else {
        setDecodeError(true);
      }
    } catch (e) {
      console.error('Failed to parse share link data payload', e);
      setDecodeError(true);
    }
  }, [searchParams]);

  if (decodeError) {
    return (
      <div className="glass p-10 rounded-2xl border border-[#27272a] text-center max-w-md mx-auto">
        <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">!</div>
        <h2 className="text-xl font-bold text-white mb-2">Invalid Share Link</h2>
        <p className="text-xs text-gray-400 leading-relaxed mb-6">
          The share link is corrupt, expired, or missing its payload data. Click below to run a fresh infrastructure spend audit.
        </p>
        <Link
          href="/audit"
          className="inline-block w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors"
        >
          Run Spend Audit
        </Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="glass p-12 rounded-2xl border border-[#27272a] text-center max-w-md mx-auto">
        <div className="w-12 h-12 border-4 border-[#27272a] border-t-blue-500 rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-lg font-bold text-white mb-1">Retrieving Audit Report</h2>
        <p className="text-xs text-gray-500">Decoding report configurations securely...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Hero Header */}
      <div className="glass p-8 rounded-2xl border border-blue-500/30 shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)] relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-blue-500/20 border-b border-l border-blue-500/30 px-3.5 py-1.5 rounded-bl-xl text-[10px] font-bold text-blue-400 tracking-wider">
          PUBLIC ARCHIVE
        </div>

        <span className="text-xs font-bold text-blue-500 tracking-wider block mb-2 uppercase">ANONYMIZED REPORT CARD</span>
        
        {report.totalSavings > 0 ? (
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Total Annual Savings Available: <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">${report.annualSavings.toLocaleString()}/yr</span>
          </h1>
        ) : (
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-emerald-400 mb-4">
            AI Tool Stack Fully Optimized!
          </h1>
        )}

        <p className="text-xs md:text-sm text-gray-400 leading-relaxed max-w-xl">
          An audit of this stack containing <strong className="text-white">{report.results.length} active AI tools</strong> for a team size of <strong className="text-white">{teamSize}</strong> reveals a current spend of <strong className="text-white">${report.totalCurrentSpend.toLocaleString()}/mo</strong>, which can be optimized down to <strong className="text-white">${report.totalRecommendedSpend.toLocaleString()}/mo</strong>.
        </p>
      </div>

      {/* Per Tool Breakdown Table */}
      <div className="glass p-6 md:p-8 rounded-2xl border border-[#27272a] space-y-4">
        <h3 className="font-bold text-base text-gray-200">Calculated Recommendations</h3>
        
        <div className="space-y-3">
          {report.results.map((res) => {
            const hasSavings = res.savings > 0;
            return (
              <div key={res.toolName} className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="sm:w-1/3">
                  <div className="font-semibold text-white flex items-center gap-2 text-xs md:text-sm">
                    {res.toolName}
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full border ${
                      hasSavings 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {res.action}
                    </span>
                  </div>
                  <span className="text-[9px] text-gray-500 block mt-0.5">TARGET PLAN: {res.recommendedPlan === 'None' ? 'Unused' : res.recommendedPlan}</span>
                </div>

                <div className="sm:w-1/2">
                  <p className="text-xs text-gray-400 leading-relaxed">{res.reason}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] text-gray-500 block">MONTHLY SAVING</span>
                  <span className={`font-semibold text-xs md:text-sm ${hasSavings ? 'text-emerald-400' : 'text-gray-500'}`}>
                    {hasSavings ? `+$${res.savings}/mo` : '$0/mo'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Credit Summary Callout */}
      {report.isEligibleForCredits && (
        <div className="bg-gradient-to-r from-blue-900/40 to-violet-900/40 border border-blue-500/30 p-6 rounded-xl">
          <h3 className="font-semibold text-sm text-blue-400 mb-1 flex items-center gap-2">
            <span>✨</span> Active Credit Eligibility Summary
          </h3>
          <p className="text-xs text-gray-300 leading-relaxed">
            This company qualifies for high-tier startup credits. AWS, Google Cloud, and Anthropic offer up to $250k in combined non-dilutive token and compute grants.
          </p>
        </div>
      )}

      {/* VIRAL LOOP CTA */}
      <div className="glass p-8 rounded-2xl border border-dashed border-[#27272a] text-center">
        <h3 className="text-xl font-bold text-white mb-2">How much is your team overpaying?</h3>
        <p className="text-xs text-gray-400 max-w-md mx-auto mb-6 leading-relaxed">
          Most startups save between 30% to 50% on Cursor, Copilot, ChatGPT, Claude, and cloud API keys. Run a free instant audit of your stack in less than 2 minutes.
        </p>
        <Link
          href="/audit"
          className="inline-block px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-sm transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20"
        >
          Run My Free AI Spend Audit &rarr;
        </Link>
      </div>
    </div>
  );
}

export default function SharedAuditPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans selection:bg-blue-500/30">
      <header className="border-b border-[#27272a] p-6 glass sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">C</div>
            <span className="text-xl font-semibold tracking-tight">Credex</span>
          </Link>
          <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">AI Spend Report</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-2xl z-10">
          <Suspense fallback={
            <div className="glass p-12 rounded-2xl border border-[#27272a] text-center max-w-md mx-auto">
              <div className="w-12 h-12 border-4 border-[#27272a] border-t-blue-500 rounded-full animate-spin mx-auto mb-6" />
              <h2 className="text-lg font-bold text-white mb-1">Loading Shared Audit</h2>
              <p className="text-xs text-gray-500">Initializing render container...</p>
            </div>
          }>
            <SharedAuditDashboard />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
