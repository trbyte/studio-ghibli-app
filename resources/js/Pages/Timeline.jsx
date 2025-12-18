import React, { useState, useEffect, useRef } from "react";
import { router } from "@inertiajs/react";
import Modal from "../Components/Modal";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";

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

function TimelineItem({ item, isLeft, reverse, userList = {}, onWatchTrailer }) {
  const [showDetails, setShowDetails] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleActionClick = (actionKey) => {
    if (!item.id) return;

    // Send action to backend via Inertia
    router.post(
      "/film-actions",
      {
        film_id: item.id,
        film_title: item.title,
        action_type: actionKey,
      },
      {
        preserveScroll: true,
        onFinish: () => setMenuOpen(false),
      }
    );
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
            onMouseEnter={() => setShowDetails(true)}
            onMouseLeave={() => setShowDetails(false)}
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
            <p className="mb-4">
              <strong className="text-yellow-400">Rating:</strong>{" "}
              {item.rt_score ?? "—"}
            </p>

            <button
              type="button"
              onClick={() => onWatchTrailer && onWatchTrailer()}
              className="mt-1 inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-black shadow-lg shadow-yellow-500/40 hover:bg-yellow-300 hover:shadow-yellow-400/70 transition"
            >
              <span className="material-symbols-outlined text-sm">play_arrow</span>
              Watch Trailer
            </button>
          </motion.div>
        )}

        {menuOpen && (
          <div
            className={`absolute ${menuPosition} top-14 space-y-2 z-50 w-48`}
          >
            {actions.map((action) => {
              const isActive = userList[action.key]?.some(
                (film) => film.id === item.id
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
const TimelineSection = ({
  item,
  index,
  userList,
  setActiveImage,
  setFallbackImage,
  setBackgroundOpacity,
  onWatchTrailer,
  giphyMap,
}) => {
  const ref = useRef(null);

  const containerRef = useRef(null);
  
  // Check if item is in view and calculate how centered it is
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });
  const isCentered = useInView(ref, { margin: "-50% 0px -50% 0px" });
  
  // Calculate scroll progress for smooth fade-in
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "center center", "end start"]
  });
  
  // Get GIF URL or fallback to static image
  const getBackgroundImage = () => {
    // Try exact match first
    let gifUrl = giphyMap[item.title];
    
    // If no exact match, try case-insensitive match
    if (!gifUrl) {
      const titleLower = item.title.toLowerCase();
      for (const [key, value] of Object.entries(giphyMap)) {
        if (key.toLowerCase() === titleLower && value) {
          gifUrl = value;
          break;
        }
      }
    }
    
    if (gifUrl) {
      return gifUrl;
    }
    // Fallback to static image
    return item.movie_banner || item.image || "https://picsum.photos/1920/1080";
  };

  useEffect(() => {
    const backgroundImage = getBackgroundImage();
    const staticFallback = item.movie_banner || item.image || "https://picsum.photos/1920/1080";
    
    // Set image when in view
    if (isInView || isCentered) {
      setActiveImage(backgroundImage);
      setFallbackImage(staticFallback);
    }
  }, [isInView, isCentered, item, setActiveImage, setFallbackImage, giphyMap]);

  // Calculate opacity based on scroll progress with smooth fade-in
  useEffect(() => {
    if (!isInView && !isCentered) {
      setBackgroundOpacity(0);
      return;
    }

    const unsubscribe = scrollYProgress.on("change", (latest) => {
      // Smooth fade-in: 0 when far, gradually increases, peaks at 1.0 when centered
      // Using a smooth curve for natural fade-in effect
      let calculatedOpacity = 0;
      
      if (latest <= 0.5) {
        // Fading in as it approaches center
        calculatedOpacity = latest * 2; // 0 to 1.0
      } else {
        // Fading out as it moves past center
        calculatedOpacity = 2 - (latest * 2); // 1.0 to 0
      }
      
      // Clamp between 0.1 and 1.0 for visibility
      setBackgroundOpacity(Math.max(0.1, Math.min(1, calculatedOpacity)));
    });
    
    return () => unsubscribe();
  }, [scrollYProgress, isInView, isCentered, setBackgroundOpacity]);

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
          onWatchTrailer={
            onWatchTrailer ? () => onWatchTrailer(item, index) : undefined
          }
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
  const [fallbackImage, setFallbackImage] = useState(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);
  const playlistId = "PLkukk61q9mY_ps9HKovftqotZiKb34BVt";
  const GIPHY_API_KEY = "Zxohb5mVWXHaNJL3MH6qpqlosFq1C3Qw";

  // Map film titles to Giphy GIF URLs
  const giphyMap = {
    "Castle in the Sky": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHVzbnl6YjU2YXNwcmZ5MzV3MXhjNDhnNmdma2VoeHE0bzJ4ZGZybiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/b54zZ33PedJAY/giphy.gif",
    "Grave of the Fireflies": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExdjNsNzdtMXFqMDgyc3cya2Y4djZoazl3ZXhpMGttYWhzMHJ6bjFseiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AKtV37treIorS/giphy.gif",
    "My Neighbor Totoro": "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExazVueTYxeGluM3I5a21ybjlxNWphbTVlenI1dGE1N2V6bDUwdWEwOCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xMkWcQ9xTGH8A/giphy.gif",
    "Kiki's Delivery Service": "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExODd5d2kzbmdyZWpudHhocnVlaTh1bGxkY212YjAwN3M3ejdnbWZ1MyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/HLzvuV6rmpdeM/giphy.gif",
    "Only Yesterday": null, // Use default pic
    "Porco Rosso": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3M4MWN1dG1zcHI2OGJqODJuOGM5bnB3dTU5aDJlemx2OGZiNTN4YyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fwqAg6ZS6ebL2/giphy.gif",
    "Pom Poko": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnplbmV1Zm9jbXhxeWwwaGo5dDF4ZGM4a2FpbGkwNzJpcGE1Y3Y1NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L6TilUE7VN4QM/giphy.gif",
    "Whisper of the Heart": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTgydTN2Zjk5dzVuZTNqeno0Ym05dGZqMjZwdmFhaDVtNWNpcDdpbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/6XX4V0O8a0xdS/giphy.gif",
    "Princess Mononoke": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExem5kM2hpejE0emN4bXRvdXg3azlvcjA2cXlrNmFwcDJvc3ExYTJ3dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8A7dN5xUW7AuSm8hEY/giphy.gif",
    "My Neighbors the Yamadas": null, // Use default pic
    "Spirited Away": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExbjhxOWdpM2g2OXM3MjlscWozOWZ5ZXhraDVhZXp5d2VxYjU3ZnJqZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/MkuD2E3CJM9LG/giphy.gif",
    "The Cat Returns": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXFtZTR1ZHFnbGkwdGY2c3p5MnN0MHE5dDQybHh0OHE2YWx5NjR4dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/hS21PWdzgP02Y/giphy.gif",
    "Howl's Moving Castle": "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjlyMDdiOW9reDdhejRwZWVodTViMm9hc3E5cW1qcGpkaGd4MjgzOSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/wUCgLRvDdtWs8/giphy.gif",
    "Tales from Earthsea": null, // Use default pic
    "Ponyo": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHpmNWpjbDh4c3E5Z25uMnlwbzA3MG9td3BlMmI2YmdyaDNxODlhcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/pQOeDr8mVwaHu/giphy.gif",
    "The Secret World of Arrietty": "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmU1d2w0Z2dpdHNxaXE3enAxcmw5aHdsODdkbnhqM2syMm1nMmE4ZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3sjOADyw19Pa/giphy.gif",
    "From Up on Poppy Hill": "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExdW1vcWxqaHg5N2NmOHY5dmR2OXpseW40ZzZycDdvdGc2ZTJ6eDdsZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0mmGH15O5ivXnNec26/giphy.gif",
    "The Wind Rises": "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3hwOGx5c2puM2t1aDZrd2l6dW4zejZ5OW81YmI5cnlmYXppZ2UzcCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/oHvHEKTgRgk6MeIZv5/giphy.gif",
    "The Tale of the Princess Kaguya": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHB5bjBwZ3kwaWJ4bDF6bmcwNXZoaDR4bWNsdjE0cXNnd3U1bHluayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VKLruF5oChAR2/giphy.gif",
    "When Marnie Was There": "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExaW5nemptZXY5a2F0bjMydzE4YnNxYml5cG0yYWVvc3A0cjkwZzVoYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ufvRifZxL1Svu/giphy.gif",
    "The Red Turtle": null, // Use default pic
    "Earwig and the Witch": null, // Use default pic
  };

  // Map film titles from the Ghibli API to their index in the playlist:
  // https://www.youtube.com/watch?v=8ykEy-yPBFc&list=PLkukk61q9mY_ps9HKovftqotZiKb34BVt
  // Index is 0-based and follows the visible order you provided.
  const trailerIndexMap = {
    "Castle in the Sky": 0,              // Laputa: Castle in the Sky
    "Grave of the Fireflies": 1,
    "My Neighbor Totoro": 2,
    "Kiki's Delivery Service": 3,
    "Only Yesterday": 4,
    "Porco Rosso": 5,
    "Pom Poko": 6,
    "Whisper of the Heart": 7,
    "Princess Mononoke": 8,
    "My Neighbors the Yamadas": 9,
    "Spirited Away": 10,
    "The Cat Returns": 11,
    "Howl's Moving Castle": 12,
    "Tales from Earthsea": 13,
    "Ponyo": 14,
    "The Secret World of Arrietty": 15,  // Arrietty
    "From Up on Poppy Hill": 16,
  };

  const [trailerIndex, setTrailerIndex] = useState(null);

  const handleOpenTrailer = (movie, fallbackIndex) => {
    const mappedIndex = trailerIndexMap[movie.title];

    if (typeof mappedIndex === "number") {
      setTrailerIndex(mappedIndex);
    } else if (typeof fallbackIndex === "number") {
      // Fallback: use the timeline index if no explicit mapping yet
      setTrailerIndex(fallbackIndex);
    } else {
      // If nothing is mapped, do nothing (or you could open a search page instead)
      console.warn("No trailer mapping for:", movie.title);
    }
  };

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
        
        // Set initial background image for first item
        if (items.length > 0) {
          const firstItem = items[0];
          const firstGif = giphyMap[firstItem.title];
          const initialImage = firstGif || firstItem.movie_banner || firstItem.image;
          if (initialImage) {
            setActiveImage(initialImage);
            setFallbackImage(firstItem.movie_banner || firstItem.image);
            setBackgroundOpacity(0.3);
          }
        }
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
          {activeImage && (
            <motion.img
              key={activeImage}
              src={activeImage}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 1 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: backgroundOpacity }}
              exit={{ opacity: 0 }}
              transition={{ 
                duration: 0.8, 
                ease: [0.25, 0.1, 0.25, 1] // Smooth ease-in-out curve
              }}
              onError={(e) => {
                // Fallback to static image if GIF fails to load
                if (fallbackImage && e.target.src !== fallbackImage) {
                  e.target.src = fallbackImage;
                }
              }}
              loading="eager"
            />
          )}
          <div className="absolute inset-0 bg-black/20" style={{ zIndex: 2 }} />
          {/* Dark overlay for text readability - reduced opacity */}
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
              setFallbackImage={setFallbackImage}
              setBackgroundOpacity={setBackgroundOpacity}
              onWatchTrailer={handleOpenTrailer}
              giphyMap={giphyMap}
            />
          ))}
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-[20vh] relative z-10" />

      {/* Trailer Modal with playlist embed */}
      <Modal
        show={trailerIndex !== null}
        onClose={() => setTrailerIndex(null)}
        maxWidth="2xl"
      >
        <div className="bg-black">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-white">
              Trailer:{" "}
              {trailerIndex !== null && timeline[trailerIndex]
                ? timeline[trailerIndex].title
                : ""}
            </h3>
            <button
              type="button"
              onClick={() => setTrailerIndex(null)}
              className="text-slate-400 hover:text-slate-200 transition"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          <div className="relative w-full aspect-video bg-black">
            {trailerIndex !== null && (
              <iframe
                title={
                  trailerIndex !== null && timeline[trailerIndex]
                    ? `Trailer for ${timeline[trailerIndex].title}`
                    : "Trailer"
                }
                className="w-full h-full"
                src={`https://www.youtube.com/embed?autoplay=1&rel=0&modestbranding=1&listType=playlist&list=${playlistId}&index=${trailerIndex + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
}