import { useState } from 'react';
import {
  Twitter,
  Instagram,
  Linkedin,
  Video,
  Send,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  Loader2,
  Github,
} from 'lucide-react';
import { repurposeContent } from './groq';
import type { RepurposedContent, Platform, PlatformKey } from './types';

const PLATFORMS: Platform[] = [
  { key: 'twitter', label: 'Twitter/X Thread', icon: 'twitter', maxChars: 1400, color: '#1d9bf0' },
  { key: 'instagram', label: 'Instagram Caption', icon: 'instagram', maxChars: 2200, color: '#e1306c' },
  { key: 'linkedin', label: 'LinkedIn Post', icon: 'linkedin', maxChars: 3000, color: '#0077b5' },
  { key: 'reels', label: 'Reels / TikTok Script', icon: 'video', maxChars: 2000, color: '#ff0050' },
  { key: 'telegram', label: 'Telegram Post', icon: 'telegram', maxChars: 4096, color: '#2aabee' },
];

function PlatformIcon({ name, size = 18 }: { name: string; size?: number }) {
  const props = { size, strokeWidth: 2 };
  switch (name) {
    case 'twitter': return <Twitter {...props} />;
    case 'instagram': return <Instagram {...props} />;
    case 'linkedin': return <Linkedin {...props} />;
    case 'video': return <Video {...props} />;
    case 'telegram': return <Send {...props} />;
    default: return null;
  }
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      disabled={copied}
      className="px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-2 border"
      style={{
        background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
        color: copied ? '#22c55e' : '#a1a1aa',
        borderColor: copied ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.1)',
      }}
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
    </button>
  );
}

function ContentRenderer({ content, platform }: { content: string; platform: PlatformKey }) {
  if (platform === 'twitter' && content.includes('---')) {
    const tweets = content.split(/\n\n---\n\n/).filter(Boolean);
    return (
      <div className="space-y-4">
        {tweets.map((tweet, i) => (
          <div key={i}>
            <div className="flex items-start gap-3">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  boxShadow: '0 0 12px rgba(168,85,247,0.3)',
                }}
              >
                {i + 1}
              </div>
              <span className="whitespace-pre-wrap text-sm leading-relaxed flex-1">{tweet}</span>
            </div>
            {i < tweets.length - 1 && (
              <div className="ml-4 my-3 pl-0 flex">
                <div
                  className="w-0.5 h-8 rounded-full"
                  style={{
                    background: 'linear-gradient(180deg, rgba(168,85,247,0.5), rgba(99,102,241,0.2))',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  return <span className="whitespace-pre-wrap text-sm leading-relaxed">{content}</span>;
}

export default function App() {
  const [input, setInput] = useState('');
  const [content, setContent] = useState<RepurposedContent | null>(null);
  const [activeTab, setActiveTab] = useState<PlatformKey>('twitter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const result = await repurposeContent(input.trim());
      setContent(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activePlatform = PLATFORMS.find((p) => p.key === activeTab)!;
  const activeContent = content?.[activeTab] ?? '';
  const charCount = activeContent.length;
  const charLimit = activePlatform.maxChars;
  const charPercent = Math.min((charCount / charLimit) * 100, 100);

  let charColor = '#22c55e';
  if (charPercent > 90) charColor = '#ef4444';
  else if (charPercent > 70) charColor = '#eab308';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans overflow-x-hidden">
      {/* Enhanced background with animated orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Base gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(26,10,46,0.6) 0%, rgba(10,10,15,1) 100%)',
          }}
        />

        {/* Animated floating orbs */}
        <div
          className="absolute top-1/4 -left-40 w-96 h-96 rounded-full blur-3xl opacity-[0.15] animate-float"
          style={{
            background: 'radial-gradient(circle, #a855f7, transparent)',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute top-1/2 -right-32 w-80 h-80 rounded-full blur-3xl opacity-[0.12] animate-float"
          style={{
            background: 'radial-gradient(circle, #7c3aed, transparent)',
            animation: 'float 25s ease-in-out infinite 2s',
          }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl opacity-[0.1] animate-float"
          style={{
            background: 'radial-gradient(circle, #6366f1, transparent)',
            animation: 'float 30s ease-in-out infinite 5s',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10 lg:py-16">
        {/* Header */}
        <header className="text-center mb-12 lg:mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-bold tracking-widest uppercase backdrop-blur-sm border"
            style={{
              background: 'rgba(168,85,247,0.08)',
              borderColor: 'rgba(168,85,247,0.4)',
              boxShadow: '0 0 20px rgba(168,85,247,0.2)',
            }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: '#a855f7' }} />
            Powered by Groq + Llama 3.3
          </div>

          <h1
            className="text-5xl lg:text-7xl font-black tracking-tight mb-2"
            style={{
              background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 50%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            AI Repurposing Engine
          </h1>

          <p className="text-base lg:text-lg text-gray-500 font-medium tracking-wider">
            1 Content{' '}
            <span style={{ color: '#a855f7' }} className="font-bold">
              →
            </span>{' '}
            5 Platforms
          </p>
        </header>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left: Input panel */}
          <div className="flex flex-col gap-4">
            <div
              className="rounded-2xl p-6 lg:p-8 flex flex-col gap-6 h-full border"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(168,85,247,0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(99,102,241,0.2))',
                    borderColor: 'rgba(168,85,247,0.3)',
                    border: '1px solid',
                  }}
                >
                  <Sparkles size={20} style={{ color: '#a855f7' }} />
                </div>
                <h2 className="font-bold text-lg text-white">Original Content</h2>
              </div>

              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your blog post, article, newsletter, or any content here..."
                rows={14}
                className="w-full resize-none rounded-xl p-4 text-sm leading-relaxed outline-none transition-all duration-300 text-gray-200"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  minHeight: '320px',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)';
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(168,85,247,0.2), inset 0 0 20px rgba(168,85,247,0.05)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />

              <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
                <span>{input.length.toLocaleString()} characters</span>
                <span>{input.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>

              <button
                onClick={generate}
                disabled={loading || !input.trim()}
                className="w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden"
                style={{
                  background: loading || !input.trim()
                    ? 'rgba(168,85,247,0.15)'
                    : 'linear-gradient(135deg, #7c3aed 0%, #6366f1 50%, #0891b2 100%)',
                  color: loading || !input.trim() ? 'rgba(168,85,247,0.5)' : 'white',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  boxShadow: loading || !input.trim() ? 'none' : '0 0 30px rgba(124,58,237,0.4)',
                  transform: loading || !input.trim() ? 'scale(1)' : 'scale(1)',
                }}
                onMouseEnter={(e) => {
                  if (!loading && input.trim()) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(124,58,237,0.6)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && input.trim()) {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(124,58,237,0.4)';
                  }
                }}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Generate for All Platforms
                  </>
                )}
              </button>

              {/* Platform chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {PLATFORMS.map((p) => {
                  const isActive = activeTab === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => setActiveTab(p.key)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-300"
                      style={{
                        background: isActive ? `${p.color}15` : 'rgba(255,255,255,0.04)',
                        color: isActive ? p.color : '#a1a1aa',
                        borderColor: isActive ? `${p.color}40` : 'rgba(255,255,255,0.08)',
                        boxShadow: isActive ? `0 0 12px ${p.color}20` : 'none',
                      }}
                    >
                      <PlatformIcon name={p.icon} size={12} />
                      <span className="hidden sm:inline">{p.label}</span>
                      <span className="sm:hidden">{p.key.charAt(0).toUpperCase() + p.key.slice(1)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Output panel */}
          <div className="flex flex-col">
            <div
              className="rounded-2xl flex flex-col h-full overflow-hidden border"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(168,85,247,0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Tabs */}
              <div
                className="flex overflow-x-auto scrollbar-hide overflow-x-auto"
                style={{
                  borderBottom: '1px solid rgba(168,85,247,0.15)',
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {PLATFORMS.map((p) => {
                  const isActive = activeTab === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => setActiveTab(p.key)}
                      className="flex-shrink-0 flex items-center gap-2.5 px-4 py-4 text-xs font-bold transition-all duration-300 whitespace-nowrap relative border-b-2"
                      style={{
                        color: isActive ? p.color : '#71717a',
                        borderBottomColor: isActive ? p.color : 'transparent',
                        background: isActive ? `${p.color}08` : 'transparent',
                        boxShadow: isActive ? `0 0 15px ${p.color}20` : 'none',
                      }}
                    >
                      <PlatformIcon name={p.icon} size={16} />
                      <span className="hidden sm:inline">{p.label}</span>
                      <span className="sm:hidden">{p.key.charAt(0).toUpperCase() + p.key.slice(1)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Content area */}
              <div className="flex-1 flex flex-col p-6 lg:p-8 gap-4">
                {error && (
                  <div
                    className="flex items-start gap-3 p-4 rounded-lg text-sm border"
                    style={{
                      background: 'rgba(239,68,68,0.08)',
                      borderColor: 'rgba(239,68,68,0.3)',
                      color: '#fca5a5',
                    }}
                  >
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {loading && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20">
                    <div className="relative w-14 h-14">
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          border: '2px solid rgba(168,85,247,0.15)',
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
                        style={{
                          borderTopColor: '#a855f7',
                          borderRightColor: '#7c3aed',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold">Generating content...</p>
                      <p className="text-gray-500 text-xs mt-2">Repurposing for all 5 platforms</p>
                    </div>
                  </div>
                )}

                {!loading && !content && !error && (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 text-center">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center border"
                      style={{
                        background: 'rgba(168,85,247,0.1)',
                        borderColor: 'rgba(168,85,247,0.25)',
                      }}
                    >
                      <PlatformIcon name={activePlatform.icon} size={28} />
                    </div>
                    <div>
                      <p className="text-gray-300 font-semibold">No content yet</p>
                      <p className="text-gray-600 text-xs max-w-xs mt-1">
                        Paste your content on the left and click Generate to see your {activePlatform.label} content here.
                      </p>
                    </div>
                  </div>
                )}

                {!loading && content && activeContent && (
                  <>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{
                            background: `${activePlatform.color}15`,
                            borderColor: `${activePlatform.color}30`,
                            border: '1px solid',
                          }}
                        >
                          <PlatformIcon name={activePlatform.icon} size={16} style={{ color: activePlatform.color }} />
                        </div>
                        <span className="font-bold text-sm text-white truncate">{activePlatform.label}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={generate}
                          disabled={loading}
                          className="px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 flex items-center gap-2 border"
                          style={{
                            background: 'rgba(255,255,255,0.05)',
                            color: '#a1a1aa',
                            borderColor: 'rgba(255,255,255,0.1)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(168,85,247,0.1)';
                            e.currentTarget.style.color = '#a855f7';
                            e.currentTarget.style.borderColor = 'rgba(168,85,247,0.3)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.color = '#a1a1aa';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                          }}
                        >
                          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
                          <span className="hidden sm:inline">Regenerate</span>
                        </button>
                        <CopyButton text={activeContent} />
                      </div>
                    </div>

                    <div
                      className="flex-1 rounded-lg p-5 text-gray-300 overflow-y-auto border"
                      style={{
                        background: 'rgba(255,255,255,0.02)',
                        borderColor: 'rgba(255,255,255,0.08)',
                        minHeight: '280px',
                        maxHeight: '480px',
                      }}
                    >
                      <ContentRenderer content={activeContent} platform={activeTab} />
                    </div>

                    {/* Character count bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span style={{ color: charColor }}>{charCount.toLocaleString()} characters</span>
                        <span className="text-gray-600">
                          {charLimit.toLocaleString()} max
                        </span>
                      </div>
                      <div
                        className="w-full h-2 rounded-full overflow-hidden border"
                        style={{
                          background: 'rgba(255,255,255,0.06)',
                          borderColor: 'rgba(255,255,255,0.08)',
                        }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${charPercent}%`,
                            background: `linear-gradient(90deg, #a855f7 0%, #7c3aed 50%, #06b6d4 100%)`,
                            boxShadow: `0 0 12px ${charColor}40`,
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 pt-8" style={{ borderTop: '1px solid rgba(168,85,247,0.1)' }}>
          <div className="space-y-4">
            <p className="text-xs text-gray-600 font-medium tracking-wide">
              <span style={{ color: '#a855f7' }} className="font-bold">AI Repurposing Engine</span> · Powered by{' '}
              <span style={{ color: '#06b6d4' }} className="font-bold">Groq</span> +{' '}
              <span style={{ color: '#6366f1' }} className="font-bold">Llama 3.3 70B</span>
            </p>
            <div className="flex items-center justify-center gap-3">
              <span className="text-xs text-gray-600">Built by Daffa Novendra Aditama</span>
              <a
                href="https://linkedin.com/in/daffanovendraaditama"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center transition-all duration-300"
                style={{ color: '#a1a1aa' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#0077b5';
                  e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(0,119,181,0.4))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#a1a1aa';
                  e.currentTarget.style.filter = 'none';
                }}
              >
                <Linkedin size={16} />
              </a>
              <span className="text-gray-700">·</span>
              <a
                href="https://github.com/Tama260"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center transition-all duration-300"
                style={{ color: '#a1a1aa' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.filter = 'drop-shadow(0 0 8px rgba(255,255,255,0.4))';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#a1a1aa';
                  e.currentTarget.style.filter = 'none';
                }}
              >
                <Github size={16} />
              </a>
            </div>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(120deg); }
          66% { transform: translate(-20px, 20px) rotate(240deg); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 0.8s linear infinite;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          scroll-behavior: smooth;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          display: none;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          display: none;
        }
      `}</style>
    </div>
  );
}
