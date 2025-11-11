/**
 * LastUpdated Component
 *
 * Displays last update timestamp with author attribution
 * Important for:
 * - Building user trust
 * - Signaling content freshness to Google
 * - E-E-A-T signals (author accountability)
 */

import { formatDistanceToNow } from 'date-fns';
import { cs } from 'date-fns/locale';

interface LastUpdatedProps {
  date: string | Date;
  author?: string;
  className?: string;
}

export default function LastUpdated({
  date,
  author = "Tomáš Kostrhoun",
  className = ""
}: LastUpdatedProps) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const formattedDate = dateObj.toLocaleDateString('cs-CZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const relativeTime = formatDistanceToNow(dateObj, {
    addSuffix: true,
    locale: cs
  });

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600 border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r mb-6 ${className}`}>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>
          <strong className="text-gray-900">Aktualizováno:</strong> {formattedDate}
        </span>
      </div>
      <span className="hidden sm:inline text-gray-400">•</span>
      <div className="flex items-center gap-2">
        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>
          <strong className="text-gray-900">Autor:</strong> {author}
        </span>
      </div>
      <span className="text-xs text-gray-500 sm:ml-auto">({relativeTime})</span>
    </div>
  );
}
