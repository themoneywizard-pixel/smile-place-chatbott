"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

const SUGGESTED = [
  "ราคาขูดหินปูนเท่าไหร่?",
  "อยากจองนัดหมาย",
  "เปิดกี่โมง?",
  "จัดฟันราคาเท่าไหร่?",
];

const TypingDots = () => (
  <div className={styles.typingDots}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className={styles.dot}
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </div>
);

export default function DentalChatbot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "สวัสดีค่ะ 😊 ยินดีต้อนรับสู่ **คลินิกทันตกรรม สไมล์เพลส**\nน้องฟันพร้อมช่วยเหลือคุณนะคะ จะสอบถามเรื่องบริการ ราคา หรือจองนัดหมายได้เลยค่ะ",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  const renderText = (text) => {
    const lines = text.split("\n");
    return lines.map((line, lineIndex) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const lineContent = parts.map((part, partIndex) =>
        partIndex % 2 === 1 ? <strong key={partIndex}>{part}</strong> : part
      );
      return (
        <span key={lineIndex}>
          {lineContent}
          {lineIndex < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
        throw new Error("Invalid response format");
      }

      const reply = data.content[0]?.text || "ขออภัยค่ะ ไม่สามารถตอบได้ในขณะนี้";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "ขออภัยค่ะ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้งนะคะ",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isButtonDisabled = !input.trim() || loading;

  return (
    <div className={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap');
      `}</style>

      <div className={styles.widget}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.avatar}>🦷</div>
          <div className={styles.headerInfo}>
            <div className={styles.headerTitle}>น้องฟัน AI Assistant</div>
            <div className={styles.headerSubtitle}>คลินิกทันตกรรม สไมล์เพลส</div>
          </div>
          <div className={styles.onlineDot} />
        </div>

        {/* Messages */}
        <div className={styles.messagesContainer}>
          {messages.map((m, i) => (
            <div
              key={i}
              className={`${styles.messageWrapper} ${
                m.role === "user" ? styles.userWrapper : styles.assistantWrapper
              }`}
            >
              {m.role === "assistant" && (
                <div className={styles.messageBotAvatar}>🦷</div>
              )}
              <div
                className={`${styles.message} ${
                  m.role === "user" ? styles.userMessage : styles.botMessage
                }`}
              >
                {renderText(m.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div className={styles.messageWrapper}>
              <div className={styles.messageBotAvatar}>🦷</div>
              <div className={`${styles.message} ${styles.botMessage}`}>
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Suggested chips */}
        {messages.length === 1 && (
          <div className={styles.chipsContainer}>
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className={styles.chip}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className={styles.inputRow}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์ข้อความ..."
            disabled={loading}
            rows={1}
            className={styles.input}
          />
          <button
            onClick={() => sendMessage()}
            disabled={isButtonDisabled}
            className={`${styles.sendButton} ${
              isButtonDisabled ? styles.sendButtonDisabled : ""
            }`}
            aria-label="ส่งข้อความ"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
