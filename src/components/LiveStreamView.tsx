/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { VIRTUAL_GIFTS } from "../mockData";
import { Gift, LiveStreamMessage } from "../types";
import { Radio, Users, Heart, Gift as GiftIcon, ShieldAlert, Sparkles, AlertCircle } from "lucide-react";

export default function LiveStreamView() {
  const [broadcastingMode, setBroadcastingMode] = useState<"broadcaster" | "audience">("audience");
  const [streamCoins, setStreamCoins] = useState(1500); // coins specifically for gifting
  const [viewerCount, setViewerCount] = useState(4820);
  const [comments, setComments] = useState<LiveStreamMessage[]>([]);
  const [isLiveOnline, setIsLiveOnline] = useState(true);
  const [likeCount, setLikeCount] = useState(12800);
  
  // Animation state triggers
  const [overlayEffect, setOverlayEffect] = useState<string | null>(null);
  const [overlayText, setOverlayText] = useState("");
  
  const commentsEndRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize stream comments
  useEffect(() => {
    setComments([
      { id: "lst-1", userName: "CyberVibe", userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100", text: "Ready for the big show! 🔮✨", timestamp: Date.now() },
      { id: "lst-2", userName: "DevWeaver", userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100", text: "Are you gonna drop the compiler source link today?", timestamp: Date.now() }
    ]);
  }, []);

  // Simulate viewer fluctuations and incoming comments
  useEffect(() => {
    if (!isLiveOnline) return;

    const interval = setInterval(() => {
      // Fluctuate viewers
      setViewerCount(prev => Math.max(100, prev + Math.floor(Math.random() * 41) - 20));

      // Inject standard comments
      const mockNames = ["AlexCode", "GlitchPeg", "SilverFox", "TechnoZen", "MainframeGod", "KoreSound"];
      const mockAvatars = [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100"
      ];
      const mockGossip = [
        "THIS SHIELD PRESET GOES CRAZY! ⚡⚡",
        "Can you trigger the Silver filter?",
        "Spamming comments with pure hearts! ♥️",
        "Just tipped an Electric Peg! Let's go!",
        "Incredible visual alignment here.",
        "Perfect compilation wave format."
      ];

      const rName = mockNames[Math.floor(Math.random() * mockNames.length)];
      const rAvatar = mockAvatars[Math.floor(Math.random() * mockAvatars.length)];
      const rText = mockGossip[Math.floor(Math.random() * mockGossip.length)];

      const freshComment: LiveStreamMessage = {
        id: `lst-${Date.now()}`,
        userName: rName,
        userAvatar: rAvatar,
        text: rText,
        timestamp: Date.now()
      };

      setComments(prev => [...prev.slice(-25), freshComment]);
    }, 3800);

    return () => clearInterval(interval);
  }, [isLiveOnline]);

  // Handle auto scroll for chat
  useEffect(() => {
    commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  // Synthesize background visual pattern on Canvas to simulate active broadcast stream loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 18, 0.15)"; // Soft trailing background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render flowing energy waves representing stream
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0, "rgba(16, 185, 129, 0.4)"); // Emerald green
      gradient.addColorStop(0.5, "rgba(20, 184, 166, 0.4)"); // Teal
      gradient.addColorStop(1, "rgba(52, 211, 153, 0.4)"); // Soft Green

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = gradient;

      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 5) {
        const y = canvas.height / 2 + Math.sin(x * 0.015 + phase) * 35 * Math.sin(phase * 0.5);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw active telemetry particles
      for (let i = 0; i < 5; i++) {
        const px = (Math.sin(phase + i) * 0.5 + 0.5) * canvas.width;
        const py = (Math.cos(phase * 0.8 + i) * 0.5 + 0.5) * canvas.height;
        ctx.fillStyle = i % 2 === 0 ? "#14b8a6" : "#52d399";
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      phase += 0.04;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [broadcastingMode]);

  // Handle tipping virtual gift
  const handleSendGift = (gift: Gift) => {
    if (streamCoins < gift.costInPegs) {
      alert("Insufficient Pegs! Buy more testing Pegs in the Creator Tools wallet tab.");
      return;
    }

    setStreamCoins(prev => prev - gift.costInPegs);

    // Trigger visual overlay sweep
    setOverlayEffect(gift.visualEffect);
    setOverlayText(`Sent a ${gift.name} ${gift.emoji}! (Spent ${gift.costInPegs} PEGS)`);

    // Play an interactive synthesizer tone to announce the gift alert!
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      const pitch = gift.costInPegs === 5 ? 440 : gift.costInPegs === 15 ? 587 : gift.costInPegs === 99 ? 880 : 1318;
      
      osc.frequency.setValueAtTime(pitch, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
      
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.log("Audio feedback synth not supported on frame browser", e);
    }

    // append gift message ticket to chat loop
    const giftMsg: LiveStreamMessage = {
      id: `lst-gift-${Date.now()}`,
      userName: "You (Broadcaster Guest)",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100",
      text: `sent ${gift.name} ${gift.emoji} !`,
      gift: {
        name: gift.name,
        emoji: gift.emoji,
        count: 1
      },
      timestamp: Date.now()
    };

    setComments(prev => [...prev, giftMsg]);

    // Clear alert sweep
    setTimeout(() => {
      setOverlayEffect(null);
      setOverlayText("");
    }, 4000);
  };

  return (
    <div className="w-full bg-[#0a100c] border border-[#162719] rounded-2xl p-6 text-slate-100 shadow-2xl space-y-6 overflow-hidden animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg animate-pulse">
              <Radio size={18} />
            </span>
            Pegger Dynamic Live Stream & Gifting Arena
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Simulate real-time messaging chat ticks, send luxury cyber gifts with matching visual explosion sweeps.
          </p>
        </div>
        <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-xl">
          <button
            onClick={() => setBroadcastingMode("audience")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              broadcastingMode === "audience" 
                ? "bg-emerald-600 text-white" 
                : "text-slate-450 hover:text-white"
            }`}
          >
            Audience Arena
          </button>
          <button
            onClick={() => setBroadcastingMode("broadcaster")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
              broadcastingMode === "broadcaster" 
                ? "bg-emerald-600 text-white" 
                : "text-slate-450 hover:text-white"
            }`}
          >
            Broadcaster Screen
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[500px]">
        {/* Stream Broadcast Visual Field */}
        <div className="lg:col-span-7 bg-slate-950 relative rounded-xl border border-slate-850 overflow-hidden flex flex-col justify-between p-4 h-full">
          {/* Active Overlay Animations for virtual gifts */}
          {overlayEffect && (
            <div className={`absolute inset-0 z-40 bg-emerald-950/25 flex flex-col items-center justify-center pointer-events-none animate-fade-in`}>
              {overlayEffect === "violet-explosion" && (
                <div className="absolute w-32 h-32 rounded-full bg-emerald-600/30 border border-emerald-500 animate-ping opacity-75"></div>
              )}
              {overlayEffect === "lightning-flash" && (
                <div className="absolute inset-0 bg-teal-400/10 border-4 border-teal-400 animate-pulse duration-100"></div>
              )}
              {overlayEffect === "silver-sparkle" && (
                <div className="absolute w-44 h-44 rounded-full border-2 border-emerald-400 border-dashed animate-spin duration-300"></div>
              )}
              {overlayEffect === "diamonds-rain" && (
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-teal-500/10 flex flex-wrap justify-around text-emerald-400 font-bold overflow-hidden">
                  {["💎", "💵", "✨", "👑"].map((emoji, eIdx) => (
                    <span key={eIdx} className="animate-bounce" style={{ animationDelay: `${eIdx * 0.2}s` }}>
                      {emoji}
                    </span>
                  ))}
                </div>
              )}
              <div className="bg-slate-900 border border-emerald-500/30 p-4 rounded-xl shadow-2xl text-center space-y-1.5 relative border-l-4 border-l-emerald-400">
                <span className="text-xs font-bold text-emerald-400 block uppercase tracking-wider">Virtual Gift Received!</span>
                <p className="text-sm font-extrabold text-white">{overlayText}</p>
              </div>
            </div>
          )}

          {/* Telemetry metadata bars */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-rose-600 text-white text-[10px] uppercase font-mono font-black tracking-widest rounded flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span> Live
              </span>
              <span className="px-2 py-0.5 bg-slate-900/80 text-[10px] text-slate-300 font-mono rounded-md flex items-center gap-1 border border-slate-800">
                <Users size={11} className="text-emerald-400" /> {viewerCount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setLikeCount(prev => prev + 10)}
                className="p-1.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-pink-400 hover:scale-110 active:scale-95 transition rounded-lg text-xs cursor-pointer flex items-center gap-1"
                title="Double tap heart generator"
              >
                <Heart size={13} className="fill-pink-400" /> {likeCount.toLocaleString()}
              </button>
            </div>
          </div>

          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover rounded-xl" width={500} height={400} />

          <div className="z-10 flex flex-col justify-end">
            <div className="bg-slate-900/70 p-3 rounded-lg border border-slate-800 backdrop-blur-sm max-w-[280px]">
              <span className="text-[10px] text-emerald-400 font-mono font-bold block">
                {broadcastingMode === "broadcaster" ? "🎮 Now Broadcasting" : "✨ Subsidized stream host: @pegger_pioneer"}
              </span>
              <p className="text-xs text-slate-200 mt-1">
                {broadcastingMode === "broadcaster"
                  ? "Transmitting live video matrix. Virtual gift tipping alert sound synthesizers are active."
                  : "Playing deep sea bioluminescent electronic trance live beats."}
              </p>
            </div>
          </div>
        </div>

        {/* Live Messages scroll and action board */}
        <div className="lg:col-span-5 h-full flex flex-col justify-between">
          <div className="bg-slate-950 rounded-xl border border-slate-850 p-4 h-[350px] overflow-hidden flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-550 uppercase tracking-widest border-b border-slate-900 pb-2 block mb-2">
              Comment Feed Stream
            </span>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 h-full scrollbar-none">
              {comments.map((c) => (
                <div key={c.id} className="text-xs flex items-start gap-2 animate-slide-up">
                  <img src={c.userAvatar} alt="" className="w-5 h-5 rounded-full object-cover mt-0.5" />
                  <div className="flex-1">
                    <span className="font-bold text-white pr-1.5">{c.userName}</span>
                    {c.gift ? (
                      <span className="px-2 py-0.5 bg-pink-950/60 text-pink-300 border border-pink-900/30 rounded text-[10px] font-bold inline-flex items-center gap-1">
                        <Sparkles size={10} className="text-yellow-400 animate-spin" />
                        {c.text}
                      </span>
                    ) : (
                      <span className="text-slate-300 font-sans">{c.text}</span>
                    )}
                  </div>
                </div>
              ))}
              <div ref={commentsEndRef} />
            </div>
          </div>

          <div className="space-y-3 pt-3">
            <div className="bg-[#0b0f0c] px-3 py-2 rounded-lg border border-[#162719] flex justify-between items-center text-xs">
              <span className="text-slate-500 font-mono">My Wallet Pool:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 border-b border-dashed border-emerald-500/25">
                ✨ {streamCoins} PEGS
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {VIRTUAL_GIFTS.map((gift) => (
                <button
                  key={gift.id}
                  onClick={() => handleSendGift(gift)}
                  className="bg-slate-950 hover:bg-[#111713] border border-slate-850 hover:border-emerald-500/40 p-2 rounded-lg text-center cursor-pointer transition active:scale-95 space-y-1 flex flex-col items-center group"
                >
                  <span className="text-xl group-hover:scale-125 transition">{gift.emoji}</span>
                  <span className="text-[9px] font-bold text-white block truncate w-full">{gift.name}</span>
                  <span className="text-[8px] font-bold text-emerald-450 block">{gift.costInPegs} PEGS</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
