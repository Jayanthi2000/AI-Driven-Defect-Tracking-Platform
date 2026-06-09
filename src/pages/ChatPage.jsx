import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Bug } from "lucide-react";
import {
  getMessages,
  saveMessages,
  saveBug,
} from "../services/chatStorage";

import {
  analyzeBug,
} from "../utils/aiAnalyzer";

export default function ChatPage() {
  const [messages, setMessages] = useState(() => {
    return JSON.parse(
      localStorage.getItem("defect-chat")
    ) || [];
  });

  const [input, setInput] = useState("");

  const bottomRef = useRef(null);

  /* AUTO SCROLL */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  /* SAVE CHAT */
  useEffect(() => {
    localStorage.setItem(
      "defect-chat",
      JSON.stringify(messages)
    );
  }, [messages]);

  /* SEND MESSAGE */
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: input,
    };

    const updatedMessages = [
      ...messages,
      userMessage,
    ];

    setMessages(updatedMessages);

    setInput("");

    /* SIMPLE AI BUG ANALYSIS */
    let aiReply = "";

    const text = input.toLowerCase();

    if (text.includes("crash")) {
      aiReply =
        "⚠️ High Severity Bug Detected. Possible crash issue in application.";
    } else if (
      text.includes("login")
    ) {
      aiReply =
        "🔐 Authentication-related issue detected. Check token/session handling.";
    } else if (
      text.includes("slow")
    ) {
      aiReply =
        "🐢 Performance issue detected. Optimize API/database calls.";
    } else {
      aiReply =
        "🤖 AI analyzed your bug report. Severity appears medium.";
    }

    /* STORE BUG */
    const bugs =
      JSON.parse(
        localStorage.getItem("defects")
      ) || [];

    bugs.push({
      id: Date.now(),
      description: input,
      aiAnalysis: aiReply,
      createdAt: new Date(),
    });

    localStorage.setItem(
      "defects",
      JSON.stringify(bugs)
    );

    /* FAKE AI DELAY */
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "ai",
          text: aiReply,
        },
      ]);
    }, 700);
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col">

      {/* HEADER */}
      <div className="border-b border-white/[0.06] pb-4 mb-4">
        <h1 className="text-2xl font-bold text-white">
          AI Bug Assistant
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Report bugs and get AI suggestions instantly.
        </p>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-4">

        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Bug
                className="mx-auto text-emerald-400 mb-4"
                size={40}
              />

              <p className="text-slate-400">
                Start describing your bug...
              </p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.role === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 border ${
                msg.role === "user"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-white"
                  : "bg-white/[0.04] border-white/[0.06] text-slate-200"
              }`}
            >
              <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                {msg.role === "user" ? (
                  <>
                    <User size={13} />
                    You
                  </>
                ) : (
                  <>
                    <Bot size={13} />
                    DefectAI
                  </>
                )}
              </div>

              <p className="text-sm leading-6">
                {msg.text}
              </p>
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="mt-4 border-t border-white/[0.06] pt-4">
        <div className="flex items-center gap-3">

          <input
            type="text"
            placeholder="Describe your bug..."
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              handleSend()
            }
            className="flex-1 h-14 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-5 text-white outline-none focus:border-emerald-500"
          />

          <button
            onClick={handleSend}
            className="h-14 w-14 rounded-2xl bg-emerald-500 text-black flex items-center justify-center font-bold hover:scale-105 transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}