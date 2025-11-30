
import React, { useState, useRef, useEffect } from "react";

// convert running time to hour and minutes examlpe: 1h 2m
function formatRunningTime(value) {
  const m = parseInt(value, 10);
  if (Number.isNaN(m)) return value ?? "—";
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h > 0) return `${h}h ${r}m`;
  return `${r}m`;
}

export default function Timeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchFilms() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("https://ghibliapi.vercel.app/films");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if (!mounted) return;

        // map all films to timeline items
        const items = data.map((f) => ({
          id: f.id,
          title: f.title,
          date: f.release_date,
          desc: f.description,
          original_title: f.original_title || f.original_title_romanised || null,
          director: f.director,
          producer: f.producer,
          running_time: f.running_time,
          rating: f.rt_score,
          movie_banner: f.movie_banner || null,
        }));

        setTimeline(items);
      } catch (err) {
        setError(err.message || "Failed to fetch films");
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="relative w-3/4 mx-auto py-12">
        <p className="text-center text-gray-600">Loading timeline…</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative w-3/4 mx-auto py-12">
        <p className="text-center text-red-500">Error: {error}</p>
      </section>
    );
  }

  const itemsToRender = timeline.length ? timeline : [
    { id: null, title: "Title 1", date: "1986", desc: "Lorem ipsum dolor sit amet." },
    { id: null, title: "Title 2", date: "1988", desc: "Ut enim ad minim veniam." },
    { id: null, title: "Title 3", date: "1989", desc: "Duis aute irure dolor." },
  ];

  return (
    <section className="relative w-3/4 mx-auto py-12">
      {/* Middle line */}
      <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300 -translate-x-1/2"></div>

      {itemsToRender.map((item, index) => (
        <TimelineItem
          key={index}
          item={item}
          isLeft={index % 2 === 0}
          reverse={index % 2 === 1}
        />
      ))}
    </section>
  );
}

/* ================================================================== */
/*                            TIMELINE ITEM                           */
/* ================================================================== */

function TimelineItem({ item, isLeft, reverse }) {
  const [showDetails, setShowDetails] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const actions = [
    { key: "favorite", label: "Favorite", icon: "star" },
    { key: "plan", label: "Plan to Watch", icon: "bookmark" },
    { key: "on_hold", label: "On-Hold", icon: "pause_circle" },
    { key: "dropped", label: "Dropped", icon: "cancel" },
    { key: "finished", label: "Finished", icon: "check_circle" },
  ];

  /* ------------------------------------------
     BUTTON ROW ALIGNMENT (MIRRORING)
  ------------------------------------------- */
  const buttonRowClass = isLeft
    ? "flex items-center mt-3 space-x-4 relative"
    : "flex items-center mt-3 space-x-4 relative justify-end";

  /* Details popup alignment */
  const detailsPopupPosition = isLeft ? "-left-4" : "right-0";

  /* Dropdown menu alignment */
  const menuPosition = isLeft
    ? "left-[85px]"
    : "right-[100px] flex flex-col items-end";

  return (
    <div className={`relative w-1/2 py-6 ${isLeft ? "pr-8" : "pl-8 ml-auto"}`}>
      
      {/* Dot marker */}
      <div className="absolute top-6 left-1/2 w-3 h-3 bg-gray-400 rounded-full -translate-x-1/2"></div>

      {/* Panel box */}
      <div className="p-4 border rounded-md bg-white">
        {reverse ? (
          <div className="flex justify-between">
            <span className="text-sm">{item.date}</span>
            <h3 className="font-semibold">{item.title}</h3>
          </div>
        ) : (
          <div className="flex justify-between">
            <h3 className="font-semibold">{item.title}</h3>
            <span className="text-sm">{item.date}</span>
          </div>
        )}

        <hr className="border-t border-gray-400 border-dotted my-2" />

        <p className="text-sm text-gray-700">{item.desc}</p>
      </div>

      {/* BUTTON ROW */}
      <div className={buttonRowClass} ref={menuRef}>
        
        {/* ============= LEFT SIDE BUTTON ORDER ============= */}
        {isLeft && (
          <>
            {/* Details button */}
            <button
              onMouseEnter={() => setShowDetails(true)}
              onMouseLeave={() => setShowDetails(false)}
              className="px-5 py-2 bg-black text-white rounded-xl text-sm font-medium shadow hover:bg-gray-800 transition"
            >
              Details
            </button>

            {/* PLUS button */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow"
            >
              <span className="material-symbols-outlined text-2xl">add</span>
            </button>
          </>
        )}

        {/* ============= RIGHT SIDE BUTTON ORDER ============= */}
        {!isLeft && (
          <>
            {/* PLUS button */}
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow"
            >
              <span className="material-symbols-outlined text-2xl">add</span>
            </button>

            {/* Details button */}
            <button
              onMouseEnter={() => setShowDetails(true)}
              onMouseLeave={() => setShowDetails(false)}
              className="px-5 py-2 bg-black text-white rounded-xl text-sm font-medium shadow hover:bg-gray-800 transition"
            >
              Details
            </button>
          </>
        )}

            {/* DETAILS POPUP */}
        {showDetails && (
          <div
            className={`absolute ${detailsPopupPosition} top-12 w-72 bg-white border rounded-md shadow-lg p-4 text-sm z-50`}
          >
            <p><strong>Japanese Title:</strong> {item.original_title ?? '—'}</p>
            <p><strong>Director:</strong> {item.director ?? '—'}</p>
            <p><strong>Producer:</strong> {item.producer ?? '—'}</p>
            <p><strong>Running Time:</strong> {formatRunningTime(item.running_time)}</p>
            <p><strong>Rating:</strong> {item.rating ?? '—'}</p>
          </div>
        )}

        {/* DROPDOWN MENU */}
        {menuOpen && (
          <div className={`absolute ${menuPosition} top-12 space-y-2 z-50`}>

            {actions.map((action) => (
              <div
                key={action.key}
                className={`flex items-center space-x-2 ${
                  isLeft ? "" : "flex-row-reverse space-x-reverse"
                }`}
              >
                {/* ICON BUTTON */}
                <button
                  onClick={() => {
                    console.log("Selected:", action.key);
                    setMenuOpen(false);
                  }}
                  className="w-9 h-9 bg-white border rounded-full flex items-center justify-center shadow hover:bg-gray-100 transition"
                >
                  <span className="material-symbols-outlined text-base">
                    {action.icon}
                  </span>
                </button>

                {/* LABEL */}
                <div className="px-4 py-2 bg-white rounded-full border shadow text-sm">
                  {action.label}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}