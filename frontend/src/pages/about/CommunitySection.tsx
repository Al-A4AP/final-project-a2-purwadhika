import type { FC } from "react";
import { COMMUNITY_STORIES } from "./aboutData";
import { CommunityStoryCard } from "./CommunityStoryCard";

export const CommunitySection: FC = () => (
  <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
    <h2 className="text-sm font-bold tracking-widest text-slate-500 uppercase mb-4">Komunitas</h2>
    <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-16 max-w-2xl">Built on PURWALOKA: Merayakan Komunitas Pemilik Properti Lokal</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {COMMUNITY_STORIES.map((story) => <CommunityStoryCard key={story.name} story={story} />)}
    </div>
  </section>
);
