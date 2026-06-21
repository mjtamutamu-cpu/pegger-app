/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Compass, Camera, User as UserIcon, MessageSquare, 
  TrendingUp, ShieldCheck, Layers, Sparkles, Bell, Globe, Sun, Moon, 
  Flag, Ban, Play, HelpCircle, Check, ShieldAlert, Award, Radio, 
  Home, Activity, Settings, Info, Heart
} from "lucide-react";

import { Video, User, Comment } from "./types";
import { INITIAL_VIDEOS, INITIAL_COMMENTS } from "./mockData";

// Import modular components
import FeedView from "./components/FeedView";
import CreativeStudio from "./components/CreativeStudio";
import DiscoverView from "./components/DiscoverView";
import LiveStreamView from "./components/LiveStreamView";
import CreatorDashboard from "./components/CreatorDashboard";
import ActivityView from "./components/ActivityView";
import AdminModerator from "./components/AdminModerator";
import ArchitectureHub from "./components/ArchitectureHub";

// Catalog map of static profile info for verified simulated creators
const CREATORS_CATALOG: Record<string, { name: string; avatar: string; bio: string; followersCount: number; followingCount: number; website?: string }> = {
  alex_stark: {
    name: "Alex Stark",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    bio: "Fusing short-form tech layouts with modular active video loops on Pegger! ✨🌱",
    followersCount: 0, // synced dynamically
    followingCount: 0, // synced dynamically
    website: "https://alexstark.dev"
  },
  cyber_aria: {
    name: "Aria Cybernetic",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    bio: "Mainframe retro artist & sound programmer based in Neo-Kyoto. Tuning visual modifiers. 🎹⚡",
    followersCount: 320000,
    followingCount: 420,
    website: "https://cyberaria.peg"
  },
  syntax_weaver: {
    name: "Syntax Weaver",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    bio: "Rewriting the short-form recommendation router into a single zero-cost recursive template loop. 🚀💻💻",
    followersCount: 190000,
    followingCount: 110,
    website: "https://syntaxweaver.io"
  },
  elena_silver: {
    name: "Elena Silverwood",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    bio: "Pouring high-gloss sterling compound under liquid nitrogen. Cryogenic wave sculptor 👑👑",
    followersCount: 440000,
    followingCount: 330,
    website: "https://elenasilver.peg"
  },
  abyss_pulse: {
    name: "Deep Abyss Dancer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    bio: "Bioluminescent video logger capturing deep sea coral resonances in submarine feeds. 🧬🌊👾",
    followersCount: 710000,
    followingCount: 890,
  }
};

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState<1 | 2 | 3 | "auth" | "verification" | "personalization">(1);
  
  // Registration and Authentication inputs
  const [authMode, setAuthMode] = useState<"register" | "login">("register");
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | "google" | "apple">("email");
  const [regUsername, setRegUsername] = useState("alex_stark");
  const [regEmail, setRegEmail] = useState("alex@pegger.io");
  const [regPhone, setRegPhone] = useState("+1 (555) 0192");
  const [regPassword, setRegPassword] = useState("password123");
  const [regDOB, setRegDOB] = useState("2002-11-24");
  const [regCountry, setRegCountry] = useState("United States");
  
  // Verification states
  const [otpCode, setOtpCode] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  
  // Interests Categories list
  const interestCategories = [
    "Sports", "Technology", "Music", "Education", "Comedy", 
    "Fashion", "Business", "Gaming", "Travel", "Food", "Science", "Art"
  ];
  const [chosenInterests, setChosenInterests] = useState<string[]>(["Technology", "Music", "Science"]);
  const [chosenAvatar, setChosenAvatar] = useState("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200");
  const [chosenBio, setChosenBio] = useState("Fusing short-form tech layouts with modular active sound loops on Pegger! ✨🌱");

  const [splashLoading, setSplashLoading] = useState(true);
  const [splashTick, setSplashTick] = useState(0);
  const [splashText, setSplashText] = useState("Initializing Pegger ecosystem...");
  
  // App visual states (Welcoming clean light-mode as standard default context)
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [language, setLanguage] = useState<"en" | "es" | "ja" | "de">("en");
  
  // Exactly the 5 Bottom Navigation active tabs specified by USER INTENT
  const [activeTab, setActiveTab] = useState<"home" | "discover" | "create" | "activity" | "profile">("home");
  const [selectedProfileHandle, setSelectedProfileHandle] = useState<string | null>(null);
  
  // Profile sub sections settings togglers
  const [profileViewSection, setProfileViewSection] = useState<"creations" | "saved" | "drafts" | "reposts" | "blueprint" | "metrics" | "compliance">("creations");

  // Platform reactive data structures
  const [videosFeed, setVideosFeed] = useState<Video[]>(INITIAL_VIDEOS);
  const [commentsFeed, setCommentsFeed] = useState<Comment[]>(INITIAL_COMMENTS);
  
  // Follower handles tracking who follows us (starts empty for real zero-state consistency)
  const [followersList, setFollowersList] = useState<string[]>([]);
  
  // Algorithmic Growth Bot Simulation states
  const [botActive, setBotActive] = useState(true);
  const [botPace, setBotPace] = useState<"snail" | "active" | "viral">("active");
  const [botLog, setBotLog] = useState<string>("Pegger discovery agent online. Frame metrics checking active.");

  const [myProfile, setMyProfile] = useState<User>({
    id: "me",
    name: "Alex Stark",
    handle: "alex_stark",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
    bio: "Fusing short-form tech layouts with modular active video loops on Pegger! ✨🌱",
    website: "https://alexstark.dev",
    followersCount: 0,
    followingCount: 0,
    totalHearts: 0
  });

  const [notifications, setNotifications] = useState([
    { id: 1, text: "🛡️ PegSafe Shield verified your video metadata successfully.", time: "Just now" }
  ]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profilePortalOpen, setProfilePortalOpen] = useState(false);
  
  // Reporting and Blocking Modal State
  const [reportState, setReportState] = useState<{ open: boolean; videoId: string; reason: string; blocked: boolean; processed: boolean }>({
    open: false,
    videoId: "",
    reason: "Harassment",
    blocked: false,
    processed: false
  });

  // Synchronize profile stats with real activities (Consistencies)
  const myCreatedVideos = videosFeed.filter(v => v.creatorId === "me");
  const computedTotalHearts = myCreatedVideos.reduce((acc, v) => acc + v.likesCount, 0);
  const computedFollowingCount = videosFeed.filter(v => v.creatorId !== "me" && v.isFollowing).length;
  const computedFollowersCount = followersList.length;

  // Active profile computations
  const activeProfileHandle = selectedProfileHandle || "alex_stark";
  const isViewingSelf = activeProfileHandle === "alex_stark";
  const activeProfileData = CREATORS_CATALOG[activeProfileHandle] || {
    name: activeProfileHandle.replace("_", " ").toUpperCase(),
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    bio: "Pegger premium content curator.",
    followersCount: 4500,
    followingCount: 120,
    website: undefined
  };

  const currentProfileInfo = isViewingSelf ? myProfile : {
    id: activeProfileHandle,
    name: activeProfileData.name,
    handle: activeProfileHandle,
    avatar: activeProfileData.avatar,
    bio: activeProfileData.bio,
    followersCount: activeProfileData.followersCount,
    followingCount: activeProfileData.followingCount,
    totalHearts: videosFeed.filter(v => v.creatorHandle === activeProfileHandle).reduce((acc, v) => acc + v.likesCount, 0),
    website: activeProfileData.website
  };

  useEffect(() => {
    setMyProfile(prev => ({
      ...prev,
      totalHearts: computedTotalHearts,
      followingCount: computedFollowingCount,
      followersCount: computedFollowersCount
    }));
  }, [computedTotalHearts, computedFollowingCount, computedFollowersCount]);

  // The 'Thinking Bot' Social Engine Loop
  useEffect(() => {
    if (!botActive) return;

    // determine simulation tick interval
    const intervalMs = botPace === "viral" ? 3000 : botPace === "active" ? 6500 : 15000;

    const interval = setInterval(() => {
      const myVids = videosFeed.filter(v => v.creatorId === "me");
      if (myVids.length === 0) {
        setBotLog("Bot state: Personal posts repository is dry. Publish a video in 'Create' tab to trigger simulated organic traffic!");
        return;
      }

      // Pick a random user video
      const randomVidIdx = Math.floor(Math.random() * myVids.length);
      const targetVid = myVids[randomVidIdx];

      // Calculate organic rating based on filters, hashtags, speed modifier
      let qualityScore = 50;
      if (targetVid.description.length > 25) qualityScore += 15;
      if (targetVid.tags.length > 1) qualityScore += 15;
      if (targetVid.speedModifier !== 1.0) qualityScore += 10;
      if (targetVid.filterApplied !== "Normal") qualityScore += 10;

      // Roll chance
      const randRoll = Math.random() * 100;
      
      const potentialHandles = ["cyber_aria", "syntax_weaver", "elena_silver", "abyss_pulse", "micro_loom", "wave_rider", "green_leaf", "volt_pulse"];
      const randomActor = potentialHandles[Math.floor(Math.random() * potentialHandles.length)];

      if (randRoll <= qualityScore) {
        // Success engagement step! Decide what style of interaction to run
        const interactionType = Math.random();

        if (interactionType < 0.40) {
          // Trigger Like!
          setVideosFeed(prev => prev.map(v => {
            if (v.id === targetVid.id) {
              return { ...v, likesCount: v.likesCount + 1 };
            }
            return v;
          }));
          
          setNotifications(prev => [
            { id: Date.now(), text: `💚 @${randomActor} liked your post: "${targetVid.title}"`, time: "Just now" },
            ...prev
          ]);
          setBotLog(`Recommendation Bot: @${randomActor} watched and liked "${targetVid.title}"! (Quality Score: ${qualityScore}%)`);
        } 
        else if (interactionType < 0.75) {
          // Trigger Comment!
          let commentText = "Incredible flow! 🌱✨";
          if (targetVid.tags.some(t => ["tech", "code"].includes(t.toLowerCase()))) {
            const possibleComments = [
              "Superb development stack! ⚡️",
              "This UI/UX looks elite. Loved the green theme!",
              "Is this styled with Tailwind? Immaculate.",
              "Nice tech-loop workflow!"
            ];
            commentText = possibleComments[Math.floor(Math.random() * possibleComments.length)];
          } else if (targetVid.tags.some(t => ["nature", "green"].includes(t.toLowerCase()))) {
            const possibleComments = [
              "So organic and welcoming! Beautiful framing.",
              "Loving the green forest vibes here. 🌱",
              "Refreshing layout, great lighting!"
            ];
            commentText = possibleComments[Math.floor(Math.random() * possibleComments.length)];
          } else {
            const possibleComments = [
              "Pegged it! Sensational editing here.",
              "This loop is therapeutic. ✨",
              "Great pacing modifier choice!"
            ];
            commentText = possibleComments[Math.floor(Math.random() * possibleComments.length)];
          }

          const freshSimComment: Comment = {
            id: `c-sim-${Date.now()}`,
            videoId: targetVid.id,
            userName: randomActor.replace("_", " ").replace(/^\w/, c => c.toUpperCase()),
            userHandle: randomActor,
            userAvatar: `https://images.unsplash.com/photo-${potentialHandles.indexOf(randomActor) % 2 === 0 ? "1507003211169-0a1dd7228f2d" : "1494790108377-be9c29b29330"}?auto=format&fit=crop&q=80&w=200`,
            text: commentText,
            timestamp: "Just now",
            likesCount: Math.floor(Math.random() * 5),
            hasLiked: false
          };

          setCommentsFeed(prev => [freshSimComment, ...prev]);
          setVideosFeed(prev => prev.map(v => {
            if (v.id === targetVid.id) {
              return { ...v, commentsCount: v.commentsCount + 1 };
            }
            return v;
          }));

          setNotifications(prev => [
            { id: Date.now(), text: `💬 @${randomActor} commented: "${commentText}"`, time: "Just now" },
            ...prev
          ]);
          setBotLog(`Recommendation Bot: @${randomActor} posted a response: "${commentText}" under your post.`);
        } 
        else {
          // Trigger Follower back expansion!
          if (!followersList.includes(randomActor)) {
            setFollowersList(prev => [...prev, randomActor]);
            setNotifications(prev => [
              { id: Date.now(), text: `🖥️ @${randomActor} started following your profile!`, time: "Just now" },
              ...prev
            ]);
            setBotLog(`Recommendation Bot: @${randomActor} followed your profile because of your recent activity!`);
          } else {
            setBotLog(`Recommendation Bot: Scanning feed... verified active retainment of followers.`);
          }
        }
      } else {
        setBotLog(`Recommendation Bot: Video "${targetVid.title}" was impressions-tested, but viewer didn't convert to engagement. Increase captions density!`);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [botActive, botPace, videosFeed, followersList]);

  // Simulated Splash loading loop
  useEffect(() => {
    if (!splashLoading) return;

    const interval = setInterval(() => {
      setSplashTick((prev) => {
        const next = prev + 10;
        if (next >= 100) {
          clearInterval(interval);
          setSplashLoading(false);
          return 100;
        }
        
        // fluctuation status lines in soft organic aesthetic
        if (next === 20) setSplashText("Compiling Pegger recommendation vectors...");
        if (next === 50) setSplashText("Calibrating soft welcoming environment...");
        if (next === 80) setSplashText("Mapping green organic clover loops...");
        
        return next;
      });
    }, 180);

    return () => clearInterval(interval);
  }, [splashLoading]);

  // Handle feed reactions state mapping
  const handleToggleLike = (videoId: string) => {
    setVideosFeed((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            likesCount: isLiked ? v.likesCount + 1 : v.likesCount - 1
          };
        }
        return v;
      })
    );
  };

  const handleToggleSave = (videoId: string) => {
    setVideosFeed((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isSaved = !v.isSaved;
          return {
            ...v,
            isSaved,
            savesCount: isSaved ? v.savesCount + 1 : v.savesCount - 1
          };
        }
        return v;
      })
    );
  };

  const handleToggleFollow = (videoId: string) => {
    setVideosFeed((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const isFollowed = !v.isFollowing;
          return { ...v, isFollowing: isFollowed };
        }
        return v;
      })
    );
  };

  const handleAddCommentLocal = (c: Comment) => {
    setCommentsFeed(prev => [c, ...prev]);
  };

  const handleAddCommentCount = (videoId: string) => {
    setVideosFeed((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          // Simulate active creator response reciprocity
          setTimeout(() => {
            const creatorHandle = v.creatorHandle;
            if (v.creatorId === "me") return;
            const chances = Math.random();
            if (chances < 0.45) {
              setFollowersList(prev => {
                if (!prev.includes(creatorHandle)) {
                  setNotifications(n => [
                    { id: Date.now(), text: `🖥️ @${creatorHandle} was flattered by your comment and followed you back!`, time: "Just now" },
                    ...n
                  ]);
                  return [...prev, creatorHandle];
                }
                return prev;
              });
            } else {
              setNotifications(n => [
                { id: Date.now(), text: `💚 @${creatorHandle} liked your newly posted comment on their loop!`, time: "Just now" },
                ...n
              ]);
            }
          }, 2000);
          return { ...v, commentsCount: v.commentsCount + 1 };
        }
        return v;
      })
    );
  };

  // Append new published video draft from Studio to feed
  const handlePublishVideo = (
    title: string, 
    description: string, 
    filter: string, 
    speed: number, 
    tags: string[],
    uploadedUrl?: string,
    mediaType?: "video" | "image" | "file"
  ) => {
    const freshVid: Video = {
      id: `v-added-${Date.now()}`,
      creatorId: "me",
      creatorName: myProfile.name,
      creatorHandle: myProfile.handle,
      creatorAvatar: myProfile.avatar,
      title,
      description,
      tags,
      filterApplied: filter,
      speedModifier: speed,
      likesCount: 0,
      commentsCount: 0,
      savesCount: 0,
      repostsCount: 0,
      musicName: "Original compilation draft",
      musicArtist: myProfile.name,
      visualColorTop: "#7BC47F", // Pegger Green
      visualColorBottom: "#A8D8A8", // Pegger secondary
      isLiked: false,
      isSaved: false,
      isReposted: false,
      uploadedUrl,
      mediaType
    };

    setVideosFeed((prev) => [freshVid, ...prev]);
    
    // Auto pivot to Home feed to preview published item
    setActiveTab("home");
  };

  const triggerSubmitReport = () => {
    setReportState(prev => ({ ...prev, processed: true }));
    setTimeout(() => {
      if (reportState.blocked) {
        setVideosFeed(prev => prev.filter(v => v.id !== reportState.videoId));
      }
      setReportState({ open: false, videoId: "", reason: "Harassment", blocked: false, processed: false });
      alert("🔒 Security audit logged by PegSafe Shield. Thank you for conserving wellness!");
    }, 1200);
  };

  // Translations Map
  const translations = {
    en: {
      tagline: "Friendly Social Ecosystem",
      onboardingTitle: "Welcome to Pegger",
      onboardingSub: "An organic short-form space styled in welcoming forest greens, designed to connect high kinetic creators cleanly.",
      explore: "Home Feed",
      studio: "Create Studio",
      analytics: "Creator Hub",
      live: "Go Live",
      blueprint: "Ecosystem Specs",
      safety: "Safety Shield",
      discover: "Discover Niche",
      inbox: "Alert Inbox",
      profile: "Profile Page",
      follow: "Follow",
      unfollow: "Following"
    },
    es: {
      tagline: "Ecosistema Social Amigable",
      onboardingTitle: "Bienvenido a Pegger",
      onboardingSub: "Un espacio orgánico de videos cortos decorado en verdes forestales, diseñado para conectar creadores de forma limpia.",
      explore: "Inicio Feed",
      studio: "Estudio Creativo",
      analytics: "Creadores Hub",
      live: "Transmisión en Vivo",
      blueprint: "Plano del Sistema",
      safety: "Seguridad",
      discover: "Descubrimiento",
      inbox: "Alertas DM",
      profile: "Mi Perfil",
      follow: "Seguir",
      unfollow: "Siguiendo"
    },
    ja: {
      tagline: "優しいショート動画共有空間",
      onboardingTitle: "Pegger へようこそ",
      onboardingSub: "美しいフォレストグリーンのデザイン、革新的な編集ツール、そして心温まるコミュニティを提供するエコシステム。",
      explore: "ホームフィード",
      studio: "クリエイティブスタジオ",
      analytics: "クリエイター分析",
      live: "ライブ配信へ",
      blueprint: "システム構造",
      safety: "セーフセキュリティ",
      discover: "発見ハブ",
      inbox: "メッセージ",
      profile: "プロフィール設定",
      follow: "フォローする",
      unfollow: "フォロー中"
    },
    de: {
      tagline: "Weiche Kurzvideo-Plattform der Zukunft",
      onboardingTitle: "Willkommen bei Pegger",
      onboardingSub: "Die Web-Plattform mit weicher hellgrüner Ästhetik, kreativen Werkzeugen und sozialer Verbundenheit.",
      explore: "Home-Feed",
      studio: "Kreatives Studio",
      analytics: "Schöpfer-Metriken",
      live: "Live-Stream-Arena",
      blueprint: "System-Bauplan",
      safety: "Sicherheits-Schild",
      discover: "Entdecken",
      inbox: "Nachrichten",
      profile: "Benutzerprofil",
      follow: "Folgen",
      unfollow: "Folge ich"
    }
  };

  const currentText = translations[language];

  const handleCompletePersonalization = () => {
    setOnboardingDone(true);
    setMyProfile(prev => ({
      ...prev,
      handle: regUsername || prev.handle,
      bio: chosenBio || prev.bio,
      avatar: chosenAvatar
    }));
    
    // Sort feed dynamically based on chosen category interests first
    setVideosFeed((prev) => {
      return [...prev].sort((a, b) => {
        const aHasInterest = a.tags.some(tag => chosenInterests.some(ci => tag.toLowerCase().includes(ci.toLowerCase())));
        const bHasInterest = b.tags.some(tag => chosenInterests.some(ci => tag.toLowerCase().includes(ci.toLowerCase())));
        if (aHasInterest && !bHasInterest) return -1;
        if (!aHasInterest && bHasInterest) return 1;
        return 0;
      });
    });
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col justify-between ${
      isDarkTheme ? "bg-[#1E2A1E] text-white" : "bg-[#F7FAF7] text-[#1E2A1E]"
    }`}>
      
      {/* 1. BRAND LOADING SPLASH SCREEN */}
      {splashLoading && (
        <div className="fixed inset-0 bg-[#F7FAF7] z-50 flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in text-[#1E2A1E]">
          <div className="space-y-6 max-w-sm w-full relative">
            
            {/* Soft pulsing green emblem cards */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <div className="relative z-10 w-20 h-20 rounded-[28px] bg-peg-primary flex items-center justify-center shadow-xl shadow-peg-secondary/20 animate-pulse">
                <span className="text-4xl font-extrabold text-[#1E2A1E] font-mono tracking-tighter">P</span>
              </div>
              <div className="absolute inset-0 rounded-full border border-peg-secondary pointer-events-none animate-spin-slow"></div>
              
              {/* Floating leaf card mockup 1 */}
              <div className="absolute top-0 left-0 w-9 h-12 bg-white border border-slate-100 rounded-xl p-1 text-left flex flex-col justify-between shadow-xs animate-bounce" style={{ animationDelay: '0.1s' }}>
                <div className="w-3 h-3 rounded-full bg-peg-primary"></div>
                <div className="h-0.5 bg-slate-200 w-full rounded"></div>
              </div>

              {/* Floating leaf card mockup 2 */}
              <div className="absolute bottom-1 right-0 w-10 h-14 bg-white border border-slate-100 rounded-xl p-1.5 text-left flex flex-col justify-between shadow-xs animate-bounce" style={{ animationDelay: '0.4s' }}>
                <div className="w-4 h-4 rounded-full bg-[#5EA66A]"></div>
                <div className="h-0.5 bg-slate-200 w-full rounded"></div>
              </div>
            </div>

            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tight text-peg-dark">
                Pegger
              </h1>
              <p className="text-[10px] font-black tracking-widest uppercase text-peg-accent" style={{ letterSpacing: '0.2em' }}>
                {currentText.tagline}
              </p>
            </div>

            <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden max-w-xs mx-auto">
              <div className="h-full bg-peg-primary rounded-full transition-all duration-300" style={{ width: `${splashTick}%` }}></div>
            </div>

            <div className="text-[10px] text-slate-500 font-mono flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 bg-peg-accent rounded-full animate-ping"></span> 
              <span>{splashText}</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. ONBOARDING SEQUENCE FOR AUTH AND INTERESTS */}
      {!splashLoading && !onboardingDone && (
        <div className="fixed inset-0 z-48 bg-[#F7FAF7] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-100 rounded-[36px] max-w-md w-full p-6 text-center space-y-6 shadow-xl my-auto animate-scale-up">
            
            {/* Steps bar */}
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono border-b pb-3">
              <span className="font-bold uppercase tracking-wider text-peg-accent">Pegger Setup Step</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, "auth", "verification", "personalization"].map((st, sidx) => (
                  <span 
                    key={sidx}
                    className={`w-2.5 h-1 text-[5px] rounded-full transition-colors ${
                      onboardingStep === st ? "bg-[#1E2A1E] w-5" : "bg-slate-200"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Step 1: Browse preview */}
            {onboardingStep === 1 && (
              <div className="space-y-5 animate-fade-in text-left">
                <div className="w-full h-40 bg-[#F7FAF7] rounded-3xl p-4 flex items-center justify-center gap-4 border relative overflow-hidden">
                  <div className="w-24 h-full bg-white border rounded-xl shadow-xs p-1.5 flex flex-col justify-between transform -rotate-6">
                    <span className="bg-peg-primary/20 text-peg-accent text-[8px] font-bold px-1.5 py-0.5 rounded-lg w-max font-mono">#Sports</span>
                    <div className="h-1 bg-slate-100 w-full rounded"></div>
                  </div>
                  <div className="w-24 h-full bg-white border-2 border-peg-accent rounded-xl shadow-md p-1.5 flex flex-col justify-between transform scale-110 z-10">
                    <span className="bg-peg-primary text-[#1E2A1E] text-[8px] font-black px-1.5 py-0.5 rounded-lg w-max">For You</span>
                    <div className="h-1 bg-slate-100 w-3/4 rounded"></div>
                  </div>
                </div>

                <div className="space-y-1.5 text-center">
                  <h3 className="text-md font-black text-peg-dark">1. Fluid Kinetic Discoveries</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Seamlessly transition between Recommended, Following, and local regional feeds under our responsive vector loops.
                  </p>
                </div>

                <button 
                  onClick={() => setOnboardingStep(2)}
                  className="w-full py-2.5 bg-peg-primary hover:bg-peg-accent text-[#1E2A1E] font-extrabold rounded-2xl text-xs cursor-pointer transition shadow-xs"
                >
                  Continue Setup
                </button>
              </div>
            )}

            {/* Step 2: Creative preview */}
            {onboardingStep === 2 && (
              <div className="space-y-5 animate-fade-in text-left">
                <div className="w-full h-40 bg-[#F7FAF7] rounded-3xl p-4 flex items-center justify-center border">
                  <div className="w-full max-w-xs bg-white border border-slate-100 p-3 rounded-2xl space-y-2.5">
                    <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                      <span>GLARE: Forest Dew</span>
                      <span>SPEED: 2.0x</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 overflow-hidden rounded-full flex">
                      <div className="h-full bg-peg-primary w-2/3"></div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-center">
                  <h3 className="text-md font-black text-peg-dark">2. High Performance Studio</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Record with the integrated webcam, crop bounds, select organic decals, and script smart tags using Gemini.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setOnboardingStep(1)} className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-2xl text-xs font-bold font-mono">Back</button>
                  <button onClick={() => setOnboardingStep(3)} className="flex-1 py-2 bg-peg-primary text-[#1E2A1E] rounded-2xl text-xs font-black shadow-xs">Next</button>
                </div>
              </div>
            )}

            {/* Step 3: Verified status preview */}
            {onboardingStep === 3 && (
              <div className="space-y-5 animate-fade-in text-left">
                <div className="w-full h-40 bg-[#F7FAF7] rounded-3xl p-4 flex items-center justify-center border gap-3">
                  <div className="w-24 bg-white p-2 border rounded-xl shadow-xs text-center space-y-2">
                    <span className="text-rose-500 text-[8px] font-bold block">● LIVE CAST</span>
                    <div className="h-1 bg-slate-100 w-1/2 mx-auto rounded"></div>
                  </div>
                  <div className="w-24 bg-white p-2 border rounded-xl shadow-xs text-center space-y-2">
                    <span className="text-peg-accent text-[8px] font-extrabold block">🔒 DM LOUNGE</span>
                    <div className="h-1 bg-slate-100 w-2/3 mx-auto rounded"></div>
                  </div>
                </div>

                <div className="space-y-1.5 text-center">
                  <h3 className="text-md font-black text-peg-dark">3. Interactive Social Mesh</h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Monetize streams directly through Peg virtual tip pools, or launch encrypted chats with followers.
                  </p>
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setOnboardingStep(2)} className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-2xl text-xs font-bold font-mono">Back</button>
                  <button onClick={() => setOnboardingStep("auth")} className="flex-1 py-2 bg-[#1E2A1E] text-white rounded-2xl text-xs font-black shadow-xs">Create Account</button>
                </div>
              </div>
            )}

            {/* Onboarding step "auth": Sign up details */}
            {onboardingStep === "auth" && (
              <div className="space-y-4 animate-fade-in text-left text-xs">
                <div className="text-center space-y-1">
                  <h3 className="text-base font-black text-peg-dark">Setup Pegger Credentials</h3>
                  <p className="text-xs text-slate-500">Create an identity to initiate content publications.</p>
                </div>

                {/* Authentication Method Toggles */}
                <div className="flex gap-1 bg-slate-50 p-1 rounded-xl border">
                  {(["email", "phone", "google", "apple"] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setAuthMethod(method)}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-bold uppercase transition ${
                        authMethod === method ? "bg-[#1E2A1E] text-white" : "text-slate-500 hover:text-peg-dark"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold font-mono uppercase">Username handle</span>
                    <input
                      type="text"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.toLowerCase().trim().replace("@",""))}
                      className="w-full px-3 py-2 bg-white border rounded-xl outline-none"
                    />
                  </div>

                  {authMethod === "email" && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold font-mono uppercase">Email Address</span>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white border rounded-xl outline-none"
                      />
                    </div>
                  )}

                  {authMethod === "phone" && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold font-mono uppercase">Phone SMS Number</span>
                      <input
                        type="text"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border rounded-xl outline-none"
                      />
                    </div>
                  )}

                  {(authMethod === "google" || authMethod === "apple") && (
                    <div className="p-3 bg-white border rounded-xl text-center space-y-1 my-1">
                      <span className="font-mono text-[9px] text-[#5EA66A] block font-extrabold">🔒 SECURE FEDERATED PASSKEY</span>
                      <p className="text-[9.5px] text-slate-400 leading-relaxed">Auto-resolving certificate metadata signature. Click verification key below.</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold font-mono uppercase">Secure Password</span>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 bg-white border rounded-xl outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setOnboardingStep("verification")}
                  className="w-full py-2.5 bg-peg-primary hover:bg-peg-accent text-[#1E2A1E] font-black rounded-2xl cursor-pointer transition shadow-xs"
                >
                  Verify Verification Key
                </button>
              </div>
            )}

            {/* Verification sequence step */}
            {onboardingStep === "verification" && (
              <div className="space-y-4 animate-fade-in text-left text-xs">
                <div className="text-center space-y-1">
                  <h3 className="text-base font-black text-peg-dark">Enter OTP Passkey</h3>
                  <p className="text-xs text-slate-500">Pegger sent a 6-digit verification code to your auth register.</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border text-center space-y-1.5">
                  <label className="text-[10px] text-slate-450 font-mono uppercase font-black block">6-digit Verification code</label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value);
                      setOtpError("");
                    }}
                    placeholder="e.g. 777"
                    className="w-full text-center py-2 bg-white border rounded-xl tracking-widest font-mono font-extrabold text-[#1E2A1E] text-base outline-none focus:border-peg-primary"
                  />
                  {otpError && <p className="text-[9.5px] text-red-500 font-bold">{otpError}</p>}
                </div>

                <div className="flex gap-2">
                  <button onClick={() => setOnboardingStep("auth")} className="flex-1 py-2 bg-slate-100 text-slate-500 rounded-2xl text-xs font-bold font-mono">Back</button>
                  <button
                    onClick={() => {
                      if (otpCode !== "777" && otpCode.trim() !== "") {
                        setOtpVerified(true);
                        setOnboardingStep("personalization");
                      } else {
                        // Accept standard bypass
                        setOtpVerified(true);
                        setOnboardingStep("personalization");
                      }
                    }}
                    className="flex-1 py-2 bg-[#1E2A1E] hover:bg-[#283c28] text-white font-extrabold rounded-2xl transition"
                  >
                    Verify Pass
                  </button>
                </div>
              </div>
            )}

            {/* Interests selecting */}
            {onboardingStep === "personalization" && (
              <div className="space-y-4 animate-fade-in text-left text-xs">
                <div className="text-center space-y-1">
                  <h3 className="text-base font-black text-peg-dark">Personalize Stream Algorithms</h3>
                  <p className="text-xs text-slate-500">Select matrices to initialize the feed engine.</p>
                </div>

                {/* Profile Avatar presets */}
                <div className="p-3.5 bg-slate-50 border rounded-2xl flex items-center gap-3 justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src={chosenAvatar} className="w-10 h-10 rounded-full object-cover border" alt="" />
                    <div>
                      <span className="font-extrabold text-peg-dark block">@{regUsername || "alex_stark"}</span>
                      <span className="text-[9.5px] text-slate-450 italic">"{chosenBio.substring(0, 30)}..."</span>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    {[
                      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
                      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=200"
                    ].map((url, idx) => (
                      <button
                        key={idx}
                        onClick={() => setChosenAvatar(url)}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 cursor-pointer transition ${
                          chosenAvatar === url ? "border-peg-primary scale-110" : "border-transparent opacity-50"
                        }`}
                      >
                        <img src={url} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Categories matrix selection */}
                <div className="grid grid-cols-3 gap-1.5">
                  {interestCategories.map((cat) => {
                    const active = chosenInterests.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          if (active) {
                            setChosenInterests(chosenInterests.filter(i => i !== cat));
                          } else {
                            setChosenInterests([...chosenInterests, cat]);
                          }
                        }}
                        className={`py-2 rounded-xl border text-[10px] font-bold truncate transition cursor-pointer ${
                          active 
                            ? "bg-peg-primary/20 border-peg-accent text-[#1E2A1E] font-extrabold" 
                            : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold uppercase block">Self description Bio</span>
                  <input
                    type="text"
                    value={chosenBio}
                    onChange={(e) => setChosenBio(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs text-peg-dark outline-none"
                  />
                </div>

                <button
                  onClick={handleCompletePersonalization}
                  className="w-full py-2.5 bg-peg-primary hover:bg-peg-accent text-[#1E2A1E] font-black rounded-2xl cursor-pointer transition shadow-xs uppercase tracking-wide text-xs"
                >
                  Spawn Feed Engine ({chosenInterests.length} selected)
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* 3. MAIN DASHBOARD CHANNELS FRAME */}
      {onboardingDone && (
        <div className="max-w-4xl mx-auto flex flex-col min-h-screen w-full relative pb-20">
          
          {/* Header Bar */}
          <header className={`px-4 sm:px-6 py-3.5 border-b flex justify-between items-center z-20 ${
            isDarkTheme ? "bg-[#1E2A1E] border-slate-700" : "bg-white border-slate-100"
          }`}>
            <div className="flex items-center gap-2.5 text-left">
              <div className="w-8 h-8 rounded-xl bg-peg-primary flex items-center justify-center shadow-xs">
                <span className="font-black text-[#1E2A1E] text-md font-mono">P</span>
              </div>
              <div>
                <span className="text-base font-black tracking-tight text-peg-dark block leading-none">Pegger</span>
                <span className="text-[8px] font-mono tracking-widest uppercase text-peg-accent">{currentText.tagline}</span>
              </div>
            </div>

            {/* Header controls layout */}
            <div className="flex items-center gap-2 text-xs">
              
              {/* Theme toggler */}
              <button
                onClick={() => setIsDarkTheme(!isDarkTheme)}
                className="p-1.5 bg-slate-50 border hover:bg-slate-100 rounded-lg cursor-pointer transition text-slate-500"
                title="Toggle visual style"
              >
                {isDarkTheme ? <Sun size={13} /> : <Moon size={13} />}
              </button>

              {/* Language switcher */}
              <button
                onClick={() => setLanguage(language === "en" ? "es" : language === "es" ? "ja" : language === "ja" ? "de" : "en")}
                className="px-2.5 py-1 bg-slate-50 border hover:bg-slate-100 rounded-lg cursor-pointer text-[9px] font-mono font-bold uppercase flex items-center gap-0.5"
                title="Cycle localizations translation"
              >
                <Globe size={11} /> {language}
              </button>

              {/* Direct active report link */}
              <button 
                onClick={() => setReportState(r => ({ ...r, open: true, videoId: videosFeed[0]?.id || "v-1" }))}
                className="px-3 py-1 bg-rose-50 text-rose-600 border border-rose-100 rounded-lg hover:bg-rose-100 transition font-mono font-extrabold text-[9.5px] uppercase"
                title="File compliance audit report"
              >
                Report File
              </button>
            </div>
          </header>

          {/* CENTRAL CONTENTS DISPLAY CONTAINER SLOT */}
          <main className="flex-1 w-full bg-transparent overflow-y-auto">
            
            {/* View Switching */}
            {activeTab === "home" && (
              <div className="space-y-4 max-w-lg mx-auto py-2">
                <FeedView 
                  videos={videosFeed}
                  onToggleLike={handleToggleLike}
                  onToggleSave={handleToggleSave}
                  onToggleFollow={handleToggleFollow}
                  onAddCommentCount={handleAddCommentCount}
                  commentsOverride={commentsFeed}
                  onAddCommentLocal={handleAddCommentLocal}
                  onSelectProfile={(handle) => {
                    setSelectedProfileHandle(handle);
                    setActiveTab("profile");
                  }}
                />
              </div>
            )}

            {activeTab === "discover" && (
              <DiscoverView 
                onSelectVideo={(v) => {
                  const idx = videosFeed.findIndex(vid => vid.id === v.id);
                  if (idx !== -1) {
                    // Switch tab
                    setActiveTab("home");
                  }
                }} 
                onSelectProfile={(handle) => {
                  setSelectedProfileHandle(handle);
                  setActiveTab("profile");
                }}
              />
            )}

            {activeTab === "create" && (
              <CreativeStudio onPublishVideo={handlePublishVideo} />
            )}

            {activeTab === "activity" && (
              <ActivityView />
            )}

            {activeTab === "profile" && (
              <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 animate-fade-in text-left">
                
                {/* Visual guest mode breadcrumb header if viewing another creator's profile */}
                {!isViewingSelf && (
                  <div className="flex justify-between items-center bg-slate-50 border p-3.5 rounded-2xl animate-fade-in">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase font-black text-slate-400">Viewing Pegger Network:</span>
                      <span className="text-xs font-black text-peg-accent">@{activeProfileHandle}</span>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedProfileHandle(null);
                        setProfileViewSection("creations");
                      }}
                      className="px-3 py-1.5 bg-[#1E2A1E] hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                    >
                      ↩ Return to My Profile
                    </button>
                  </div>
                )}

                {/* Profile Header card info */}
                <div className="bg-white border rounded-[32px] p-5 flex flex-col md:flex-row items-center justify-between gap-6 relative shadow-sm">
                  
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    {/* Avatar visual */}
                    <div className="relative">
                      <img src={currentProfileInfo.avatar} className="w-18 h-18 rounded-full border-2 border-peg-accent object-cover shadow-sm" alt="" referrerPolicy="no-referrer" />
                      <span className="absolute bottom-0 right-0 bg-yellow-500 rounded-full p-1 border border-white text-[8px] font-mono" title="Verified Creator">🌱</span>
                    </div>

                    <div className="text-center sm:text-left space-y-1">
                      <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                        <span className="text-base font-black text-peg-dark">{currentProfileInfo.name}</span>
                        <span className="bg-peg-primary/20 text-[#1E2A1E] font-bold text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-lg border font-mono">
                          {isViewingSelf ? "Premium Creator" : "Verified Partner"}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono block">@{currentProfileInfo.handle}</span>
                      <p className="text-xs text-slate-500 font-sans leading-relaxed max-w-xs">{currentProfileInfo.bio}</p>
                    </div>
                  </div>

                  {/* Profile statistics rows */}
                  <div className="flex gap-6 text-center bg-slate-50 p-4 rounded-2xl border">
                    <div>
                      <span className="text-xs font-black block text-peg-dark">{(currentProfileInfo.followersCount).toLocaleString()}</span>
                      <span className="text-[9.5px] font-mono text-slate-400 block uppercase font-bold">Followers</span>
                    </div>
                    <div className="w-[1px] bg-slate-200"></div>
                    <div>
                      <span className="text-xs font-black block text-peg-dark">{(currentProfileInfo.followingCount).toLocaleString()}</span>
                      <span className="text-[9.5px] font-mono text-slate-400 block uppercase font-bold">Following</span>
                    </div>
                    <div className="w-[1px] bg-slate-200"></div>
                    <div>
                      <span className="text-xs font-black block text-peg-dark">{(currentProfileInfo.totalHearts || 0).toLocaleString()}</span>
                      <span className="text-[9.5px] font-mono text-slate-400 block uppercase font-bold">Hearts</span>
                    </div>
                  </div>

                </div>

                {/* Tabs selection: Profile tab channels */}
                <div className="flex gap-1 bg-white p-1 rounded-2xl border text-xs font-bold shadow-xs">
                  <button
                    onClick={() => setProfileViewSection("creations")}
                    className={`flex-1 py-2 rounded-xl transition ${
                      profileViewSection === "creations" ? "bg-[#1E2A1E] text-white" : "text-slate-400 hover:text-peg-dark"
                    }`}
                  >
                    {isViewingSelf ? "My Posts" : "Posts"} ({videosFeed.filter(v => isViewingSelf ? v.creatorId === "me" : v.creatorHandle === activeProfileHandle).length})
                  </button>
                  <button
                    onClick={() => setProfileViewSection("saved")}
                    className={`flex-1 py-2 rounded-xl transition ${
                      profileViewSection === "saved" ? "bg-[#1E2A1E] text-white" : "text-slate-400 hover:text-peg-dark"
                    }`}
                  >
                    {isViewingSelf ? "Saves" : "Favorites"}
                  </button>
                  {isViewingSelf && (
                    <>
                      <button
                        onClick={() => setProfileViewSection("drafts")}
                        className={`flex-1 py-2 rounded-xl transition ${
                          profileViewSection === "drafts" ? "bg-[#1E2A1E] text-white" : "text-slate-400 hover:text-peg-dark"
                        }`}
                      >
                        Drafts
                      </button>
                      <button
                        onClick={() => setProfileViewSection("blueprint")}
                        className={`flex-1 py-2 rounded-xl transition ${
                          profileViewSection === "blueprint" ? "bg-[#1E2A1E] text-white" : "text-slate-400 hover:text-peg-dark"
                        }`}
                      >
                         SQL Blueprints
                      </button>
                      <button
                        onClick={() => setProfileViewSection("metrics")}
                        className={`flex-1 py-2 rounded-xl transition ${
                          profileViewSection === "metrics" ? "bg-[#1E2A1E] text-white font-black" : "text-slate-400 hover:text-peg-dark"
                        }`}
                      >
                         Insights
                      </button>
                    </>
                  )}
                </div>

                {/* Sub Tab contents slots render */}
                <div className="bg-white border rounded-[32px] p-5 shadow-xs">
                  
                  {/* Tab 1: Creations view list */}
                  {profileViewSection === "creations" && (
                    <div className="space-y-4">
                      <span className="text-xs font-black text-peg-dark uppercase">Published short videos:</span>
                      
                      {videosFeed.filter(v => isViewingSelf ? v.creatorId === "me" : v.creatorHandle === activeProfileHandle).length === 0 ? (
                        <div className="p-12 text-center text-slate-400 text-xs">
                          {isViewingSelf 
                            ? "No publicized posts found. Pivot to 'Create Studio' to publish your first content!"
                            : `@${activeProfileHandle} has not published any short videos yet.`}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {videosFeed.filter(v => isViewingSelf ? v.creatorId === "me" : v.creatorHandle === activeProfileHandle).map(v => (
                            <div 
                              key={v.id}
                              onClick={() => {
                                const masterIdx = videosFeed.findIndex(mv => mv.id === v.id);
                                if (masterIdx !== -1) {
                                  setActiveTab("home");
                                }
                              }}
                              className="bg-slate-50 border p-3 rounded-2xl hover:border-peg-primary cursor-pointer transition flex flex-col justify-between h-[96px]"
                            >
                              <span className="text-[11px] font-black text-peg-dark truncate">{v.title}</span>
                              <p className="text-[10px] text-slate-500 line-clamp-1">{v.description}</p>
                              <div className="flex justify-between items-center text-[9px] font-sans font-bold text-peg-accent pt-1.5 border-t">
                                <span>💚 {v.likesCount.toLocaleString()} likes</span>
                                <span className="bg-white px-1 ml-1 rounded font-mono border uppercase text-[8px]">{v.filterApplied}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tab 2: Saved items list */}
                  {profileViewSection === "saved" && (
                    <div className="space-y-4">
                      <span className="text-xs font-black text-peg-dark uppercase">
                        {isViewingSelf ? "Bookmarked saves grid:" : "Public Liked Videos:"}
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {videosFeed.filter(v => isViewingSelf ? (v.isSaved || v.id === "v-3") : v.creatorHandle === activeProfileHandle).map(v => (
                          <div 
                            key={v.id}
                            onClick={() => {
                              setActiveTab("home");
                            }}
                            className="bg-slate-50 border p-3 rounded-2xl hover:border-peg-primary cursor-pointer transition flex flex-col justify-between h-[96px]"
                          >
                            <span className="text-[11px] font-bold text-peg-dark truncate">{v.title}</span>
                            <span className="text-[9.5px] text-slate-400 font-mono">@{v.creatorHandle}</span>
                            <div className="flex justify-between items-center text-[9px] font-sans text-peg-accent pt-1 font-bold">
                              <span>❤️ {v.likesCount.toLocaleString()}</span>
                              <span className="bg-amber-50 text-amber-500 text-[8.5px] px-1 py-0.5 rounded">
                                {isViewingSelf ? "Saved" : "Hot"}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 3: Drafts section info list */}
                  {profileViewSection === "drafts" && (
                    <div className="space-y-4">
                      <span className="text-xs font-black text-peg-dark uppercase">Unpublished project drafts:</span>
                      <div className="bg-slate-50 p-4 rounded-2xl border text-center space-y-2">
                        <span className="text-base">📋</span>
                        <h4 className="text-xs font-bold text-peg-dark">Modular Clover loop compilation</h4>
                        <p className="text-[10px] text-slate-500 max-w-xs mx-auto">Initial drafting completed with Sunset Mist filter preset. Waiting on final transcode checking.</p>
                        <button 
                          onClick={() => {
                            setActiveTab("create");
                          }}
                          className="px-3 py-1.5 bg-[#1E2A1E] text-white text-[10px] font-bold rounded-lg cursor-pointer"
                        >
                          Restore Draft in Studio
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tab 4: System Blueprints specifications hub */}
                  {profileViewSection === "blueprint" && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-peg-dark">
                        <Layers size={14} className="text-peg-primary" /> Active PostgreSQL Schemas & Roadmaps
                      </div>
                      <ArchitectureHub />
                    </div>
                  )}

                  {/* Tab 5: Analytics metrics */}
                  {profileViewSection === "metrics" && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-peg-dark">
                        <TrendingUp size={14} className="text-peg-primary" /> Live Creator Analytics Insights
                      </div>
                      
                      {/* Pegger Dynamic Recommendation Bot Control Panel */}
                      <div className="bg-[#101813] border border-[#162719] rounded-2xl p-4 text-slate-100 space-y-3 shadow-md">
                        <div className="flex justify-between items-center border-b border-[#162719] pb-2">
                          <div>
                            <span className="text-[10px] text-emerald-400 font-mono tracking-wider block uppercase">Algorithmic Automation Shield</span>
                            <h4 className="text-xs font-black text-white flex items-center gap-1.5 mt-0.5">
                              🤖 Cognitive Recommendation Bot Engine
                            </h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase ${botActive ? "bg-emerald-500/10 text-emerald-400 animate-pulse border border-emerald-500/20" : "bg-slate-800 text-slate-400"}`}>
                            {botActive ? "● Simulating Passive Feed" : "■ Paused"}
                          </span>
                        </div>

                        {/* Bot logs */}
                        <div className="bg-slate-950 px-3 py-2 rounded-xl text-[10px] font-mono text-emerald-300/90 leading-relaxed border border-slate-900 min-h-[44px] flex items-center">
                          ⚡ {botLog}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                          {/* Left controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setBotActive(!botActive)}
                              className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition text-[10px] ${
                                botActive ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-550/30" : "bg-emerald-500 text-slate-950 font-black hover:bg-emerald-400"
                              }`}
                            >
                              {botActive ? "Pause Agent" : "Resume Agent"}
                            </button>

                            {botActive && (
                              <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-850 rounded-xl">
                                <button
                                  onClick={() => setBotPace("snail")}
                                  className={`px-2 py-0.5 rounded-lg text-[9px] font-bold cursor-pointer transition ${botPace === "snail" ? "bg-white text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
                                >
                                  Snail
                                </button>
                                <button
                                  onClick={() => setBotPace("active")}
                                  className={`px-2 py-0.5 rounded-lg text-[9px] font-bold cursor-pointer transition ${botPace === "active" ? "bg-white text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
                                >
                                  Active
                                </button>
                                <button
                                  onClick={() => setBotPace("viral")}
                                  className={`px-2 py-0.5 rounded-lg text-[9px] font-bold cursor-pointer transition ${botPace === "viral" ? "bg-emerald-400 text-slate-950 font-black" : "text-slate-400 hover:text-white"}`}
                                >
                                  Viral
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Instant click action */}
                          <button
                            onClick={() => {
                              const myVids = videosFeed.filter(v => v.creatorId === "me");
                              if (myVids.length === 0) {
                                alert("⚠️ Personal feed is dry! Compose and publish a short video loop in 'Create' studio first to trigger organic traffic.");
                                return;
                              }
                              // Fast injection loop
                              const randomVid = myVids[Math.floor(Math.random() * myVids.length)];
                              const prospectiveActors = ["cyber_aria", "syntax_weaver", "elena_silver", "abyss_pulse", "leaf_clipper", "nature_fan"];
                              const actor = prospectiveActors[Math.floor(Math.random() * prospectiveActors.length)];

                              // Increment counts
                              setVideosFeed(prev => prev.map(v => {
                                if (v.id === randomVid.id) {
                                  return { 
                                    ...v, 
                                    likesCount: v.likesCount + 2, 
                                    commentsCount: v.commentsCount + 1 
                                  };
                                }
                                return v;
                              }));

                              // App comment
                              const instantComment: Comment = {
                                id: `instant-sim-${Date.now()}`,
                                videoId: randomVid.id,
                                userName: actor.replace("_", " ").toUpperCase(),
                                userHandle: actor,
                                userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
                                text: "Insane creative pacing! Love the clover themes 🌿✨",
                                timestamp: "Just now",
                                likesCount: 1,
                                hasLiked: false
                              };
                              setCommentsFeed(prev => [instantComment, ...prev]);

                              // Follow back
                              setFollowersList(prev => {
                                if (!prev.includes(actor)) return [...prev, actor];
                                return prev;
                              });

                              setNotifications(prev => [
                                { id: Date.now(), text: `⚡ @${actor} instantly engaged and followed your profile in viral surge!`, time: "Just now" },
                                ...prev
                              ]);

                              setBotLog(`Surge Bot: Successfully triggered 5x conversion rate check on your video loop "${randomVid.title}"!`);
                            }}
                            className="px-3.5 py-1.5 bg-[#7BC47F] hover:bg-[#5EA66A] text-[#1E2A1E] font-black rounded-xl text-xs flex items-center gap-1 shadow-sm transition cursor-pointer"
                          >
                            🚀 Trigger Viral Surge
                          </button>
                        </div>
                      </div>

                      <CreatorDashboard 
                        followersCount={myProfile.followersCount}
                        totalHearts={myProfile.totalHearts}
                        videosCount={videosFeed.filter(v => v.creatorId === "me").length}
                      />
                    </div>
                  )}

                </div>

                {/* Sub setting: quick access options to secondary portals */}
                <div className="bg-slate-50 p-4 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-left">
                    <span className="text-xs font-black text-peg-dark block">Compliance & Virtual Livestreams</span>
                    <p className="text-[10px] text-slate-500">Access supplementary platform portals like PegSafe AI Scanner, or stream viewer simulation.</p>
                  </div>
                  <div className="flex gap-2 text-xs font-bold font-mono">
                    <button 
                      onClick={() => alert("🌻 Live Broadcasting is currently simulated! Head over to Home Feed or Creator metrics inside Profile.")}
                      className="px-3 py-1.5 bg-peg-primary text-[#1E2A1E] rounded-xl hover:bg-peg-accent transition cursor-pointer"
                    >
                      Broadcast Live Room
                    </button>
                    <button 
                      onClick={() => setProfileViewSection("blueprint")}
                      className="px-3 py-1.5 bg-[#1E2A1E] text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
                    >
                      Infrastructure blueprint Spec
                    </button>
                  </div>
                </div>

              </div>
            )}

          </main>

          {/* SECURE FLAT BOTTOM NAVIGATION CONTAINER DOCK (NON-FLOATING FOR FULL SYSTEM FIDELITY) */}
          <nav className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg backdrop-blur-md border-t shadow-2xl flex justify-around p-2 z-40 transition-all duration-300 uppercase tracking-wider text-[10px] font-black ${
            activeTab === "home" 
              ? "bg-slate-950/90 border-white/10 text-white" 
              : "bg-white/95 border-slate-100 text-slate-500"
          }`}>
            
            {/* Tab 1: Home */}
            <button
              onClick={() => setActiveTab("home")}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeTab === "home" 
                  ? "bg-peg-primary text-slate-950 font-extrabold shadow-sm" 
                  : activeTab === "home" ? "text-white" : "text-neutral-400 hover:text-white"
              }`}
            >
              <Home size={15} className={activeTab === "home" ? "text-slate-950 fill-slate-950/10" : ""} />
              <span className="text-[8px] font-extrabold">Home</span>
            </button>

            {/* Tab 2: Discover */}
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeTab === "discover" 
                  ? "bg-peg-primary text-slate-950 font-extrabold shadow-sm" 
                  : activeTab === "home" ? "text-neutral-300 hover:text-white" : "text-slate-450 hover:text-peg-dark"
              }`}
            >
              <Compass size={15} />
              <span className="text-[8px] font-extrabold">Discover</span>
            </button>

            {/* Tab 3: Create */}
            <button
              onClick={() => setActiveTab("create")}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeTab === "create" 
                  ? "bg-peg-primary text-slate-950 font-extrabold shadow-sm" 
                  : activeTab === "home" ? "text-neutral-350 hover:text-white" : "text-slate-450 hover:text-peg-dark"
              }`}
            >
              <div className="p-1.5 bg-peg-primary rounded-xl text-slate-950 shadow-lg transform -translate-y-2 hover:scale-110 active:scale-95 transition-all duration-200">
                <Camera size={14} />
              </div>
              <span className="text-[8px] font-extrabold -mt-2">Create</span>
            </button>

            {/* Tab 4: Activity */}
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl cursor-pointer transition-all duration-300 relative ${
                activeTab === "activity" 
                  ? "bg-peg-primary text-slate-950 font-extrabold shadow-sm" 
                  : activeTab === "home" ? "text-neutral-300 hover:text-white" : "text-slate-450 hover:text-peg-dark"
              }`}
            >
              <Activity size={15} />
              <span className="text-[8px] font-extrabold">Activity</span>
              <span className="absolute top-1.5 right-4 w-1.5 h-1.5 bg-rose-500 rounded-full border border-white"></span>
            </button>

            {/* Tab 5: Profile */}
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-2xl cursor-pointer transition-all duration-300 ${
                activeTab === "profile" 
                  ? "bg-peg-primary text-slate-950 font-extrabold shadow-sm" 
                  : activeTab === "home" ? "text-neutral-300 hover:text-white" : "text-slate-450 hover:text-peg-dark"
              }`}
            >
              <UserIcon size={15} />
              <span className="text-[8px] font-extrabold">Profile</span>
            </button>

          </nav>

        </div>
      )}

      {/* 4. COMPLIANCE VIOLATION ABUSE SCANNING PROMPT */}
      {reportState.open && (
        <div className="fixed inset-0 z-49 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in text-xs text-[#1E2A1E]">
          <div className="bg-white border rounded-[36px] w-full max-w-sm p-6 text-left space-y-4 shadow-2xl relative">
            
            <div className="flex items-center gap-2 text-rose-500">
              <span className="p-1.5 bg-rose-50 rounded-xl">
                <Flag size={18} />
              </span>
              <h3 className="font-extrabold text-xs uppercase tracking-wider">File Compliance Report</h3>
            </div>

            <p className="text-xs text-slate-500 leading-normal">
              PegSafe enforments. Flagged creators trigger automated safety scanning vectors check on caption descriptions to secure high wellness standards.
            </p>

            <div className="space-y-3.5 p-4 bg-slate-50 border rounded-2xl">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-mono font-bold uppercase">Violation criteria</span>
                <select 
                  value={reportState.reason}
                  onChange={(e) => setReportState(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full text-xs px-2.5 py-1.5 bg-white border rounded-xl"
                >
                  <option value="Copyright">Copyright Infringement</option>
                  <option value="Harassment">Abuse & Harassment</option>
                  <option value="Dangerous">Dangerous activity / stunts</option>
                  <option value="Explicit">Explicit contents</option>
                </select>
              </div>

              <label className="flex items-center gap-2 font-bold cursor-pointer">
                <input
                  type="checkbox"
                  checked={reportState.blocked}
                  onChange={(e) => setReportState(prev => ({ ...prev, blocked: e.target.checked }))}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
                <span>Block this user from my stream feed</span>
              </label>
            </div>

            {reportState.processed ? (
              <div className="text-[10px] text-center text-rose-500 font-mono font-bold animate-pulse">
                ⏳ Running Gemini compliance scanning vectors...
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setReportState({ open: false, videoId: "", reason: "Harassment", blocked: false, processed: false })}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold rounded-xl text-xs font-mono transition"
                >
                  Cancel
                </button>
                <button
                  onClick={triggerSubmitReport}
                  className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Ban size={12} /> Submit Report Log
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
