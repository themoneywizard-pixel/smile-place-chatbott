.container {
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Sarabun", "Noto Sans Thai", sans-serif;
  padding: 1rem;
}

.widget {
  width: 100%;
  max-width: 420px;
  background: #1a2342;
  border-radius: 1.5rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 4px 16px rgba(2, 132, 199, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: min(680px, 90vh);
}

/* Header */
.header {
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  padding: 1.125rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.avatar {
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.375rem;
  flex-shrink: 0;
}

.headerInfo {
  flex: 1;
}

.headerTitle {
  color: white;
  font-weight: 700;
  font-size: 0.9375rem;
}

.headerSubtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.75rem;
  margin-top: 0.125rem;
}

.onlineDot {
  width: 0.625rem;
  height: 0.625rem;
  background: #4ade80;
  border-radius: 50%;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.3);
}

/* Messages */
.messagesContainer {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  background: #1a2342;
}

.messageWrapper {
  display: flex;
  animation: fadeSlideUp 0.3s ease;
}

.userWrapper {
  justify-content: flex-end;
}

.assistantWrapper {
  justify-content: flex-start;
  align-items: flex-start;
}

.messageBotAvatar {
  width: 1.875rem;
  height: 1.875rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  margin-right: 0.5rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.message {
  max-width: 75%;
  padding: 0.625rem 0.875rem;
  border-radius: 1.125rem;
  font-size: 0.84375rem;
  line-height: 1.6;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.botMessage {
  background: #243556;
  color: #e2e8f0;
  border-radius: 0.25rem 0.75rem 0.75rem 0.75rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.userMessage {
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  color: white;
  border-radius: 0.75rem 0.25rem 0.75rem 0.75rem;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);
}

/* Typing dots */
.typingDots {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  padding: 0.25rem 0;
}

.dot {
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 50%;
  background: #0ea5e9;
  animation: bounce 1.2s infinite;
  opacity: 0.4;
}

@keyframes bounce {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-0.375rem);
    opacity: 1;
  }
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(0.625rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Chips */
.chipsContainer {
  padding: 0 1rem 0.625rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  background: #1a2342;
}

.chip {
  background: #1e3a5f;
  border: 1px solid #2d5a8c;
  color: #7dd3fc;
  border-radius: 1.25rem;
  padding: 0.3125rem 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  font-family: inherit;
  font-weight: 500;
  transition: background-color 0.15s, border-color 0.15s;
}

.chip:hover {
  background: #2d5a8c;
  border-color: #3d7aad;
}

.chip:active {
  transform: scale(0.96);
}

/* Input */
.inputRow {
  padding: 0.625rem 0.875rem 0.875rem;
  border-top: 1px solid #243556;
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  background: #1a2342;
}

.input {
  flex: 1;
  border: 1.5px solid #334155;
  border-radius: 0.875rem;
  padding: 0.5625rem 0.875rem;
  font-size: 0.84375rem;
  font-family: inherit;
  resize: none;
  background: #243556;
  color: #e2e8f0;
  outline: none;
  line-height: 1.5;
  transition: border-color 0.2s;
  max-height: 7.5rem;
}

.input:focus {
  border-color: #0ea5e9;
}

.input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Send button */
.sendButton {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(2, 132, 199, 0.4);
}

.sendButton:hover {
  opacity: 0.9;
}

.sendButton:active {
  transform: scale(0.96);
}

.sendButtonDisabled {
  background: #334155;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.6;
}

.sendButtonDisabled:hover {
  opacity: 0.6;
}

/* Scrollbar */
.messagesContainer::-webkit-scrollbar {
  width: 0.25rem;
}

.messagesContainer::-webkit-scrollbar-track {
  background: transparent;
}

.messagesContainer::-webkit-scrollbar-thumb {
  background: #1e3a5f;
  border-radius: 99px;
}

/* Responsive */
@media (max-width: 600px) {
  .container {
    padding: 1rem;
  }

  .widget {
    border-radius: 1rem;
  }

  .message {
    max-width: 85%;
  }
}
