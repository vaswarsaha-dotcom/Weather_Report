import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const NAV = [
  {
    href: "/dashboard",
    label: "Overview",
  },
  {
    href: "/dashboard/history",
    label: "History",
  },
  {
    href: "/dashboard/alerts",
    label: "Alerts",
  },
  {
    href: "/dashboard/widget",
    label: "Widget",
  },
  {
    href: "/dashboard/branding",
    label: "Branding",
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSession();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  const displayName = user.name?.trim() || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div className="relative isolate min-h-screen w-full bg-ink text-cloud">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 bg-isobar-glow opacity-60" />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-[1000] border-b border-white/10 bg-ink/80 backdrop-blur-xl supports-[backdrop-filter]:bg-ink/60">
        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1600px]
            items-center
            justify-between
            gap-3
            px-3
            py-2.5
            sm:px-5
            sm:py-3
            lg:px-6
          "
        >

          {/* =================================================
              LOGO
          ================================================== */}

          <Link
            href="/dashboard"
            className="
              shrink-0
              font-display
              text-sm
              font-bold
              leading-tight
              text-cloud
              sm:text-base
            "
          >
            <span className="hidden sm:inline">
              {process.env.NEXT_PUBLIC_APP_NAME || "WeatherSphere Pro"}
            </span>

            <span className="sm:hidden">
              WeatherSphere
            </span>
          </Link>

          {/* =================================================
              DESKTOP NAV
          ================================================== */}

          <nav className="hidden items-center gap-1 text-sm lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="
                  rounded-lg
                  px-3
                  py-1.5
                  text-slate
                  transition
                  hover:bg-white/5
                  hover:text-cloud
                "
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* =================================================
              MOBILE MENU
          ================================================== */}

          <details className="relative lg:hidden">
            <summary
              className="
                flex
                h-9
                w-9
                cursor-pointer
                list-none
                items-center
                justify-center
                rounded-xl
                border
                border-white/10
                bg-white/[0.03]
                text-slate
                transition
                hover:bg-white/[0.07]
                hover:text-cloud
              "
              aria-label="Open navigation"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            </summary>

            <div
              className="
                absolute
                right-0
                top-[calc(100%+8px)]
                z-[100]
                w-52
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-[#11182D]
                shadow-2xl
              "
            >
              <div className="border-b border-white/10 px-4 py-3">
                <p className="text-xs font-semibold text-cloud">
                  Navigation
                </p>
              </div>

              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="
                    flex
                    items-center
                    px-4
                    py-3
                    text-xs
                    text-slate
                    transition
                    hover:bg-white/5
                    hover:text-cloud
                  "
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>

          {/* =================================================
              PROFILE
          ================================================== */}

          <div className="flex shrink-0 items-center gap-2">

            {/* Admin */}

            {user.role === "admin" && (
              <Link
                href="/admin"
                className="
                  hidden
                  px-2
                  text-xs
                  text-amber
                  transition
                  hover:text-amber/80
                  md:block
                "
              >
                Admin
              </Link>
            )}

            {/* PROFILE DROPDOWN */}

            <details className="relative">
              <summary
                className="
                  flex
                  cursor-pointer
                  select-none
                  list-none
                  items-center
                  gap-1.5
                  rounded-xl
                  border
                  border-white/10
                  bg-white/[0.03]
                  px-1.5
                  py-1.5
                  transition
                  hover:bg-white/[0.07]
                  sm:px-2
                "
              >

                {/* AVATAR */}

                <div
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    bg-amber
                    text-xs
                    font-bold
                    text-ink
                  "
                >
                  {initial}
                </div>

                {/* NAME */}

                <div className="hidden max-w-[100px] text-left leading-tight sm:block">
                  <div className="truncate text-xs font-medium text-cloud">
                    {displayName}
                  </div>

                  <div className="mt-0.5 text-[9px] capitalize text-slate">
                    {user.role || "user"}
                  </div>
                </div>

                {/* ARROW */}

                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-slate"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>

              {/* PROFILE DROPDOWN */}

              <div
                className="
                  absolute
                  right-0
                  top-[calc(100%+8px)]
                  z-[100]
                  w-52
                  overflow-hidden
                  rounded-2xl
                  border
                  border-white/10
                  bg-[#11182D]
                  shadow-2xl
                "
              >
                <div className="border-b border-white/10 px-4 py-3">
                  <div className="truncate text-sm font-medium text-cloud">
                    {displayName}
                  </div>

                  <div className="mt-0.5 text-[10px] capitalize text-slate">
                    {user.role || "user"}
                  </div>
                </div>

                <Link
                  href="/dashboard"
                  className="
                    block
                    px-4
                    py-3
                    text-xs
                    text-slate
                    hover:bg-white/5
                    hover:text-cloud
                  "
                >
                  👤 Profile
                </Link>

                <Link
                  href="/dashboard/branding"
                  className="
                    block
                    px-4
                    py-3
                    text-xs
                    text-slate
                    hover:bg-white/5
                    hover:text-cloud
                  "
                >
                  🎨 Branding
                </Link>

                <Link
                  href="/dashboard/widget"
                  className="
                    block
                    px-4
                    py-3
                    text-xs
                    text-slate
                    hover:bg-white/5
                    hover:text-cloud
                  "
                >
                  ☁️ Weather Widget
                </Link>

                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="
                      block
                      px-4
                      py-3
                      text-xs
                      text-amber
                      hover:bg-white/5
                    "
                  >
                    ⚙️ Admin Panel
                  </Link>
                )}
              </div>
            </details>
          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="
          relative mx-auto w-full min-w-0 max-w-[1600px] px-3 py-4 sm:px-5 sm:py-6 lg:px-6 lg:py-8
        "
      >
        {/* IMPORTANT:
            min-w-0 prevents dashboard children from
            overflowing their available width.
        */}
        <div className="min-w-0 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}