export function IsobarField() {
  // Concentric, hand-tuned contour lines evoking a pressure map — the
  // signature visual motif for the brand, echoed later in the dashboard
  // loading states and the widget builder preview frame.
  const paths = [
    "M-100,300 C150,180 350,420 600,280 C850,140 1050,380 1300,260",
    "M-100,380 C150,260 350,500 600,360 C850,220 1050,460 1300,340",
    "M-100,460 C150,340 350,580 600,440 C850,300 1050,540 1300,420",
    "M-100,220 C150,100 350,340 600,200 C850,60 1050,300 1300,180",
    "M-100,540 C150,420 350,660 600,520 C850,380 1050,620 1300,500"
  ];

  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
      viewBox="0 0 1200 700"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="isobar-amber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F5A623" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#F5A623" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="isobar-cyan" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#35C5E0" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#35C5E0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {paths.map((d, i) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={i % 2 === 0 ? "url(#isobar-amber)" : "url(#isobar-cyan)"}
          strokeWidth={1.25}
          className="animate-drift"
          style={{ animationDelay: `${i * 1.4}s`, animationDuration: `${14 + i * 2}s` }}
        />
      ))}
    </svg>
  );
}
