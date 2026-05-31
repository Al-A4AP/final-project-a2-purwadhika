import type { FC } from "react";

export const MissionImage: FC = () => (
  <div className="rounded-2xl overflow-hidden aspect-video relative">
    <img
      src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
      alt="Community impact"
      className="object-cover w-full h-full"
    />
  </div>
);
