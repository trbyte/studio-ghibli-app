import React, { useState, useRef, useEffect } from "react";

export default function Timeline() {
  const timeline = [
    { title: "Title 1", date: "1986", desc: "Lorem ipsum dolor sit amet." },
    { title: "Title 2", date: "1988", desc: "Ut enim ad minim veniam." },
    { title: "Title 3", date: "1989", desc: "Duis aute irure dolor." },
  ];

  return (
    <section className="relative w-3/4 mx-auto py-12">
      {/* Middle line */}
      <div className="absolute left-1/2 top-0 h-full w-px bg-gray-300 -translate-x-1/2"></div>

      {timeline.map((item, index) => (
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
/*                             TIMELINE ITEM                           */
/* ================================================================== */

function TimelineItem({ item, isLeft, reverse }) {
  const [showDetails, setShowDetails] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const detailsRef = useRef(null);
  const menuRef = useRef(null);

  // CLOSE WHEN CLICKING OUTSIDE
  useEffect(() => {
    function handleOutside(e) {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setShowDetails(false);
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const actions = [
    { key: "favorite", label: "Favorite", icon: "star" },
    { key: "plan", label: "Plan to Watch", icon: "bookmark" },
    { key: "on_hold", label: "On-Hold", icon: "pause_circle" },
    { key: "dropped", label: "Dropped", icon: "cancel" },
    { key: "finished", label: "Finished", icon: "check_circle" },
  ];

  /* ================================
     POSITION CLASSES FOR LEFT/RIGHT
     ================================ */

  const rowClass = isLeft
    ? "flex items-center space-x-4 mt-3 relative"
    : "flex items-center space-x-4 mt-3 relative justify-end";

  const dropdownAlign = isLeft
    ? "left-[90px]"
    : "right-[90px] flex flex-col items-end";

  const detailsPopupAlign = isLeft ? "left-0" : "right-0";

  const actionRowReverse = isLeft
    ? "flex-row space-x-2"
    : "flex-row-reverse space-x-reverse";

  return (
    <div className={`relative w-1/2 py-6 ${isLeft ? "pr-8" : "pl-8 ml-auto"}`}>

      {/* TIMELINE DOT */}
      <div className="absolute top-6 left-1/2 w-3 h-3 bg-gray-400 rounded-full -translate-x-1/2"></div>

      {/* PANEL */}
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
      <div className={rowClass}>
        
        {/* ===================== LEFT SIDE ===================== */}
        {isLeft && (
          <>
            {/* DETAILS BUTTON + POPUP */}
            <div className="relative" ref={detailsRef}>
              <button
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
                className="px-5 py-2 bg-black text-white rounded-xl text-sm shadow hover:bg-gray-800 transition"
              >
                Details
              </button>

              {showDetails && (
                <div
                  className={`absolute ${detailsPopupAlign} top-12 w-64 bg-white border rounded-md shadow-lg p-4 text-sm`}
                >
                  <p><strong>Japanese Title:</strong> ______</p>
                  <p><strong>Director:</strong> ______</p>
                  <p><strong>Producer:</strong> ______</p>
                  <p><strong>Running Time:</strong> ______</p>
                  <p><strong>Rating:</strong> ______</p>
                </div>
              )}
            </div>

            {/* PLUS BUTTON */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>

              {menuOpen && (
                <div
                  className={`absolute ${dropdownAlign} top-12 space-y-2 z-50`}
                >
                  {actions.map((action) => (
                    <div
                      key={action.key}
                      className={`flex items-center ${actionRowReverse}`}
                    >
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-9 h-9 bg-white border rounded-full flex items-center justify-center shadow hover:bg-gray-100"
                      >
                        <span className="material-symbols-outlined text-base">
                          {action.icon}
                        </span>
                      </button>

                      <div className="px-4 py-2 bg-white rounded-full border shadow text-sm">
                        {action.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ===================== RIGHT SIDE ===================== */}
        {!isLeft && (
          <>
            {/* PLUS BUTTON */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow"
              >
                <span className="material-symbols-outlined text-2xl">add</span>
              </button>

              {menuOpen && (
                <div
                  className={`absolute ${dropdownAlign} top-12 space-y-2 z-50`}
                >
                  {actions.map((action) => (
                    <div
                      key={action.key}
                      className={`flex items-center ${actionRowReverse}`}
                    >
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-9 h-9 bg-white border rounded-full flex items-center justify-center shadow hover:bg-gray-100"
                      >
                        <span className="material-symbols-outlined text-base">
                          {action.icon}
                        </span>
                      </button>

                      <div className="px-4 py-2 bg-white rounded-full border shadow text-sm">
                        {action.label}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* DETAILS BUTTON + POPUP */}
            <div className="relative" ref={detailsRef}>
              <button
                onMouseEnter={() => setShowDetails(true)}
                onMouseLeave={() => setShowDetails(false)}
                className="px-5 py-2 bg-black text-white rounded-xl text-sm shadow hover:bg-gray-800 transition"
              >
                Details
              </button>

              {showDetails && (
                <div
                  className={`absolute ${detailsPopupAlign} top-12 w-64 bg-white border rounded-md shadow-lg p-4 text-sm`}
                >
                  <p><strong>Japanese Title:</strong> ______</p>
                  <p><strong>Director:</strong> ______</p>
                  <p><strong>Producer:</strong> ______</p>
                  <p><strong>Running Time:</strong> ______</p>
                  <p><strong>Rating:</strong> ______</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
