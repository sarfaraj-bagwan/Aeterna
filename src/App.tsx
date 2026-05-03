/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Activity, 
  GitBranch, 
  FileText, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Globe,
  Database,
  Terminal,
  ChevronDown,
  Lock,
  RefreshCcw,
  Play,
  Cpu,
  Fingerprint,
  Search,
  Dna,
  BarChart3,
  TrendingUp,
  Map as MapIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import * as aeternaAi from './services/slpAiService';

export default function App() {
  const [harmScore, setHarmScore] = useState(0.1245);
  const [status, setStatus] = useState('NORMAL');
  const [activeTab, setActiveTab] = useState<'Merge Workspace' | 'Template Library' | 'Truth-Ledger' | 'System Dashboard'>('Merge Workspace');
  const [isExecuting, setIsExecuting] = useState(false);
  const [auditState, setAuditState] = useState<'idle' | 'scanning' | 'pass' | 'fail'>('idle');
  const [isHealing, setIsHealing] = useState(false);
  const [systemLogs, setSystemLogs] = useState<{msg: string, time: string, type: 'info' | 'warn' | 'success'}[]>([]);

  // AI Feature States
  const [policyText, setPolicyText] = useState('');
  const [isAnalyzingPolicy, setIsAnalyzingPolicy] = useState(false);
  const [policyResult, setPolicyResult] = useState<any>(null);
  
  const [isScanningAnomalies, setIsScanningAnomalies] = useState(false);
  const [anomalyResult, setAnomalyResult] = useState<any>(null);

  const [dnaResult, setDnaResult] = useState<string | null>(null);
  const [isExtractingDna, setIsExtractingDna] = useState(false);

  // Red Team States
  const [lastAttack, setLastAttack] = useState<any>(null);
  const [isProbing, setIsProbing] = useState(false);

  // Dashboard Data
  const [metricsHistory, setMetricsHistory] = useState<any[]>([]);

  // Simulation of harm score fluctuation and Automated Red Teaming
  useEffect(() => {
    const interval = setInterval(() => {
      if (isHealing) return;

      // Randomly trigger a Red Team Probe (10% chance per interval)
      if (Math.random() < 0.1 && !isProbing) {
        performRedTeamProbe();
      }

      setHarmScore(prev => {
        const delta = (Math.random() - 0.5) * 0.02;
        const next = Math.max(0, Math.min(1, prev + delta));
        
        if (next > 0.25) setStatus('WARNING');
        else if (next > 0.4) setStatus('CRITICAL');
        else setStatus('NORMAL');

        // Automated Self-Healing Trigger
        if (next > 0.35 && !isHealing) {
          triggerHeal("Automated: Critical Harm Threshold Breached");
        }
        
        // Update history for dashboard
        setMetricsHistory(h => {
          const newHistory = [...h, { time: new Date().toLocaleTimeString(), harm: next, gini: 0.354 + next * 0.1 }].slice(-20);
          return newHistory;
        });

        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isHealing]);

  const addLog = (msg: string, type: 'info' | 'warn' | 'success' = 'info') => {
    setSystemLogs(prev => [{ msg, time: new Date().toLocaleTimeString(), type }, ...prev].slice(0, 50));
  };

  const triggerHeal = (reason: string = "Manual State Reversion") => {
    setIsHealing(true);
    addLog(reason, 'warn');
    addLog("Initiating Layer 4 Self-Correction Loop...", 'info');
    
    setTimeout(() => {
      addLog("Rolling back to checkpoint: AETERNA_STABLE_001", 'info');
      setTimeout(() => {
        setHarmScore(0.1245);
        setStatus('NORMAL');
        setAuditState('pass');
        setIsHealing(false);
        setAnomalyResult(null);
        addLog("System Integrity Restored. Entropy Nullified.", 'success');
      }, 2000);
    }, 1500);
  };

  const handleExecute = () => {
    setIsExecuting(true);
    setTimeout(() => setIsExecuting(false), 3000);
  };

  const runAudit = () => {
    setAuditState('scanning');
    setTimeout(() => {
      // Simulate checking against harm function threshold
      const success = harmScore < 0.3; 
      setAuditState(success ? 'pass' : 'fail');
    }, 2500);
  };

  const performRedTeamProbe = async () => {
    setIsProbing(true);
    addLog("Red Team Agent initiating adversarial probe...", 'warn');
    try {
      const attack = await aeternaAi.generateAttackVector();
      setLastAttack(attack);
      
      if (attack.successProbability > 0.4) {
        addLog(`EXPLOIT SUCCESS: ${attack.attackVector}`, 'warn');
        // Trigger self-healing after a small delay to show the "damage"
        setTimeout(() => {
          triggerHeal(`Vulnerability Detected: ${attack.attackVector}. Initiating Root-Logic Reversion.`);
        }, 1500);
      } else {
        addLog(`Attack Deflected: ${attack.attackVector}`, 'success');
      }
    } catch (error) {
      console.error("Red Team probe failed:", error);
    } finally {
      setIsProbing(false);
    }
  };

  const handlePolicyAnalysis = async () => {
    if (!policyText) return;
    setIsAnalyzingPolicy(true);
    try {
      const result = await aeternaAi.analyzePolicy(policyText);
      setPolicyResult(result);
    } catch (error) {
      console.error("AI Analysis failed:", error);
    } finally {
      setIsAnalyzingPolicy(false);
    }
  };

  const handleAnomalyScan = async () => {
    setIsScanningAnomalies(true);
    try {
      // Sending current system state as "logs"
      const logs = `Harm Score: ${harmScore}, Status: ${status}, Gini: ${(0.354 + harmScore * 0.1).toFixed(3)}`;
      const result = await aeternaAi.detectAnomalies(logs);
      setAnomalyResult(result);
    } catch (error) {
      console.error("Anomaly scan failed:", error);
    } finally {
      setIsScanningAnomalies(false);
    }
  };

  const handleDnaExtraction = async () => {
    setIsExtractingDna(true);
    try {
      const desc = "A village with 100% solar microgrid, cooperative farming, and a revolving credit pool for women entrepreneurs.";
      const result = await aeternaAi.extractSuccessDNA(desc);
      setDnaResult(result);
    } catch (error) {
      console.error("DNA extraction failed:", error);
    } finally {
      setIsExtractingDna(false);
    }
  };

  return (
    <div id="aeterna-root" className="w-full h-screen bg-[#F9FAFB] text-slate-900 font-sans flex flex-col overflow-hidden select-none relative">
      
      {/* Self-Healing Recovery Overlay */}
      <AnimatePresence>
        {isHealing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center text-white p-12"
          >
            <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-12 flex flex-col items-center gap-8 shadow-2xl">
              <div className="relative">
                <RefreshCcw className="w-20 h-20 text-indigo-400 animate-spin" />
                <Shield className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic">Layer 4: Self-Healing Protocol</h2>
                <p className="text-slate-400 font-mono text-sm tracking-widest">STATE_REVERSION_IN_PROGRESS // ENTROPY_CLEANSE</p>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '100%' }}
                   transition={{ duration: 3.5, ease: "easeInOut" }}
                   className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                />
              </div>
              <div className="flex flex-col gap-2 w-full max-w-sm">
                {systemLogs.slice(0, 3).map((log, i) => (
                  <div key={i} className="flex justify-between text-[10px] font-mono opacity-60">
                    <span>{log.msg}</span>
                    <span className="text-indigo-400">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Header */}
      <header id="main-header" className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold tracking-tight text-xl">Aeterna</span>
            <span className="font-normal text-slate-400 ml-2 italic text-sm border-l border-slate-200 pl-2">System Orchestrator</span>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <nav className="flex gap-8 text-sm font-medium text-slate-500 h-full">
            {['Merge Workspace', 'System Dashboard', 'Template Library', 'Truth-Ledger'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`relative py-5 transition-colors hover:text-slate-900 ${
                  activeTab === tab ? 'text-slate-900' : ''
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="underline" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900" 
                  />
                )}
              </button>
            ))}
          </nav>
          
          <button 
            id="execute-btn"
            onClick={handleExecute}
            disabled={isExecuting}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 active:scale-95 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExecuting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
            Execute Protocol
          </button>
        </div>
      </header>

      <main id="app-body" className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Input Manifest & Metrics */}
        <aside id="sidebar-left" className="w-72 border-r border-slate-200 bg-white p-6 flex flex-col gap-10 overflow-y-auto">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Input Manifest</h3>
              <FileText className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div className="space-y-3">
              <div className="group flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="bg-white p-1.5 rounded-md shadow-sm">
                  <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono truncate font-medium">AETERNA_ROOT.txt</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-tighter mt-0.5">Root Logic</p>
                </div>
              </div>
              <div className="group flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors">
                <div className="bg-white p-1.5 rounded-md shadow-sm">
                  <Terminal className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-mono truncate font-medium">AETERNA_PROMPT.txt</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-tighter mt-0.5">Implementation</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">Sovereignty Metrics</h3>
              <Activity className="w-3.5 h-3.5 text-slate-300" />
            </div>
            <div className="space-y-4">
              {[
                { label: 'Gini Coeff', value: (0.354 + harmScore * 0.1).toFixed(3), color: 'indigo' },
                { label: 'Unemployment', value: (4.2 + harmScore * 5).toFixed(1) + '%', color: 'emerald' },
                { label: 'Affordability', value: (84.2 - harmScore * 10).toFixed(1) + '%', color: 'amber' }
              ].map((metric) => (
                <div key={metric.label} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                    <span>{metric.label}</span>
                    <span className={`text-${metric.color}-600`}>{metric.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.random() * 40 + 40}%` }}
                      className={`h-full bg-${metric.color}-500 shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-auto pt-6 border-t border-slate-100">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Destination Path</h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 overflow-hidden hover:bg-slate-100 transition-colors cursor-default">
              <p className="text-[10px] font-mono text-slate-500 break-all leading-relaxed line-clamp-2">
                /outputs/Aeterna_GITHUB/spec_v1.0
              </p>
            </div>
          </section>
        </aside>

        {/* Main Content: Projected Structure & Staging */}
        <div id="main-content" className="flex-1 p-8 flex flex-col gap-8 bg-[#FDFDFE] overflow-y-auto">
          {activeTab === 'System Dashboard' ? (
            <div className="flex-1 flex flex-col gap-8">
               <div className="flex justify-between items-start">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                  <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Governance Real-time Dashboard</h2>
                  <p className="text-sm text-slate-500 mt-2 max-w-lg leading-relaxed">
                    Live telemetry from the Sovereignty Cluster 082. Monitoring Harm Function ($H$) and Micro-Economic Integrity.
                  </p>
                </motion.div>
                <div className="flex gap-4">
                  <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-center shadow-sm">
                    <span className="text-[10px] text-slate-400 font-bold block">ACTIVE NODES</span>
                    <span className="text-xl font-black text-slate-900">1,248</span>
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-center shadow-sm">
                    <span className="text-[10px] text-slate-400 font-bold block">VERIFIED DNA</span>
                    <span className="text-xl font-black text-indigo-600">82</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <Activity className="w-4 h-4 text-red-500" /> Harm Function Trend ($H$)
                    </h3>
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={metricsHistory}>
                        <defs>
                          <linearGradient id="colorHarm" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0, 1]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                          itemStyle={{ color: '#ef4444' }}
                        />
                        <Area type="monotone" dataKey="harm" stroke="#ef4444" fillOpacity={1} fill="url(#colorHarm)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                       <BarChart3 className="w-4 h-4 text-indigo-500" /> Inequality Proxy (Gini)
                    </h3>
                  </div>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={metricsHistory}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="time" hide />
                        <YAxis hide domain={[0.2, 0.5]} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc', fontSize: '12px' }}
                          itemStyle={{ color: '#6366f1' }}
                        />
                        <Line type="monotone" dataKey="gini" stroke="#6366f1" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full" />
                <div className="relative z-10 grid grid-cols-3 gap-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-indigo-400">
                      <TrendingUp className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Growth Integrity</span>
                    </div>
                    <div className="text-4xl font-black tabular-nums">92.4%</div>
                    <p className="text-xs text-slate-400 leading-relaxed">System-wide resource efficiency calculated via Layer 4.</p>
                  </div>
                  <div className="space-y-4 border-l border-slate-800 pl-12">
                    <div className="flex items-center gap-3 text-emerald-400">
                      <MapIcon className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Village Diffusion</span>
                    </div>
                    <div className="text-4xl font-black tabular-nums">412</div>
                    <p className="text-xs text-slate-400 leading-relaxed">Success patterns successfully cloned to new recipient nodes.</p>
                  </div>
                  <div className="space-y-4 border-l border-slate-800 pl-12">
                    <div className="flex items-center gap-3 text-amber-400">
                      <Activity className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Anomaly Flux</span>
                    </div>
                    <div className="text-4xl font-black tabular-nums">0.03</div>
                    <p className="text-xs text-slate-400 leading-relaxed">System entropy remains within nominal tolerance ($2\sigma$).</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Project Staging Cluster</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-lg leading-relaxed">
                Synthesizing constitutional root-logic with active implementation prompts into a distributed GitHub repository structure.
              </p>
            </motion.div>
            
            <div className="text-right">
              <span className="text-[11px] text-slate-400 uppercase block mb-2 font-bold tracking-widest">System Version</span>
              <span className="bg-indigo-50 text-indigo-700 text-[11px] font-bold px-3 py-1.5 rounded-full border border-indigo-100 uppercase tracking-tighter">
                AETERNA-CORE 2026.05
              </span>
            </div>
          </div>

            <div id="staging-area" className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex flex-col overflow-hidden relative">
              <div className="h-12 bg-slate-50/50 border-b border-slate-200 flex items-center px-6 justify-between">
              <div className="flex gap-2.5">
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
                <div className="w-3 h-3 rounded-full bg-slate-200" />
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex bg-slate-100 rounded-lg p-0.5">
                   <button 
                     onClick={() => setActiveTab('Snapshot')}
                     className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === 'Snapshot' || activeTab === 'Merge Workspace' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                   >
                     FS_SNAPSHOT
                   </button>
                   <button 
                     onClick={() => setActiveTab('Policy Terminal')}
                     className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${activeTab === 'Policy Terminal' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                   >
                     POLICY_TERMINAL
                   </button>
                </div>
                <div className="h-4 w-px bg-slate-200" />
                <button className="text-[10px] flex items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors uppercase font-bold">
                  <RefreshCcw className="w-3 h-3" /> Refresh
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-0 overflow-y-auto">
              {activeTab === 'Policy Terminal' ? (
                <div className="p-8 flex flex-col gap-6 h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2 text-slate-800">
                      <Cpu className="w-4 h-4 text-indigo-500" /> Layer 1: Semantic Firewall
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <Fingerprint className="w-3 h-3" /> SECURE_VALIDATION_ACTIVE
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col gap-4">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Policy Draft Input</label>
                      <textarea 
                        value={policyText}
                        onChange={(e) => setPolicyText(e.target.value)}
                        placeholder="Type policy draft here for constitutional compliance check..."
                        className="flex-1 bg-transparent resize-none outline-none font-mono text-sm border-none placeholder:text-slate-300"
                      />
                      <div className="flex justify-end">
                        <button 
                          onClick={handlePolicyAnalysis}
                          disabled={isAnalyzingPolicy || !policyText}
                          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                          {isAnalyzingPolicy ? <RefreshCcw className="w-3 h-3 animate-spin"/> : <Search className="w-3 h-3"/>}
                          Run Firewall Analysis
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {policyResult && (
                        <motion.div 
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-6 rounded-xl border ${policyResult.passed ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-red-50 border-red-100 text-red-800'}`}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <span className="font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                              {policyResult.passed ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                              Firewall Result: {policyResult.passed ? 'PASSED' : 'REJECTED'}
                            </span>
                            <span className="text-[10px] font-mono">Bias Score: {(policyResult.biasScore * 100).toFixed(1)}%</span>
                          </div>
                          <p className="text-sm italic mb-4 leading-relaxed opacity-90">{policyResult.recommendation}</p>
                          {policyResult.violations?.length > 0 && (
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold uppercase opacity-60">Violation Points:</p>
                              {policyResult.violations.map((v: string, i: number) => (
                                <div key={i} className="text-xs flex items-center gap-2">• {v}</div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              ) : (
                <div className="p-8 font-mono text-[14px] leading-relaxed text-slate-700">
                  {['.github/', '  workflows/', '    aeterna_validation.yml', 'core/', '  governance/', '    harm_function.ts', '    ledger_node.py', '  infrastructure/', '    BFT_consensus.go', 'docs/', '  protocol/', '    SYMBOLS.md', 'README.md', 'package.json'].map((path, idx) => {
                    const isDir = path.endsWith('/');
                    const level = path.search(/\S/);
                    const name = path.trim();
                    
                    return (
                      <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-3 py-0.5 group cursor-pointer"
                      >
                        <span className="text-slate-300 w-4 flex justify-center" style={{ marginLeft: `${level * 12}px` }}>
                          {isDir ? '📁' : '📄'}
                        </span>
                        <span className={`${isDir ? 'font-bold text-slate-800' : 'text-slate-600'} hover:text-indigo-600 transition-colors`}>
                          {name}
                        </span>
                        {!isDir && idx === 2 && (
                          <span className="text-[10px] bg-indigo-50 text-indigo-400 px-2 py-0.5 rounded italic opacity-0 group-hover:opacity-100 transition-opacity">
                            Automated from Meta-Prompt
                          </span>
                        )}
                      </motion.div>
                    );
                  })}

                  <AnimatePresence>
                    {isExecuting && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-10 p-5 bg-slate-900 rounded-xl text-slate-300 text-[12px] shadow-xl border border-slate-700 font-mono"
                      >
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                          <Terminal className="w-4 h-4" />
                          <span className="italic">$ aeterna-merge --source ./prompts --target ./spec --enforce-constitutional-root</span>
                        </div>
                        <div className="space-y-1 opacity-80">
                          <p className="flex justify-between"><span>[OK] Scanning AETERNA_ROOT.txt...</span><span className="text-slate-500 italic">34.2ms</span></p>
                          <p>Applying 7-layer governance constraints...</p>
                          <p className="text-indigo-400">Synchronizing BFT Consensus nodes [100/100]</p>
                          <p className="flex justify-between text-white font-bold border-t border-slate-700 mt-2 pt-2">
                            <span>SUCCESS: SPECIFICATION MANIFEST GENERATED</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="absolute top-24 right-8 w-40 p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-xl pointer-events-none">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Ledger Sync</span>
                </div>
                <div className="text-xl font-bold font-mono tracking-tighter">99.8%</div>
                <div className="w-full bg-slate-100 h-1 rounded-full">
                  <div className="w-full h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

        {/* Right Sidebar: Governance Controls */}
        <aside id="sidebar-right" className="w-80 border-l border-slate-200 bg-white p-8 overflow-y-auto">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Composition Settings</h3>
          
          <div className="space-y-10">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                <GitBranch className="w-3 h-3" /> Integration Layer
              </label>
              <div className="group p-4 border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-all">
                <span className="text-sm font-semibold">Semantic Synthesis</span>
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:translate-y-0.5 transition-transform" />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                <Lock className="w-3 h-3" /> Security Policy
              </label>
              <div className="group p-4 border border-slate-200 rounded-2xl flex items-center justify-between cursor-pointer opacity-50 bg-slate-50 hover:bg-slate-100 transition-all">
                <span className="text-sm font-semibold">Constitutional Hardened</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                   <Activity className="w-3 h-3 text-red-500" /> Anomaly Detection
                 </span>
              </div>
              
              <button 
                onClick={handleAnomalyScan}
                disabled={isScanningAnomalies}
                className="w-full py-3 px-4 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-sm"
              >
                {isScanningAnomalies ? (
                  <>
                    <RefreshCcw className="w-3.5 h-3.5 animate-spin text-red-500" />
                    <span>Analyzing Logs...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-3.5 h-3.5" />
                    <span>Scan for Corruption</span>
                  </>
                )}
              </button>

              <AnimatePresence>
                {anomalyResult && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mt-4 p-4 rounded-xl border ${anomalyResult.isAnomaly ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {anomalyResult.isAnomaly ? <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <span className="text-[10px] font-bold uppercase tracking-widest">
                        {anomalyResult.isAnomaly ? `DETECTED: ${anomalyResult.type}` : 'SYSTEM CLEAN'}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-relaxed font-mono">
                      {anomalyResult.evidence}
                    </p>
                    <div className="mt-3 flex justify-between items-center text-[9px] font-bold opacity-60">
                      <span>CONFIDENCE: {(anomalyResult.confidence * 100).toFixed(0)}%</span>
                      <span>RISK: {anomalyResult.riskLevel}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-8 border-t border-slate-100">
               <div className="flex justify-between items-center mb-4">
                 <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                   <Shield className="w-3 h-3 text-indigo-500" /> Self-Healing
                 </span>
                 <div className="flex items-center gap-1.5">
                   <span className="text-[9px] font-bold text-slate-400">AGENTS_ACTIVE: 2</span>
                   <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => triggerHeal()}
                  disabled={isHealing}
                  className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-100"
                >
                  <RefreshCcw className={`w-3.5 h-3.5 ${isHealing ? 'animate-spin' : ''}`} />
                  <span>Heal System State</span>
                </button>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                      <Terminal className="w-3 h-3 text-red-500" /> Red Team Agent
                    </span>
                    {isProbing && <RefreshCcw className="w-3 h-3 animate-spin text-red-500" />}
                  </div>
                  
                  {lastAttack ? (
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold text-slate-800 tracking-tight line-clamp-1">
                        {lastAttack.attackVector}
                      </p>
                      <p className="text-[9px] text-slate-400 line-clamp-2 italic">
                        {lastAttack.description}
                      </p>
                      <div className="flex justify-between items-center pt-2">
                        <span className="text-[9px] font-mono opacity-60">PROB_SUCCESS: {(lastAttack.successProbability * 100).toFixed(0)}%</span>
                        <div className={`w-2 h-2 rounded-full ${lastAttack.successProbability > 0.4 ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                      </div>
                    </div>
                  ) : (
                    <p className="text-[9px] text-slate-400 italic">No active probes detected. Monitoring system vectors...</p>
                  )}
                </div>
              </div>

              <p className="text-[9px] text-slate-400 mt-3 italic leading-relaxed">
                Layer 4 autonomously triggers Red Team attacks to maintain entropy-resistance and verify constitutional durability.
              </p>
            </div>

            <div className="pt-8 border-t border-slate-100">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-2">
                   <Zap className="w-3 h-3 text-emerald-500" /> Auto-Enforcement
                 </span>
                 <div className="w-9 h-5 bg-emerald-500 rounded-full relative shadow-inner cursor-pointer">
                   <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md" />
                 </div>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed italic">
                Enabling Auto-Enforcement will trigger algorithmic kill-switches if Harm Function thresholds are breached during simulation.
              </p>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="mt-12 bg-indigo-600 rounded-2xl p-6 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden"
            >
              <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4" /> Ready for Global Node
                </h4>
                <p className="text-[10px] text-indigo-100 mb-6 leading-normal">
                  The protocol structure is validated against 395 constitutional articles. Distributed write is available.
                </p>
                <button className="w-full bg-white text-indigo-600 py-3 rounded-xl font-bold text-xs shadow-xl active:translate-y-1 transition-all">
                  Initialize Governance Node
                </button>
              </div>
            </motion.div>
            
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className={`w-4 h-4 ${status === 'NORMAL' ? 'text-slate-400' : 'text-red-500'}`} />
                <span className="text-[10px] font-bold text-slate-500 uppercase">System Status</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-black font-mono ${status === 'NORMAL' ? 'text-slate-900' : 'text-red-700'}`}>
                  H : {harmScore.toFixed(4)}
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    status === 'NORMAL' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-100 text-red-700 border-red-200 animate-pulse'
                }`}>
                  {status}
                </span>
              </div>
              <p className="text-[9px] text-slate-400 font-mono italic">Threshold T = 0.2500</p>
            </div>
          </div>
        </aside>
      </main>
      
      {/* Footer Bar */}
      <footer id="main-footer" className="h-10 bg-slate-900 text-slate-400 flex items-center px-6 text-[11px] font-mono shrink-0 justify-between">
        <div className="flex gap-8">
          <div className="flex items-center gap-2 text-indigo-400">
            <Database className="w-3 h-3" />
            <span>V 2.4.1-STABLE</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
            <span className="text-emerald-400 uppercase tracking-tighter font-bold">System Active</span>
          </div>
        </div>
        <div className="flex gap-8 items-center">
          <div className="flex gap-2 items-center opacity-70">
            <Globe className="w-3 h-3" />
            <span>ASIA-SE-1 // NODE_082</span>
          </div>
          <div className="text-slate-600 uppercase tracking-widest text-[9px]">
            AETERNA-CSR-INTERNAL-6000-X
          </div>
        </div>
      </footer>
    </div>
  );
}
