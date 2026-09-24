"use client";

import { useState, type ReactNode } from "react";
import {
  WeatherSidebar,
  type ViewKey,
} from "./WeatherSidebar";

interface Props {
  topBar: ReactNode;
  locationTabs?: ReactNode;
  views: Partial<Record<ViewKey, ReactNode>>;
  defaultView?: ViewKey;
}

const MOBILE_NAV: {
  key: ViewKey;
  label: string;
  icon: string;
}[] = [
  {
    key: "current",
    label: "Current",
    icon: "☀",
  },
  {
    key: "hourly",
    label: "Hourly",
    icon: "◷",
  },
  {
    key: "details",
    label: "Details",
    icon: "◉",
  },
  {
    key: "maps",
    label: "Maps",
    icon: "⌖",
  },
  {
    key: "monthly",
    label: "Monthly",
    icon: "▦",
  },
  {
    key: "trends",
    label: "Trends",
    icon: "⌁",
  },
];

export function WeatherShell({
  topBar,
  locationTabs,
  views,
  defaultView = "current",
}: Props) {
  const [active, setActive] =
    useState<ViewKey>(defaultView);

  return (
    <div className="w-full min-w-0">

      {/* =====================================================
          MOBILE NAVIGATION
          
          Visible only below lg.
      ====================================================== */}

      <div className="lg:hidden mb-4">
        <div
          className="
            w-full
            overflow-x-auto
            scrollbar-hide
            rounded-2xl
            border
            border-white/10
            bg-[#111a2e]/90
            backdrop-blur-xl
            p-1.5
          "
        >
          <div className="flex min-w-max gap-1">
            {MOBILE_NAV.map((item) => {
              const activeItem =
                active === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    setActive(item.key)
                  }
                  className={`
                    flex
                    items-center
                    gap-1.5
                    rounded-xl
                    px-3
                    py-2
                    text-[11px]
                    font-medium
                    whitespace-nowrap
                    transition
                    ${
                      activeItem
                        ? "bg-amber text-ink shadow-sm"
                        : "text-slate hover:bg-white/5 hover:text-cloud"
                    }
                  `}
                >
                  <span className="text-xs">
                    {item.icon}
                  </span>

                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================
          DESKTOP + MOBILE CONTENT

          Desktop:
            Sidebar | Content

          Mobile:
            Content only
      ====================================================== */}

      <div className="w-full min-w-0 lg:flex lg:items-start lg:gap-5">

        {/* ===================================================
            DESKTOP SIDEBAR

            IMPORTANT:
            Hidden on mobile.
        ==================================================== */}

        <aside className="hidden lg:block lg:w-[190px] lg:flex-none">
          <WeatherSidebar
            activeView={active}
            onChange={setActive}
          />
        </aside>

        {/* ===================================================
            MAIN CONTENT

            min-w-0 prevents horizontal overflow.
        ==================================================== */}

        <div className="min-w-0 flex-1 w-full overflow-hidden">

          {/* TOP BAR */}

          <div className="w-full min-w-0">
            {topBar}
          </div>

          {/* LOCATION TABS */}

          {locationTabs && (
            <div className="w-full min-w-0 mt-4">
              {locationTabs}
            </div>
          )}

          {/* ACTIVE VIEW */}

          <div className="w-full min-w-0 mt-5">
            {views[active] ?? views.current}
          </div>
        </div>
      </div>
    </div>
  );
}