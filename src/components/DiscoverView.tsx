/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Flame, Music, UserCheck, Play, Sparkles, Filter, Video, Users, BookOpen } from "lucide-react";
import { Video as VideoType } from "../types";
import { INITIAL_VIDEOS } from "../mockData";

export default function DiscoverView({ onSelectVideo, onSelectProfile }: { onSelectVideo: (v: VideoType) => void; onSelectProfile?: (handle: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<"videos" | "users" | "sounds" | "creators">("videos");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  
  // Custom smart recommendations simulation with Gemini
  const [userInterestsInput, setUserInterestsInput] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [customStreams, setCustomStreams] = useState<{ name: string; description: string; emoji: string }[]>([]);

  // Dummy Sounds Index
  const trendingSounds = [
    { title: "Z-Byte Compiler Beats", artist: "Weave Syndicate", postsCount: "42.8k", duration: "0:15" },
    { title: "Fractal Resonance (Acoustic)", artist: "Helium Trio", postsCount: "31.2k", duration: "0:30" },
    { title: "Neon Mainframe Overdrive", artist: "Aria Cybernetic", postsCount: "19.5k", duration: "1:00" },
    { title: "Abyssal Swell Ambient", artist: "The Bathysphere", postsCount: "8.4k", duration: "0:45" },
    { title: "Moss Whisper Wind", artist: "Lofi Flora", postsCount: "123.1k", duration: "0:20" }
  ];

  // Dummy Creators Index
  const famousCreators = [
    { name: "Aria Cybernetic", handle: "cyber_aria", bio: "Mainframe retro artist & sound programmer", followers: "320k", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
    { name: "Syntax Weaver", handle: "syntax_weaver", bio: "Recursive algorithms and fast compiles", followers: "190k", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
    { name: "Elena Silverwood", handle: "elena_silver", bio: "Cryogenic metallurgy & molten wave sculptor", followers: "440k", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150" },
    { name: "Deep Abyss Dancer", handle: "abyss_pulse", bio: "Submarine bioluminescent video logger", followers: "710k", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" }
  ];

  const trendingHashtags = [
    { tag: "CodeCraft", count: "124.5k posts", eco: true },
    { tag: "PeggerSports", count: "310.2k posts", eco: false },
    { tag: "SunsetMist", count: "89.4k posts", eco: true },
    { tag: "SatisfyingSilver", count: "190.1k posts", eco: false },
    { tag: "BreathFresh", count: "450k posts", eco: true },
    { tag: "LofiMainframe", count: "23k posts", eco: false }
  ];

  const categories = ["All", "Sports", "Technology", "Comedy", "Music", "Education", "Science", "Nature"];

  // Filter video list based on queries and category tabs
  const filteredVideos = INITIAL_VIDEOS.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.creatorHandle.toLowerCase().includes(q) ||
      v.tags.some(t => t.toLowerCase().includes(q));

    const matchesCategory = 
      selectedCategory === "All" ||
      v.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase()) ||
      (selectedCategory === "Technology" && (v.tags.includes("coding") || v.tags.includes("MAIN_FRAME"))) ||
      (selectedCategory === "Music" && v.tags.includes("electronic")) ||
      (selectedCategory === "Science" && v.tags.includes("fractal"));

    return matchesSearch && matchesCategory;
  });

  const handleSmartCategoryTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInterestsInput.trim()) return;
    setLoadingAI(true);

    try {
      const response = await fetch("/api/personalized-categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInterests: userInterestsInput.split(",") })
      });
      const data = await response.json();
      if (data.recommendedStreams) {
        setCustomStreams(data.recommendedStreams);
      }
    } catch {
      // Simulate beautiful fallback
      setCustomStreams([
        { name: "Pebble Moss ASMR", description: "Soft natural sound cycles recorded in green valleys.", emoji: "🌿" },
        { name: "Algorithmic Bonsai", description: "Designing code structures that model plant growth.", emoji: "💻" },
        { name: "Gravity Free Runs", description: "Clean high impact sports jumping loops with zero frame delays.", emoji: "🏃" }
      ]);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="w-full bg-[#F7FAF7] text-[#1E2A1E] space-y-6 animate-fade-in text-left max-w-4xl mx-auto p-4 sm:p-6">
      
      {/* Upper header section */}
      <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-peg-primary/10 text-peg-accent rounded-xl">
              <Flame size={20} className="fill-peg-accent/20 text-peg-accent" />
            </span>
            <div>
              <h2 className="text-lg font-black text-peg-dark tracking-tight">Discover Pegger Ecosystem</h2>
              <p className="text-xs text-slate-500">Explore trending sounds, active creators, hashtags, and trigger personalized AI algorithms.</p>
            </div>
          </div>

          {/* Interactive tabs switcher */}
          <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-150 self-start text-xs font-bold">
            {(["videos", "users", "sounds", "creators"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-3 py-1.5 rounded-lg transition-all capitalize cursor-pointer ${
                  searchType === type 
                    ? "bg-peg-primary text-[#1E2A1E] font-extrabold shadow-sm" 
                    : "text-slate-500 hover:text-peg-dark"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Unified Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search outstanding pegger ${searchType}... (Type name or keywords)`}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs text-peg-dark focus:border-peg-primary outline-none transition"
          />
          <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
          <Filter size={11} /> Filter Channels
        </span>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === cat 
                  ? "bg-peg-primary border-peg-accent text-[#1E2A1E] font-black" 
                  : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER DYNAMIC RESULTS ACCORDING TO ACTIVE TAB SEARCH */}
      
      {/* Tab 1: Videos Grid Results */}
      {searchType === "videos" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-extrabold text-peg-dark flex items-center gap-1.5">
              <Video size={14} className="text-peg-accent" /> Trending & Matching Peggers ({filteredVideos.length})
            </span>
            <span className="text-[10px] text-slate-400">Tap card to stream video</span>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="bg-white border border-slate-100 p-12 text-center rounded-3xl text-sm text-slate-400">
              No videos match your query "{searchQuery}". Try browsing "All" categories!
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
              {filteredVideos.map((video) => (
                <div 
                  key={video.id}
                  onClick={() => onSelectVideo(video)}
                  className="bg-white border border-slate-100/80 hover:border-peg-primary rounded-3xl p-3 cursor-pointer group hover:shadow-md transition-all duration-200 text-left relative flex flex-col justify-between h-[210px]"
                >
                  {/* Pseudo Video Thumbnail Block (organic gradient mockup) */}
                  <div className="w-full h-28 rounded-2xl relative overflow-hidden flex flex-col justify-between p-2"
                       style={{ background: `linear-gradient(135deg, ${video.visualColorTop}22, ${video.visualColorBottom}11)` }}>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] bg-white/95 text-peg-accent px-1.5 py-0.5 rounded-lg border font-mono">
                        {video.filterApplied}
                      </span>
                      <span className="text-[8px] bg-slate-900/40 text-white px-1.5 py-0.5 rounded-lg border border-transparent font-mono">
                        {video.speedModifier}x
                      </span>
                    </div>

                    <div className="flex items-center gap-1 bg-white/80 backdrop-blur-md px-1.5 py-0.5 rounded-lg w-max text-[8px] border">
                      <Play size={8} fill="#1E2A1E" />
                      <span className="font-mono font-bold">{(video.likesCount * 2.3).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-2">
                    <span 
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProfile?.(video.creatorHandle);
                      }}
                      className="text-[9px] text-slate-400 font-bold font-mono hover:underline cursor-pointer hover:text-peg-primary"
                    >
                      @{video.creatorHandle}
                    </span>
                    <h4 className="text-[11.5px] font-bold text-peg-dark line-clamp-1 group-hover:text-peg-accent transition">{video.title}</h4>
                    <p className="text-[9.5px] text-slate-500 line-clamp-1">{video.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Users Search results */}
      {searchType === "users" && (
        <div className="space-y-4">
          <span className="text-xs font-extrabold text-peg-dark flex items-center gap-1.5">
            <Users size={14} className="text-peg-accent" /> Creator & Audiences Indices
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {famousCreators
              .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.handle.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((u, i) => (
                <div key={i} className="bg-white border border-slate-100 p-4 rounded-3xl flex items-center justify-between gap-3 shadow-xs">
                  <div 
                    onClick={() => onSelectProfile?.(u.handle)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <img src={u.avatar} className="w-11 h-11 rounded-full object-cover border group-hover:scale-105 transition" alt="" />
                    <div>
                      <h4 className="text-xs font-extrabold text-peg-dark group-hover:underline">{u.name}</h4>
                      <span className="text-[10px] text-peg-accent font-mono group-hover:text-[#5EA66A]">@{u.handle}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{u.bio}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1.5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase font-black">{u.followers} followers</span>
                    <button 
                      onClick={() => alert(`🌱 Start following @${u.handle}!`)}
                      className="px-3 py-1 bg-peg-primary hover:bg-peg-accent text-xs font-mono font-bold rounded-lg text-peg-dark whitespace-nowrap active:scale-95 cursor-pointer transition"
                    >
                      Follow
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 3: Sounds List */}
      {searchType === "sounds" && (
        <div className="space-y-3">
          <span className="text-xs font-extrabold text-peg-dark flex items-center gap-1.5">
            <Music size={14} className="text-peg-accent" /> Trending Pegger Vocal & Audio Samples
          </span>
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs divide-y divide-slate-50">
            {trendingSounds
              .filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.artist.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((s, i) => (
                <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition duration-150">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-peg-primary/10 text-peg-accent flex items-center justify-center">
                      <Music size={12} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-peg-dark">{s.title}</h4>
                      <span className="text-[9.5px] text-slate-400">{s.artist} • {s.duration}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{s.postsCount} posts</span>
                    <button 
                      onClick={() => alert(`🎙️ Applied sound track "${s.title}" to camera Studio!`)}
                      className="px-2.5 py-1 bg-[#1E2A1E] hover:bg-[#2e402e] text-white rounded-lg text-[10px] tracking-wider transition active:scale-95 font-bold cursor-pointer"
                    >
                      Use Track
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Tab 4: Creators Catalog Grid */}
      {searchType === "creators" && (
        <div className="space-y-4">
          <span className="text-xs font-extrabold text-peg-dark flex items-center gap-1.5">
            <UserCheck size={14} className="text-peg-accent" /> Featured Verified Partners
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {famousCreators.map((c, idx) => (
              <div 
                key={idx} 
                onClick={() => onSelectProfile?.(c.handle)}
                className="bg-white border border-slate-100 text-center p-4 rounded-3xl space-y-2 flex flex-col items-center cursor-pointer hover:border-[#5EA66A] transition group"
              >
                <img src={c.avatar} className="w-14 h-14 rounded-full object-cover border-2 border-peg-accent shadow-sm group-hover:scale-105 transition" alt="" />
                <div>
                  <h4 className="text-xs font-black text-peg-dark line-clamp-1 group-hover:underline">{c.name}</h4>
                  <span className="text-[9.5px] text-slate-400 font-mono group-hover:text-peg-primary">@{c.handle}</span>
                </div>
                <div className="pt-1.5 border-t border-slate-50 w-full flex justify-between items-center text-[9px] text-slate-500">
                  <span>Verified</span>
                  <strong className="text-peg-accent">Partner</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Hashtags row layout */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl space-y-3.5">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Flame size={12} className="text-red-500 fill-red-500" /> Viral Hashtag Metrics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {trendingHashtags.map((h, hIdx) => (
            <button
              key={hIdx}
              onClick={() => {
                setSearchType("videos");
                setSearchQuery(h.tag);
              }}
              className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/65 rounded-2xl border border-slate-100 text-left transition text-xs group cursor-pointer"
            >
              <div>
                <span className="font-bold text-peg-dark group-hover:text-peg-accent">#{h.tag}</span>
                <span className="block text-[8.5px] text-slate-450 mt-0.5">{h.count}</span>
              </div>
              {h.eco && (
                <span className="text-[8px] bg-peg-primary/20 text-peg-accent py-0.5 px-1 rounded font-bold uppercase font-mono">Eco</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Intelligent AI Streams Generator card panel */}
      <div className="bg-white border border-[#a8d8a8]/25 p-5 rounded-3xl shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="text-peg-accent animate-pulse" size={16} />
          <div>
            <h3 className="text-xs font-extrabold pb-0.5 text-peg-dark uppercase">Custom AI Interests Generator</h3>
            <p className="text-[11px] text-slate-450">Describe your micro-taste elements separated by commas, and let Gemini compile sub-category tags.</p>
          </div>
        </div>

        <form onSubmit={handleSmartCategoryTrigger} className="flex gap-2 text-xs">
          <input
            type="text"
            value={userInterestsInput}
            onChange={(e) => setUserInterestsInput(e.target.value)}
            placeholder="e.g. relaxing moss, rustic compilers, bicycle flips, high energy synth"
            className="flex-1 px-3 py-2 bg-slate-55 border border-slate-150 rounded-xl text-xs text-peg-dark focus:border-peg-accent outline-none"
          />
          <button
            type="submit"
            disabled={loadingAI || !userInterestsInput.trim()}
            className="px-4 py-2 bg-peg-primary hover:bg-peg-accent disabled:bg-slate-100 disabled:text-slate-400 font-bold text-[#1E2A1E] rounded-xl text-xs flex items-center gap-1 cursor-pointer transition shadow-xs"
          >
            {loadingAI ? "Synthesizing..." : "Spawn Stream"}
          </button>
        </form>

        {customStreams.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-in pt-1">
            {customStreams.map((st, sIdx) => (
              <div key={sIdx} className="p-3 bg-[#fbfdfb] border border-peg-secondary/30 rounded-2xl space-y-1 relative text-left">
                <span className="absolute top-2 right-2 text-base">{st.emoji}</span>
                <h4 className="text-xs font-bold text-peg-dark pr-6">{st.name}</h4>
                <p className="text-[10px] text-slate-450 leading-relaxed pt-0.5">{st.description}</p>
                <div className="pt-1 text-[9px] text-peg-accent font-mono font-bold">✨ Pegger Custom Stream</div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
