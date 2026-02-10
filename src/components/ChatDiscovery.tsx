import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, ArrowRight, Calendar, Plus } from 'lucide-react';
import visitorTracking from '@/lib/visitorTracking';
import { trackingSupabase } from '@/lib/trackingBackend';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatDiscoveryProps {
  onComplete?: (data: any) => void;
}

const ChatDiscovery: React.FC<ChatDiscoveryProps> = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentStep, setCurrentStep] = useState(-1);
  const [userData, setUserData] = useState({
    thinkingPartner: '',
    role: '',
    whatWouldChange: '',
    interest: '',
    servicePath: '',
    name: '',
    email: '',
    customResponse: '',
    additionalContext: ''
  });
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [waitingForOther, setWaitingForOther] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when waiting for "Other" response
  useEffect(() => {
    if (waitingForOther && inputRef.current) {
      inputRef.current.focus();
    }
  }, [waitingForOther]);

  const conversationFlow = [
    {
      question: "When's the last time you had a thinking partner who actually pushed back on your ideas?",
      options: [
        "It's been a while",
        "I don't, really",
        "I have a few people"
      ],
      field: 'thinkingPartner',
      acknowledgment: (answer: string) => {
        if (answer === "I have a few people") return "That's rare. Good.";
        return "That's more common than you'd think.";
      }
    },
    {
      question: "What would change if you had that — someone in your corner for the hard calls?",
      options: [
        "I'd make faster decisions",
        "I'd second-guess myself less",
        "I'd finally move on things I've been sitting on"
      ],
      field: 'whatWouldChange',
      acknowledgment: () => "That's exactly why I built this. So I can point you in the right direction —"
    },
    {
      question: "How would you describe your role?",
      options: ["Founder/CEO", "Coach/Consultant", "Creator/Content maker", "Executive/Team leader", "Other"],
      field: 'role',
      acknowledgment: () => "Got it."
    },
    {
      question: "The Roundtable gives you 60+ expert advisors debating your real decisions. I also build Custom GPTs that handle the day-to-day. Which sounds more useful right now?",
      options: [
        "The Roundtable (thinking partner)",
        "Custom GPT (handles the doing)",
        "Both, honestly"
      ],
      field: 'interest',
      acknowledgment: null // Final message handles this
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setTimeout(() => {
        addBotMessage("Quick question — when's the last time you had a thinking partner who actually pushed back on your ideas?");
        setCurrentStep(0);
      }, 500);
    }
  }, [isOpen, messages.length]);

  const addBotMessage = (text: string, delay: number = 0) => {
    if (delay > 0) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const botMessage: Message = {
          id: Date.now().toString(),
          text,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }, delay);
    } else {
      const botMessage: Message = {
        id: Date.now().toString(),
        text,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const addUserMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const sendConversationData = async (finalData: any) => {
    console.log('🚀 sendConversationData called with:', finalData);

    try {
      const conversationText = messages.map(msg =>
        `${msg.isUser ? 'User' : 'Bot'}: ${msg.text}`
      ).join('\n');

      console.log('📝 Conversation text prepared:', conversationText);

      // Save lead to Supabase
      const sessionId = visitorTracking.getSessionId() || sessionStorage.getItem('galavanteer_session_id');
      
      if (sessionId) {
        const serviceDisplay = finalData.servicePath === 'customgpt'
          ? 'Custom GPT (The Doing)'
          : finalData.servicePath === 'roundtable'
          ? 'The Roundtable (The Thinking)'
          : 'Both (Custom GPT + Roundtable)';

        const { error: supabaseError } = await trackingSupabase.from('leads').insert({
          session_id: sessionId,
          email: finalData.email,
          name: finalData.name,
          source: 'chatbot',
          status: 'new',
          message: finalData.additionalContext || null,
          metadata: {
            servicePath: finalData.servicePath,
            serviceDisplay,
            role: finalData.role,
            thinkingPartner: finalData.thinkingPartner,
            whatWouldChange: finalData.whatWouldChange,
            interest: finalData.interest,
            customResponse: finalData.customResponse,
            additionalContext: finalData.additionalContext,
            conversation: conversationText,
            timestamp: new Date().toISOString()
          }
        });

        if (supabaseError) {
          console.error('❌ Supabase lead insert error:', supabaseError);
        } else {
          console.log('✅ Lead saved to Supabase with session:', sessionId);
        }

        // Track the lead capture event
        await visitorTracking.trackEvent('chatbot_lead_captured', {
          has_email: !!finalData.email,
          has_name: !!finalData.name,
          service_path: finalData.servicePath
        });
      }

      // Send instant email notification via Resend edge function
      try {
        const serviceDisplay = finalData.servicePath === 'customgpt'
          ? 'Custom GPT (The Doing)'
          : finalData.servicePath === 'roundtable'
          ? 'The Roundtable (The Thinking)'
          : 'Both (Custom GPT + Roundtable)';

        const notifyResponse = await fetch(
          `https://pydbejawnenjqgnyyonf.supabase.co/functions/v1/notify-lead`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: finalData.name,
              email: finalData.email,
              role: finalData.role,
              interest: finalData.interest,
              serviceDisplay,
              thinkingPartner: finalData.thinkingPartner || '',
              whatWouldChange: finalData.whatWouldChange || '',
              customResponse: finalData.customResponse || '',
              additionalContext: finalData.additionalContext || '',
              conversation: conversationText
            })
          }
        );

        if (notifyResponse.ok) {
          console.log('✅ Lead notification email sent to jason@galavanteer.com');
          return true;
        } else {
          const errorText = await notifyResponse.text();
          console.log('❌ Lead notification failed:', notifyResponse.status, errorText);
        }
      } catch (notifyError) {
        console.log('❌ Lead notification error:', notifyError);
      }

      const chatHistory = JSON.parse(localStorage.getItem('chatDiscoveryHistory') || '[]');
      chatHistory.push({
        ...finalData,
        conversation: conversationText,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('chatDiscoveryHistory', JSON.stringify(chatHistory.slice(-50)));

      console.log('💾 Data captured locally as backup');
      return false;

    } catch (error) {
      console.error('🚨 Error in sendConversationData:', error);
      return false;
    }
  };

  const getServicePath = (interest: string): string => {
    if (interest === "Custom GPT (handles the doing)") return 'customgpt';
    if (interest === "The Roundtable (thinking partner)") return 'roundtable';
    return 'both';
  };

  const getFinalMessage = (data: any): string => {
    const { interest, whatWouldChange } = data;

    if (interest === "The Roundtable (thinking partner)") {
      return `Perfect. The Roundtable is built exactly for that — ${whatWouldChange.toLowerCase().replace("i'd ", "helping you ").replace("i've ", "you've ")}. Let's get you set up.`;
    }

    if (interest === "Custom GPT (handles the doing)") {
      return `Got it. A Custom GPT that writes in your voice, handles the repetitive stuff, frees you up for what actually matters. Let's talk about building yours.`;
    }

    // "Both, honestly"
    return `Smart. Most of the people I work with need both — The Roundtable for the thinking, a Custom GPT for the doing. Let's figure out where to start.`;
  };

  const handleOptionClick = (option: string) => {
    // If "Other" is selected, prompt for text input
    if (option === "Other") {
      addUserMessage(option);
      addBotMessage("Tell me more:", 500);
      setWaitingForOther(true);
      return;
    }

    addUserMessage(option);

    const field = conversationFlow[currentStep].field;
    const newUserData = { ...userData, [field]: option };

    // Set service path based on interest answer
    if (field === 'interest') {
      newUserData.servicePath = getServicePath(option);
    }

    setUserData(newUserData);
    setCurrentInput('');

    setTimeout(() => {
      if (currentStep < conversationFlow.length - 1) {
        const nextStep = currentStep + 1;
        const ackFn = conversationFlow[currentStep].acknowledgment;

        if (ackFn) {
          // Get acknowledgment (it's a function now)
          const ackMessage = typeof ackFn === 'function' ? ackFn(option) : ackFn;
          addBotMessage(ackMessage, 800);
          setTimeout(() => {
            setCurrentStep(nextStep);
            addBotMessage(conversationFlow[nextStep].question, 1200);
          }, 1500);
        } else {
          setCurrentStep(nextStep);
          addBotMessage(conversationFlow[nextStep].question, 1200);
        }
      } else {
        const finalMessage = getFinalMessage(newUserData);
        addBotMessage(finalMessage, 1500);

        setTimeout(() => {
          setCurrentStep(conversationFlow.length);
          setTimeout(() => {
            scrollToBottom();
          }, 300);
        }, 3500);
      }
    }, 600);
  };

  const handleTextSubmit = () => {
    if (!currentInput.trim()) return;

    addUserMessage(currentInput);

    // Handle "Other" text input
    if (waitingForOther) {
      const field = conversationFlow[currentStep].field;
      const newUserData = { ...userData, [field]: currentInput };

      if (field === 'interest') {
        // Determine service path from free text
        const lowerInput = currentInput.toLowerCase();
        if (lowerInput.includes('gpt') || lowerInput.includes('doing') || lowerInput.includes('writing')) {
          newUserData.servicePath = 'customgpt';
        } else if (lowerInput.includes('roundtable') || lowerInput.includes('thinking') || lowerInput.includes('decision')) {
          newUserData.servicePath = 'roundtable';
        } else {
          newUserData.servicePath = 'both';
        }
      }

      setUserData(newUserData);
      setCurrentInput('');
      setWaitingForOther(false);

      setTimeout(() => {
        if (currentStep < conversationFlow.length - 1) {
          const nextStep = currentStep + 1;
          const ackFn = conversationFlow[currentStep].acknowledgment;

          if (ackFn) {
            const ackMessage = typeof ackFn === 'function' ? ackFn(currentInput) : ackFn;
            addBotMessage(ackMessage, 800);
            setTimeout(() => {
              setCurrentStep(nextStep);
              addBotMessage(conversationFlow[nextStep].question, 1200);
            }, 1500);
          } else {
            setCurrentStep(nextStep);
            addBotMessage(conversationFlow[nextStep].question, 1200);
          }
        } else {
          const finalMessage = getFinalMessage(newUserData);
          addBotMessage(finalMessage, 1500);

          setTimeout(() => {
            setCurrentStep(conversationFlow.length);
            setTimeout(() => {
              scrollToBottom();
            }, 300);
          }, 3500);
        }
      }, 600);
      return;
    }

    if (currentStep >= 0 && currentStep < conversationFlow.length) {
      const field = conversationFlow[currentStep].field;
      const newUserData = { ...userData, [field]: currentInput };

      if (field === 'interest') {
        const lowerInput = currentInput.toLowerCase();
        if (lowerInput.includes('gpt') || lowerInput.includes('doing') || lowerInput.includes('writing') || lowerInput.includes('content')) {
          newUserData.servicePath = 'customgpt';
        } else if (lowerInput.includes('roundtable') || lowerInput.includes('thinking') || lowerInput.includes('decision')) {
          newUserData.servicePath = 'roundtable';
        } else {
          newUserData.servicePath = 'both';
        }
      }

      setUserData(newUserData);

      setCurrentInput('');
      setShowQuickReplies(false);

      setTimeout(() => {
        if (currentStep < conversationFlow.length - 1) {
          const nextStep = currentStep + 1;
          const ackFn = conversationFlow[currentStep].acknowledgment;

          if (ackFn) {
            const ackMessage = typeof ackFn === 'function' ? ackFn(currentInput) : ackFn;
            addBotMessage(ackMessage, 800);
            setTimeout(() => {
              setCurrentStep(nextStep);
              addBotMessage(conversationFlow[nextStep].question, 1200);
            }, 1500);
          } else {
            setCurrentStep(nextStep);
            addBotMessage(conversationFlow[nextStep].question, 1200);
          }
        } else {
          const finalMessage = getFinalMessage(newUserData);
          addBotMessage(finalMessage, 1500);

          setTimeout(() => {
            setCurrentStep(conversationFlow.length);
            setTimeout(() => {
              scrollToBottom();
            }, 300);
          }, 3500);
        }
      }, 600);
    } else {
      const newUserData = { ...userData, customResponse: currentInput };
      setUserData(newUserData);
      setCurrentInput('');

      setTimeout(() => {
        addBotMessage("Thanks for sharing that! Let me ask you a couple quick questions to see how I can help:", 1500);

        setTimeout(() => {
          setCurrentStep(0);
          addBotMessage(conversationFlow[0].question, 2500);
        }, 3000);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Closed state - premium floating button
  if (!isOpen) {
    return (
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 group">
        <button
          onClick={() => setIsOpen(true)}
          className="relative flex items-center justify-center w-14 h-14 transition-all duration-300 hover:scale-105"
          style={{
            background: '#1A1915',
            boxShadow: '0 4px 20px rgba(26, 25, 21, 0.3)'
          }}
          aria-label="Open chat"
        >
          {/* Gold corner accents */}
          <div className="absolute top-0 left-0 w-3 h-px bg-gold/60" />
          <div className="absolute top-0 left-0 w-px h-3 bg-gold/60" />
          <div className="absolute bottom-0 right-0 w-3 h-px bg-gold/60" />
          <div className="absolute bottom-0 right-0 w-px h-3 bg-gold/60" />

          <MessageCircle size={22} style={{ color: '#D4B896' }} />

          {/* Subtle pulse indicator */}
          <div
            className="absolute -top-1 -right-1 w-2.5 h-2.5"
            style={{ background: '#B8956C' }}
          >
            <div
              className="absolute inset-0 animate-ping"
              style={{ background: '#B8956C', opacity: 0.4 }}
            />
          </div>
        </button>

        {/* Hover tooltip */}
        <div
          className="absolute bottom-full right-0 mb-3 px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap"
          style={{
            background: '#1A1915',
            boxShadow: '0 4px 12px rgba(26, 25, 21, 0.2)'
          }}
        >
          <p className="text-xs" style={{ color: '#C9C3B8' }}>Start a conversation</p>
          {/* Arrow */}
          <div
            className="absolute top-full right-6 w-0 h-0"
            style={{
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #1A1915'
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <div
        className="overflow-hidden"
        style={{
          background: '#FDFBF7',
          border: '1px solid rgba(184, 149, 108, 0.3)',
          boxShadow: '0 8px 40px rgba(26, 25, 21, 0.25), 0 2px 8px rgba(26, 25, 21, 0.15)'
        }}
      >
        {/* Header - Premium dark with gold accents */}
        <div
          className="relative p-4 flex justify-between items-center"
          style={{ background: '#1A1915' }}
        >
          {/* Gold accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-gold/40 via-gold/60 to-gold/40" />

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 flex items-center justify-center">
              <img
                src="/lovable-uploads/64da8d28-80eb-4cc4-8422-5a6e3ec44ebb.png"
                alt="Galavanteer"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <h3
                className="font-display text-sm"
                style={{ color: '#FDFBF7' }}
              >
                Galavanteer
              </h3>
              <p
                className="text-[10px] uppercase tracking-wider"
                style={{ color: '#C9C3B8' }}
              >
                Discovery Assistant
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 transition-colors hover:bg-white/10"
            style={{ color: '#A09A90' }}
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages area */}
        <div
          className="overflow-y-auto"
          style={{
            height: '320px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            background: '#FDFBF7'
          }}
        >
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                display: 'flex',
                justifyContent: message.isUser ? 'flex-end' : 'flex-start',
                width: '100%'
              }}
            >
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.isUser ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}>
                <div
                  style={{
                    backgroundColor: message.isUser ? '#1A1915' : '#FFFFFF',
                    padding: '12px 16px',
                    position: 'relative',
                    border: message.isUser ? 'none' : '1px solid rgba(26, 25, 21, 0.08)',
                    wordBreak: 'break-word'
                  }}
                >
                  {/* Gold accent for bot messages */}
                  {!message.isUser && (
                    <div
                      className="absolute top-0 left-0 w-6 h-px"
                      style={{ background: 'linear-gradient(to right, #B8956C, transparent)' }}
                    />
                  )}
                  <p style={{
                    margin: 0,
                    padding: 0,
                    fontSize: '13px',
                    lineHeight: '1.5',
                    fontFamily: "'DM Sans', sans-serif",
                    maxWidth: '47ch',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    color: message.isUser ? '#FDFBF7' : '#1A1915'
                  }}>
                    {message.text}
                  </p>
                </div>
                <span style={{
                  fontSize: '10px',
                  color: '#A09A90',
                  marginTop: '4px',
                  paddingLeft: '4px',
                  paddingRight: '4px',
                  fontFamily: "'DM Sans', sans-serif"
                }}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div
                className="p-3 relative"
                style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(26, 25, 21, 0.08)'
                }}
              >
                <div
                  className="absolute top-0 left-0 w-6 h-px"
                  style={{ background: 'linear-gradient(to right, #B8956C, transparent)' }}
                />
                <div className="flex gap-1.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: '#B8956C', animationDelay: '0ms' }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: '#B8956C', animationDelay: '150ms' }}
                  />
                  <div
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{ background: '#B8956C', animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Embedded Calendly Scheduler */}
          {currentStep >= conversationFlow.length && (
            <div className="mt-2">
              <EmbeddedScheduler userData={userData} onSubmit={sendConversationData} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area - consistent height */}
        <div
          className="p-3"
          style={{
            borderTop: '1px solid rgba(26, 25, 21, 0.08)',
            background: '#FDFBF7',
            minHeight: '140px'
          }}
        >
          {/* Quick replies - vertical stack for readability */}
          {currentStep >= 0 && currentStep < conversationFlow.length && !waitingForOther && (
            <div className="mb-3">
              <p
                className="text-[10px] uppercase tracking-wider mb-2"
                style={{ color: '#7A7368' }}
              >
                {isTyping ? 'One moment...' : 'Select one'}
              </p>
              <div className="flex flex-col gap-1.5">
                {conversationFlow[currentStep].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    disabled={isTyping}
                    className="text-left text-xs px-3 py-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid rgba(26, 25, 21, 0.12)',
                      color: '#1A1915'
                    }}
                    onMouseEnter={(e) => {
                      if (!isTyping) {
                        e.currentTarget.style.borderColor = '#B8956C';
                        e.currentTarget.style.background = 'rgba(184, 149, 108, 0.06)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(26, 25, 21, 0.12)';
                      e.currentTarget.style.background = '#FFFFFF';
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Text input for "Other" */}
          {waitingForOther && (
            <div className="mb-3">
              <p
                className="text-[10px] uppercase tracking-wider mb-2"
                style={{ color: '#B8956C' }}
              >
                Your answer
              </p>
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Tell me more..."
                  className="flex-1 p-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gold/30"
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #B8956C',
                    color: '#1A1915',
                    fontFamily: "'DM Sans', sans-serif",
                    caretColor: '#B8956C'
                  }}
                />
                <button
                  onClick={handleTextSubmit}
                  disabled={!currentInput.trim()}
                  className="px-3 py-2.5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                style={{
                  background: '#1A1915',
                  color: '#D4B896'
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.background = '#B8956C';
                    e.currentTarget.style.color = '#FDFBF7';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#1A1915';
                  e.currentTarget.style.color = '#D4B896';
                }}
              >
                <Send size={16} />
              </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Premium Scheduling Component
const EmbeddedScheduler: React.FC<{ userData: any; onSubmit: (data: any) => void }> = ({ userData, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [showScheduler, setShowScheduler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const schedulerRef = useRef<HTMLDivElement>(null);

  // Scroll into view when component mounts or showScheduler changes
  useEffect(() => {
    if (schedulerRef.current) {
      setTimeout(() => {
        schedulerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [showScheduler]);

  const handleContinue = async () => {
    if (!name.trim() || !email.trim()) return;

    setIsSubmitting(true);

    const finalData = {
      ...userData,
      name,
      email,
      additionalContext,
      timestamp: new Date().toISOString()
    };

    await onSubmit(finalData);

    setIsSubmitting(false);
    setShowScheduler(true);
  };

  const createCalendlyLink = () => {
    const baseUrl = 'https://calendly.com/jason-galavanteer/discovery_call';

    const serviceDisplay = userData.servicePath === 'customgpt'
      ? 'Custom GPT (The Doing)'
      : userData.servicePath === 'roundtable'
      ? 'The Roundtable (The Thinking)'
      : 'Both (Custom GPT + Roundtable)';

    const params = new URLSearchParams({
      name: name,
      email: email,
      a1: `Interest: ${serviceDisplay}`,
      a2: `Role: ${userData.role}`,
      a3: `Thinking partner: ${userData.thinkingPartner}`,
      a4: `What would change: ${userData.whatWouldChange}`,
      ...(userData.customResponse && { a5: `Custom response: ${userData.customResponse}` }),
      ...(additionalContext && { a6: `Additional context: ${additionalContext}` })
    });

    return `${baseUrl}?${params.toString()}`;
  };

  if (showScheduler) {
    return (
      <div
        ref={schedulerRef}
        className="p-5 relative"
        style={{
          background: '#FFFFFF',
          border: '1px solid rgba(184, 149, 108, 0.3)'
        }}
      >
        {/* Gold corner accents */}
        <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-gold to-transparent" />
        <div className="absolute top-0 left-0 w-px h-8 bg-gradient-to-b from-gold to-transparent" />

        <div className="text-center mb-4">
          <div
            className="w-10 h-10 mx-auto mb-3 flex items-center justify-center"
            style={{ background: 'rgba(184, 149, 108, 0.1)' }}
          >
            <span style={{ color: '#B8956C', fontSize: '18px' }}>✓</span>
          </div>
          <p
            className="font-display text-sm mb-1"
            style={{ color: '#1A1915' }}
          >
            Perfect — I've captured your info.
          </p>
          <p
            className="text-xs"
            style={{ color: '#5C554A' }}
          >
            Jason will respond within 24 hours.
          </p>
        </div>

        <div
          className="w-full h-px my-4"
          style={{ background: 'linear-gradient(to right, transparent, rgba(184, 149, 108, 0.3), transparent)' }}
        />

        <p
          className="text-xs text-center mb-4"
          style={{ color: '#5C554A' }}
        >
          Want to skip the wait?
        </p>

        <a
          href={createCalendlyLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 text-xs font-medium tracking-wide uppercase transition-all duration-200"
          style={{
            background: '#1A1915',
            color: '#D4B896'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#B8956C';
            e.currentTarget.style.color = '#FDFBF7';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1A1915';
            e.currentTarget.style.color = '#D4B896';
          }}
        >
          <Calendar size={14} />
          Schedule a Clarity Call
        </a>
      </div>
    );
  }

  return (
    <div
      ref={schedulerRef}
      className="p-5 relative"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(26, 25, 21, 0.08)'
      }}
    >
      {/* Gold accent */}
      <div className="absolute top-0 left-0 w-8 h-px bg-gradient-to-r from-gold/60 to-transparent" />

      <p
        className="text-xs mb-4"
        style={{ color: '#5C554A' }}
      >
        Just need your contact info to continue:
      </p>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-colors"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(26, 25, 21, 0.15)',
            color: '#1A1915',
            fontFamily: "'DM Sans', sans-serif",
            caretColor: '#B8956C'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#B8956C'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(26, 25, 21, 0.15)'}
        />
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 transition-colors"
          style={{
            background: '#FFFFFF',
            border: '1px solid rgba(26, 25, 21, 0.15)',
            color: '#1A1915',
            fontFamily: "'DM Sans', sans-serif",
            caretColor: '#B8956C'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#B8956C'}
          onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(26, 25, 21, 0.15)'}
        />

        <div className="relative">
          <textarea
            placeholder="Anything else I should know? (optional)"
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            rows={2}
            className="w-full p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/30 resize-none transition-colors"
            style={{
              background: '#FFFFFF',
              border: '1px solid rgba(26, 25, 21, 0.15)',
              color: '#1A1915',
              fontFamily: "'DM Sans', sans-serif",
              caretColor: '#B8956C'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = '#B8956C'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(26, 25, 21, 0.15)'}
          />
          <div className="absolute top-3 right-3">
            <Plus size={12} style={{ color: '#A09A90' }} />
          </div>
        </div>

        <button
          onClick={handleContinue}
          disabled={isSubmitting || !name.trim() || !email.trim()}
          className="w-full py-3 text-xs font-medium tracking-wide uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: '#1A1915',
            color: '#D4B896'
          }}
          onMouseEnter={(e) => {
            if (!e.currentTarget.disabled) {
              e.currentTarget.style.background = '#B8956C';
              e.currentTarget.style.color = '#FDFBF7';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#1A1915';
            e.currentTarget.style.color = '#D4B896';
          }}
        >
          {isSubmitting ? (
            <>
              <div
                className="w-3 h-3 border border-current border-t-transparent animate-spin"
                style={{ borderRadius: '50%' }}
              />
              Connecting...
            </>
          ) : (
            <>
              Continue <ArrowRight size={14} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatDiscovery;
