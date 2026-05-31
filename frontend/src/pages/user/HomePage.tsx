import type { FC } from "react";
import { HeroSection } from "@/components/user/HeroSection";
import { HomeResultsSection } from "./home/HomeResultsSection";
import { useHomePageState } from "./home/useHomePageState";

const HomePage: FC = () => {
  const { activeFilters, hasFilterChanges, propertyLimit, propertyState } = useHomePageState();
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <HeroSection />
      <HomeResultsSection
        activeFilters={activeFilters}
        hasFilterChanges={hasFilterChanges}
        propertyLimit={propertyLimit}
        {...propertyState}
      />
    </div>
  );
};

export default HomePage;
