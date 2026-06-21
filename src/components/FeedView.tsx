/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Video, Comment } from "../types";
import { INITIAL_COMMENTS } from "../mockData";
import { 
  Heart, MessageCircle, Share2, Bookmark, Music, Check, Plus, 
  Volume2, VolumeX, Flame, ChevronUp, ChevronDown, SlidersHorizontal, 
  Activity, AlertCircle, Eye, RefreshCw
} from "lucide-react";

export default function FeedView({ 
  videos, 
  onToggleLike, 
  onToggleSave, 
  onToggleFollow, 
  onAddCommentCount,
  commentsOverride,
  onAddCommentLocal,
  onSelectProfile
}: { 
  videos: Video[];
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onToggleFollow: (id: string) => void;
  onAddCommentCount: (id: string) => void;
  commentsOverride?: Comment[];
  onAddCommentLocal?: (c: Comment) => void;
  onSelectProfile?: (handle: string) => void;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedMode, setFeedMode] = useState<"recommended" | "following" | "nearby">("recommended");
  const [muted, setMuted] = useState(false);
  
  // Comments drawer & State
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>(INITIAL_COMMENTS);
  const [commentInput, setCommentInput] = useState("");
  
  // Repost simulation state
  const [repostingId, setRepostingId] = useState<string | null>(null);

  // Recommendation engine state specs
  const [showEngineMetrics, setShowEngineMetrics] = useState(false);

  // Double tap hearts splash state
  const [heartSpas, setHeartSpas] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });
  
  // Swipe/drag vertical states
  const touchStartY = useRef<number | null>(null);
  const mouseStartY = useRef<number | null>(null);
  const isDraggingMouse = useRef<boolean>(false);
  const lastWheelTime = useRef<number>(0);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const activeVideo = videos[currentIdx] || videos[0];

  const commentsToUse = commentsOverride || commentsList;

  // Web Audio Synth loops
  const audioCtxRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<number | null>(null);

  const cleanupSynth = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state !== "closed") {
        audioCtxRef.current.close().catch(() => {});
      }
      audioCtxRef.current = null;
    }
  };

  const resumeAudioContext = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
  };

  const initAndStartSynth = () => {
    cleanupSynth();
    if (!activeVideo) return;
    
    // Check if AudioContext is available
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;
    
    let step = 0;
    let bpm = 120;
    let notes: number[] = [];
    let waveType: OscillatorType = "triangle";
    let isCyber = false;
    let isAsmr = false;
    
    // Customize melody based on video
    if (activeVideo.id === "v-1") {
      bpm = 125;
      notes = [110.00, 110.00, 130.81, 130.81, 98.00, 98.00, 146.83, 146.83]; // A2, A2, C3, C3, G2, G2, D3, D3
      waveType = "sawtooth";
    } else if (activeVideo.id === "v-2") {
      bpm = 150;
      notes = [164.81, 196.00, 246.94, 329.63, 246.94, 196.00, 246.94, 329.63]; // E3, G3, B3, E4...
      waveType = "square";
      isCyber = true;
    } else if (activeVideo.id === "v-3") {
      bpm = 70;
      notes = [261.63, 329.63, 392.00, 493.88]; // Major 7th chord drone
      waveType = "sine";
      isAsmr = true;
    } else {
      bpm = 100;
      notes = [174.61, 220.00, 261.63, 349.23, 196.00, 246.94, 293.66, 392.00]; // Warm triangle melody
      waveType = "triangle";
    }
    
    const intervalMs = (60 / bpm) * 1000 * (isCyber ? 0.25 : 0.5); // quarter / eighth notes
    
    const triggerStep = () => {
      if (!ctx || ctx.state === "suspended") return;
      
      try {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        const currentNote = notes[step % notes.length];
        osc.type = waveType;
        osc.frequency.setValueAtTime(currentNote, ctx.currentTime);
        
        if (isAsmr) {
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 2.2);
        } else if (isCyber) {
          gainNode.gain.setValueAtTime(0.04, ctx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.18);
          
          if (step % 2 === 0) {
            const tickOsc = ctx.createOscillator();
            const tickGain = ctx.createGain();
            tickOsc.connect(tickGain);
            tickGain.connect(ctx.destination);
            tickOsc.type = "sine";
            tickOsc.frequency.setValueAtTime(10000 + Math.random() * 2000, ctx.currentTime);
            tickGain.gain.setValueAtTime(0.015, ctx.currentTime);
            tickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
            tickOsc.start(ctx.currentTime);
            tickOsc.stop(ctx.currentTime + 0.05);
          }
        } else {
          gainNode.gain.setValueAtTime(0, ctx.currentTime);
          gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
          gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.5);
          
          if (step % 4 === 0) {
            const kickOsc = ctx.createOscillator();
            const kickGain = ctx.createGain();
            kickOsc.connect(kickGain);
            kickGain.connect(ctx.destination);
            kickOsc.frequency.setValueAtTime(150, ctx.currentTime);
            kickOsc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);
            kickGain.gain.setValueAtTime(0.18, ctx.currentTime);
            kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
            kickOsc.start(ctx.currentTime);
            kickOsc.stop(ctx.currentTime + 0.18);
          }
        }
        
        step++;
      } catch (e) {
        // Safe fail
      }
    };
    
    synthIntervalRef.current = window.setInterval(triggerStep, intervalMs);
  };

  useEffect(() => {
    if (muted || commentsOpen) {
      cleanupSynth();
      return;
    }
    
    initAndStartSynth();
    
    return () => {
      cleanupSynth();
    };
  }, [currentIdx, muted, commentsOpen]);

  useEffect(() => {
    if (currentIdx >= videos.length) {
      setCurrentIdx(0);
    }
  }, [videos, currentIdx]);

  // Handle local swipe/page cycling
  const handleNextVideo = () => {
    if (videos.length === 0) return;
    if (currentIdx < videos.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setCurrentIdx(0); // Infinite loop
    }
    setCommentsOpen(false);
  };

  const handlePrevVideo = () => {
    if (videos.length === 0) return;
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
    } else {
      setCurrentIdx(videos.length - 1);
    }
    setCommentsOpen(false);
  };

  // Wheel tracking (vertical scroll mouse wheel) with basic throttle
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastWheelTime.current < 800) return; // limit frequency
    if (Math.abs(e.deltaY) > 20) {
      lastWheelTime.current = now;
      if (e.deltaY > 0) {
        handleNextVideo();
      } else {
        handlePrevVideo();
      }
    }
  };

  // Touch triggers
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY.current === null) return;
    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;
    touchStartY.current = null;

    if (Math.abs(diff) > 50) { // threshold of 50px
      if (diff > 0) {
        handleNextVideo();
      } else {
        handlePrevVideo();
      }
    }
  };

  // Mouse drag simulation (vertical scroll drag on viewport)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseStartY.current = e.clientY;
    isDraggingMouse.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingMouse.current || mouseStartY.current === null) return;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingMouse.current || mouseStartY.current === null) return;
    const mouseEndY = e.clientY;
    const diff = mouseStartY.current - mouseEndY;
    
    isDraggingMouse.current = false;
    mouseStartY.current = null;

    if (Math.abs(diff) > 50) { // threshold of 50px
      if (diff > 0) {
        handleNextVideo();
      } else {
        handlePrevVideo();
      }
    }
  };

  const handleMouseLeave = () => {
    isDraggingMouse.current = false;
    mouseStartY.current = null;
  };

  // Double tap hearts easter egg
  let lastTap = 0;
  const handleViewportTap = (e: React.MouseEvent<HTMLDivElement>) => {
    resumeAudioContext();
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      if (activeVideo && !activeVideo.isLiked) {
        onToggleLike(activeVideo.id);
      }
      
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      setHeartSpas({ x: clickX, y: clickY, show: true });
      setTimeout(() => setHeartSpas(prev => ({ ...prev, show: false })), 900);
    }
    lastTap = now;
  };

  // Submit comment
  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeVideo) return;

    const freshComment: Comment = {
      id: `c-added-${Date.now()}`,
      videoId: activeVideo.id,
      userName: "Alex Stark",
      userHandle: "alex_stark",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      text: commentInput,
      timestamp: "Just now",
      likesCount: 0,
      hasLiked: false
    };

    if (onAddCommentLocal) {
      onAddCommentLocal(freshComment);
    } else {
      setCommentsList(prev => [freshComment, ...prev]);
    }
    setCommentInput("");
    onAddCommentCount(activeVideo.id);
  };

  const handleRepostVideo = (id: string) => {
    setRepostingId(id);
    setTimeout(() => {
      setRepostingId(null);
      alert("🔁 Video successfully reposted to your Pegger profile!");
    }, 1000);
  };

  // filter comments specifically for active video
  const activeComments = activeVideo ? commentsToUse.filter(c => c.videoId === activeVideo.id) : [];

  // Canvas-based organic background: soft green waves, floating flower petals or leaf particles.
  useEffect(() => {
    if (!canvasRef.current || !activeVideo) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        canvas.width = entry.contentRect.width || 380;
        canvas.height = entry.contentRect.height || 600;
      }
    });

    if (canvasContainerRef.current) {
      resizeObserver.observe(canvasContainerRef.current);
    }

    canvas.width = canvasContainerRef.current?.clientWidth || 380;
    canvas.height = canvasContainerRef.current?.clientHeight || 600;

    // Generate soft organic particles (floating seed / clover petals)
    const petalsCount = 18;
    const petals: { x: number; y: number; r: number; d: number; speedX: number; speedY: number; rotation: number; rotSpeed: number }[] = [];
    for (let i = 0; i < petalsCount; i++) {
      petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 4 + Math.random() * 8, // size
        d: Math.random() * petalsCount,
        speedX: -1 + Math.random() * 2,
        speedY: (0.8 + Math.random() * 1.5) * activeVideo.speedModifier,
        rotation: Math.random() * Math.PI,
        rotSpeed: -0.02 + Math.random() * 0.04
      });
    }

    const draw = () => {
      // Clean welcoming background base
      // Custom soft cream and natural greens
      ctx.fillStyle = "#F7FAF7";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create organic layered backdrop curves (mimics fluid terrain layout)
      ctx.fillStyle = "rgba(123, 196, 127, 0.08)"; // 7BC47F with alpha
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.5);
      ctx.bezierCurveTo(
        canvas.width * 0.25, canvas.height * (0.45 + Math.sin(tick * 0.005) * 0.05),
        canvas.width * 0.75, canvas.height * (0.55 + Math.cos(tick * 0.007) * 0.05),
        canvas.width, canvas.height * 0.5
      );
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Secondary soft layer
      ctx.fillStyle = "rgba(168, 216, 168, 0.12)"; // A8D8A8 with alpha
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.7);
      ctx.bezierCurveTo(
        canvas.width * 0.3, canvas.height * (0.75 + Math.cos(tick * 0.004) * 0.04),
        canvas.width * 0.7, canvas.height * (0.65 + Math.sin(tick * 0.006) * 0.04),
        canvas.width, canvas.height * 0.72
      );
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Draw floating clover particles
      ctx.fillStyle = "#7BC47F";
      ctx.strokeStyle = "#5EA66A";
      ctx.lineWidth = 1;

      petals.forEach(p => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // draw cute heart-shape leaf or clover seed
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.r, -p.r, -p.r * 1.5, p.r / 3, 0, p.r * 1.3);
        ctx.bezierCurveTo(p.r * 1.5, p.r / 3, p.r, -p.r, 0, 0);
        ctx.closePath();
        ctx.fillStyle = "rgba(94, 166, 106, 0.4)"; // Accent teal emerald alpha
        ctx.fill();
        ctx.stroke();

        ctx.restore();

        // Update particle
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(tick * 0.02 + p.d) * 0.4;
        p.rotation += p.rotSpeed;

        if (p.y > canvas.height) {
          p.y = -15;
          p.x = Math.random() * canvas.width;
        }
      });

      // Filter Overlays (welcoming, non-cyberpunk)
      if (activeVideo.filterApplied === "Forest Dew") {
        ctx.fillStyle = "rgba(94, 166, 106, 0.08)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (activeVideo.filterApplied === "Sunset Mist") {
        const sunsetGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        sunsetGrad.addColorStop(0, "rgba(251, 191, 36, 0.06)"); // Amber
        sunsetGrad.addColorStop(1, "rgba(239, 68, 68, 0.05)"); // Red
        ctx.fillStyle = sunsetGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (activeVideo.filterApplied === "Emerald Glass") {
        ctx.fillStyle = "rgba(123, 196, 127, 0.12)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Add a clean, vignette border shadow
      const vigGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, canvas.width / 3,
        canvas.width / 2, canvas.height / 2, canvas.height / 1.1
      );
      vigGrad.addColorStop(0, "rgba(30, 42, 30, 0)");
      vigGrad.addColorStop(1, "rgba(30, 42, 30, 0.25)"); // Dark Text Color soft transparent
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      tick += 1.0;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, [activeVideo]);

  if (!activeVideo) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-peg-dark h-96">
        <AlertCircle className="text-peg-accent animate-pulse mb-3" size={32} />
        <h3 className="font-bold text-base">Feed is currently vacant</h3>
        <p className="text-xs text-slate-500 max-w-xs mt-1">Compose a draft and hit compile to peg some content here!</p>
      </div>
    );
  }

  // Simulated AI Recommendation Match score
  const matchingScore = activeVideo.tags.some(tag => tag.toLowerCase().includes("tech") || tag.toLowerCase().includes("code")) ? 98 : 84;

  return (
    <div className="w-full flex flex-col items-center justify-center py-4 bg-[#F7FAF7] text-[#1E2A1E] relative min-h-[660px]">
      
      {/* Outer desktop arrows */}
      <div className="hidden lg:flex flex-col gap-3 absolute left-6 top-1/2 -translate-y-1/2 z-10">
        <button 
          onClick={handlePrevVideo}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-full cursor-pointer transition text-peg-dark active:scale-95 flex items-center justify-center shadow-md shadow-slate-200/50"
          title="Previous Video"
        >
          <ChevronUp size={20} />
        </button>
        <div className="text-center bg-white border border-slate-100 py-1.5 px-3 rounded-2xl shadow-sm text-xs font-mono font-bold text-peg-dark">
          {currentIdx + 1} / {videos.length}
        </div>
        <button 
          onClick={handleNextVideo}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-full cursor-pointer transition text-peg-dark active:scale-95 flex items-center justify-center shadow-md shadow-slate-200/50"
          title="Next Video"
        >
          <ChevronDown size={20} />
        </button>
      </div>

      {/* Primary Vertical Short Video Phone Viewport Frame */}
      <div 
        ref={canvasContainerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="w-full max-w-[400px] h-[640px] rounded-[36px] overflow-hidden relative shadow-2xl border-4 border-slate-900 bg-slate-950 flex flex-col justify-between select-none"
      >
        {/* Organic motion simulator canvas background */}
        {activeVideo.uploadedUrl ? (
          activeVideo.mediaType === "video" ? (
            <video
              src={activeVideo.uploadedUrl}
              autoPlay
              loop
              muted={muted}
              playsInline
              className={`absolute inset-0 w-full h-full object-cover z-0 ${
                activeVideo.filterApplied === "Forest Dew" ? "grayscale opacity-85 contrast-125 saturate-50" :
                activeVideo.filterApplied === "Sunset Glow" ? "brightness-110 saturate-150 contrast-115 hue-rotate-15" :
                activeVideo.filterApplied === "Jade Glass" ? "saturate-110 contrast-105 hue-rotate-60" :
                activeVideo.filterApplied === "Cyberpunk Glitch" ? "hue-rotate-180 brightness-105 contrast-125" : ""
              }`}
            />
          ) : (
            <img
              src={activeVideo.uploadedUrl}
              alt="Uploaded file"
              className={`absolute inset-0 w-full h-full object-cover z-0 ${
                activeVideo.filterApplied === "Forest Dew" ? "grayscale opacity-85 contrast-125 saturate-50" :
                activeVideo.filterApplied === "Sunset Glow" ? "brightness-110 saturate-150 contrast-115 hue-rotate-15" :
                activeVideo.filterApplied === "Jade Glass" ? "saturate-110 contrast-105 hue-rotate-60" :
                activeVideo.filterApplied === "Cyberpunk Glitch" ? "hue-rotate-180 brightness-105 contrast-125" : ""
              }`}
              referrerPolicy="no-referrer"
            />
          )
        ) : (
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />
        )}
 
        {/* Double-tap splash heart */}
        {heartSpas.show && (
          <span 
            className="absolute z-40 text-[#7BC47F] text-7xl pointer-events-none drop-shadow-md scale-up-fade"
            style={{ left: `${heartSpas.x - 36}px`, top: `${heartSpas.y - 36}px` }}
          >
            💚
          </span>
        )}
 
        {/* Feed Headers: Recommended, Following, Nearby */}
        <div className="z-10 w-full pt-6 px-6 flex justify-between items-center bg-gradient-to-b from-black/90 via-black/40 to-transparent pb-8">
          <div className="flex gap-4 items-center mx-auto text-[11.5px] font-extrabold uppercase tracking-widest text-white">
            <button 
              onClick={() => setFeedMode("recommended")}
              className={`pb-1 px-1 cursor-pointer transition-all duration-200 relative ${
                feedMode === "recommended" ? "text-white font-extrabold border-b-2 border-peg-accent" : "text-white/60 hover:text-white"
              }`}
            >
              Recommended
            </button>
            <button 
              onClick={() => setFeedMode("following")}
              className={`pb-1 px-1 cursor-pointer transition-all duration-200 relative ${
                feedMode === "following" ? "text-white font-extrabold border-b-2 border-peg-accent" : "text-white/60 hover:text-white"
              }`}
            >
              Following
            </button>
            <button 
              onClick={() => setFeedMode("nearby")}
              className={`pb-1 px-1 cursor-pointer transition-all duration-200 relative ${
                feedMode === "nearby" ? "text-white font-extrabold border-b-2 border-peg-accent" : "text-white/60 hover:text-white"
              }`}
            >
              Nearby
            </button>
          </div>
        </div>
 
        {/* Double-tap catchment overlay zone */}
        <div 
          onClick={handleViewportTap} 
          className="absolute inset-0 z-5 cursor-pointer max-h-[480px]" 
        />
 
        {/* Dynamic recommendation system indicator tag right at the viewport top left */}
        <div className="absolute left-4 top-16 z-20">
          <button 
            onClick={() => setShowEngineMetrics(!showEngineMetrics)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-black/40 backdrop-blur-md rounded-2xl text-[9px] font-bold text-white shadow-lg border border-white/10 hover:bg-black/60 active:scale-95 transition"
          >
            <Activity size={10} className="text-peg-primary animate-pulse" />
            <span>AI: Match {matchingScore}%</span>
          </button>
        </div>
 
        {/* Mute controller top right */}
        <div className="absolute right-4 top-16 z-20">
          <button 
            onClick={() => {
              const nextMuted = !muted;
              setMuted(nextMuted);
              if (!nextMuted) {
                setTimeout(resumeAudioContext, 50);
              }
            }}
            className="p-1.5 bg-black/40 backdrop-blur-md rounded-full shadow-lg text-white border border-white/10 cursor-pointer active:scale-90 transition hover:bg-black/60"
          >
            {muted ? <VolumeX size={12} className="text-rose-400" /> : <Volume2 size={12} className="text-peg-primary" />}
          </button>
        </div>
 
        {/* Video feed action sidebar */}
        <div className="absolute right-3 bottom-20 z-10 flex flex-col items-center gap-4 text-center">
          
          {/* Creator with Follow toggle */}
          <div className="relative mb-1">
            <div 
              onClick={() => onSelectProfile?.(activeVideo.creatorHandle)}
              className="p-0.5 bg-gradient-to-tr from-peg-primary to-emerald-400 rounded-full shadow-lg cursor-pointer hover:scale-105 transition"
              title={`View ${activeVideo.creatorName}'s profile`}
            >
              <img 
                src={activeVideo.creatorAvatar} 
                alt="" 
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full object-cover border border-slate-900" 
              />
            </div>
            <button 
              onClick={() => onToggleFollow(activeVideo.id)}
              className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center border border-slate-950 font-extrabold text-[11px] shadow-lg transition-all duration-200 cursor-pointer ${
                activeVideo.isFollowing 
                  ? "bg-slate-800 text-slate-400 scale-90" 
                  : "bg-peg-primary hover:bg-peg-accent text-slate-950 animate-bounce"
              }`}
            >
              {activeVideo.isFollowing ? <Check size={10} className="text-white" /> : "+"}
            </button>
          </div>
 
          {/* Like */}
          <div>
            <button 
              onClick={() => onToggleLike(activeVideo.id)}
              className={`p-2.5 bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 rounded-full shadow-lg active:scale-90 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                activeVideo.isLiked ? "text-rose-500 bg-rose-500/10 border-rose-500/30" : "text-white hover:text-rose-400"
              }`}
            >
              <Heart size={17} className={activeVideo.isLiked ? "fill-rose-500 text-rose-500" : ""} />
            </button>
            <span className="text-[10px] font-extrabold text-white block mt-0.5 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {activeVideo.likesCount.toLocaleString()}
            </span>
          </div>
 
          {/* Comments */}
          <div>
            <button 
              onClick={() => setCommentsOpen(true)}
              className="p-2.5 bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 rounded-full shadow-lg hover:text-peg-primary cursor-pointer transition-all duration-200 flex items-center justify-center text-white"
            >
              <MessageCircle size={17} />
            </button>
            <span className="text-[10px] font-extrabold text-white block mt-0.5 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {activeComments.length || activeVideo.commentsCount}
            </span>
          </div>
 
          {/* Save bookmark */}
          <div>
            <button 
              onClick={() => onToggleSave(activeVideo.id)}
              className={`p-2.5 bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 rounded-full shadow-lg active:scale-90 cursor-pointer transition-all duration-200 flex items-center justify-center ${
                activeVideo.isSaved ? "text-amber-400 bg-amber-400/10 border-amber-400/30" : "text-white hover:text-amber-400"
              }`}
            >
              <Bookmark size={17} className={activeVideo.isSaved ? "fill-amber-400 text-amber-400" : ""} />
            </button>
            <span className="text-[10px] font-extrabold text-white block mt-0.5 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {activeVideo.savesCount.toLocaleString()}
            </span>
          </div>
 
          {/* Repost (Simulate post reference overlay) */}
          <div>
            <button 
              onClick={() => handleRepostVideo(activeVideo.id)}
              className="p-2.5 bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 rounded-full shadow-lg cursor-pointer transition-all duration-200 flex items-center justify-center text-white"
              title="Repost Video"
            >
              <RefreshCw size={15} className={`text-white ${repostingId === activeVideo.id ? "animate-spin text-peg-primary" : ""}`} />
            </button>
            <span className="text-[10px] font-extrabold text-white block mt-0.5 font-mono drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {activeVideo.repostsCount.toLocaleString()}
            </span>
          </div>
 
          {/* Share */}
          <div>
            <button 
              onClick={() => {
                const link = `${window.location.origin}/video/${activeVideo.id}`;
                navigator.clipboard.writeText(link).catch(() => {});
                alert(`📤 Share Link Copied to clipboard!`);
              }}
              className="p-2.5 bg-black/40 backdrop-blur-sm border border-white/10 hover:bg-black/60 rounded-full shadow-lg text-white hover:text-peg-primary cursor-pointer transition-all duration-200 flex items-center justify-center"
            >
              <Share2 size={17} />
            </button>
            <span className="text-[10.5px] font-extrabold text-white block mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              Share
            </span>
          </div>
 
          {/* Rotating vinyl disk simulator in matching branding */}
          <div 
            style={{ animationPlayState: !muted && !commentsOpen ? "running" : "paused" }}
            className="relative w-8 h-8 rounded-full bg-slate-950 border border-zinc-805 flex items-center justify-center animate-spin mt-1 shadow-lg"
          >
            <div className="absolute inset-1 border border-zinc-900 rounded-full"></div>
            <div className="w-2.5 h-2.5 bg-peg-primary rounded-full z-10 border border-slate-950"></div>
          </div>
        </div>
 
        {/* Video metadata captions area overlay */}
        <div className="z-10 bg-gradient-to-t from-black/95 via-black/40 to-transparent p-5 pb-5 space-y-2 mt-auto text-left text-white">
          
          {/* Tag & View count */}
          <div className="flex justify-between items-center text-[10.5px] font-mono text-neutral-300">
            <span className="flex items-center gap-1 font-extrabold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              <Eye size={12} className="text-peg-primary" />
              {(activeVideo.likesCount * 3.4).toLocaleString(undefined, {maximumFractionDigits: 0})} views
            </span>
            <span className="bg-emerald-500/10 text-[9px] text-peg-primary px-1.5 py-0.5 rounded font-extrabold uppercase border border-emerald-500/20">
              {activeVideo.filterApplied}
            </span>
          </div>
 
          <div className="flex items-center gap-1.5 animate-fade-in">
            <span 
              onClick={() => onSelectProfile?.(activeVideo.creatorHandle)}
              className="text-[13.5px] font-black text-white hover:underline cursor-pointer hover:text-peg-primary transition"
              title={`View ${activeVideo.creatorHandle} profile`}
            >
              @{activeVideo.creatorHandle}
            </span>
            {activeVideo.id === "v-1" && (
              <span className="px-1.5 py-0.5 bg-peg-primary/20 text-peg-primary font-mono font-extrabold text-[8px] rounded uppercase border border-peg-primary/30">Admin Verified</span>
            )}
          </div>
          
          <p className="text-[11.5px] text-neutral-200 leading-relaxed max-w-[280px] line-clamp-3 font-sans font-medium drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
            <strong className="text-peg-primary">{activeVideo.title}</strong> — {activeVideo.description}
          </p>
 
          <div className="flex flex-wrap gap-1.5">
            {activeVideo.tags.map((tag, tIdx) => (
              <span key={tIdx} className="text-[9.5px] bg-white/10 hover:bg-white/15 text-white font-extrabold px-1.5 py-0.5 rounded-lg border border-white/5 cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
 
          {/* Ticker Music */}
          <div className="flex items-center justify-between gap-1.5 text-[10.5px] text-white/80 pt-2 border-t border-white/10">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Music size={11} className="text-peg-primary flex-shrink-0 animate-pulse" />
              <marquee scrollamount="2.5" className="truncate overflow-hidden max-w-[170px] whitespace-nowrap text-[10px] font-bold font-mono text-neutral-300">
                {activeVideo.musicName} — {activeVideo.musicArtist}
              </marquee>
            </div>
            
            {/* Equalizer Pulsing Equalizer Visualizer */}
            <div className="flex items-end gap-[1.5px] h-2.5 px-1 bg-white/5 rounded border border-white/10">
              <span className={`w-[2px] bg-peg-primary rounded-full transition-all duration-300 ${!muted && !commentsOpen ? "h-2.5 animate-pulse" : "h-1"}`} style={{ animationDuration: "0.45s" }}></span>
              <span className={`w-[2px] bg-peg-primary rounded-full transition-all duration-300 ${!muted && !commentsOpen ? "h-1.5 animate-pulse" : "h-1"}`} style={{ animationDuration: "0.25s" }}></span>
              <span className={`w-[2px] bg-peg-primary rounded-full transition-all duration-300 ${!muted && !commentsOpen ? "h-2 animate-pulse" : "h-1"}`} style={{ animationDuration: "0.35s" }}></span>
              <span className={`w-[2px] bg-peg-primary rounded-full transition-all duration-300 ${!muted && !commentsOpen ? "h-1.5 pb-[2px] animate-pulse" : "h-1"}`} style={{ animationDuration: "0.5s" }}></span>
            </div>
          </div>
        </div>
 
        {/* Recommendation Engine Details modal block */}
        {showEngineMetrics && (
          <div className="absolute inset-x-4 top-28 z-30 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-4 space-y-2.5 animate-scale-up text-left text-xs text-white">
            <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
              <span className="font-extrabold text-[10px] text-peg-primary uppercase tracking-wider flex items-center gap-1">
                <Activity size={12} /> Recommendation Engine Feed Signal
              </span>
              <button onClick={() => setShowEngineMetrics(false)} className="text-[10px] font-mono text-neutral-400 font-bold hover:text-white">Hide</button>
            </div>
            <div className="space-y-1.5 text-[10px] font-mono">
              <div className="flex justify-between">
                <span className="text-neutral-400">Retrieval Category Match:</span>
                <span className="font-bold">Tech / General ({matchingScore}%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Global Heat Rating:</span>
                <span className="font-bold text-peg-primary">HIGH IMPACT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Creator Retention Score:</span>
                <span className="font-bold text-peg-primary">0.96 / 1.0</span>
              </div>
              <p className="text-[9.5px] text-neutral-400 leading-relaxed border-t border-white/5 pt-1.5 font-sans">
                💡 <strong>Pegger AI Vector explanation:</strong> This video was ranked in your Recommended feed pool because its visual descriptors match {matchingScore}% of your personalization profile settings.
              </p>
            </div>
          </div>
        )}

        {/* Fully Interactive comments Drawer */}
        {commentsOpen && (
          <div className="absolute inset-x-0 bottom-0 z-35 bg-white border-t border-slate-100 rounded-t-[32px] h-[380px] p-4 flex flex-col justify-between animate-slide-up text-left shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2">
              <span className="text-xs font-bold text-peg-dark uppercase tracking-wider flex items-center gap-1">
                💬 Comments ({activeComments.length})
              </span>
              <button 
                onClick={() => setCommentsOpen(false)}
                className="text-xs text-slate-500 hover:text-peg-dark cursor-pointer font-bold font-mono py-0.5 px-2.5 bg-slate-50 border border-slate-100 rounded-lg"
              >
                Done
              </button>
            </div>

            {/* Scrollable comments lists */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 scrollbar-none">
              {activeComments.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No comments yet. Write a friendly tip! 🌱✨
                </div>
              ) : (
                activeComments.map((comment) => (
                  <div key={comment.id} className="text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100/80 flex items-start gap-2 animate-fade-in text-[#1E2A1E]">
                    <img 
                      src={comment.userAvatar} 
                      className="w-6 h-6 rounded-full object-cover mt-0.5 border cursor-pointer hover:opacity-85" 
                      alt="" 
                      onClick={() => {
                        setCommentsOpen(false);
                        onSelectProfile?.(comment.userHandle);
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <span 
                          onClick={() => {
                            setCommentsOpen(false);
                            onSelectProfile?.(comment.userHandle);
                          }}
                          className="font-bold text-peg-dark truncate hover:underline cursor-pointer hover:text-peg-primary"
                        >
                          @{comment.userHandle}
                        </span>
                        <span className="text-[8px] font-mono text-slate-400">{comment.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5 leading-relaxed font-sans">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Comment formulate input */}
            <form onSubmit={handlePostComment} className="flex gap-2 border-t border-slate-100 pt-3 mt-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Share a warm response..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs text-peg-dark focus:outline-none focus:ring-1 focus:ring-peg-accent placeholder-slate-400"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="px-4 py-1.5 bg-peg-primary hover:bg-peg-accent disabled:bg-slate-100 disabled:text-slate-400 text-[#1E2A1E] font-bold rounded-xl text-xs transition duration-200 flex items-center justify-center cursor-pointer"
              >
                Send
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
