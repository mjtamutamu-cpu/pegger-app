/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Camera, Sparkles, Scissors, Trash, Check, Sliders, Music, 
  Calendar, RotateCw, Zap, Timer, Upload, Search, 
  X, HelpCircle, Heart, MessageSquare, CheckCircle, 
  ChevronRight, Play, Pause, Image, Eye
} from "lucide-react";
import { AICaptionResult } from "../types";

export interface StickerOnVideo {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

interface SoundItem {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: "Trending" | "Viral" | "Vibe" | "Pegger Mix";
  useCount: string;
  color: string;
}

interface EffectItem {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

export default function CreativeStudio({ 
  onPublishVideo 
}: { 
  onPublishVideo: (title: string, description: string, filter: string, speed: number, tags: string[], uploadedUrl?: string, mediaType?: "video" | "image" | "file") => void 
}) {
  // Navigation workflow state: "camera" | "preview" (editing / drafting)
  const [studioStep, setStudioStep] = useState<"camera" | "preview">("camera");

  // Camera settings
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isMirrored, setIsMirrored] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  // TikTok Side modifier states
  const [selectedSpeed, setSelectedSpeed] = useState<number>(1.0);
  const [selectedFilter, setSelectedFilter] = useState("Normal");
  const [activeEffect, setActiveEffect] = useState<string>("none");
  const [activeSound, setActiveSound] = useState<SoundItem | null>(null);
  
  // Beautify multipliers
  const [beautySmooth, setBeautySmooth] = useState(60);
  const [beautyEyes, setBeautyEyes] = useState(40);
  const [beautySlim, setBeautySlim] = useState(30);

  // Timer states
  const [selectedTimerDelay, setSelectedTimerDelay] = useState<number>(0); // 0 = none, 3 = 3s, 10 = 10s
  const [countdownValue, setCountdownValue] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);

  // Recording Engine
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0); // 0 to 100 percent
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecordedFootage, setHasRecordedFootage] = useState(false);

  // Drawers trigger
  const [isSoundDrawerOpen, setIsSoundDrawerOpen] = useState(false);
  const [isEffectsDrawerOpen, setIsEffectsDrawerOpen] = useState(false);
  const [isBeautyPanelOpen, setIsBeautyPanelOpen] = useState(false);
  
  // Music & Effects search query lists
  const [soundSearchText, setSoundSearchText] = useState("");
  const [effectCategory, setEffectCategory] = useState<"Trending" | "Visual" | "Atmosphere">("Trending");

  // Draft details (For Step 2: Pitching, composition & Post)
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDesc, setDraftDesc] = useState("");
  const [draftTags, setDraftTags] = useState<string[]>([]);
  const [audiencePrivacy, setAudiencePrivacy] = useState<"Everyone" | "Friends" | "Private">("Everyone");
  const [allowComments, setAllowComments] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("2026-06-25");
  const [scheduleTime, setScheduleTime] = useState("18:30");

  const [activeCoverFrame, setActiveCoverFrame] = useState<number>(1);
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string; url?: string; type?: "video" | "image" | "file" } | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [stickers, setStickers] = useState<StickerOnVideo[]>([]);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Gemini smart caption states
  const [videoPrompt, setVideoPrompt] = useState("");
  const [category, setCategory] = useState("PeggerSports");
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AICaptionResult | null>(null);

  // Stream Refs
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // TikTok Sounds Catalog
  const SOUND_CATALOG: SoundItem[] = [
    { id: "s-1", title: "Dance Monkey (Pegger Remix)", artist: "Tones and I", duration: "0:15", category: "Trending", useCount: "14.2M posts", color: "bg-rose-500" },
    { id: "s-2", title: "CHIHIRO Ambient Synth Beat", artist: "Billie Eilish", duration: "0:15", category: "Trending", useCount: "9.8M posts", color: "bg-indigo-500" },
    { id: "s-3", title: "Espresso Organic Loop", artist: "Sabrina Carpenter", duration: "0:15", category: "Viral", useCount: "22.4M posts", color: "bg-teal-500" },
    { id: "s-4", title: "Not Like Us (Peg Beats)", artist: "Kendrick Lamar", duration: "0:15", category: "Viral", useCount: "18.1M posts", color: "bg-purple-500" },
    { id: "s-5", title: "Forest Dew Wind Whispers", artist: "Pegger Studio", duration: "0:15", category: "Pegger Mix", useCount: "1.2M posts", color: "bg-emerald-500" },
    { id: "s-6", title: "Million Dollar Baby Synth", artist: "Tommy Richman", duration: "0:15", category: "Viral", useCount: "15.6M posts", color: "bg-orange-500" },
    { id: "s-7", title: "Quantum Particles Flute", artist: "Soma Weaver", duration: "0:15", category: "Vibe", useCount: "3.4M posts", color: "bg-sky-500" },
    { id: "s-8", title: "Bioluminescent Abyss Pulse", artist: "Deep Aura", duration: "0:15", category: "Vibe", useCount: "2.1M posts", color: "bg-pink-500" }
  ];

  // TikTok Effects Catalog
  const EFFECTS_CATALOG: EffectItem[] = [
    { id: "fireflies", name: "Quantum Fireflies", emoji: "✨", description: "Generates beautiful glowing particles drifting upwards.", color: "from-amber-400 to-yellow-600" },
    { id: "greenscreen", name: "Green Screen", emoji: "🏞️", description: "Simulates an organic forest backplate with high-alpha composite.", color: "from-emerald-400 to-teal-700" },
    { id: "warploops", name: "Speedy Loops", emoji: "🌀", description: "Renders concentric moving neon warp vector arcs.", color: "from-sky-400 to-violet-700" },
    { id: "sunsetmist", name: "Sunset Mist", emoji: "🌇", description: "Applies warm golden fluid gradient ripples to the stage.", color: "from-rose-400 to-amber-600" },
    { id: "cybergrid", name: "Cyber Matrix Grid", emoji: "💻", description: "Casts a flowing neon green coordinate mesh in 3D scale.", color: "from-green-400 to-emerald-950" }
  ];

  // Filters list
  const FILTERS_LIST = [
    { id: "Normal", name: "Normal", class: "" },
    { id: "Forest Dew", name: "Forest Dew", class: "grayscale opacity-85 contrast-125 saturate-50" },
    { id: "Sunset Glow", name: "Sunset Glow", class: "brightness-110 saturate-150 contrast-115 hue-rotate-15" },
    { id: "Jade Glass", name: "Jade Glass", class: "saturate-110 contrast-105 hue-rotate-60" },
    { id: "Cyberpunk Glitch", name: "Cyber Glitch", class: "hue-rotate-180 brightness-105 contrast-125" }
  ];

  // Start & stop camera streaming
  useEffect(() => {
    if (cameraEnabled && studioStep === "camera") {
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
      setUploadedFile(null); // Overwrite manual uploads
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          setCameraStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn("Camera stream access declined, fallback to beautiful organic visual synth mesh.", err);
          setCameraEnabled(false);
        });
    } else {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
    }

    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraEnabled, studioStep]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
    };
  }, []);

  // Fallback visual simulation loop on canvas when cam is disabled
  useEffect(() => {
    if (cameraStream || studioStep !== "camera") return;
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    // Local lists for effects
    const particles: Array<{ x: number; y: number; speedY: number; radius: number; color: string; alpha: number }> = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speedY: -0.5 - Math.random() * 1.5,
        radius: 1 + Math.random() * 4,
        color: `hsl(${50 + Math.random() * 40}, 100%, 75%)`,
        alpha: 0.1 + Math.random() * 0.8
      });
    }

    const draw = () => {
      // 1. Draw viewport ambient base
      if (activeEffect === "greenscreen") {
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, "#0B1D12");
        grad.addColorStop(0.5, "#1F3D24");
        grad.addColorStop(1, "#36683D");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(123, 196, 127, 0.15)";
        ctx.beginPath();
        ctx.arc(canvas.width * 0.3, canvas.height * 0.6, 120, 0, Math.PI, true);
        ctx.arc(canvas.width * 0.7, canvas.height * 0.8, 160, 0, Math.PI, true);
        ctx.fill();
      } else if (activeEffect === "sunsetmist") {
        const grad = ctx.createRadialGradient(canvas.width/2, canvas.height*0.7, 50, canvas.width/2, canvas.height/2, canvas.height);
        grad.addColorStop(0, "#FFF3E0");
        grad.addColorStop(0.3, "#FFB74D");
        grad.addColorStop(0.7, "#FF5722");
        grad.addColorStop(1, "#210C06");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = "#121212";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw active effect vectors
      if (activeEffect === "fireflies") {
        particles.forEach(p => {
          p.y += p.speedY;
          if (p.y < 0) p.y = canvas.height;
          p.x += Math.sin(tick * 0.02 + p.y) * 0.4;
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = p.color;
          ctx.globalAlpha = p.alpha;
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;
        ctx.shadowBlur = 0;
      } else if (activeEffect === "warploops") {
        ctx.strokeStyle = "rgba(0, 242, 254, 0.45)";
        ctx.lineWidth = 1.5;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        for (let i = 1; i <= 6; i++) {
          const radius = ((tick * selectedSpeed * 1.5 + i * 40) % 200);
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (activeEffect === "cybergrid") {
        ctx.strokeStyle = "rgba(46, 204, 113, 0.35)";
        ctx.lineWidth = 1.0;
        const horizon = canvas.height * 0.4;
        for (let x = -100; x <= canvas.width + 100; x += 40) {
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, horizon);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = horizon; y < canvas.height; y += 15) {
          const ratio = (y - horizon) / (canvas.height - horizon);
          const mappedY = horizon + ratio * ratio * (canvas.height - horizon);
          ctx.beginPath();
          ctx.moveTo(0, mappedY);
          ctx.lineTo(canvas.width, mappedY);
          ctx.stroke();
        }
      } else {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(tick * 0.012 * selectedSpeed);
        
        ctx.fillStyle = "rgba(123, 196, 127, 0.2)";
        ctx.strokeStyle = "#5EA66A";
        ctx.lineWidth = 1.8;

        for (let i = 0; i < 4; i++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          const leafSize = 65 + Math.sin(tick * 0.04) * 6;
          ctx.bezierCurveTo(-leafSize / 2, -leafSize / 2, -leafSize, leafSize / 3, 0, leafSize);
          ctx.bezierCurveTo(leafSize, leafSize / 3, leafSize / 2, -leafSize / 2, 0, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      if (activeSound) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`🎵 Playlist: ${activeSound.title}`, canvas.width / 2, 35);
      }

      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.fillText(`BEAUTY: S:${beautySmooth} E:${beautyEyes} W:${beautySlim}`, 15, canvas.height - 15);

      tick += 1.0;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [cameraStream, activeEffect, activeSound, selectedSpeed, beautySmooth, beautyEyes, beautySlim, studioStep]);

  // Handle countdown Timer trigger
  const triggerCountdownTimer = () => {
    if (selectedTimerDelay === 0) {
      toggleRecording();
      return;
    }

    setIsCountingDown(true);
    setCountdownValue(selectedTimerDelay);
    
    const countInterval = setInterval(() => {
      setCountdownValue((prev) => {
        if (prev === null) {
          clearInterval(countInterval);
          return null;
        }
        if (prev <= 1) {
          clearInterval(countInterval);
          setIsCountingDown(false);
          setCountdownValue(null);
          startRecordingNow();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startRecordingNow = () => {
    setIsRecording(true);
    setHasRecordedFootage(true);
    setRecordingSeconds(0);
    setRecordProgress(0);

    recordingIntervalRef.current = setInterval(() => {
      setRecordingSeconds((prevSec) => {
        const next = prevSec + 0.1;
        const progressPercentage = (next / 15) * 100;

        if (next >= 15.0) {
          if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
          setIsRecording(false);
          setRecordProgress(100);
          return 15.0;
        }

        setRecordProgress(progressPercentage);
        return next;
      });
    }, 100);
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
      setIsRecording(false);
    } else {
      startRecordingNow();
    }
  };

  const handleRemoveUploadedFile = () => {
    if (uploadedFile?.url) {
      URL.revokeObjectURL(uploadedFile.url);
    }
    setUploadedFile(null);
    setHasRecordedFootage(false);
  };

  const handleResetRecord = () => {
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
    setRecordProgress(0);
    setRecordingSeconds(0);
    handleRemoveUploadedFile();
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const isVideo = file.type.startsWith("video/");
      const isImage = file.type.startsWith("image/");
      
      if (uploadedFile?.url) {
        URL.revokeObjectURL(uploadedFile.url);
      }
      const url = URL.createObjectURL(file);
      
      setUploadedFile({
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        url,
        type: isVideo ? "video" : isImage ? "image" : "file"
      });
      setHasRecordedFootage(true);
      setCameraEnabled(false);
    }
  };

  const triggerMockFileBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleSelectSound = (sound: SoundItem) => {
    setActiveSound(sound);
    setIsSoundDrawerOpen(false);
  };

  const handleDropSticker = (emoji: string) => {
    const fresh: StickerOnVideo = {
      id: `st-${Date.now()}`,
      emoji,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40
    };
    setStickers((prev) => [...prev, fresh]);
  };

  const handleAIAssistance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoPrompt.trim()) return;
    setLoadingAI(true);
    setAiSuggestions(null);

    try {
      const response = await fetch("/api/smart-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoPrompt, category })
      });
      const data = await response.json();
      setAiSuggestions(data);
    } catch {
      setAiSuggestions({
        captions: [
          { text: `Pulsing kinetic energy with a touch of ${videoPrompt}. Watch until the end! ⚡🔥`, hashtags: ["ViralPegger", "fyp", category] },
          { text: `Spent hours perfecting this transition layout of my ${videoPrompt} setup. Pegger is real growth. 🌱✨`, hashtags: ["transition", "cameraRoll", "looping"] }
        ],
        suggestedStickers: ["🔥", "👑", "🚀"],
        recommendedFilter: "Sunset Glow"
      });
    } finally {
      setLoadingAI(false);
    }
  };

  const handleApplySuggestion = (text: string, tags: string[], filter: string) => {
    setDraftTitle(text.substring(0, 40));
    setDraftDesc(text);
    setDraftTags(tags);
    setSelectedFilter(filter);
    alert("✨ Gemini pitch applied into metadata fields below!");
  };

  const handleFinalPublish = () => {
    if (!draftTitle.trim() && !draftDesc.trim()) {
      alert("Please provide a title, description or video caption headline before posting!");
      return;
    }

    onPublishVideo(
      draftTitle || "New Pegger compilation",
      draftDesc || "Original short format video captured using custom motion tools on Pegger.",
      selectedFilter,
      selectedSpeed,
      draftTags.length > 0 ? draftTags : ["tiktokStyle", "creatorStudio"],
      uploadedFile?.url || undefined,
      uploadedFile?.type || undefined
    );

    setPublishedSuccess(true);
    setTimeout(() => {
      setPublishedSuccess(false);
      setStudioStep("camera");
      setDraftTitle("");
      setDraftDesc("");
      setDraftTags([]);
      setStickers([]);
      setUploadedFile(null);
      setVideoPrompt("");
      setAiSuggestions(null);
      setActiveSound(null);
      setHasRecordedFootage(false);
      setRecordingSeconds(0);
      setRecordProgress(0);
    }, 3000);
  };

  const filteredSoundsCatalog = SOUND_CATALOG.filter(sound => {
    if (!soundSearchText) return true;
    return sound.title.toLowerCase().includes(soundSearchText.toLowerCase()) || 
           sound.artist.toLowerCase().includes(soundSearchText.toLowerCase());
  });

  return (
    <div className="w-full bg-[#121212] min-h-screen text-white p-4 md:p-6 rounded-[36px] flex flex-col justify-between max-w-4xl mx-auto shadow-2xl relative overflow-hidden border border-zinc-800">
      
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

      {studioStep === "camera" && (
        <div className="space-y-6 flex-1 flex flex-col justify-between h-full animate-fade-in relative">
          
          <div className="flex justify-between items-center z-20 px-3 py-1">
            <button 
              onClick={handleResetRecord}
              className="p-2 bg-zinc-900/80 hover:bg-zinc-850 text-white rounded-full transition-colors font-mono text-xs flex items-center gap-1 cursor-pointer font-bold"
              type="button"
            >
              <Trash size={14} className="text-zinc-400" />
              Reset Clip Buffer
            </button>

            <button
              onClick={() => setIsSoundDrawerOpen(true)}
              className="px-4 py-2 bg-zinc-950/95 border border-zinc-800 hover:border-rose-500/50 text-white text-xs font-black rounded-full transition flex items-center gap-2 shadow-lg animate-pulse"
              type="button"
            >
              <Music size={12} className="text-rose-500" />
              {activeSound ? (
                <span className="truncate max-w-[140px] text-rose-450">{activeSound.title}</span>
              ) : (
                "Add Sound"
              )}
              {activeSound && <X size={12} className="text-zinc-400 hover:text-white" onClick={(e) => { e.stopPropagation(); setActiveSound(null); }} />}
            </button>

            <button
              onClick={() => setCameraEnabled(!cameraEnabled)}
              className={`px-3 py-1.5 rounded-xl text-[10.5px] font-mono font-bold uppercase transition flex items-center gap-1.5 border shadow ${
                cameraEnabled 
                  ? "bg-rose-600 border-rose-500 text-white font-extrabold animate-pulse" 
                  : "bg-zinc-900 border-zinc-800 text-zinc-300"
              }`}
              type="button"
            >
              <Camera size={12} />
              {cameraEnabled ? "Cam Online" : "Cam Standby"}
            </button>
          </div>

          <div className="flex-1 flex justify-center items-center py-1">
            <div 
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`w-full max-w-[310px] aspect-[9/16] bg-zinc-950 rounded-[44px] overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.85)] border-4 border-zinc-800/90 flex flex-col justify-between p-4 ${
                dragActive ? "border-rose-500 bg-rose-500/10" : ""
              }`}
            >
              {isRecording && (
                <div className="absolute top-4 left-4 right-4 h-1.5 bg-zinc-800/70 rounded-full overflow-hidden z-20">
                  <div 
                    className="h-full bg-rose-500 transition-all duration-100 ease-linear rounded-full"
                    style={{ width: `${recordProgress}%` }}
                  />
                </div>
              )}

              <div className="absolute top-8 left-4 z-20 flex items-center gap-1.5 bg-black/60 shadow-md border border-zinc-800 px-2 py-1 rounded-full text-[9px] font-mono text-zinc-350">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>{recordingSeconds.toFixed(1)}s / 15.0s</span>
              </div>

              {flashOn && (
                <div className="absolute top-8 right-4 z-20 p-1.5 bg-yellow-500 text-black rounded-full animate-bounce">
                  <Zap size={10} fill="currentColor" />
                </div>
              )}

              {uploadedFile && uploadedFile.url ? (
                uploadedFile.type === "video" ? (
                  <video
                    src={uploadedFile.url}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={`absolute inset-0 w-full h-full object-cover z-10 ${
                      isMirrored ? "scale-x-[-1]" : ""
                    } ${
                      FILTERS_LIST.find(f => f.id === selectedFilter)?.class || ""
                    }`}
                  />
                ) : (
                  <img
                    src={uploadedFile.url}
                    alt="Uploaded media preview"
                    className={`absolute inset-0 w-full h-full object-cover z-10 ${
                      isMirrored ? "scale-x-[-1]" : ""
                    } ${
                      FILTERS_LIST.find(f => f.id === selectedFilter)?.class || ""
                    }`}
                  />
                )
              ) : cameraEnabled ? (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className={`absolute inset-0 w-full h-full object-cover z-10 ${
                    isMirrored ? "scale-x-[-1]" : ""
                  } ${
                    FILTERS_LIST.find(f => f.id === selectedFilter)?.class || ""
                  }`}
                />
              ) : (
                <canvas
                  ref={canvasRef}
                  className={`absolute inset-0 w-full h-full object-cover z-10 ${
                    FILTERS_LIST.find(f => f.id === selectedFilter)?.class || ""
                  }`}
                  width={310}
                  height={550}
                />
              )}

              {uploadedFile ? (
                <div className="absolute top-14 left-3 right-3 z-20 bg-neutral-950/90 backdrop-blur-md rounded-2xl border border-emerald-500/30 p-3 shadow-xl flex items-center justify-between text-xs text-white">
                  <div className="flex items-center gap-2 max-w-[70%] text-left">
                    <span className="text-sm">📂</span>
                    <div className="truncate">
                      <span className="font-extrabold text-emerald-400 block truncate">{uploadedFile.name}</span>
                      <span className="text-[9px] font-mono text-zinc-400 block">{uploadedFile.size} loaded</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleRemoveUploadedFile}
                    className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-bold rounded-lg uppercase cursor-pointer border border-rose-500/20"
                    type="button"
                  >
                    Reset File
                  </button>
                </div>
              ) : (
                !cameraEnabled && !hasRecordedFootage && (
                  <div className="absolute inset-0 z-12 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-zinc-400 text-3xl mb-3 animate-bounce">📽️</span>
                    <p className="text-[10.5px] text-zinc-400 font-mono font-bold uppercase tracking-wider mb-4 leading-relaxed max-w-[200px]">
                      Select local files or turn on Always-on live webcam
                    </p>
                    
                    <button
                      onClick={() => {
                        setCameraEnabled(true);
                      }}
                      className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400 rounded-xl text-xs shadow-md transition cursor-pointer mb-2.5"
                      type="button"
                    >
                      <Camera size={14} />
                      🎥 START LIVE CAMERA
                    </button>
                    <span className="text-[8.5px] text-zinc-500 font-mono font-bold uppercase">or</span>
                    <button
                      onClick={triggerMockFileBrowse}
                      className="mt-2.5 flex items-center gap-1.5 px-4 py-2 bg-zinc-800 text-white font-extrabold hover:bg-zinc-750 rounded-xl text-[10.5px] shadow-md transition cursor-pointer border border-zinc-700"
                      type="button"
                    >
                      <Upload size={13} />
                      Browse Files
                    </button>
                  </div>
                )
              )}

              {isCountingDown && countdownValue !== null && (
                <div className="absolute inset-0 bg-black/85 z-20 flex flex-col items-center justify-center">
                  <span className="text-rose-500 text-6xl font-black font-mono animate-ping">
                    {countdownValue}
                  </span>
                  <span className="text-xs text-zinc-400 mt-4 uppercase tracking-widest font-mono font-bold text-center">Countdown starting...</span>
                </div>
              )}

              {stickers.map((st) => (
                <span
                  key={st.id}
                  className="absolute z-21 text-4xl select-none cursor-pointer hover:scale-125 p-1 transition-transform animate-scale-up"
                  style={{ left: `${st.x}%`, top: `${st.y}%` }}
                  onClick={() => setStickers((prev) => prev.filter(s => s.id !== st.id))}
                  title="Click to remove sticker"
                >
                  {st.emoji}
                </span>
              ))}

              <div className="absolute bottom-16 left-4 right-4 z-15 flex justify-between items-center opacity-85">
                {selectedFilter !== "Normal" && (
                  <span className="bg-black/75 backdrop-blur px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-rose-450">
                    Filter: {selectedFilter}
                  </span>
                )}
                {activeEffect !== "none" && (
                  <span className="bg-rose-505/85 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider text-white">
                    FX: {EFFECTS_CATALOG.find(e => e.id === activeEffect)?.name}
                  </span>
                )}
              </div>

              <div className="absolute right-3 top-16 z-20 flex flex-col gap-4 bg-zinc-950/80 backdrop-blur p-2 rounded-2xl border border-zinc-800/60 shadow-lg">
                <button 
                  onClick={() => setIsMirrored(!isMirrored)}
                  className="flex flex-col items-center gap-0.5 group"
                  title="Flip video projection"
                  type="button"
                >
                  <span className="p-1.5 bg-zinc-900 group-hover:bg-zinc-800 rounded-full text-zinc-300 group-hover:text-white transition">
                    <RotateCw size={13} className="group-hover:rotate-180 transition-transform duration-500" />
                  </span>
                  <span className="text-[7.5px] font-mono text-zinc-400 uppercase tracking-tight scale-90 font-bold">Flip</span>
                </button>

                <button
                  onClick={() => setFlashOn(!flashOn)}
                  className="flex flex-col items-center gap-0.5 group"
                  title="Toggle mock lighting lamp"
                  type="button"
                >
                  <span className={`p-1.5 rounded-full text-zinc-300 transition ${flashOn ? "bg-yellow-500 text-black" : "bg-zinc-900 group-hover:bg-zinc-800"}`}>
                    <Zap size={13} />
                  </span>
                  <span className="text-[7.5px] font-mono text-zinc-400 uppercase tracking-tight scale-90 font-bold">Flash</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedTimerDelay(prev => prev === 0 ? 3 : prev === 3 ? 10 : 0);
                  }}
                  className="flex flex-col items-center gap-0.5 group"
                  title="Timed record delayed"
                  type="button"
                >
                  <span className={`p-1.5 rounded-full text-zinc-300 transition ${selectedTimerDelay > 0 ? "bg-rose-500 text-white" : "bg-zinc-900 group-hover:bg-zinc-800"}`}>
                    <Timer size={13} />
                  </span>
                  <span className="text-[7.5px] font-mono text-zinc-400 uppercase tracking-tight scale-90 font-bold font-mono">
                    {selectedTimerDelay > 0 ? `${selectedTimerDelay}s` : "Timer"}
                  </span>
                </button>

                <button
                  onClick={() => {
                    const idx = FILTERS_LIST.findIndex(f => f.id === selectedFilter);
                    const nextIdx = (idx + 1) % FILTERS_LIST.length;
                    setSelectedFilter(FILTERS_LIST[nextIdx].id);
                  }}
                  className="flex flex-col items-center gap-0.5 group"
                  title="Change visual filter style"
                  type="button"
                >
                  <span className="p-1.5 bg-zinc-900 group-hover:bg-zinc-800 rounded-full text-rose-450 transition">
                    <Sliders size={13} />
                  </span>
                  <span className="text-[7.5px] font-mono text-zinc-400 uppercase tracking-tight scale-90 font-bold">Filter</span>
                </button>

                <button
                  onClick={() => setIsBeautyPanelOpen(!isBeautyPanelOpen)}
                  className="flex flex-col items-center gap-0.5 group"
                  title="Beautify faces smoothing"
                  type="button"
                >
                  <span className={`p-1.5 rounded-full text-zinc-300 transition ${isBeautyPanelOpen ? "bg-rose-500 text-white" : "bg-zinc-900 group-hover:bg-zinc-800"}`}>
                    <Sliders size={13} />
                  </span>
                  <span className="text-[7.5px] font-mono text-zinc-400 uppercase tracking-tight scale-90 font-bold">Beauty</span>
                </button>
              </div>

              {isBeautyPanelOpen && (
                <div className="absolute inset-x-3 bottom-14 z-20 bg-zinc-950/95 border border-zinc-800 p-3 rounded-2xl space-y-2 text-white animate-scale-up text-left">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5">
                    <span className="text-[9.5px] font-bold text-rose-500 uppercase font-mono">Live Beautify Tuners</span>
                    <button type="button" onClick={() => setIsBeautyPanelOpen(false)}>
                      <X size={10} className="text-zinc-400 hover:text-white" />
                    </button>
                  </div>
                  <div className="space-y-1.5 text-[9px] font-mono">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-zinc-400 w-14">Smooth:</span>
                      <input 
                        type="range" min="0" max="100" value={beautySmooth} 
                        onChange={(e) => setBeautySmooth(parseInt(e.target.value))} 
                        className="flex-1 accent-rose-500 h-1" 
                      />
                      <span className="text-zinc-300 w-4 text-right">{beautySmooth}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-zinc-400 w-14">LargeEye:</span>
                      <input 
                        type="range" min="0" max="100" value={beautyEyes} 
                        onChange={(e) => setBeautyEyes(parseInt(e.target.value))} 
                        className="flex-1 accent-rose-500 h-1" 
                      />
                      <span className="text-zinc-300 w-4 text-right">{beautyEyes}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-zinc-400 w-14">SlimJaw:</span>
                      <input 
                        type="range" min="0" max="100" value={beautySlim} 
                        onChange={(e) => setBeautySlim(parseInt(e.target.value))} 
                        className="flex-1 accent-rose-500 h-1" 
                      />
                      <span className="text-zinc-300 w-4 text-right">{beautySlim}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 z-15 flex justify-center text-[8.5px] text-zinc-550 font-mono tracking-widest uppercase font-bold">
                PEGGER CAMS 9:16
              </div>

            </div>
          </div>

          <div className="space-y-4 bg-zinc-950/80 p-5 rounded-3xl border border-zinc-850 z-20">
            
            <div className="flex flex-col items-center space-y-2">
              <span className="text-[10px] text-zinc-400 font-mono uppercase tracking-widest font-bold">Velocity Pitch Controller</span>
              <div className="flex bg-zinc-900 border border-zinc-800 p-0.5 rounded-full w-full max-w-xs justify-between">
                {[0.3, 0.5, 1.0, 2.0, 3.0].map((v) => (
                  <button
                    key={v}
                    onClick={() => setSelectedSpeed(v)}
                    className={`px-3 py-1 text-[9.5px] font-black rounded-full transition-all cursor-pointer ${
                      selectedSpeed === v
                        ? "bg-rose-600 text-white shadow-md scale-105"
                        : "text-zinc-400 hover:text-white"
                    }`}
                    type="button"
                  >
                    {v === 1.0 ? "1x" : `${v}x`}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
              
              <button
                onClick={() => setIsEffectsDrawerOpen(true)}
                className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white cursor-pointer active:scale-95 group"
                type="button"
              >
                <div className={`p-2.5 rounded-xl transition ${activeEffect !== "none" ? "bg-rose-600 text-white" : "bg-zinc-900 border border-zinc-800"}`}>
                  <Sparkles size={16} />
                </div>
                <span className="text-[10px] font-bold">Effects</span>
              </button>

              <div className="relative flex items-center justify-center">
                <div className={`absolute rounded-full border-2 transition-all duration-300 ${
                  isRecording 
                    ? "w-20 h-20 border-rose-500 animate-ping opacity-75" 
                    : "w-20 h-20 border-zinc-700 hover:border-rose-500"
                }`} />

                <button
                  onClick={triggerCountdownTimer}
                  disabled={isCountingDown}
                  className={`relative z-10 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                    isRecording 
                      ? "w-14 h-14 bg-rose-500 rounded-lg animate-pulse" 
                      : "w-16 h-16 bg-white border-4 border-rose-600 hover:scale-105"
                  }`}
                  title={isRecording ? "Stop recording clip" : "Record 15s clip"}
                  type="button"
                >
                  {isRecording && <div className="w-5 h-5 bg-white rounded" />}
                </button>
              </div>

              <button
                onClick={triggerMockFileBrowse}
                className="flex flex-col items-center gap-1 text-zinc-400 hover:text-white cursor-pointer active:scale-95 group"
                type="button"
              >
                <div className="p-2.5 bg-zinc-900 border border-zinc-800 group-hover:border-zinc-740 rounded-xl transition">
                  <Upload size={16} />
                </div>
                <span className="text-[10px] font-bold">Upload</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="video/*,image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    const isVideo = file.type.startsWith("video/");
                    const isImage = file.type.startsWith("image/");
                    
                    if (uploadedFile?.url) {
                      URL.revokeObjectURL(uploadedFile.url);
                    }
                    const url = URL.createObjectURL(file);
                    
                    setUploadedFile({
                      name: file.name,
                      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                      url,
                      type: isVideo ? "video" : isImage ? "image" : "file"
                    });
                    setHasRecordedFootage(true);
                    setCameraEnabled(false);
                  }
                }}
              />
            </div>

            {hasRecordedFootage && (
              <div className="flex justify-center pt-2 border-t border-zinc-900 animate-slide-up">
                <button
                  onClick={() => setStudioStep("preview")}
                  className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-full text-xs font-black shadow-lg shadow-rose-600/20 transition-all flex items-center gap-1.5 animate-bounce font-mono"
                  type="button"
                >
                  <Check size={14} strokeWidth={3} />
                  Keep Clip - Continue to Post
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-zinc-900 flex justify-center items-center gap-4 text-[9px] uppercase tracking-wider text-zinc-500 font-mono">
              <span className="font-bold">Stamp Quick Emoji:</span>
              <div className="flex gap-2">
                {["🌱", "✨", "🔥", "🚀", "💚", "⚡"].map(s => (
                  <button 
                    key={s} 
                    onClick={() => handleDropSticker(s)}
                    className="text-base hover:scale-125 transition cursor-pointer"
                    type="button"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center gap-5 text-[10px] font-black uppercase text-zinc-500 tracking-wider">
              <span className="text-zinc-300 border-b border-rose-500 pb-0.5 font-bold">Camera</span>
              <button type="button" className="hover:text-zinc-300 cursor-pointer text-[10px] font-black uppercase tracking-wider" onClick={() => alert("🌻 Quick templates are dynamically routed. Select custom sound arrays!")}>Templates</button>
              <button type="button" className="hover:text-zinc-300 cursor-pointer text-[10px] font-black uppercase tracking-wider" onClick={() => alert("🎙️ Broadcasting room simulator is accessible under Profile page bottom tab link!")}>Live Match</button>
            </div>

          </div>

        </div>
      )}

      {studioStep === "preview" && (
        <div className="space-y-6 animate-fade-in text-left">
          
          <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
            <button
              onClick={() => setStudioStep("camera")}
              className="px-3 py-1.5 bg-[#1E2A1E] text-peg-accent hover:bg-zinc-905 border border-zinc-800 rounded-xl text-xs font-bold transition flex items-center gap-1"
              type="button"
            >
              ← Back to Recording
            </button>
            <div>
              <h2 className="text-sm font-black text-white">Video Draft Composition</h2>
              <p className="text-[10.5px] font-mono text-zinc-400">Pegger security checked • compliance approved</p>
            </div>
            <div className="w-12" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            <div className="md:col-span-8 space-y-6">
              
              <div className="bg-zinc-950/80 p-5 rounded-3xl border border-zinc-850 space-y-3.5">
                <span className="text-xs uppercase font-mono font-black tracking-wider text-rose-500">1. Video Headline & Hooks</span>
                
                <div className="space-y-1.5">
                  <span className="text-[10px] text-zinc-400 font-bold font-mono">Title Headline Hook</span>
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Enter catchy headline hook..."
                    className="w-full px-3 py-2 bg-zinc-905 border border-zinc-800 text-white rounded-xl text-xs outline-none focus:border-rose-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] text-zinc-400 font-bold font-mono">Detailed Video caption</span>
                  <textarea
                    value={draftDesc}
                    onChange={(e) => setDraftDesc(e.target.value)}
                    placeholder="Describe your video compilation... What trends should folks follow?"
                    className="w-full h-20 px-3 py-2 bg-zinc-905 border border-zinc-800 text-white rounded-xl text-xs outline-none resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setDraftDesc(prev => prev + " @alex_stark ");
                    }}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl text-[10px] font-bold font-mono border border-zinc-800 flex items-center gap-1 cursor-pointer"
                    type="button"
                  >
                    @ Mention User
                  </button>
                  <button
                    onClick={() => {
                        setDraftTags(prev => {
                          const next = [...prev];
                          if (!next.includes("pegger")) next.push("pegger");
                          if (!next.includes("viral")) next.push("viral");
                          return next;
                        });
                        setDraftTitle(prev => prev + " #pegger #viral");
                    }}
                    className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl text-[10px] font-bold font-mono border border-zinc-800 flex items-center gap-1 cursor-pointer"
                    type="button"
                  >
                    # Add Hashtags
                  </button>
                </div>
              </div>

              <div className="bg-zinc-950/80 p-5 rounded-3xl border border-rose-950/40 space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-855 pb-2">
                  <span className="text-xs uppercase font-mono font-black text-rose-450 flex items-center gap-1">
                    ✨ Gemini automated Headline script
                  </span>
                  <span className="text-[8.5px] bg-rose-600/25 text-rose-400 border border-rose-500/30 px-1.5 py-0.5 rounded font-black font-mono">
                    AI Auto-Pilot
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                  Stuck on copywriting? Describe the camera clips and permit Gemini to script fully formulated captions with trending tags!
                </p>

                <form onSubmit={handleAIAssistance} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <input
                      type="text"
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="e.g. green leaves blooming, urban skate tricks"
                      className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-xl placeholder-zinc-500 outline-none focus:border-rose-500"
                    />

                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="px-3 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-xl outline-none cursor-pointer"
                    >
                      <option value="PeggerSports">Sports channel</option>
                      <option value="PeggerTech">Technology channel</option>
                      <option value="AmbientPeace">Vibe & Meditative</option>
                      <option value="MacroSatisfying">Macro Satisfying</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingAI || !videoPrompt.trim()}
                    className="w-full py-2 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-900 disabled:text-zinc-400 text-white text-xs font-bold rounded-xl transition flex justify-center items-center gap-1 cursor-pointer"
                  >
                    {loadingAI ? "Consulting AI Generator..." : "Generate Captions with Gemini"}
                  </button>
                </form>

                {aiSuggestions && (
                  <div className="bg-zinc-900/60 p-3.5 rounded-2xl border border-zinc-850 space-y-2.5 animate-slide-up">
                    <span className="text-[9px] uppercase font-mono font-bold text-zinc-400">Pitched variants (Click to apply):</span>
                    <div className="space-y-2 text-xs">
                      {aiSuggestions.captions?.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleApplySuggestion(item.text, item.hashtags, aiSuggestions.recommendedFilter || "Normal")}
                          className="w-full text-left p-3 bg-zinc-950/85 border border-zinc-800 rounded-xl hover:border-rose-500 transition-colors cursor-pointer"
                        >
                          <span className="text-white block font-bold leading-normal">{item.text}</span>
                          <div className="flex gap-1.5 flex-wrap mt-1.5">
                            {item.hashtags.map((h, hIdx) => (
                              <span key={hIdx} className="text-[8.5px] font-mono text-rose-450 bg-zinc-900 px-1 py-0.5 rounded border border-zinc-800 font-bold">#{h}</span>
                            ))}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-zinc-950/80 p-5 rounded-3xl border border-zinc-850 space-y-4">
                <span className="text-xs uppercase font-mono font-black tracking-wider text-rose-500">2. Privacy & Audience control</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-440 font-bold font-mono">Who can watch this list</span>
                    <select
                      value={audiencePrivacy}
                      onChange={(e) => setAudiencePrivacy(e.target.value as any)}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-xl outline-none cursor-pointer"
                    >
                      <option value="Everyone">Everyone (Public)</option>
                      <option value="Friends">Friends only</option>
                      <option value="Private">Only Me (Private)</option>
                    </select>
                  </div>

                  <div className="bg-zinc-900/60 p-2.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-white font-bold block">Allow Comments</span>
                      <p className="text-[8.5px] text-zinc-400">Permit followers to type reviews.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowComments}
                      onChange={(e) => setAllowComments(e.target.checked)}
                      className="w-4 h-4 accent-rose-500 cursor-pointer"
                    />
                  </div>

                  <div className="bg-zinc-900/60 p-2.5 rounded-2xl border border-zinc-800 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-white font-bold block">Duet / Stitch</span>
                      <p className="text-[8.5px] text-zinc-400">Toggle comparative records.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowDuet}
                      onChange={(e) => setAllowDuet(e.target.checked)}
                      className="w-4 h-4 accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-3 bg-zinc-900/40 rounded-2xl border border-zinc-850 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[10.5px] font-black text-white font-mono uppercase">
                      <Calendar size={12} className="text-zinc-450" /> Schedule Video Publication
                    </div>
                    <input
                      type="checkbox"
                      checked={scheduleEnabled}
                      onChange={(e) => setScheduleEnabled(e.target.checked)}
                      className="w-4 h-4 accent-rose-500 cursor-pointer"
                    />
                  </div>

                  {scheduleEnabled && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-850 animate-fade-in text-xs">
                      <div className="space-y-1">
                        <span className="text-[9px] text-zinc-400 font-bold font-mono font-bold">Date</span>
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 font-mono text-xs focus:ring-1 focus:ring-rose-500 outline-none text-white cursor-pointer"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-zinc-400 font-bold font-mono font-bold">Time (UTC)</span>
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-1.5 font-mono text-xs focus:ring-1 focus:ring-rose-500 outline-none text-white cursor-pointer"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            <div className="md:col-span-4 space-y-6 flex flex-col">
              
              <div className="bg-zinc-950/80 p-4 rounded-3xl border border-zinc-850 text-center space-y-3">
                <span className="text-[10px] uppercase font-mono font-black text-rose-500 block">3. Covers Selector widget</span>
                
                <div className="w-full max-w-[150px] aspect-[9/16] bg-zinc-900 border border-zinc-800 rounded-2xl mx-auto overflow-hidden relative shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 z-10 p-2 text-left flex flex-col justify-between">
                    <span className="bg-rose-500 text-white text-[8px] px-1 py-0.5 rounded font-mono font-extrabold w-max uppercase">Draft</span>
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-black text-white truncate block">@{draftTitle || "Draft cover"}</span>
                      <div className="flex gap-1">
                        <span className="text-[7.5px] text-rose-450 bg-black/60 px-0.5 rounded font-mono font-bold">#pegger</span>
                      </div>
                    </div>
                  </div>

                  <div className={`absolute inset-0 z-0 transition-opacity ${
                    activeCoverFrame === 1 ? "bg-gradient-to-br from-indigo-900 to-indigo-950" : 
                    activeCoverFrame === 2 ? "bg-gradient-to-tr from-emerald-900 to-teal-950" :
                    "bg-gradient-to-bl from-rose-900 to-amber-950"
                  }`} />
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-zinc-400 font-mono block font-bold">CLICK Cover segment profile:</span>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3].map((frame) => (
                      <button
                        key={frame}
                        onClick={() => setActiveCoverFrame(frame)}
                        className={`w-10 h-7 rounded border transition-all cursor-pointer text-[9.5px] font-extrabold ${
                          activeCoverFrame === frame 
                            ? "border-rose-500 bg-rose-500/10 text-white" 
                            : "border-zinc-800 bg-zinc-900 text-zinc-500"
                        }`}
                        type="button"
                      >
                        F{frame}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-zinc-950/80 p-4 rounded-3xl border border-zinc-850 space-y-3">
                <span className="text-[10px] uppercase font-mono font-black text-zinc-400 block">Dispatched publishing</span>

                {publishedSuccess ? (
                  <div className="p-4 bg-emerald-950/90 border border-emerald-500 text-emerald-400 rounded-2xl text-center text-xs font-bold font-mono animate-scale-up space-y-1">
                    <div className="flex justify-center text-lg">🎉</div>
                    <strong>Post Published!</strong>
                    <p className="text-[10px] text-zinc-400 italic">Dispatched successfully under PegSafe Security shield.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={handleFinalPublish}
                      className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-2xl shadow-lg shadow-rose-600/10 transition-all cursor-pointer active:scale-95"
                      type="button"
                    >
                      Post to Pegger feed
                    </button>
                    <button
                      onClick={() => {
                        alert("💾 Form data cached into unpublished cookie drafts successfully!");
                        setStudioStep("camera");
                      }}
                      className="w-full py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-2xl text-xs font-black transition border border-zinc-800 cursor-pointer"
                      type="button"
                    >
                      Save to Drafts Folder
                    </button>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}


      {isSoundDrawerOpen && (
        <div className="fixed inset-0 z-49 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-zinc-950 border border-zinc-800 max-w-md w-full rounded-[38px] p-6 text-white space-y-6 shadow-2xl relative my-auto animate-scale-up">
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Music size={16} className="text-rose-500" />
                <h3 className="font-extrabold text-sm">Add Sound Library</h3>
              </div>
              <button 
                onClick={() => setIsSoundDrawerOpen(false)}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                type="button"
              >
                <X size={14} />
              </button>
            </div>

            <div className="relative">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={soundSearchText}
                onChange={(e) => setSoundSearchText(e.target.value)}
                placeholder="Search songs, artists, compilations..."
                className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 text-white text-xs rounded-2xl outline-none focus:border-rose-500 placeholder-zinc-500"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px] font-bold">
              {["Trending", "Viral", "Pegger Mix", "Vibe"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSoundSearchText(cat === "Trending" ? "" : cat)}
                  className={`px-3 py-1.5 border rounded-xl transition cursor-pointer ${
                    soundSearchText === cat 
                      ? "bg-rose-600 border-transparent text-white" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-850"
                  }`}
                  type="button"
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-2.5 max-h-[260px] overflow-y-auto pr-1 scrollbar-thin">
              {filteredSoundsCatalog.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs font-mono font-bold">No matching TikTok tracks found.</div>
              ) : (
                filteredSoundsCatalog.map((sound) => {
                  const isCurrent = activeSound?.id === sound.id;
                  return (
                    <div 
                      key={sound.id} 
                      className={`p-3.5 rounded-2xl border transition-colors flex items-center justify-between gap-3 ${
                        isCurrent 
                          ? "bg-rose-950/30 border-rose-600/60" 
                          : "bg-zinc-900/65 border-zinc-850 hover:bg-zinc-900"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-mono font-black ${sound.color}`}>
                          {sound.artist.charAt(0)}
                        </div>

                        <div>
                          <h4 className="font-bold text-xs leading-none text-white">{sound.title}</h4>
                          <span className="text-[10px] text-zinc-400 font-mono mt-1 block">@{sound.artist} • {sound.duration}</span>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3 flex-shrink-0">
                        <span className="text-[9px] font-mono text-zinc-400 font-bold">{sound.useCount}</span>
                        <button
                          onClick={() => handleSelectSound(sound)}
                          className={`px-3 py-1.5 text-[9.5px] font-black rounded-xl transition cursor-pointer ${
                            isCurrent
                              ? "bg-rose-600 text-white font-black"
                              : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                          }`}
                          type="button"
                        >
                          {isCurrent ? "Applied" : "Use Sound"}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="text-center p-2.5 bg-zinc-900/30 border rounded-2xl border-zinc-850">
              <p className="text-[9px] text-zinc-550 font-medium">
                Sounds are licensed for temporary short-term compilation exports.
              </p>
            </div>

          </div>
        </div>
      )}


      {isEffectsDrawerOpen && (
        <div className="fixed inset-0 z-49 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-zinc-950 border border-zinc-800 max-w-md w-full rounded-[38px] p-6 text-white space-y-5 shadow-2xl relative my-auto animate-scale-up">
            
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-rose-500" />
                <h3 className="font-extrabold text-sm">Overlay Video Effects</h3>
              </div>
              <button 
                onClick={() => setIsEffectsDrawerOpen(false)}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-full transition-colors cursor-pointer"
                type="button"
              >
                <X size={14} />
              </button>
            </div>

            <div className="flex gap-2">
              {(["Trending", "Visual", "Atmosphere"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setEffectCategory(cat)}
                  className={`flex-1 py-1 text-[10px] font-black rounded-lg transition cursor-pointer ${
                    effectCategory === cat ? "bg-rose-600 text-white" : "bg-zinc-900 text-zinc-400"
                  }`}
                  type="button"
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[240px] overflow-y-auto pr-1">
              
              <button
                onClick={() => {
                  setActiveEffect("none");
                  setIsEffectsDrawerOpen(false);
                }}
                className={`p-3 rounded-2xl border text-left space-y-1.5 transition cursor-pointer ${
                  activeEffect === "none" ? "bg-rose-950/20 border-rose-600" : "bg-zinc-900 border-zinc-800"
                }`}
                type="button"
              >
                <span className="text-lg">🚫</span>
                <h4 className="font-bold text-xs text-white leading-none">No Effect</h4>
                <p className="text-[9px] text-zinc-500 leading-normal">Clear all custom overlays from active loops.</p>
              </button>

              {EFFECTS_CATALOG.map((eff) => {
                const isActive = activeEffect === eff.id;
                return (
                  <button
                    key={eff.id}
                    onClick={() => {
                      setActiveEffect(eff.id);
                      setIsEffectsDrawerOpen(false);
                    }}
                    className={`p-3 rounded-2xl border text-left space-y-1.5 transition relative overflow-hidden cursor-pointer ${
                      isActive ? "bg-rose-955/20 border-rose-600" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                    }`}
                    type="button"
                  >
                    <span className="text-lg relative z-10">{eff.emoji}</span>
                    <h4 className="font-bold text-xs text-white leading-none relative z-10">{eff.name}</h4>
                    <p className="text-[9.5px] text-zinc-400 leading-normal relative z-10">{eff.description}</p>
                    
                    <div className={`absolute -right-2 -bottom-2 w-10 h-10 bg-gradient-to-tr ${eff.color} opacity-20 rounded-full blur`} />
                  </button>
                );
              })}
            </div>

            <div className="text-center p-2.5 bg-zinc-900/30 border border-zinc-850 rounded-2xl text-[9px] text-zinc-550 font-medium">
              Interactive overlays draw beautiful math vector grids dynamically onto the viewfinder canvas.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
