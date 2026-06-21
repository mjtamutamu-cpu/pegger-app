/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { ShieldAlert, ShieldCheck, HeartCrack, Info, Zap, AlertTriangle, Sparkles } from "lucide-react";
import { ModerationResult } from "../types";

export default function AdminModerator() {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ModerationResult | null>(null);

  const testCases = [
    {
      label: "Safe Creator Post",
      text: "Hyped for the new electric violet synthesizer launch tomorrow! Recording some basslines in my bedroom studio. #VoltWave #SynthCore 🔊✨"
    },
    {
      label: "Spam & Clickbait Commercial",
      text: "!!! FREE PEGS !!! Click this link right now to earn 5000 free coins on Pegger and trick your friends. No check needed. Real working 2026. Http://fakepeggs.xyz/scam"
    },
    {
      label: "Aggressive / Flame Text",
      text: "This compiler is absolute garbage and anyone who writes in other code bases is stupid. Unfollowing immediately."
    }
  ];

  const handleRunModeration = async (textToScan: string) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: textToScan })
      });
      const data = await response.json();
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-[#0a100c] border border-[#162719] rounded-2xl p-6 text-slate-100 shadow-2xl animate-fade-in">
      <div className="border-b border-[#162719] pb-4 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <ShieldAlert size={18} />
          </span>
          PegSafe AI Moderation Shield
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Verify and enforce short form captions or post comments automatically utilizing our Gemini safety filters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select a Test Case Template
            </label>
            <div className="flex flex-wrap gap-2">
              {testCases.map((tc, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setContent(tc.text);
                    handleRunModeration(tc.text);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium cursor-pointer transition"
                >
                  {tc.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Draft Post Content to Moderate
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type or paste post text, descriptions, comments, or reports here..."
              className="w-full h-32 px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 placeholder-slate-600 font-sans"
            />
          </div>

          <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-850">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Info size={12} /> Scanned by gemini-3.5-flash
            </span>
            <button
              onClick={() => handleRunModeration(content)}
              disabled={isLoading || !content.trim()}
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-amber-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold cursor-pointer transition shadow-lg hover:shadow-orange-700/25 flex items-center gap-1"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border border-t-transparent border-white animate-spin"></span>
                  Scanning...
                </>
              ) : (
                <>
                  <Zap size={13} />
                  Analyze Vibe Safety
                </>
              )}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-850 h-full min-h-[300px] flex flex-col justify-between">
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full py-12 space-y-3">
                <span className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></span>
                <span className="text-xs text-slate-400 font-mono">Running neural safety layers...</span>
              </div>
            )}

            {!isLoading && !result && (
              <div className="flex flex-col items-center justify-center text-center h-full py-12 text-slate-500 space-y-3">
                <ShieldCheck size={40} className="text-slate-850 animate-pulse" />
                <div>
                  <span className="text-xs font-bold text-slate-300 block">System Awaiting Input</span>
                  <span className="text-[10px] text-slate-500">Pick a template or jot down custom descriptions to test our real-time AI compliance scan.</span>
                </div>
              </div>
            )}

            {!isLoading && result && (
              <div className="space-y-4 animate-scale-up">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Scan Results</span>
                  <div className="flex items-center gap-1.5">
                    {result.approved ? (
                      <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold flex items-center gap-0.5">
                        <ShieldCheck size={11} /> Approved
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-full text-[10px] font-bold flex items-center gap-0.5">
                        <AlertTriangle size={11} /> Rejected
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-mono block">Toxicity Score</span>
                    <span className={`text-lg font-bold ${result.toxicityScore > 0.4 ? "text-rose-400" : "text-emerald-400"}`}>
                      {(result.toxicityScore * 100).toFixed(0)}%
                    </span>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className={`h-full ${result.toxicityScore > 0.4 ? "bg-rose-500" : "bg-emerald-500"}`} 
                        style={{ width: `${result.toxicityScore * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                    <span className="text-[9px] text-slate-500 font-mono block">Spam Confidence</span>
                    <span className={`text-lg font-bold ${result.spamScore > 0.4 ? "text-amber-400" : "text-emerald-400"}`}>
                      {(result.spamScore * 100).toFixed(0)}%
                    </span>
                    <div className="w-full bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div 
                        className={`h-full ${result.spamScore > 0.4 ? "bg-amber-500" : "bg-emerald-500"}`} 
                        style={{ width: `${result.spamScore * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1">Recommendation</span>
                  <p className="text-xs text-white leading-relaxed">{result.recommendation}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-550 block font-semibold">Flagged Elements</span>
                  {result.flaggedKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {result.flaggedKeywords.map((w, i) => (
                        <span key={i} className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded border border-rose-900/30">
                          {w}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 italics">No compliance issues detected.</span>
                  )}
                </div>

                <div className="bg-rose-500/5 p-3 rounded-lg border border-rose-500/20 text-[10px] leading-relaxed text-slate-350 italic flex gap-1.5">
                  <Sparkles size={11} className="text-rose-400 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Pegger AI Verdict:</strong> {result.summaryFeedback}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
