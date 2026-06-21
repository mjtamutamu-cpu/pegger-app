/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { VIRTUAL_GIFTS } from "../mockData";
import { TrendingUp, Award, DollarSign, Pocket, Star, Check, Sparkles, Send } from "lucide-react";

export default function CreatorDashboard({
  followersCount = 0,
  totalHearts = 0,
  videosCount = 0,
}: {
  followersCount?: number;
  totalHearts?: number;
  videosCount?: number;
}) {
  const [walletBalance, setWalletBalance] = useState(0); // Initial pegs wallet balance starts at zero for full consistency
  const [premiumActive, setPremiumActive] = useState(false);
  const [subPrice, setSubPrice] = useState("4.99");
  const [brandStatus, setBrandStatus] = useState<"pending" | "applied" | "approved" >("pending");
  const [simulatedTipAmount, setSimulatedTipAmount] = useState("");
  const [notifications, setNotifications] = useState<string[]>([]);

  // Compute dynamic stats based on video engagement
  const dStats = [
    { 
      id: "m-1", 
      label: "Views (Last 30d)", 
      value: totalHearts > 0 ? (totalHearts * 3.4).toLocaleString(undefined, { maximumFractionDigits: 0 }) : "0", 
      change: totalHearts > 0 ? "+24.5%" : "0%", 
      isPositive: totalHearts > 0, 
      description: "Total video impressions across both discovery engines." 
    },
    { 
      id: "m-2", 
      label: "Net Earnings (PEGS)", 
      value: `${walletBalance.toLocaleString()} P`, 
      change: walletBalance > 0 ? "+100%" : "0%", 
      isPositive: walletBalance > 0, 
      description: "Total creator tipping, virtual gifts received during livestream, and brand pool payout." 
    },
    { 
      id: "m-3", 
      label: "Subscriber Base", 
      value: followersCount.toLocaleString(), 
      change: followersCount > 0 ? `+${(followersCount * 12.5).toFixed(0)}%` : "0%", 
      isPositive: followersCount > 0, 
      description: "Highly active followers opting in to receive daily status notifications." 
    },
    { 
      id: "m-4", 
      label: "My Posted Videos", 
      value: videosCount.toLocaleString(), 
      change: videosCount > 0 ? "Active" : "None", 
      isPositive: videosCount > 0, 
      description: "Total number of publicized posts." 
    }
  ];

  const handleSimulateTip = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(simulatedTipAmount);
    if (isNaN(amount) || amount <= 0) return;

    setWalletBalance((prev) => prev + amount);
    setNotifications((prev) => [
      `🎉 Fan tipped you ${amount} PEGS!`,
      ...prev.slice(0, 4)
    ]);
    setSimulatedTipAmount("");
  };

  const buyDummyPegs = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
    setNotifications((prev) => [
      `💳 Purchased package: +${amount} PEGS added to your wallet pool.`,
      ...prev.slice(0, 4)
    ]);
  };

  return (
    <div className="w-full bg-[#0a100c] border border-[#162719] rounded-2xl p-6 text-slate-100 shadow-2xl space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#162719] pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <TrendingUp size={18} />
            </span>
            Studio Elite & Monetization
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track user conversion rates, configuration specifications for virtual tipping, and launch partnership pool requests.
          </p>
        </div>
        <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-3 min-w-[180px]">
          <div>
            <span className="text-[10px] text-slate-500 font-mono tracking-wider block uppercase">My Peg-Token Wallet</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1">
              ✨ {walletBalance.toLocaleString()} PEGS
            </span>
          </div>
          <button
            onClick={() => buyDummyPegs(500)}
            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-555 text-slate-950 font-bold rounded text-[10px] cursor-pointer transition"
          >
            +500
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dStats.map((metric) => (
          <div key={metric.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block">{metric.label}</span>
              <span className="text-2xl font-bold text-white mt-1 block">{metric.value}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-900 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400 flex items-center gap-0.5" title={metric.description}>
                📊 Details
              </span>
              <span className={`text-[10px] font-bold ${metric.isPositive ? "text-emerald-400" : "text-slate-400"}`}>
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid using styled SVGs for maximum reliability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-850">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Viewership Conversion Curve</span>
            <span className="text-[10px] text-emerald-400 font-mono">Last 7 Days</span>
          </div>
          <div className="w-full h-44 flex items-end justify-between relative pt-6 pb-2 px-4 bg-slate-900/40 rounded-lg">
            {/* Guide Grid Lines */}
            <div className="absolute left-0 right-0 top-1/4 border-b border-slate-850/60 font-mono text-[8px] text-slate-600 pl-2">100K views</div>
            <div className="absolute left-0 right-0 top-2/4 border-b border-slate-850/60 font-mono text-[8px] text-slate-600 pl-2">50K views</div>
            <div className="absolute left-0 right-0 top-3/4 border-b border-slate-850/60 font-mono text-[8px] text-slate-600 pl-2">10K views</div>

            {/* Custom SVG line plotting */}
            <svg className="absolute inset-0 w-full h-full p-4 pointer-events-none" viewBox="0 0 400 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradientLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Fill Area */}
              <path d="M0,100 Q60,70 120,40 T240,65 T360,20 L360,110 L0,110 Z" fill="url(#gradientLine)" />
              {/* Stroke */}
              <path d="M0,100 Q60,70 120,40 T240,65 T360,20" fill="none" stroke="#10b981" strokeWidth="2.5" />
              {/* Nodes */}
              <circle cx="120" cy="40" r="4" fill="#34d399" />
              <circle cx="360" cy="20" r="4" fill="#14b8a6" />
            </svg>

            {/* X-axis labels */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-between px-6 text-[8px] font-mono text-slate-550 pt-2">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Platform Gifting Ratios</span>
            <span className="text-[10px] text-emerald-400 font-mono">Conversion Breakdown</span>
          </div>
          <div className="grid grid-cols-2 gap-4 items-center h-full pt-4">
            <div className="flex justify-center">
              <div className="relative w-28 h-28 flex items-center justify-center">
                {/* SVG Pizza ring */}
                <svg className="w-full h-full transform -rotate-95" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#101813" strokeWidth="4" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="45 55" strokeDashoffset="100" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#14b8a6" strokeWidth="4" strokeDasharray="30 70" strokeDashoffset="55" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#34d399" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="25" />
                </svg>
                <div className="absolute text-center">
                  <span className="font-mono text-xs text-emerald-400 font-bold">In Flow</span>
                  <span className="block text-[8px] text-slate-500 font-mono">Pegs Token</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                <span className="text-slate-300">⚡ Volt Sparks (45%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-2.5 rounded bg-teal-500"></span>
                <span className="text-slate-300">🌿 Mint Leaves (30%)</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-2.5 rounded bg-emerald-300"></span>
                <span className="text-slate-300">👑 Silver Crowns (25%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monetization Integrator Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Creator Tipping config */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <DollarSign size={14} className="text-emerald-400" /> Tipping Simulator
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Test how fans can tip your account directly. Tips post straight to your in-app currency wallet.
          </p>
          <form onSubmit={handleSimulateTip} className="space-y-3">
            <div className="relative">
              <input
                type="number"
                value={simulatedTipAmount}
                onChange={(e) => setSimulatedTipAmount(e.target.value)}
                placeholder="Enter tip, eg. 100"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-850 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <span className="absolute right-3 top-2.5 text-[9px] font-bold text-emerald-400">PEGS</span>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-555 text-slate-950 font-bold rounded-lg text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1"
            >
              <Send size={12} /> Inject Simulated Tip
            </button>
          </form>
        </div>

        {/* Premium Subscription config */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Star size={14} className="text-emerald-400" /> Premium Memberships
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Configure month-by-month premium streams giving specific priority tags and unmoderated chat rights to core fans.
          </p>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-slate-900 p-2 rounded-lg border border-slate-800">
              <span className="text-[11px] font-mono text-slate-350">Price Per Month:</span>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500">$</span>
                <input
                  type="text"
                  value={subPrice}
                  onChange={(e) => setSubPrice(e.target.value)}
                  className="w-14 px-1.5 py-0.5 bg-slate-950 text-white font-mono rounded text-center border border-slate-700"
                />
              </div>
            </div>
            <button
              onClick={() => setPremiumActive(!premiumActive)}
              className={`w-full py-2 rounded-lg text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1 ${
                premiumActive 
                  ? "bg-emerald-600 text-slate-950" 
                  : "bg-slate-800 hover:bg-slate-750 text-slate-300"
              }`}
            >
              <Sparkles size={12} /> {premiumActive ? `Activated ($${subPrice}/mo)` : "Enable Subscription Tier"}
            </button>
          </div>
        </div>

        {/* Brand Network Marketplace */}
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Award size={14} className="text-emerald-400" /> Brand Marketplace
          </h3>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Apply to the global broker catalog. Enables brands to contract short promotional scripts matching your creative metrics.
          </p>
          <div className="pt-2">
            {brandStatus === "pending" && (
              <button
                onClick={() => setBrandStatus("applied")}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-550 text-slate-950 font-bold rounded-lg text-xs font-bold cursor-pointer transition"
              >
                Submit Marketplace Application
              </button>
            )}
            {brandStatus === "applied" && (
              <div className="p-3 bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 rounded-lg text-[10px] text-center font-mono">
                ⏳ Processing compliance check against safety metrics...
              </div>
            )}
          </div>
        </div>
      </div>

      {notifications.length > 0 && (
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-2">
          <span className="text-[10px] text-slate-500 block font-mono uppercase tracking-wider">Live Wallet Ledger Notifications</span>
          <div className="space-y-1">
            {notifications.map((note, nIdx) => (
              <div key={nIdx} className="text-[11px] text-slate-300 flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-850">
                <Check size={11} className="text-emerald-400" /> {note}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
