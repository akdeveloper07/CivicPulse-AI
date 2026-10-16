// ============================================================
// ShareButton component — real sharing with fallback
// ============================================================

import React, { useState } from 'react';
import { Share2, Copy } from 'lucide-react';

/**
 * Props:
 * - url: The public URL to share (e.g., issue detail page)
 * - title: Optional title text for the share sheet
 */
export const ShareButton: React.FC<{ url: string; title?: string }> = ({ url, title }) => {
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleShare = async () => {
    // Try native Web Share API first
    if (navigator.share) {
      try {
        await navigator.share({
          title: title || 'Civic Issue',
          text: 'Check out this civic issue',
          url,
        });
        setFeedback('Shared via native dialog');
        return;
      } catch (err) {
        // User cancelled or error – fall back
        console.warn('Native share failed', err);
      }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(url);
      setFeedback('Link copied to clipboard');
    } catch (err) {
      // Manual copy fallback
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed'; // avoid scroll jump
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      setFeedback('Link copied (fallback)');
    }
  };

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium shadow-sm transition-colors"
      >
        <Share2 className="w-4 h-4" /> Share
      </button>
      {feedback && (
        <span className="text-xs text-teal-200 animate-fade-in">{feedback}</span>
      )}
    </div>
  );
};

// Note: The component deliberately avoids exposing any private data.
// It only shares the public URL that the caller constructs.
