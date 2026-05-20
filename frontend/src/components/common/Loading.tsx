import type { FC } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
  size?: number;
}

export const Loading: FC<LoadingProps> = ({ 
  fullScreen = false, 
  text = 'Memuat data...', 
  size = 32 
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-3 p-8">
      <Loader2 size={size} className="animate-spin text-red-600" />
      {text && <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-9999">
        {content}
      </div>
    );
  }

  return content;
};
