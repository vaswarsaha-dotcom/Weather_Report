"use client";

import { useState, type ReactNode } from "react";
import { WeatherSidebar, type ViewKey } from "./WeatherSidebar";

interface Props {
  topBar: ReactNode;
  locationTabs?: ReactNode;
  views: Partial<Record<ViewKey, ReactNode>>;
  defaultView?: ViewKey;
}

export function WeatherShell({ topBar, locationTabs, views, defaultView = "current" }: Props) {
  const [active, setActive] = useState<ViewKey>(defaultView);

  return (
    <div className="flex flex-col gap-5 lg:flex-row">
      <WeatherSidebar activeView={active} onChange={setActive} />

      <div className="min-w-0 flex-1 space-y-5">
        {topBar}
        {locationTabs}
        {views[active] ?? views.current}
      </div>
    </div>
  );
}