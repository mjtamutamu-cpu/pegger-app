/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { INITIAL_CHATS } from "../mockData";
import { DirectChat, Message } from "../types";
import { MessageSquare, Send, Image, Flame, Smile, CheckCheck } from "lucide-react";

export default function DirectMessages() {
  const [chats, setChats] = useState<DirectChat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>("fc-1");
  const [textInput, setTextInput] = useState("");

  const activeChat = chats.find((c) => c.userId === activeChatId) || chats[0];

  const handleSelectChat = (userId: string) => {
    setActiveChatId(userId);
    // Mark as read
    setChats(prev => prev.map(c => {
      if (c.userId === userId) {
        return { ...c, unreadCount: 0 };
      }
      return c;
    }));
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    const myMessage: Message = {
      id: `m-user-${Date.now()}`,
      senderId: "me",
      senderName: "My Profile",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      text: textInput,
      timestamp: "Now",
      isMine: true
    };

    // Update active chat with user msg
    setChats(prev => prev.map(chat => {
      if (chat.userId === activeChat.userId) {
        const updatedMsgs = [...chat.messages, myMessage];
        return {
          ...chat,
          lastMessage: textInput,
          timestamp: "Now",
          messages: updatedMsgs
        };
      }
      return chat;
    }));

    setTextInput("");

    // Simulate reactive friend reply if they are a coach or lord
    setTimeout(() => {
      let replyText = "Awesome Vibe! Let's schedule that collab!";
      if (activeChat.userId === "fc-1") {
        replyText = "Boom! That's what I call clean short-form content. Have you tested our AI safety shield scan on your captions yet? ⚡🛡️";
      }

      const botReply: Message = {
        id: `m-bot-${Date.now()}`,
        senderId: activeChat.userId,
        senderName: activeChat.userName,
        senderAvatar: activeChat.userAvatar,
        text: replyText,
        timestamp: "Now",
        isMine: false
      };

      setChats(prev => prev.map(chat => {
        if (chat.userId === activeChat.userId) {
          return {
            ...chat,
            lastMessage: replyText,
            timestamp: "Now",
            messages: [...chat.messages, botReply]
          };
        }
        return chat;
      }));
    }, 1200);
  };

  const triggerSticker = (stickerText: string) => {
    const stickerMsg: Message = {
      id: `m-sticker-${Date.now()}`,
      senderId: "me",
      senderName: "My Profile",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200",
      text: `Sent a sticker: ${stickerText}`,
      sticker: stickerText,
      timestamp: "Now",
      isMine: true
    };

    setChats(prev => prev.map(chat => {
      if (chat.userId === activeChat.userId) {
        return {
          ...chat,
          lastMessage: `[Sticker ${stickerText}]`,
          timestamp: "Now",
          messages: [...chat.messages, stickerMsg]
        };
      }
      return chat;
    }));
  };

  return (
    <div className="w-full bg-[#0a100c] border border-[#162719] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row h-[550px] animate-fade-in text-slate-100">
      {/* Chats Index Panel */}
      <div className="w-full md:w-80 border-r border-[#162719] flex flex-col bg-[#0b0f0c]">
        <div className="p-4 border-b border-[#162719] flex items-center gap-2">
          <MessageSquare className="text-emerald-400" size={18} />
          <h3 className="font-bold text-white text-sm">Inbox Threads</h3>
          {chats.reduce((acc, c) => acc + c.unreadCount, 0) > 0 && (
            <span className="bg-emerald-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full animate-bounce">
              New
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.userId}
              onClick={() => handleSelectChat(chat.userId)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition text-left cursor-pointer ${
                activeChat.userId === chat.userId 
                  ? "bg-emerald-600/10 border border-emerald-500/30" 
                  : "hover:bg-slate-900 border border-transparent"
              }`}
            >
              <div className="relative">
                <img 
                  src={chat.userAvatar} 
                  alt={chat.userName} 
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-slate-800" 
                />
                {chat.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border border-slate-950 flex items-center justify-center text-[8px] text-[#0a100c] font-bold">
                    {chat.unreadCount}
                  </span>
                )}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-[#0a100c]"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-white truncate">{chat.userName}</span>
                  <span className="text-[9px] text-slate-500 font-mono flex-shrink-0">{chat.timestamp}</span>
                </div>
                <p className="text-[10px] text-slate-450 truncate mt-0.5">{chat.lastMessage}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message Chat Pane */}
      <div className="flex-1 flex flex-col bg-[#0a100c]">
        {/* Chat Pane Header */}
        <div className="p-4 border-b border-[#162719] bg-slate-900/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={activeChat.userAvatar} 
              alt={activeChat.userName} 
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-slate-700" 
            />
            <div>
              <span className="text-xs font-bold text-white block">{activeChat.userName}</span>
              <span className="text-[9px] text-slate-500 font-mono">@{activeChat.userHandle} • Verified Companion</span>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-wide text-emerald-400 font-bold font-mono">Sim Active</span>
          </div>
        </div>

        {/* Messaging Logs */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/20">
          {activeChat.messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex items-end gap-2.5 ${m.isMine ? "justify-end" : "justify-start"}`}
            >
              {!m.isMine && (
                <img 
                  src={m.senderAvatar} 
                  alt={m.senderName} 
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 rounded-full object-cover border border-slate-800 mb-1" 
                />
              )}
              <div className="max-w-[70%] space-y-1">
                {m.sticker ? (
                  <div className="text-4xl bg-emerald-950/40 p-4 rounded-2xl border border-emerald-900/30 text-center animate-bounce">
                    {m.sticker}
                  </div>
                ) : (
                  <div className={`px-4 py-2.5 text-xs font-sans rounded-2xl ${
                    m.isMine 
                      ? "bg-emerald-600 text-slate-950 font-bold rounded-br-none" 
                      : "bg-[#111814] text-slate-200 border border-[#1d3522] rounded-bl-none"
                  }`}>
                    {m.text}
                  </div>
                )}
                <div className={`flex items-center gap-1 text-[8px] text-slate-550 font-mono ${m.isMine ? "justify-end" : "justify-start"}`}>
                  <span>{m.timestamp}</span>
                  {m.isMine && <CheckCheck size={10} className="text-emerald-400" />}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input Controller */}
        <div className="p-4 border-t border-[#162719] bg-slate-900/80 space-y-3 bg-slate-950/40">
          {/* Quick Sticker Actions */}
          <div className="flex gap-2 p-1.5 bg-slate-950/60 rounded-xl border border-slate-850 justify-center">
            <span className="text-[9px] text-slate-550 font-mono uppercase mr-2 flex items-center">Sim Stickers:</span>
            {["🔥", "🎯", "⚡", "🔮", "👑"].map((st) => (
              <button
                key={st}
                onClick={() => triggerSticker(st)}
                className="hover:scale-125 transition text-xs cursor-pointer p-0.5"
              >
                {st}
              </button>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 items-center">
            <button
              type="button"
              onClick={() => triggerSticker("📷")}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition flex-shrink-0"
              title="Attach Image"
            >
              <Image size={15} />
            </button>
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={`Send your message to ${activeChat.userName}...`}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder-slate-600"
            />
            <button
              type="submit"
              disabled={!textInput.trim()}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 font-bold text-slate-950 rounded-xl cursor-pointer flex-shrink-0 transition flex items-center justify-center"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
