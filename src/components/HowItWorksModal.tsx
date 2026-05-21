'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const [activeTab, setActiveTab] = useState(0);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent background scrolling
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Handle click on backdrop (light-dismiss)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const tabs = [
    {
      title: 'Overview',
      subtitle: 'Smart AI Compute & Credit Optimizer',
      icon: (
        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <h4 className="font-semibold text-blue-400 mb-1">What is Credex?</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Credex acts as an automated financial officer for your AI infrastructure. We safely audit your active cloud accounts, optimize billing configurations, and automatically apply for high-value cloud startup credits to cut your AI compute bill by 30-50%.
            </p>
          </div>
          
          <div className="space-y-4">
            <h5 className="font-semibold text-gray-200 text-sm">Key Benefits:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2 border border-emerald-500/20">✓</div>
                <h6 className="font-semibold text-gray-200 text-sm mb-1">Immediate Savings</h6>
                <p className="text-xs text-gray-400">Average bill reduction of 35% across AWS, GCP, OpenAI, & Anthropic.</p>
              </div>
              <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-2 border border-purple-500/20">⚡</div>
                <h6 className="font-semibold text-gray-200 text-sm mb-1">Zero Engineering Required</h6>
                <p className="text-xs text-gray-400">Our team and tools handle everything so your devs can keep building.</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '1. Secure Audit',
      subtitle: 'Zero Risk. Read-Only Billing API Access.',
      icon: (
        <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      content: (
        <div className="space-y-5 animate-in fade-in duration-300">
          <p className="text-gray-300 text-sm leading-relaxed">
            To start, you grant read-only access to your cloud billing dashboard or API logs. This takes less than 2 minutes and is highly secure.
          </p>
          
          <div className="space-y-3">
            {[
              {
                title: 'Strictly Read-Only Access',
                desc: 'We never access your codebase, database, user logs, or model weights. We only analyze billing metadata and active instance sizes.'
              },
              {
                title: '5-Minute Scan',
                desc: 'Our scanning engine maps out your cluster instances, idling servers, and current token volume limits.'
              },
              {
                title: 'Fully Compliant & Encrypted',
                desc: 'All connected metadata is fully encrypted at rest and in transit with bank-grade security protocols.'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-[#18181b] border border-[#27272a] p-3 rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </span>
                <div>
                  <h6 className="font-semibold text-gray-200 text-sm">{item.title}</h6>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '2. Bill Optimization',
      subtitle: 'Detecting Wasted & Idle Resources',
      icon: (
        <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-5 animate-in fade-in duration-300">
          <p className="text-gray-300 text-sm leading-relaxed">
            Most AI startups over-provision resources out of caution. We safely fine-tune allocations to maintain speed while cutting massive overheads.
          </p>

          <div className="space-y-3">
            {[
              {
                title: 'Instance Resizing & Spot Migration',
                desc: 'We identify under-utilized GPU nodes and advise migrating dev environments to cost-effective AWS Spot Instances.'
              },
              {
                title: 'AWS Graviton3 Upgrades',
                desc: 'We help migrate server architectures from traditional x86 to Graviton3, improving performance-per-dollar by up to 40%.'
              },
              {
                title: 'Smart Prompt Caching',
                desc: 'For LLMs like Anthropic Claude, we help you implement prompt caching, which cuts repeated context fees by up to 90%.'
              }
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-[#18181b] border border-[#27272a] p-3 rounded-xl">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 flex items-center justify-center font-bold text-xs">
                  {idx + 1}
                </span>
                <div>
                  <h6 className="font-semibold text-gray-200 text-sm">{item.title}</h6>
                  <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: '3. Credit Matching',
      subtitle: 'Unlocking Hidden Free Cloud Grants',
      icon: (
        <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      content: (
        <div className="space-y-5 animate-in fade-in duration-300">
          <p className="text-gray-300 text-sm leading-relaxed">
            Cloud providers actively hand out hundreds of thousands of dollars in startup grants. We track, match, and automatically submit application packages on your behalf.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl">
              <span className="text-xs text-orange-400 font-semibold tracking-wider block mb-1">AWS ACTIVATE</span>
              <h6 className="font-semibold text-gray-200 text-sm mb-1">Up to $100k Credits</h6>
              <p className="text-xs text-gray-400">Unlock AWS activate credits to pay for EC2, SageMaker, and bedrock infrastructure.</p>
            </div>
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <span className="text-xs text-blue-400 font-semibold tracking-wider block mb-1">GCP FOR STARTUPS</span>
              <h6 className="font-semibold text-gray-200 text-sm mb-1">Up to $100k Credits</h6>
              <p className="text-xs text-gray-400">Dedicated funding for Google Compute Engine, Kubernetes, and Vertex AI models.</p>
            </div>
            
            <div className="p-4 bg-amber-700/10 border border-amber-700/20 rounded-xl">
              <span className="text-xs text-amber-400 font-semibold tracking-wider block mb-1">ANTHROPIC STARTUP</span>
              <h6 className="font-semibold text-gray-200 text-sm mb-1">Up to $50k Token Credits</h6>
              <p className="text-xs text-gray-400">Exclusive prompt optimization support and free token usage for high-growth startups.</p>
            </div>

            <div className="p-4 bg-emerald-600/10 border border-emerald-500/20 rounded-xl">
              <span className="text-xs text-emerald-400 font-semibold tracking-wider block mb-1">OPENAI FOUNDERS</span>
              <h6 className="font-semibold text-gray-200 text-sm mb-1">Up to $10k API Credits</h6>
              <p className="text-xs text-gray-400">Apply through partner incubators to fast-track API usage budgets.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '4. Success Plan',
      subtitle: 'Zero Cost Upfront. 100% Performance-Based.',
      icon: (
        <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      content: (
        <div className="space-y-6 animate-in fade-in duration-300">
          <p className="text-gray-300 text-sm leading-relaxed">
            Credex runs on a <strong>100% alignment model</strong>. You never pay a single dime out of pocket unless we verify actual savings or secure brand new credits.
          </p>

          <div className="space-y-4">
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
              <h6 className="font-semibold text-purple-400 text-sm mb-1">Our Success Fee Promise:</h6>
              <p className="text-xs text-gray-300 leading-relaxed">
                We take a small success fee representing a percentage of verified cost reduction. If our audit reports find $0 in potential savings, you pay exactly <strong>$0</strong>. No catches, no subscriptions.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-t border-[#27272a] pt-4">
              <div className="text-center sm:text-left">
                <span className="text-xs text-gray-500">READY TO SAVE?</span>
                <p className="text-sm text-gray-300 font-medium">Connect in 2 minutes & see results instantly.</p>
              </div>
              <Link
                href="/audit"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-all transform hover:scale-105 text-center shadow-lg shadow-blue-500/20"
              >
                Start Free Audit Now
              </Link>
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4 py-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl bg-[#0c0c0e] border border-[#27272a] rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden max-h-[90vh] md:max-h-[80vh] animate-in slide-in-from-bottom-4 duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg bg-[#18181b]/50 border border-white/5 hover:border-white/20 transition-all z-10"
          aria-label="Close guide"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sidebar Tabs - Hidden on Mobile, Visible on Desktop */}
        <div className="w-full md:w-1/3 bg-[#09090b] border-b md:border-b-0 md:border-r border-[#27272a] p-6 flex flex-col flex-shrink-0">
          <div className="mb-6 pr-6">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">
                C
              </div>
              <span className="text-sm font-semibold tracking-tight text-white">Credex Platform Guide</span>
            </div>
            <h3 id="modal-title" className="text-xl font-bold tracking-tight text-gray-200">How It Works</h3>
          </div>

          {/* Desktop Tab Buttons */}
          <div className="hidden md:flex flex-col gap-1.5 flex-grow">
            {tabs.map((tab, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                    isActive 
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_-3px_rgba(59,130,246,0.15)] font-semibold' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#18181b] border border-transparent'
                  }`}
                >
                  <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'opacity-70'}`}>
                    {tab.icon}
                  </span>
                  <span className="text-sm">{tab.title}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Horizontal Scroll Tab Selectors */}
          <div className="flex md:hidden overflow-x-auto gap-2 pb-2 scrollbar-none snap-x">
            {tabs.map((tab, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`snap-center flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white border-blue-500' 
                      : 'bg-[#18181b] text-gray-400 border-[#27272a]'
                  }`}
                >
                  {tab.title}
                </button>
              );
            })}
          </div>

          <div className="hidden md:block text-xs text-gray-500 mt-auto border-t border-[#27272a] pt-4">
            Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 font-mono">Esc</kbd> to exit.
          </div>
        </div>

        {/* Content Pane */}
        <div className="flex-grow flex flex-col p-6 md:p-8 min-h-[350px] md:min-h-0 overflow-y-auto">
          {/* Active Tab Heading */}
          <div className="mb-6">
            <span className="text-xs font-semibold text-blue-500 tracking-wider uppercase">
              STEP {activeTab} OF {tabs.length - 1}
            </span>
            <h4 className="text-2xl font-bold text-white mt-1 leading-tight">
              {tabs[activeTab].title}
            </h4>
            <p className="text-gray-400 text-sm mt-1.5">
              {tabs[activeTab].subtitle}
            </p>
          </div>

          {/* Tab Content Body */}
          <div className="flex-grow">
            {tabs[activeTab].content}
          </div>

          {/* Step Navigation Controls */}
          <div className="flex items-center justify-between border-t border-[#27272a] pt-6 mt-8">
            <button
              onClick={handlePrev}
              disabled={activeTab === 0}
              className={`px-4 py-2 text-sm font-medium border border-[#27272a] rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 0 
                  ? 'text-gray-600 border-gray-900 cursor-not-allowed' 
                  : 'text-gray-300 hover:bg-[#18181b] hover:text-white'
              }`}
            >
              &larr; Back
            </button>

            {/* Stepper Progress Indicators */}
            <div className="flex items-center gap-1.5">
              {tabs.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    activeTab === idx ? 'bg-blue-500 w-4' : 'bg-[#27272a] hover:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={activeTab === tabs.length - 1}
              className={`px-4 py-2 text-sm font-medium border border-[#27272a] rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === tabs.length - 1 
                  ? 'text-gray-600 border-gray-900 cursor-not-allowed' 
                  : 'text-gray-300 hover:bg-[#18181b] hover:text-white'
              }`}
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
