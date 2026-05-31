import type { FC } from "react";
import type { CommunityStory } from "./aboutTypes";

export const CommunityStoryCard: FC<{ story: CommunityStory }> = ({ story }) => (
  <div className="group cursor-pointer">
    <div className="aspect-4/5 rounded-xl overflow-hidden mb-6">
      <img src={story.image} alt={story.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    </div>
    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{story.name}</h4>
    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 font-medium uppercase tracking-wider">{story.location}</p>
    <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">{story.quote}</p>
  </div>
);
