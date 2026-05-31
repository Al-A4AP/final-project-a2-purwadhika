import type { ChangeEvent, RefObject } from 'react';
import type { User } from '@/types';
import { ProfileSection } from './ProfileSection';
import { AvatarButton } from './avatar/AvatarButton';
import { AvatarImage } from './avatar/AvatarImage';
import { AvatarInput } from './avatar/AvatarInput';
import { AvatarUserInfo } from './avatar/AvatarUserInfo';

interface Props {
  user: User | null;
  fileRef: RefObject<HTMLInputElement | null>;
  uploading: boolean;
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatarCard = ({ user, fileRef, uploading, onAvatarChange }: Props) => (
  <ProfileSection className="mb-6">
    <div className="flex items-center gap-6">
      <div className="relative">
        <AvatarImage user={user} />
        <AvatarButton fileRef={fileRef} uploading={uploading} />
        <AvatarInput fileRef={fileRef} onAvatarChange={onAvatarChange} />
      </div>
      <AvatarUserInfo user={user} />
    </div>
  </ProfileSection>
);
