import React from 'react';
import { Clock } from 'lucide-react';

interface LastUpdatedInfoProps {
  lastUpdated: Date | null;
  className?: string;
}

const LastUpdatedInfo: React.FC<LastUpdatedInfoProps> = ({ lastUpdated, className = "" }) => {
  if (!lastUpdated) {
    return null;
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('cs-CZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
      <Clock className="h-4 w-4" />
      <span>Poslední aktualizace: {formatDate(lastUpdated)}</span>
    </div>
  );
};

export default LastUpdatedInfo;