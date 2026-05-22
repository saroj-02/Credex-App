'use client';

import { useState } from 'react';
import Link from 'next/link';
import HowItWorksModal from '@/components/HowItWorksModal';

export default function Home() {
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#fafafa] font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-[#27272a]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              C
            </div>
            <span className="text-xl font-semibold tracking-tight">Credex</span>
          </div>
          <nav>
            <Link 
              href="/audit" 
              className="px-4 py-2 text-sm font-medium bg-[#fafafa] text-[#09090b] rounded-md hover:bg-gray-200 transition-colors"
            >
              Run Audit
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />
          
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center space-x-2 bg-[#18181b] border border-[#27272a] rounded-full px-4 py-1.5 mb-8 text-sm text-gray-300">
              <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
              <span>Save 30-50% on AWS & Anthropic</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
              Stop overpaying for AI compute.<br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                Get the credits you deserve.
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Credex instantly audits your AI infrastructure, identifies wasted spend, 
              and automatically secures startup credits from AWS, GCP, and Anthropic. 
              No engineering hours required.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/audit" 
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-lg transition-all transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25"
              >
                Run Free Infrastructure Audit
              </Link>
              <button 
                onClick={() => setIsHowItWorksOpen(true)}
                className="w-full sm:w-auto px-8 py-4 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-white font-medium rounded-lg text-lg transition-colors cursor-pointer"
              >
                How it works
              </button>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-[#09090b] border-y border-[#27272a]">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-10 text-left">Trusted by top AI startups</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="glass p-8 rounded-2xl relative">
                <div className="absolute -top-4 -left-4 text-6xl text-blue-500/30">&ldquo;</div>
                <p className="text-xl text-gray-300 mb-6 relative z-10 leading-relaxed">
                  Credex ran their audit in 2 minutes. By Friday, they had cut our Anthropic API bill by 40% and secured $100k in AWS credits we didn&apos;t know we qualified for. Absolute no-brainer.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full" />
                  <div>
                    <p className="font-semibold">David Chen</p>
                    <p className="text-gray-400 text-sm">Founder at VectorML (Backed by YC & Sequoia)</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="glass p-6 rounded-xl text-center flex flex-col justify-center min-h-[140px]">
                  <p className="text-4xl font-bold text-blue-400 mb-2">$4.2M</p>
                  <p className="text-sm text-gray-400">Credits Secured</p>
                </div>
                <div className="glass p-6 rounded-xl text-center flex flex-col justify-center min-h-[140px]">
                  <p className="text-4xl font-bold text-violet-400 mb-2">35%</p>
                  <p className="text-sm text-gray-400">Avg. Bill Reduction</p>
                </div>
                <div className="glass p-6 rounded-xl text-center flex flex-col justify-center min-h-[140px]">
                  <p className="text-4xl font-bold text-emerald-400 mb-2">&lt;5 min</p>
                  <p className="text-sm text-gray-400">Audit Time</p>
                </div>
                <div className="glass p-6 rounded-xl text-center flex flex-col justify-center min-h-[140px]">
                  <p className="text-4xl font-bold text-amber-400 mb-2">0</p>
                  <p className="text-sm text-gray-400">Engineering Hours</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: "What exactly does the audit check?", a: "The audit safely scans your billing APIs and usage logs to identify orphaned instances, unoptimized token usage, and unmatched pricing tiers across your current cloud providers (AWS, GCP, OpenAI, Anthropic)." },
              { q: "Is my proprietary code or data safe?", a: "Yes. We only request read-only access to your billing and infrastructure metadata. We never look at your application data, model weights, or source code." },
              { q: "How does Credex make money?", a: "We operate on a success fee model. The audit is 100% free. We only charge a small percentage of the actual hard cash savings or new startup credits we secure for you. If we don't save you money, you pay nothing." },
              { q: "What if I already have startup credits?", a: "Most startups leave credits on the table. Even if you have baseline AWS Activate credits, we can often secure volume discounts, specialized AI hardware grants, or optimize how you are burning your current credits to make them last 2x longer." },
              { q: "How long does it take to see results?", a: "The initial audit takes under 5 minutes. After our consultation, credit activation and billing optimization typically take 3 to 5 business days to reflect in your cloud accounts." }
            ].map((faq, i) => (
              <div key={i} className="bg-[#18181b] border border-[#27272a] rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#27272a] py-8 text-center text-gray-500 text-sm">
        <p>© 2026 Credex Inc. All rights reserved.</p>
      </footer>

      <HowItWorksModal 
        isOpen={isHowItWorksOpen} 
        onClose={() => setIsHowItWorksOpen(false)} 
      />
    </div>
  );
}
