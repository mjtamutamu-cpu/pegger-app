/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TECHNICAL_ARCHITECTURE } from "../mockData";
import { Database, Network, Key, Layers, Rocket, CheckCircle, Clock, Copy } from "lucide-react";

export default function ArchitectureHub() {
  const [activeSubTab, setActiveSubTab] = useState<"db" | "api" | "infra" | "roadmap">("db");
  const [copied, setCopied] = useState(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-[#F7FAF7] text-[#1E2A1E] space-y-6 animate-fade-in text-left">
      
      {/* Header section */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-peg-primary/10 text-peg-accent rounded-xl">
              <Layers size={18} />
            </span>
            <div>
              <h2 className="text-base font-black text-peg-dark tracking-tight">Pegger Global System Blueprint</h2>
              <p className="text-[11px] text-slate-500">Production-ready database SQL tables, GraphQL endpoints, HLS transcoding strategy, and launch roadmaps.</p>
            </div>
          </div>

          {/* Sub tabs selector */}
          <div className="flex bg-slate-50 p-1 rounded-xl border self-start max-w-full overflow-x-auto text-[10px] font-bold">
            <button
              onClick={() => setActiveSubTab("db")}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === "db" ? "bg-[#1E2A1E] text-white" : "text-slate-500 hover:text-peg-dark"
              }`}
            >
              Database SQL
            </button>
            <button
              onClick={() => setActiveSubTab("api")}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === "api" ? "bg-[#1E2A1E] text-white" : "text-slate-500 hover:text-peg-dark"
              }`}
            >
              API Schemas
            </button>
            <button
              onClick={() => setActiveSubTab("infra")}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === "infra" ? "bg-[#1E2A1E] text-white" : "text-slate-500 hover:text-peg-dark"
              }`}
            >
              Cloud Infra
            </button>
            <button
              onClick={() => setActiveSubTab("roadmap")}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeSubTab === "roadmap" ? "bg-[#1E2A1E] text-white" : "text-slate-500 hover:text-peg-dark"
              }`}
            >
              Roadmap
            </button>
          </div>
        </div>

        {/* ACTIVE SUB TAB CONTENT */}
        <div className="min-h-[280px]">
          {activeSubTab === "db" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border text-[11px]">
                <span className="font-mono text-slate-500">Target: PostgreSQL & Cloud Spanner</span>
                <button
                  onClick={() => handleCopy(TECHNICAL_ARCHITECTURE.databaseSchema)}
                  className="px-2.5 py-1 bg-[#1E2A1E] hover:bg-[#2e402e] rounded-lg text-[10px] font-bold text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={11} /> {copied ? "Copied!" : "Copy SQL Code"}
                </button>
              </div>
              <pre className="p-4 bg-slate-905 bg-slate-900 text-white rounded-2xl overflow-x-auto text-[10.5px] font-mono leading-relaxed border max-h-[360px]">
                {TECHNICAL_ARCHITECTURE.databaseSchema.trim()}
              </pre>
            </div>
          )}

          {activeSubTab === "api" && (
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border text-[11px]">
                <span className="font-mono text-slate-500">Dual Grid: HTTP REST & GraphQL Mesh</span>
                <button
                  onClick={() => handleCopy(TECHNICAL_ARCHITECTURE.apiStructure)}
                  className="px-2.5 py-1 bg-[#1E2A1E] hover:bg-[#2e402e] rounded-lg text-[10px] font-bold text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={11} /> {copied ? "Copied!" : "Copy Specifications"}
                </button>
              </div>
              <pre className="p-4 bg-slate-900 text-[#A8D8A8] rounded-2xl overflow-x-auto text-[10.5px] font-mono leading-relaxed border max-h-[360px]">
                {TECHNICAL_ARCHITECTURE.apiStructure.trim()}
              </pre>
            </div>
          )}

          {activeSubTab === "infra" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border text-[11px]">
                <span className="font-mono text-slate-500">Global Cloud Run + Edge FFmpeg Transcoders (HLS chunks)</span>
                <button
                  onClick={() => handleCopy(TECHNICAL_ARCHITECTURE.infrastructureStrategy)}
                  className="px-2.5 py-1 bg-[#1E2A1E] hover:bg-[#2e402e] rounded-lg text-[10px] font-bold text-white transition flex items-center gap-1 cursor-pointer"
                >
                  <Copy size={11} /> {copied ? "Copied!" : "Copy Strategy"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-xs">
                  <h4 className="font-extrabold text-[11px] text-[#5EA66A] flex items-center gap-1 uppercase">
                    📡 Direct Uplink
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Secure GCS bucket pre-signed links allow users to upload recorded raw video chunks directly, bypass intermediary relays.
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-xs">
                  <h4 className="font-extrabold text-[11px] text-[#5EA66A] flex items-center gap-1 uppercase">
                    🎛️ FFmpeg Adaptive
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Triggers instant transcoder containers splitting videos into 480p, 720p, and 1080p stream bandwidth structures (.m3u8).
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-xs">
                  <h4 className="font-extrabold text-[11px] text-[#5EA66A] flex items-center gap-1 uppercase">
                    ⚡ Edge Mesh HLS
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                    Delivered with zero visual latency to the global mobile feed pool regardless of local bandwidth throttles.
                  </p>
                </div>
              </div>

              <pre className="p-4 bg-slate-900 text-white rounded-2xl overflow-x-auto text-[10.5px] font-mono leading-relaxed border max-h-[220px]">
                {TECHNICAL_ARCHITECTURE.infrastructureStrategy.trim()}
              </pre>
            </div>
          )}

          {activeSubTab === "roadmap" && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {TECHNICAL_ARCHITECTURE.roadmaps.map((r, rIdx) => (
                  <div key={rIdx} className="bg-white border border-slate-100 p-4 rounded-3xl shadow-xs relative space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-mono font-bold border uppercase tracking-wider ${
                          r.status === "Completed" 
                            ? "bg-emerald-50 border-emerald-250 text-peg-accent" 
                            : r.status === "Current"
                            ? "bg-amber-50 border-amber-200 text-amber-500 animate-pulse font-extrabold"
                            : "bg-slate-50 border-slate-200 text-slate-400"
                        }`}>
                          {r.status}
                        </span>
                        <h4 className="font-extrabold text-peg-dark text-[11.5px] mt-2 leading-none">{r.phase}</h4>
                        <span className="text-[9px] text-slate-400 block mt-0.5 flex items-center gap-0.5"><Clock size={10} /> {r.dateRange}</span>
                      </div>

                      {r.status === "Completed" && (
                        <span className="text-[#5EA66A] text-lg">✓</span>
                      )}
                    </div>
                    <div className="bg-slate-50/50 p-2.5 rounded-xl border border-transparent text-[10px] space-y-1 text-slate-500 leading-normal font-sans">
                      <span className="font-extrabold text-peg-accent text-[9.5px] block mb-0.5 uppercase tracking-wide">Key Deliverables:</span>
                      {r.deliverables.map((d, dIdx) => (
                        <div key={dIdx} className="flex gap-1 items-start">
                          <span className="text-peg-primary select-none font-bold">•</span>
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
