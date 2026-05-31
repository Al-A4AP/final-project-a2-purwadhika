import type { FC } from "react";
import { MissionImage } from "./MissionImage";
import { MissionText } from "./MissionText";

export const MissionSection: FC = () => (
  <section className="py-24 px-6 md:px-12 bg-slate-50 dark:bg-slate-900 mt-12">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <MissionText />
      <MissionImage />
    </div>
  </section>
);
