import React, { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { router } from "@inertiajs/react";

// --- Helper Functions ---
function formatRunningTime(value) {
  const m = parseInt(value, 10);
  if (Number.isNaN(m)) return value ?? "—";
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h > 0) return `${h}h ${r}m`;
  return `${r}m`;
}


/* ================================================================== */
/*                            TIMELINE ITEM                           */
/* ================================================================== */

function TimelineItem({ item, isLeft, reverse, userList = {} }) {
  const [showDetails, setShowDetails] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleActionClick = (actionKey) => {
    if (!item.id) return;
    
    // Send action to backend
    router.post('/film-actions', {
      film_id: item.id,
      action_type: actionKey,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setMenuOpen(false);
      },
      onError: (errors) => {
        console.error('Failed to save action:', errors);
      }
    });
  };

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

  // Layout classes
  const buttonRowClass = isLeft
    ? "flex items-center mt-3 space-x-4 relative"
    : "flex items-center mt-3 space-x-4 relative justify-end";

  const detailsPopupPosition = isLeft ? "-left-4" : "right-0";

  const menuPosition = isLeft
    ? "left-[85px]"
    : "right-[100px] flex flex-col items-end";

  // Dot positioning on the spine
  const dotClass = isLeft
    ? "right-0 translate-x-1/2"
    : "left-0 -translate-x-1/2";

  return (
    <motion.div
      className={`relative w-1/2 py-6 ${isLeft ? "pr-8" : "pl-8 ml-auto"}`}
      initial={{ opacity: 0, y: -80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-20%" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Dot marker on the spine */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full border-2 border-black z-20 ${dotClass}`}
      />

      {/* Panel box - Glassmorphism style */}
      <div className="p-6 border border-white/20 rounded-xl bg-black/40 shadow-2xl text-white transform-gpu transition-all duration-500 hover:border-yellow-400/60 hover:shadow-[0_0_40px_rgba(250,204,21,0.45)] hover:-translate-y-1">
        {reverse ? (
          <div className="flex justify-between items-baseline">
            <span className="text-sm font-mono text-yellow-400">
              {item.release_date}
            </span>
            <h3 className="font-semibold text-2xl font-space tracking-tight">
              {item.title}
            </h3>
          </div>
        ) : (
          <div className="flex justify-between items-baseline">
            <h3 className="font-semibold text-2xl font-space tracking-tight">
              {item.title}
            </h3>
            <span className="text-sm font-mono text-yellow-400">
              {item.release_date}
            </span>
          </div>
        )}

        <hr className="border-t border-white/20 border-dashed my-4" />

        <p className="text-sm text-gray-300 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Action buttons */}
      <div className={buttonRowClass} ref={menuRef}>
        {isLeft && (
          <>
            <button
              onMouseEnter={() => setShowDetails(true)}
              onMouseLeave={() => setShowDetails(false)}
              className="px-5 py-2 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wider shadow hover:bg-yellow-400 transition"
            >
              Details
            </button>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-10 h-10 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center shadow hover:bg-white hover:text-black transition"
            >
              <span className="material-symbols-outlined text-xl">add</span>
            </button>
          </>
        )}

        {!isLeft && (
          <>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-10 h-10 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center shadow hover:bg-white hover:text-black transition"
            >
              <span className="material-symbols-outlined text-xl">add</span>
            </button>

            <button
              onMouseEnter={() => setShowDetails(true)}
              onMouseLeave={() => setShowDetails(false)}
              className="px-5 py-2 bg-white text-black rounded-xl text-xs font-bold uppercase tracking-wider shadow hover:bg-yellow-400 transition"
            >
              Details
            </button>
          </>
        )}

        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`absolute ${detailsPopupPosition} top-14 w-72 bg-black/90 border border-white/20 backdrop-blur-xl rounded-xl shadow-2xl p-5 text-sm z-50 text-gray-200`}
          >
            <p className="mb-1">
              <strong className="text-yellow-400">Original Title:</strong>{" "}
              {item.original_title ?? "—"}
            </p>
            <p className="mb-1">
              <strong className="text-yellow-400">Director:</strong>{" "}
              {item.director ?? "—"}
            </p>
            <p className="mb-1">
              <strong className="text-yellow-400">Producer:</strong>{" "}
              {item.producer ?? "—"}
            </p>
            <p className="mb-1">
              <strong className="text-yellow-400">Running Time:</strong>{" "}
              {formatRunningTime(item.running_time)}
            </p>
            <p>
              <strong className="text-yellow-400">Rating:</strong>{" "}
              {item.rt_score ?? "—"}
            </p>
          </motion.div>
        )}

        {menuOpen && (
          <div
            className={`absolute ${menuPosition} top-14 space-y-2 z-50 w-48`}
          >
            {actions.map((action) => {
              const isActive = userList[action.key]?.some(
                (film) => film.film_id === item.id
              );
              return (
                <div
                  key={action.key}
                  className={`group flex items-center space-x-2 cursor-pointer ${
                    isLeft ? "" : "flex-row-reverse space-x-reverse"
                  }`}
                >
                  <button
                    onClick={() => handleActionClick(action.key)}
                    className={`w-9 h-9 border rounded-full flex items-center justify-center shadow transition ${
                      isActive
                        ? "bg-yellow-400 border-yellow-500 text-black"
                        : "bg-black/80 border-white/30 text-white group-hover:bg-white group-hover:text-black"
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {action.icon}
                    </span>
                  </button>

                  <button
                    onClick={() => handleActionClick(action.key)}
                    className={`px-4 py-2 rounded-full border shadow text-xs font-bold uppercase transition ${
                      isActive
                        ? "bg-yellow-400 border-yellow-500 text-black"
                        : "bg-black/80 border-white/30 text-white group-hover:bg-white group-hover:text-black"
                    }`}
                  >
                    {action.label}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// --- Viewport Wrapper for Items ---
//
const TimelineSection = ({ item, index, userList, setActiveImage, setBackgroundOpacity }) => {
  const ref = useRef(null);

  const containerRef = useRef(null);
  
  // Check if item is in view and calculate how centered it is
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const isCentered = useInView(ref, { margin: "-50% 0px -50% 0px" });
  
  // Calculate scroll progress for this section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "center start"]
  });
  
  // Transform scroll progress to opacity (0 when far, 1 when centered)
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0, 0.5, 1]
  );

  useEffect(() => {
    if (isCentered) {
      setActiveImage(item.movie_banner || item.image);
      setBackgroundOpacity(1);
    } else if (isInView) {
      // Gradually increase opacity as it approaches center
      setActiveImage(item.movie_banner || item.image);
      setBackgroundOpacity(0.3);
    } else {
      setBackgroundOpacity(0);
    }
  }, [isInView, isCentered, item, setActiveImage, setBackgroundOpacity]);

  return (
    // Changed: flex-col justify-center centers vertical content, but allows w-full for horizontal flow
    <div
      id={`timeline-movie-${item.id}`}
      ref={containerRef}
      className="min-h-screen w-full flex flex-col justify-center relative py-20 snap-center"
    >
      <div ref={ref}>
        <TimelineItem
          item={item}
          isLeft={index % 2 === 0}
          reverse={index % 2 === 1}
          userList={userList}
        />
      </div>
    </div>
  );
};

// --- Main Timeline Component ---
//
export default function Timeline({ userList = {} }) {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);

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

        const items = data.map((f) => ({
          id: f.id,
          title: f.title,
          release_date: f.release_date,
          description: f.description,
          original_title:
            f.original_title || f.original_title_romanised || null,
          director: f.director,
          producer: f.producer,
          running_time: f.running_time,
          rt_score: f.rt_score,
          movie_banner:
            f.movie_banner || f.image || "https://picsum.photos/1920/1080",
          image: f.image,
        }));

        setTimeline(items);
        // if (items.length > 0)
        //   setActiveImage(items[0].movie_banner || items[0].image);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to fetch films");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchFilms();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <section className="h-screen w-full flex flex-col items-center justify-center bg-black text-white">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl tracking-widest uppercase opacity-70">
          Loading Library
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="h-screen w-full flex items-center justify-center bg-black text-red-500">
        <p className="text-xl">Error: {error}</p>
      </section>
    );
  }

  return (
    <section id="timeline" className="relative w-full bg-black">
      {/* Sticky, viewport-height background scoped to the timeline section */}
      <div className="pointer-events-none sticky top-0 h-screen z-0">
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-black/70 z-10" />
          {/* Dark overlay for text readability */}
          <AnimatePresence mode="popLayout">
            {activeImage && (
              <motion.img
                key={activeImage}
                src={activeImage}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: backgroundOpacity }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full max-w-5xl mx-auto -mt-80">
        {/* Timeline Heading */}
        <motion.div
          className="relative px-6 pb-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 left-10 h-24 w-24 rounded-full bg-yellow-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-16 h-24 w-24 rounded-full bg-yellow-400/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-yellow-300 ring-1 ring-yellow-400/40">
              Timeline
            </div>
            <h2 className="text-3xl font-semibold text-white">
              Journey through every film
            </h2>
            <p className="mx-auto max-w-3xl text-base text-slate-300">
              Follow release order, relive iconic scenes, and discover hidden gems across the Studio Ghibli collection. Your personal progress is tracked in one place.
            </p>
          </div>
        </motion.div>

        {/* Timeline Container with Line */}
        <div className="relative">
          {/* Timeline Line (Spine) */}
          <motion.div
            className="absolute left-1/2 top-0 h-full w-px bg-white/30 -translate-x-1/2"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          {/* Timeline Items */}
          {timeline.map((item, index) => (
            <TimelineSection
              key={item.id}
              item={item}
              index={index}
              userList={userList}
              setActiveImage={setActiveImage}
              setBackgroundOpacity={setBackgroundOpacity}
            />
          ))}
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-[20vh] relative z-10" />
    </section>
  );
}