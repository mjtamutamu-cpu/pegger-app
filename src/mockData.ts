/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Video, Comment, DirectChat, Gift, CreatorMetric } from "./types";

export const INITIAL_VIDEOS: Video[] = [
  {
    id: "v-1",
    creatorId: "u-1",
    creatorName: "Aria Cybernetic",
    creatorHandle: "cyber_aria",
    creatorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    title: "Synthwave Beats from Neo-Kyoto",
    description: "Synthesized a new bassloop in the retro mainframe. Let me know if the electric peg goes hard! ⚡🎹",
    tags: ["PeggerCyber", "VoltWave", "MAIN_FRAME", "electronic"],
    filterApplied: "Electric Violet",
    speedModifier: 1.0,
    likesCount: 142300,
    commentsCount: 942,
    savesCount: 18400,
    repostsCount: 3200,
    musicName: "Neon Mainframe Overdrive",
    musicArtist: "Aria Cybernetic",
    visualColorTop: "#10b981", // Emerald Green
    visualColorBottom: "#14b8a6", // Teal
    isLiked: false,
    isSaved: false,
    isReposted: false
  },
  {
    id: "v-2",
    creatorId: "u-2",
    creatorName: "Syntax Weaver",
    creatorHandle: "syntax_weaver",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    title: "Blisteringly Fast Compiler Hacks",
    description: "Rewriting the short-form recommendation router into a single zero-cost recursive template loop. Compile time went to zero, heart rates went to 150! 🚀💻💻",
    tags: ["DevGlow", "coding", "rustlang", "speedrun"],
    filterApplied: "Cyber Wave",
    speedModifier: 2.0,
    likesCount: 89400,
    commentsCount: 1530,
    savesCount: 31000,
    repostsCount: 5600,
    musicName: "Z-Byte Compiler Beats",
    musicArtist: "Weave Syndicate",
    visualColorTop: "#34d399", // Light Green
    visualColorBottom: "#0f766e", // Dark Teal
    isLiked: false,
    isSaved: false,
    isReposted: false
  },
  {
    id: "v-3",
    creatorId: "u-3",
    creatorName: "Elena Silverwood",
    creatorHandle: "elena_silver",
    creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
    title: "Sculpting the Silver Crown",
    description: "Pouring high-gloss sterling compound under liquid nitrogen. The thermal shock created these fractal wave guides! 👑❄️🧊",
    tags: ["SilverRetro", "fractal", "molten", "satisfying"],
    filterApplied: "Silver Retro",
    speedModifier: 1.0,
    likesCount: 324900,
    commentsCount: 4500,
    savesCount: 122000,
    repostsCount: 19400,
    musicName: "Fractal Resonance (Acoustic)",
    musicArtist: "Helium Trio",
    visualColorTop: "#6ee7b7", // Mint Green
    visualColorBottom: "#047857", // Dark Green
    isLiked: false,
    isSaved: false,
    isReposted: false
  },
  {
    id: "v-4",
    creatorId: "u-4",
    creatorName: "Deep Abyss Dancer",
    creatorHandle: "abyss_pulse",
    creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    title: "Fluorescent Dreamscape Live",
    description: "Capturing deep sea bioluminescent rhythms from our Pacific submarine simulator. Watch the cellular pulse! 🧬🌊👾",
    tags: ["DreamyGlow", "underwater", "neonrave", "meditative"],
    filterApplied: "Dreamy Glow",
    speedModifier: 0.5,
    likesCount: 512000,
    commentsCount: 8305,
    savesCount: 198000,
    repostsCount: 22400,
    musicName: "Abyssal Swell Ambient",
    musicArtist: "The Bathysphere",
    visualColorTop: "#a7f3d0", // Soft Mint
    visualColorBottom: "#065f46", // Deep Forest Green
    isLiked: false,
    isSaved: false,
    isReposted: false
  }
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: "c-1",
    videoId: "v-1",
    userName: "Electro Hype",
    userHandle: "electro_hype",
    userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100",
    text: "This bass loop actually made my desk rattle. Pegger has the cleanest audio player on the web! 🔥🎧",
    timestamp: "2h ago",
    likesCount: 412,
    hasLiked: false
  },
  {
    id: "c-2",
    videoId: "v-1",
    userName: "Volt Fanatic",
    userHandle: "fan_volt",
    userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100",
    text: "Love that deep violet branding, looks like a digital high-tier arcade.",
    timestamp: "1h ago",
    likesCount: 184,
    hasLiked: false
  },
  {
    id: "c-3",
    videoId: "v-2",
    userName: "Garbage Collector",
    userHandle: "zero_gc",
    userAvatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=100",
    text: "Bro, compiler hacks on 2x speed is how I want to digest all my computer science degrees from now on.",
    timestamp: "3h ago",
    likesCount: 890,
    hasLiked: false
  },
  {
    id: "c-4",
    videoId: "v-3",
    userName: "Metallurgy Pro",
    userHandle: "metal_god",
    userAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&q=80&w=100",
    text: "The crystal formations around the edge indicate perfect cryogenic temperature control. Fantastic craftsmanship!",
    timestamp: "4h ago",
    likesCount: 3045,
    hasLiked: false
  }
];

export const INITIAL_CHATS: DirectChat[] = [
  {
    userId: "fc-1",
    userName: "Coach Pegger",
    userHandle: "pegger_official",
    userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2??auto=format&fit=crop&q=80&w=200",
    lastMessage: "Welcome to Pegger! Head over to the Creator Tools to set up tipping configs and claim your crown! ⚡",
    timestamp: "10:14 AM",
    unreadCount: 1,
    messages: [
      {
        id: "m-1",
        senderId: "fc-1",
        senderName: "Coach Pegger",
        senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2??auto=format&fit=crop&q=80&w=200",
        text: "Hey! Thrilled to have you in our community of creators.",
        timestamp: "Yesterday",
        isMine: false
      },
      {
        id: "m-2",
        senderId: "fc-1",
        senderName: "Coach Pegger",
        senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2??auto=format&fit=crop&q=80&w=200",
        text: "Welcome to Pegger! Head over to the Creator Tools to set up tipping configs and claim your crown! ⚡",
        timestamp: "10:14 AM",
        isMine: false
      }
    ]
  },
  {
    userId: "fc-2",
    userName: "Vibe Master",
    userHandle: "vibe_lord",
    userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
    lastMessage: "No problem, that custom Cyber Wave filter goes CRAZY! Let's collab soon.",
    timestamp: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "m-3",
        senderId: "me",
        senderName: "My Profile",
        senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
        text: "Did you catch my latest video compilation?",
        timestamp: "Yesterday",
        isMine: true
      },
      {
        id: "m-4",
        senderId: "fc-2",
        senderName: "Vibe Master",
        senderAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
        text: "No problem, that custom Cyber Wave filter goes CRAZY! Let's collab soon.",
        timestamp: "Yesterday",
        isMine: false
      }
    ]
  }
];

export const VIRTUAL_GIFTS: Gift[] = [
  { id: "g-1", name: "Violet Rose", costInPegs: 5, emoji: "🌹", visualEffect: "violet-explosion" },
  { id: "g-2", name: "Electric Peg", costInPegs: 15, emoji: "⚡", visualEffect: "lightning-flash" },
  { id: "g-3", name: "Silver Crown", costInPegs: 99, emoji: "👑", visualEffect: "silver-sparkle" },
  { id: "g-4", name: "Cyber Yacht", costInPegs: 499, emoji: "🚢", visualEffect: "diamonds-rain" }
];

export const STATS_METRICS: CreatorMetric[] = [
  { id: "m-1", label: "Views (Last 30d)", value: "2,481,200", change: "+24.5%", isPositive: true, description: "Total video impressions across both discovery engines." },
  { id: "m-2", label: "Net Earnings (PEGS)", value: "12,850 P", change: "+12.1%", isPositive: true, description: "Total creator tipping, virtual gifts received during livestream, and brand pool payout." },
  { id: "m-3", label: "Subscriber Base", value: "32,900", change: "+4.1%", isPositive: true, description: "Highly active followers opting in to receive daily status notifications." },
  { id: "m-4", label: "Toxicity Block Rate", value: "99.8%", change: "-2.3%", isPositive: false, description: "AI moderation shield block auto-rejection accuracy." }
];

// Structural Production Documentation requested by the user
export const TECHNICAL_ARCHITECTURE = {
  databaseSchema: `
-- PEGGER PRODUCTION-READY DATABASE SCHEMA (PostgreSQL / Google Cloud Spanner)

-- Users Table
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    handle VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(30) UNIQUE,
    avatar_url VARCHAR(512),
    bio TEXT,
    website_url VARCHAR(255),
    followers_count INT DEFAULT 0,
    following_count INT DEFAULT 0,
    total_hearts_received INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Videos Metadata Table
CREATE TABLE videos (
    id VARCHAR(64) PRIMARY KEY,
    creator_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    cdn_video_url VARCHAR(512) NOT NULL,
    thumbnail_url VARCHAR(512),
    music_name VARCHAR(120),
    music_artist VARCHAR(120),
    filter_preset VARCHAR(50) DEFAULT 'Normal',
    speed_modifier DECIMAL(2,1) DEFAULT 1.0,
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    saves_count INT DEFAULT 0,
    reposts_count INT DEFAULT 0,
    transcoded_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Video Tags Intersection
CREATE TABLE video_tags (
    video_id VARCHAR(64) REFERENCES videos(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (video_id, tag_name)
);

-- Interactions: Likes
CREATE TABLE video_likes (
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    video_id VARCHAR(64) REFERENCES videos(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, video_id)
);

-- Comments Table
CREATE TABLE comments (
    id VARCHAR(64) PRIMARY KEY,
    video_id VARCHAR(64) REFERENCES videos(id) ON DELETE CASCADE,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    text VARCHAR(1000) NOT NULL,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Direct Messages Table
CREATE TABLE direct_messages (
    id VARCHAR(64) PRIMARY KEY,
    sender_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    receiver_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    text TEXT,
    media_url VARCHAR(512),
    sticker VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Virtual Receipts for monetization
CREATE TABLE virtual_gift_earnings (
    id VARCHAR(64) PRIMARY KEY,
    sender_id VARCHAR(64) REFERENCES users(id),
    creator_id VARCHAR(64) REFERENCES users(id),
    gift_type VARCHAR(50) NOT NULL,
    pegs_value INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
  `,
  apiStructure: `
# PEGGER API ARCHITECTURE (REST & GraphQL Blueprint)

## 1. REST Endpoints (Optimized for Video CDN & Auth)
- **POST /api/v1/auth/register-login**: Handles federated logins (JWT issue).
- **POST /api/v1/videos/presigned-upload**: Returns secure, temporary AWS S3/GCS URLs for chunked video uploads.
- **GET /api/v1/videos/stream/:id**: Serve Adaptive Bitrate HLS playlists (.m3u8) for variable bitrate delivery.
- **POST /api/v1/moderation/scan**: Automatically check video OCR, audio transcription, and metadata safety with Gemini/Vertex AI.

## 2. GraphQL Schema (Real-time Operations & Social Graph)
\`\`\`graphql
type User {
  id: ID!
  name: String!
  handle: String!
  avatarUrl: String
  bio: String
  followersCount: Int!
  followingCount: Int!
  totalHeartsReceived: Int!
  isVerified: Boolean!
}

type Video {
  id: ID!
  creator: User!
  title: String!
  description: String
  cdnVideoUrl: String!
  thumbnailUrl: String
  musicName: String
  musicArtist: String
  likesCount: Int!
  commentsCount: Int!
  savesCount: Int!
  created_at: String!
}

type Query {
  personalizedFeed(limit: Int!, offset: Int!): [Video!]!
  followingFeed(userId: ID!): [Video!]!
  searchContent(query: String!, types: [String!]!): SearchResult!
  creatorAnalytics(userId: ID!): AnalyticsData!
}

type Mutation {
  likeVideo(videoId: ID!): Boolean!
  postComment(videoId: ID!, text: String!): Comment!
  sendDirectMessage(receiverId: ID!, text: String, mediaUrl: String): Message!
  purchasePinsWallet(amount: Int!): Int!
  sendVirtualGift(creatorId: ID!, giftId: ID!): Boolean!
}

type Subscription {
  newMessage(roomId: ID!): Message!
  liveGiftReceived(streamerId: ID!): GiftAnimation!
}
\`\`\`
  `,
  infrastructureStrategy: `
# DEPLOYMENT TOPOLOGY & GLOBAL CDN PIPELINE

## 1. Multi-Platform Edge Mesh
- **Clients**: Flutter/Swift/Kotlin compiled natively with GPU-accelerated video scaling.
- **Dynamic Routing**: Cloudflare Anycast CDN routing requests to the closest regional cluster.

## 2. Server Cluster (Google Cloud Run / GKE Containers)
- **API Gateways**: Nginx Kubernetes Ingress / Envoy proxy resolving JWT signatures and managing rate-limiting.
- **Microservices**: Node.js/Go backend pods autoscaling from 0 to thousands under spikes (using Pub/Sub for background transcoders).

## 3. Video Transcoding Pipeline
- Custom trigger: S3/GCS upload -> Cloud Function invocation -> FFmpeg micro-container splits into:
  - **1080p** (5.5 Mbps) -> High-end devices / Wi-Fi
  - **720p** (3.0 Mbps) -> Medium-tier
  - **480p** (1.2 Mbps) -> Mobile networks / low-end devices
- Compresses with H.264/AAC codec, converting each stream into HTTP Live Streaming (HLS) segments.

## 4. Real-time Infrastructure
- **WebSockets**: Redis Pub/Sub adapter handles fast-socket matching to host live stream commentary & instant messaging.
- **Cache**: RAM-layer Redis memorizes trending video metadata indices, preventing database overload.
  `,
  roadmaps: [
    { phase: "Phase 1: Brand & Simulation Check", dateRange: "Month 1-2", deliverables: ["Complete interactive high-fidelity preview", "Secure Gemini server endpoints set up", "Basic mobile responsive CSS mock layout"], status: "Completed" },
    { phase: "Phase 2: Mobile App Dev & Transcoding", dateRange: "Month 3-5", deliverables: ["Flutter/iOS/Android wrapper with custom Native bridges", "Integrate FFmpeg pipeline on Cloud Functions", "JWT encryption and Google Sign-In implementation"], status: "Current" },
    { phase: "Phase 3: Live & Media Scale-out", dateRange: "Month 6-8", deliverables: ["Redis cluster integration to broadcast live chat comments", "Implement server-authoritative wallet database for virtual gifts transactions", "Custom recommended system algorithm model V1"], status: "Scheduled" },
    { phase: "Phase 4: Global Launch & Spark Sweep", dateRange: "Month 9+", deliverables: ["Global marketing partner program launch", "Creator tip-matching program pool", "AI-moderated automatic reporting engine scaling"], status: "Scheduled" }
  ]
};
