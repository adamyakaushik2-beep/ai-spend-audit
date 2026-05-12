'use client';

import { runAudit, ToolInput, AuditResult } from '../lib/audit-logic';
import { useState, useEffect } from 'react';

export default function AuditPage() {
  // --- 1. STATE MANAGEMENT ---
  const [tools, setTools] = useState<ToolInput[]>(() => {
    const saved = localStorage.getItem('ai_audit_state');
    return saved ? JSON.parse(saved).tools || [] : [];
  });
  const [teamSize, setTeamSize] = useState<number>(() => {
    const saved = localStorage.getItem('ai_audit_state');
    return saved ? JSON.parse(saved).teamSize || 1 : 1;
  });
  const [useCase, setUseCase] = useState<string>(() => {
    const saved = localStorage.getItem('ai_audit_state');
    return saved ? JSON.parse(saved).useCase || 'coding' : 'coding';
  });
  const [email, setEmail] = useState('');
  const [results, setResults] = useState<AuditResult[]>([]);
  const [isAudited, setIsAudited] = useState(false);

  // --- 2. PERSISTENCE (Requirement: Form state must persist across reloads) ---
  useEffect(() => {
    localStorage.setItem('ai_audit_state', JSON.stringify({ tools, teamSize, useCase }));
  }, [tools, teamSize, useCase]);

  // --- 3. ACTIONS ---
  const addToolRow = () => {
    setTools([...tools, { name: 'Cursor', plan: 'Pro', monthlySpend: 20, seats: 1 }]);
  };

  const removeToolRow = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const updateTool = (index: number, key: keyof ToolInput, value: string | number) => {
    const updated = [...tools];
    updated[index] = { ...updated[index], [key]: value };
    setTools(updated);
  };

  const triggerAudit = () => {
    const auditResults = runAudit(tools, teamSize, useCase);
    setResults(auditResults);
    setIsAudited(true);
    // Scroll to top to see results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalMonthlySavings = results.reduce((acc, curr) => acc + curr.monthlySavings, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 py-4 px-8 mb-8">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <span className="text-2xl font-black text-emerald-600 tracking-tighter">CREDEX <span className="text-slate-400 font-light">AUDIT</span></span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Internship Project</span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4">
        {!isAudited ? (
          /* --- INPUT FORM --- */
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-2">AI Spend Audit</h1>
            <p className="text-slate-500 mb-8">Input your team&apos;s tool usage to surface immediate savings.</p>

            <div className="space-y-6">
              {tools.map((tool, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative animate-in fade-in zoom-in duration-300">
                  <button 
                    onClick={() => removeToolRow(index)}
                    className="absolute -top-2 -right-2 bg-white border border-gray-200 rounded-full w-6 h-6 text-xs hover:bg-red-50 text-red-500 shadow-sm"
                  >✕</button>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Tool</label>
                      <select 
                        className="w-full bg-white border border-gray-200 rounded-lg p-2"
                        value={tool.name}
                        onChange={(e) => updateTool(index, 'name', e.target.value)}
                      >
                        <option>Cursor</option>
                        <option>ChatGPT</option>
                        <option>Claude</option>
                        <option>GitHub Copilot</option>
                        <option>Gemini</option>
                        <option>OpenAI API direct</option>
                        <option>Anthropic API direct</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Plan Type</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Pro, Team, Business"
                        className="w-full bg-white border border-gray-200 rounded-lg p-2"
                        value={tool.plan}
                        onChange={(e) => updateTool(index, 'plan', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Seats</label>
                      <input 
                        type="number" 
                        className="w-full bg-white border border-gray-200 rounded-lg p-2"
                        value={tool.seats}
                        onChange={(e) => updateTool(index, 'seats', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Monthly Spend ($)</label>
                      <input 
                        type="number" 
                        className="w-full bg-white border border-gray-200 rounded-lg p-2"
                        value={tool.monthlySpend}
                        onChange={(e) => updateTool(index, 'monthlySpend', parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button 
                onClick={addToolRow}
                className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-emerald-400 hover:text-emerald-600 transition-all font-medium"
              >
                + Add AI Tool to Audit
              </button>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div>
                  <label className="block text-sm font-bold mb-2">Total Company Size</label>
                  <input 
                    type="number" 
                    className="w-full border border-gray-200 rounded-lg p-3"
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Main Use Case</label>
                  <select 
                    className="w-full border border-gray-200 rounded-lg p-3"
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                  >
                    <option value="coding">Coding / Engineering</option>
                    <option value="writing">Writing / Marketing</option>
                    <option value="research">Data / Research</option>
                    <option value="mixed">Mixed Usage</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={triggerAudit}
                disabled={tools.length === 0}
                className="w-full bg-slate-900 text-white py-4 rounded-xl text-lg font-bold hover:bg-emerald-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                Run Savings Audit
              </button>
            </div>
          </div>
        ) : (
          /* --- RESULTS VIEW --- */
          <div className="animate-in slide-in-from-bottom-8 duration-500">
            {/* HERO SAVINGS */}
            <div className="bg-emerald-600 rounded-3xl p-10 text-white text-center shadow-2xl mb-8">
              <p className="text-emerald-100 uppercase tracking-widest text-sm font-bold mb-2">Potential Annual Savings</p>
              <h2 className="text-7xl font-black mb-4">${totalMonthlySavings * 12}</h2>
              <div className="inline-block bg-emerald-700 px-4 py-2 rounded-full text-emerald-50 font-semibold">
                ${totalMonthlySavings} / month identified
              </div>
            </div>

            {/* BREAKDOWN */}
            <h3 className="text-xl font-bold mb-4 px-2">Optimization Breakdown</h3>
            <div className="space-y-4 mb-12">
              {results.length > 0 ? results.map((res, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center">
                  <div className="max-w-[70%]">
                    <span className="text-xs font-bold text-emerald-600 uppercase mb-1 block">{res.toolName}</span>
                    <h4 className="text-lg font-bold mb-1">{res.recommendation}</h4>
                    <p className="text-slate-500 text-sm">{res.reason}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-emerald-600">-${res.monthlySavings}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase">per mo</div>
                  </div>
                </div>
              )) : (
                <div className="bg-white p-10 rounded-2xl text-center border border-dashed border-slate-300">
                  <p className="text-lg font-bold text-slate-700">You are already optimized! ✅</p>
                  <p className="text-slate-500">We couldn&apos;t find any immediate waste in your current stack.</p>
                </div>
              )}
            </div>

            {/* LEAD CAPTURE (Requirement: Email is captured after value is shown) */}
            <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-2">Get the Full Report</h3>
              <p className="text-slate-400 mb-6">We&apos;ll send you a detailed PDF breakdown and custom Credex discount codes.</p>
              
              <div className="flex flex-col md:flex-row gap-3">
                <input 
                  type="email" 
                  placeholder="Enter your work email"
                  className="flex-1 bg-slate-800 border-none rounded-xl p-4 focus:ring-2 focus:ring-emerald-500 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button 
                  onClick={() => alert('Audit saved! Check your email (Mocked)')}
                  className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-xl transition-all"
                >
                  Download Audit PDF
                </button>
              </div>

              {totalMonthlySavings > 500 && (
                <div className="mt-6 p-4 bg-emerald-900/30 border border-emerald-500/30 rounded-xl">
                  <p className="text-emerald-400 text-sm leading-relaxed">
                    <strong>High Savings Case:</strong> Your overspend is significant. 
                    <a href="#" className="underline ml-1 font-bold">Book a free Credex consultation</a> to recover these costs immediately.
                  </p>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsAudited(false)}
              className="mt-8 w-full text-slate-400 hover:text-slate-600 font-medium transition-all"
            >
              ← Edit tool inputs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}