import React from 'react';
import { Link } from 'react-router-dom';

export function renderTextWithMentions(text: string) {
  if (!text) return null;
  // This regex matches @username ensuring it has word boundaries or spaces around
  const mentionRegex = /(@[a-zA-Z0-9_]+)/g;
  const parts = text.split(mentionRegex);

  return parts.map((part, i) => {
    if (part.match(mentionRegex)) {
      return (
        <Link 
          key={i} 
          to={`/profile/${part}`} 
          className="text-brand-purple hover:underline font-semibold"
          onClick={(e) => e.stopPropagation()} // in case the parent has click handlers
        >
          {part}
        </Link>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}
