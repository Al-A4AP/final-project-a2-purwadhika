import type { ChangeEvent, FC, RefObject } from "react";

export const AvatarInput: FC<{ fileRef: RefObject<HTMLInputElement | null>; onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void }> = ({ fileRef, onAvatarChange }) => (
  <input ref={fileRef} type="file" accept=".jpg,.jpeg,.png,.gif" onChange={onAvatarChange} className="hidden" />
);
