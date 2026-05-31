import type { ChangeEvent, RefObject } from 'react';
import { Camera, Loader2, User as UserIcon } from 'lucide-react';
import type { User } from '@/types';

interface Props {
  user: User | null;
  fileRef: RefObject<HTMLInputElement | null>;
  uploading: boolean;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatarCard = ({ user, fileRef, uploading, onAvatarChange }: Props) => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border dark:border-slate-700 p-6 mb-6">
    <div className="flex items-center gap-6">
      <div className="relative">
        {user?.avatar_url ? (
          <img src={user.avatar_url} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <UserIcon size={32} className="text-red-600" />
          </div>
        )}
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition disabled:opacity-50"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
        </button>
        <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.gif" onChange={onAvatarChange} className="hidden" />
      </div>
      <div>
        <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
        <p className="text-sm text-gray-500">{user?.email}</p>
        <span className="text-xs bg-red-50 dark:bg-red-900/20 text-red-600 px-2 py-0.5 rounded-full">
          {user?.role === 'TENANT' ? 'Pemilik Properti' : 'Penyewa'}
        </span>
      </div>
    </div>
  </div>
);
