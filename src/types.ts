/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  website: string;
  followersCount: number;
  followingCount: number;
  totalHearts: number;
  isFollowing?: boolean;
  isVerified?: boolean;
}

export interface Video {
  id: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  title: string;
  description: string;
  tags: string[];
  filterApplied: string; // 'Normal' | 'Electric Violet' | 'Cyber Wave' | 'Silver Retro' | 'Dreamy Glow'
  speedModifier: number; // 0.5 | 1.0 | 2.0
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  repostsCount: number;
  musicName: string;
  musicArtist: string;
  isLiked?: boolean;
  isSaved?: boolean;
  isReposted?: boolean;
  isFollowing?: boolean;
  visualColorTop: string;
  visualColorBottom: string;
  uploadedUrl?: string;
  mediaType?: "video" | "image" | "file";
}

export interface Comment {
  id: string;
  videoId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likesCount: number;
  hasLiked?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  mediaUrl?: string;
  sticker?: string;
}

export interface DirectChat {
  userId: string;
  userName: string;
  userHandle: string;
  userAvatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: Message[];
}

export interface Gift {
  id: string;
  name: string;
  costInPegs: number;
  emoji: string;
  visualEffect: string; // e.g. 'diamonds-rain', 'violet-explosion', 'silver-sparkle'
}

export interface LiveStreamMessage {
  id: string;
  userName: string;
  userAvatar: string;
  text: string;
  gift?: {
    name: string;
    emoji: string;
    count: number;
  };
  timestamp: number;
}

export interface CreatorMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  description: string;
}

export interface ModerationResult {
  approved: boolean;
  toxicityScore: number;
  spamScore: number;
  flaggedKeywords: string[];
  recommendation: string;
  summaryFeedback: string;
}

export interface AICaptionResult {
  captions: {
    text: string;
    hashtags: string[];
  }[];
  suggestedStickers: string[];
  recommendedFilter: string;
}
