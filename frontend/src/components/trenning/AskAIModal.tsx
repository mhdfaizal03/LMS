import React, { useState } from 'react';
import { Sparkles, Send, X, Bot, Lightbulb, BookOpen, FileCheck } from 'lucide-react';

interface AskAIModalProps {
  onClose: () => void;
}

export const AskAIModal: React.FC<AskAIModalProps> = ({ onClose }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: 'Hello! I am your Trenning AI learning assistant. How can I help you with your UI/UX curriculum, quizzes, or assignments today?',
    },
  ]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || prompt;
    if (!query.trim()) return;

    setMessages((prev) => [...prev, { role: 'user', text: query }]);
    setPrompt('');
    setIsGenerating(true);

    setTimeout(() => {
      let aiReply = "In UI/UX design, visual hierarchy and user feedback are essential. When designing for web applications, ensure clear affordances, accessible contrast ratios, and streamlined navigation flows.";
      if (query.toLowerCase().includes('quiz')) {
        aiReply = "For the Quiz on UI Fundamentals, remember: UI focuses on the visual presentation and interactive elements (buttons, inputs, menus), while UX encompasses the overall user journey and usability.";
      } else if (query.toLowerCase().includes('color') || query.toLowerCase().includes('palette')) {
        aiReply = "When creating a color palette in UI design, follow the 60-30-10 rule: 60% dominant neutral color, 30% secondary brand color, and 10% accent color for calls to action.";
      }

      setMessages((prev) => [...prev, { role: 'ai', text: aiReply }]);
      setIsGenerating(false);
    }, 700);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', height: '600px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800 }}>Trenning AI Assistant</h3>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Real-time personalized tutor for your curriculum</div>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Quick Prompts */}
        <div style={{ display: 'flex', gap: '8px', padding: '0.75rem 0', overflowX: 'auto' }}>
          {[
            'Explain UI vs UX differences',
            'How to prepare for Psychology Exam',
            'Summary of 60-30-10 color rule',
          ].map((suggestion, i) => (
            <button
              key={i}
              onClick={() => handleSend(suggestion)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', whiteSpace: 'nowrap', borderRadius: 'var(--radius-full)' }}
            >
              <Lightbulb size={12} color="#f59e0b" /> {suggestion}
            </button>
          ))}
        </div>

        {/* Chat Message List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '10px',
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}
            >
              {m.role === 'ai' && (
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={16} />
                </div>
              )}
              <div
                style={{
                  backgroundColor: m.role === 'user' ? '#4338ca' : 'var(--bg-tertiary)',
                  color: m.role === 'user' ? '#ffffff' : 'inherit',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                }}
              >
                {m.text}
              </div>
            </div>
          ))}

          {isGenerating && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#94a3b8', fontSize: '0.8125rem' }}>
              <Sparkles size={16} className="animate-spin" /> Trenning AI is generating response...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{ display: 'flex', gap: '8px', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Ask AI anything about your courses, lessons, or tasks..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button type="submit" className="btn btn-primary" style={{ flexShrink: 0 }}>
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
