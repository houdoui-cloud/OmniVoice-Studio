import React from 'react';
import { User, Mic, Sparkles, BookOpen, Volume2, Bot, Radio, Drama, Play } from 'lucide-react';

export const USE_CASE_COLOR = {
  narration: '#83a598',
  assistant: '#b8bb26',
  gaming: '#fabd2f',
  podcast: '#fb4934',
  character: '#d3869b',
  singing: '#8ec07c',
  commercial: '#fe8019',
};

export function ArchetypeIcon({ archetype, className = 'w-4 h-4' }) {
  const norm = (archetype || '').toLowerCase();
  if (norm.includes('narrator') || norm.includes('story')) {
    return <BookOpen className={className} />;
  }
  if (norm.includes('assistant') || norm.includes('bot')) {
    return <Bot className={className} />;
  }
  if (norm.includes('broadcast') || norm.includes('news') || norm.includes('podcast')) {
    return <Radio className={className} />;
  }
  if (norm.includes('drama') || norm.includes('character') || norm.includes('game')) {
    return <Drama className={className} />;
  }
  if (norm.includes('spark') || norm.includes('magic')) {
    return <Sparkles className={className} />;
  }
  return <Mic className={className} />;
}

export function ArchetypeAvatar({ archetype, className = 'w-10 h-10 rounded-full flex items-center justify-center bg-[var(--bg-elev-2,#3c3836)]' }) {
  return (
    <div className={className}>
      <ArchetypeIcon archetype={archetype} className="w-5 h-5 text-[var(--text-primary,#ebdbb2)]" />
    </div>
  );
}

export function AccentFlag({ accent, className = 'inline-block text-xs' }) {
  if (!accent) return null;
  return <span className={className} title={accent}>🌐</span>;
}

export function NowPlaying({ className = 'w-4 h-4 flex items-center justify-center' }) {
  return (
    <span className={className}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
    </span>
  );
}
