import type { FC } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  fullScreen?: boolean;
  text?: string;
  size?: number;
}

const LoadingContent: FC<Pick<LoadingProps, 'text' | 'size'>> = ({ text, size }) => (
  <div className="flex flex-col items-center justify-center space-y-3 p-8">
    <Loader2 size={size} className="animate-spin text-red-600" />
    {text && <p className="animate-pulse text-sm font-medium text-gray-500 dark:text-gray-400">{text}</p>}
  </div>
);

const FullScreenLoading: FC<Pick<LoadingProps, 'text' | 'size'>> = (props) => (
  <div className="fixed inset-0 z-9999 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
    <LoadingContent {...props} />
  </div>
);

export const Loading: FC<LoadingProps> = ({ fullScreen = false, text = 'Memuat data...', size = 32 }) =>
  fullScreen ? <FullScreenLoading text={text} size={size} /> : <LoadingContent text={text} size={size} />;
