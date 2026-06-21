/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Bell, Heart, MessageSquare, AtSign, UserPlus, Send, Image, Check, ChevronRight, MessageCircle 
} from "lucide-react";
import { INITIAL_CHATS } from "../mockData";
import { DirectChat, Message } from "../types";

interface NotificationItem {
  id: string;
  type: "like" | "comment" | "mention" | "follower";
  userName: string;
  userHandle: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  actionText?: string;
  followedBack?: boolean;
}

export default function ActivityView() {
  const [activeSegment, setActiveSegment] = useState<"notifications" | "messages">("notifications");
  const [notificationFilter, setNotificationFilter] = useState<"all" | "like" | "comment" | "mention" | "follower">("all");
  
  // Notification State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-1",
      type: "like",
      userName: "Aria Cybernetic",
      userHandle: "cyber_aria",
      userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      text: "liked your latest 'Forest Dew' visual loop compile.",
      timestamp: "12m ago"
    },
    {
      id: "n-2",
      type: "comment",
      userName: "Syntax Weaver",
      userHandle: "syntax_weaver",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      text: "commented: 'The rendering throughput is flawless on mobile bounds!'",
      timestamp: "45m ago",
      actionText: "Reply inline"
    },
    {
      id: "n-3",
      type: "follower",
      userName: "Elena Silverwood",
      userHandle: "elena_silver",
      userAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      text: "began tracking your publication channels.",
      timestamp: "2h ago",
      followedBack: false
    },
    {
      id: "n-4",
      type: "mention",
      userName: "Deep Abyss Dancer",
      userHandle: "abyss_pulse",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      text: "mentioned @alex_stark in their bioluminescent post: 'Check out the macro setup!'",
      timestamp: "4h ago"
    },
    {
      id: "n-5",
      type: "like",
      userName: "Vibe Master",
      userHandle: "vibe_lord",
      userAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200",
      text: "hearted your scheduled description text draft.",
      timestamp: "Yesterday"
    },
    {
      id: "n-6",
      type: "follower",
      userName: "Coach Pegger",
      userHandle: "pegger_official",
      userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2??auto=format&fit=crop&q=80&w=200",
      text: "opted in to receive your daily stream events notifications.",
      timestamp: "2d ago",
      followedBack: true
    }
  ]);

  // Direct Channels State
  const [chats, setChats] = useState<DirectChat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>("fc-1");
  const [textInput, setTextInput] = useState("");

  const activeChat = chats.find((c) => c.userId === activeChatId) || chats[0];

  const handleSelectChat = (userId: string) => {
    setActiveChatId(userId);
    setChats(prev => prev.map(c => {
      if (c.userId === userId) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !activeChat) return;

    const myMessage: Message = {
      id: `m-user-${Date.now()}`,
      senderId: "me",
      senderName: "My Profile",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      text: textInput,
      timestamp: "Now",
      isMine: true
    };

    setChats(prev => prev.map(chat => {
      if (chat.userId === activeChat.userId) {
        return {
          ...chat,
          lastMessage: textInput,
          timestamp: "Now",
          messages: [...chat.messages, myMessage]
        };
      }
      return chat;
    }));

    setTextInput("");

    // Simulate instant bot responsive thread reply
    setTimeout(() => {
      let botReplyText = "Got you! That physical motion is incredibly fluid. Let's arrange a public stream next week.";
      if (activeChat.userId === "fc-1") {
        botReplyText = "Splendid progress! Your profile metric shows positive growth. Keep pegging! 🌿📈";
      }

      const botMessage: Message = {
        id: `m-bot-${Date.now()}`,
        senderId: activeChat.userId,
        senderName: activeChat.userName,
        senderAvatar: activeChat.userAvatar,
        text: botReplyText,
        timestamp: "Now",
        isMine: false
      };

      setChats(prev => prev.map(chat => {
        if (chat.userId === activeChat.userId) {
          return {
            ...chat,
            lastMessage: botReplyText,
            timestamp: "Now",
            messages: [...chat.messages, botMessage]
          };
        }
        return chat;
      }));
    }, 1500);
  };

  const handleToggleFollowBack = (id: string) => {
    setNotifications(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, followedBack: !item.followedBack };
      }
      return item;
    }));
  };

  const handleInlineReply = (notif: NotificationItem) => {
    const replyText = prompt(`Reply inline as @alex_stark to @${notif.userHandle}:`);
    if (replyText) {
      alert(`💬 Comment reply published: "${replyText}"`);
    }
  };

  // Filtered Notifications list
  const filteredNotifications = notifications.filter(n => {
    if (notificationFilter === "all") return true;
    return n.type === notificationFilter;
  });

  return (
    <div className="w-full bg-[#F7FAF7] text-[#1E2A1E] space-y-6 animate-fade-in text-left max-w-4xl mx-auto p-4 sm:p-6">
      
      {/* Upper selector Segment pills */}
      <div className="bg-white border border-slate-100 p-4 rounded-3xl shadow-sm flex justify-center items-center gap-3">
        <button
          onClick={() => setActiveSegment("notifications")}
          className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSegment === "notifications"
              ? "bg-[#1E2A1E] text-white shadow-sm"
              : "bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-100 hover:text-peg-dark"
          }`}
        >
          <Bell size={14} />
          Alerts Inbox ({notifications.length})
        </button>

        <button
          onClick={() => setActiveSegment("messages")}
          className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSegment === "messages"
              ? "bg-[#1E2A1E] text-white shadow-sm"
              : "bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-100 hover:text-peg-dark"
          }`}
        >
          <MessageSquare size={14} />
          Direct Channels ({chats.reduce((acc, c) => acc + c.unreadCount, 0)})
        </button>
      </div>

      {/* RENDER INBOX / CHATS SEGMENTS */}
      {activeSegment === "notifications" ? (
        <div className="space-y-4">
          
          {/* Notification Categories filter row */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {(["all", "like", "comment", "mention", "follower"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setNotificationFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition capitalize cursor-pointer ${
                  notificationFilter === filter 
                    ? "bg-peg-primary border-peg-accent text-[#1E2A1E] font-black" 
                    : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {filter === "all" ? "All Activity" : filter + "s"}
              </button>
            ))}
          </div>

          {/* List of alert items */}
          <div className="bg-white border border-slate-100 rounded-3xl divide-y divide-slate-50 overflow-hidden shadow-xs">
            {filteredNotifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">No alerts matching this filter category.</div>
            ) : (
              filteredNotifications.map((notif) => (
                <div key={notif.id} className="p-4 flex items-start justify-between gap-3 hover:bg-slate-50/50 transition duration-150 animate-fade-in">
                  <div className="flex items-start gap-3">
                    
                    {/* Activity Indicator icon container */}
                    <div className="relative">
                      <img src={notif.userAvatar} className="w-10 h-10 rounded-full object-cover border" alt="" />
                      <span className={`absolute -bottom-1 -right-1 p-1 rounded-full text-white ${
                        notif.type === "like" ? "bg-red-500" :
                        notif.type === "comment" ? "bg-peg-accent" :
                        notif.type === "mention" ? "bg-blue-500" :
                        "bg-teal-500"
                      }`}>
                        {notif.type === "like" && <Heart size={8} fill="currentColor" />}
                        {notif.type === "comment" && <MessageSquare size={8} fill="currentColor" />}
                        {notif.type === "mention" && <AtSign size={8} />}
                        {notif.type === "follower" && <UserPlus size={8} />}
                      </span>
                    </div>

                    {/* text content */}
                    <div className="text-xs space-y-0.5">
                      <p className="text-slate-500 leading-normal">
                        <strong className="text-peg-dark font-black">@{notif.userHandle}</strong>
                        {" "}{notif.text}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div>
                    {notif.type === "comment" && (
                      <button 
                        onClick={() => handleInlineReply(notif)}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 hover:text-peg-dark border rounded-xl text-[10px] font-bold font-mono transition cursor-pointer"
                      >
                        Reply
                      </button>
                    )}
                    {notif.type === "follower" && (
                      <button 
                        onClick={() => handleToggleFollowBack(notif.id)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition font-mono whitespace-nowrap cursor-pointer border ${
                          notif.followedBack 
                            ? "bg-slate-100 text-slate-450 border-slate-200" 
                            : "bg-peg-primary border-peg-accent text-[#1E2A1E]"
                        }`}
                      >
                        {notif.followedBack ? "Followed Back" : "Follow Back"}
                      </button>
                    )}
                  </div>

                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        /* Direct Channels layout */
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12 min-h-[460px] animate-fade-in text-xs">
          
          {/* Chats panel selection list (md:col-span-5) */}
          <div className="md:col-span-4 border-r border-slate-100 flex flex-col divide-y divide-slate-50">
            <span className="p-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Conversations</span>
            
            {chats.map((chat) => (
              <button
                key={chat.userId}
                onClick={() => handleSelectChat(chat.userId)}
                className={`p-3.5 text-left flex items-center justify-between gap-2.5 transition cursor-pointer ${
                  chat.userId === activeChatId ? "bg-slate-50" : "hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={chat.userAvatar} className="w-9 h-9 rounded-full object-cover border" alt="" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-peg-dark truncate">{chat.userName}</h4>
                    <span className="text-[10px] text-slate-400 truncate block mt-0.5">{chat.lastMessage}</span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-[8px] font-mono text-slate-400">{chat.timestamp}</span>
                  {chat.unreadCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-peg-accent text-white flex items-center justify-center text-[8px] font-black">{chat.unreadCount}</span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Active Chat box area (md:col-span-7) */}
          <div className="md:col-span-8 flex flex-col justify-between h-[460px] bg-slate-50/20">
            
            {/* Thread Header details */}
            <div className="p-3 bg-white border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img src={activeChat.userAvatar} className="w-8 h-8 rounded-full object-cover border" alt="" />
                <div>
                  <h4 className="font-bold text-peg-dark leading-none">{activeChat.userName}</h4>
                  <span className="text-[9px] text-peg-accent">@{activeChat.userHandle}</span>
                </div>
              </div>
              <span className="text-[9px] text-slate-405 font-mono">End-to-End Encrypted</span>
            </div>

            {/* Scrollable thread messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeChat.messages.map((m) => (
                <div 
                  key={m.id} 
                  className={`flex gap-2 max-w-[80%] animate-fade-in ${
                    m.isMine ? "ml-auto flex-row-reverse" : "mr-auto"
                  }`}
                >
                  <img src={m.isMine ? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" : activeChat.userAvatar} className="w-6 h-6 rounded-full object-cover mt-1" alt="" />
                  
                  <div className="space-y-0.5">
                    <div className={`p-2.5 rounded-2xl text-[11px] leading-relaxed relative ${
                      m.isMine 
                        ? "bg-peg-primary/10 border border-peg-accent/20 text-[#1E2A1E] rounded-tr-none" 
                        : "bg-white border border-slate-100 text-slate-650 rounded-tl-none"
                    }`}>
                      {m.sticker ? (
                        <span className="text-4xl block p-1">{m.sticker}</span>
                      ) : (
                        <p>{m.text}</p>
                      )}
                    </div>
                    <span className="text-[8px] block text-slate-400 font-mono text-right pr-1">{m.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat formulation input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={`Direct message @${activeChat.userHandle}...`}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs text-peg-dark outline-none focus:border-peg-primary"
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="px-4 py-2 bg-[#1E2A1E] disabled:bg-slate-100 text-white rounded-xl text-xs font-bold transition flex items-center justify-center cursor-pointer active:scale-95"
              >
                <Send size={12} />
              </button>
            </form>

          </div>

        </div>
      )}

    </div>
  );
}
