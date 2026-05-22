'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function BookConsultation() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to CRM
    setTimeout(() => {
      setSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col font-sans selection:bg-blue-500/30">
      <header className="border-b border-[#27272a] p-6 glass sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">C</div>
            <span className="text-xl font-semibold tracking-tight">Credex</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-6">
        <div className="w-full max-w-lg">
          {submitted ? (
            <div className="glass p-10 rounded-2xl border border-[#27272a] text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-4">Request Received!</h1>
              <p className="text-gray-400 mb-8">
                Our infrastructure team will review your audit report and email you within 24 hours to schedule your consultation and activate your credits.
              </p>
              <Link 
                href="/" 
                className="inline-block px-6 py-3 bg-[#18181b] hover:bg-[#27272a] border border-[#27272a] text-white font-medium rounded-lg transition-colors"
              >
                Return to Home
              </Link>
            </div>
          ) : (
            <div className="glass p-8 rounded-2xl border border-[#27272a] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-3xl font-bold mb-2">Book your Consultation</h1>
              <p className="text-gray-400 mb-8">
                Lock in your potential savings. We&apos;ll walk you through exactly how to optimize your compute and claim your startup credits.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Work Email</label>
                  <input 
                    type="email" 
                    required
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="founder@startup.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="VectorML"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Any specific concerns?</label>
                  <textarea 
                    rows={3}
                    className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                    placeholder="E.g. We have $100k AWS Activate credits expiring soon."
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-4 bg-white hover:bg-gray-200 text-black font-semibold rounded-lg text-lg transition-colors mt-4"
                >
                  Request Consultation
                </button>
              </form>
              <p className="text-xs text-center text-gray-500 mt-4">
                By booking, you agree to our terms of service and privacy policy. We will never share your email.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
