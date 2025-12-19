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
    
    // Send action to backend
    router.post('/film-actions', {
      film_id: item.id,
      action_type: actionKey,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setMenuOpen(false);
        // The userList will be automatically refreshed via Inertia's shared props
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

  // Layout classes - responsive spacing
  const buttonRowClass = isLeft
    ? "flex items-center mt-2 md:mt-3 space-x-2 md:space-x-4 relative"
    : "flex items-center mt-2 md:mt-3 space-x-2 md:space-x-4 relative justify-end";

  const detailsPopupPosition = isLeft ? "-left-2 md:-left-4" : "right-0";

  const menuPosition = isLeft
    ? "left-[60px] md:left-[85px]"
    : "right-[60px] md:right-[100px] flex flex-col items-end";

  // Dot positioning on the spine
  const dotClass = isLeft
    ? "right-0 translate-x-1/2"
    : "left-0 -translate-x-1/2";

  return (
    <motion.div
      className={`relative w-1/2 py-3 md:py-6 ${isLeft ? "pr-4 md:pr-8" : "pl-4 md:pl-8 ml-auto"}`}
      initial={{ opacity: 0, y: -80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-20%" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      {/* Dot marker on the spine */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full border-2 border-black z-20 ${dotClass}`}
      />

      {/* Panel box - Glassmorphism style */}
      <div className="p-3 md:p-6 border border-white/20 rounded-lg md:rounded-xl bg-black/40 shadow-2xl text-white transform-gpu transition-all duration-500 hover:border-yellow-400/60 hover:shadow-[0_0_40px_rgba(250,204,21,0.45)] hover:-translate-y-1">
        {reverse ? (
          <div className="flex justify-between items-baseline gap-2">
            <span className="text-[10px] md:text-sm font-mono text-yellow-400">
              {item.release_date}
            </span>
            <h3 className="font-semibold text-base md:text-2xl font-space tracking-tight">
              {item.title}
            </h3>
          </div>
        ) : (
          <div className="flex justify-between items-baseline gap-2">
            <h3 className="font-semibold text-base md:text-2xl font-space tracking-tight">
              {item.title}
            </h3>
            <span className="text-[10px] md:text-sm font-mono text-yellow-400">
              {item.release_date}
            </span>
          </div>
        )}

        <hr className="border-t border-white/20 border-dashed my-2 md:my-4" />

        <p className="text-[11px] md:text-sm text-gray-300 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Action buttons */}
      <div className={buttonRowClass} ref={menuRef}>
        {isLeft && (
          <>
            <button
              onMouseEnter={() => setShowDetails(true)}
              onTouchStart={() => setShowDetails(true)}
              className="px-3 md:px-5 py-1.5 md:py-2 bg-white text-black rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider shadow hover:bg-yellow-400 transition"
            >
              Details
            </button>

            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-8 h-8 md:w-10 md:h-10 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center shadow hover:bg-white hover:text-black transition"
            >
              <span className="material-symbols-outlined text-base md:text-xl">add</span>
            </button>
          </>
        )}

        {!isLeft && (
          <>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="w-8 h-8 md:w-10 md:h-10 bg-white/10 border border-white/20 text-white rounded-full flex items-center justify-center shadow hover:bg-white hover:text-black transition"
            >
              <span className="material-symbols-outlined text-base md:text-xl">add</span>
            </button>

            <button
              onMouseEnter={() => setShowDetails(true)}
              onTouchStart={() => setShowDetails(true)}
              className="px-3 md:px-5 py-1.5 md:py-2 bg-white text-black rounded-lg md:rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider shadow hover:bg-yellow-400 transition"
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
            className={`absolute ${detailsPopupPosition} top-12 md:top-14 w-[calc(100vw-2rem)] max-w-[280px] md:w-72 bg-black/90 border border-white/20 backdrop-blur-xl rounded-lg md:rounded-xl shadow-2xl p-3 md:p-5 text-[11px] md:text-sm z-50 text-gray-200`}
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
            <p className="mb-3 md:mb-4">
              <strong className="text-yellow-400">Rating:</strong>{" "}
              {item.rt_score ?? "—"}
            </p>

            <button
              type="button"
              onClick={() => onWatchTrailer && onWatchTrailer()}
              className="mt-1 w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-3 md:px-4 py-1.5 md:py-2 text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-black shadow-lg shadow-yellow-500/40 hover:bg-yellow-300 hover:shadow-yellow-400/70 transition"
            >
              <span className="material-symbols-outlined text-xs md:text-sm">play_arrow</span>
              Watch Trailer
            </button>
          </motion.div>
        )}

        {menuOpen && (
          <div
            className={`absolute ${menuPosition} top-12 md:top-14 space-y-1.5 md:space-y-2 z-50 w-[calc(100vw-2rem)] max-w-[180px] md:w-48`}
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
                    className={`w-7 h-7 md:w-9 md:h-9 border rounded-full flex items-center justify-center shadow transition ${
                      isActive
                        ? "bg-yellow-400 border-yellow-500 text-black"
                        : "bg-black/80 border-white/30 text-white group-hover:bg-white group-hover:text-black"
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm md:text-lg">
                      {action.icon}
                    </span>
                  </button>

                  <button
                    onClick={() => handleActionClick(action.key)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full border shadow text-[10px] md:text-xs font-bold uppercase transition ${
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
  setActiveVideo,
  setActiveImage,
  setFallbackImage,
  setBackgroundOpacity,
  onWatchTrailer,
  videoMap,
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
  
  // Get video URL or fallback to static image
  const getBackgroundVideo = () => {
    // Try exact match first
    let videoUrl = videoMap[item.title];
    
    // If no exact match, try case-insensitive match
    if (!videoUrl) {
      const titleLower = item.title.toLowerCase();
      for (const [key, value] of Object.entries(videoMap)) {
        if (key.toLowerCase() === titleLower && value) {
          videoUrl = value;
          break;
        }
      }
    }
    
    // Additional fallback: try partial matches for common variations (e.g., Arrietty)
    if (!videoUrl) {
      const titleLower = item.title.toLowerCase();
      // Handle "Arrietty" variations
      if (titleLower.includes('arrietty') || titleLower.includes('arriety')) {
        videoUrl = videoMap["The Secret World of Arrietty"] || videoMap["Arrietty"] || videoMap["The Borrower Arrietty"];
      }
    }
    
    return videoUrl;
  };

  useEffect(() => {
    const backgroundVideo = getBackgroundVideo();
    const staticFallback = item.movie_banner || item.image || "https://picsum.photos/1920/1080";
    
    // Set video or image when in view
    if (isInView || isCentered) {
      if (backgroundVideo) {
        setActiveVideo(backgroundVideo);
        setActiveImage(null);
      } else {
        setActiveVideo(null);
        setActiveImage(staticFallback);
      }
      setFallbackImage(staticFallback);
    }
  }, [isInView, isCentered, item, videoMap]);

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
      className="min-h-[60vh] md:min-h-screen w-full flex flex-col justify-center relative py-8 md:py-20 snap-center"
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
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [fallbackImage, setFallbackImage] = useState(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(0);
  const playlistId = "PLkukk61q9mY_ps9HKovftqotZiKb34BVt";

  // Map film titles to local video file paths
  const videoMap = {
    "Castle in the Sky": "/videos/Castle in the Sky.webm",
    "Grave of the Fireflies": "/videos/Grave of Fireflies.webm",
    "My Neighbor Totoro": "/videos/My Neighbor Totoro.webm",
    "Kiki's Delivery Service": "/videos/Kiki's Delivery Services.webm",
    "Only Yesterday": "/videos/Only Yesterday.webm",
    "Porco Rosso": "/videos/Porco Rosso.webm",
    "Pom Poko": "/videos/Pompoko.webm",
    "Whisper of the Heart": "/videos/Whisper of the heart.webm",
    "Princess Mononoke": "/videos/Princess Mononoke.webm",
    "My Neighbors the Yamadas": "/videos/My Neighbors The Yamada's.webm",
    "Spirited Away": "/videos/Spirited Away.webm",
    "The Cat Returns": "/videos/The cat returns.webm",
    "Howl's Moving Castle": "/videos/Howl's Moving Castle.webm",
    "Tales from Earthsea": "/videos/Tales from Earthsea.webm",
    "Ponyo": "/videos/Ponyo.webm",
    "The Secret World of Arrietty": "/videos/The secret world of Arriety.webm",
    "Arrietty": "/videos/The secret world of Arriety.webm",
    "The Borrower Arrietty": "/videos/The secret world of Arriety.webm",
    "From Up on Poppy Hill": "/videos/From up on Poppy Hill.webm",
    "The Wind Rises": "/videos/Wind Rises.webm",
    "The Tale of the Princess Kaguya": "/videos/The Tale of Princess Kaguya.webm",
    "When Marnie Was There": "/videos/When marnie was there.webm",
    "The Red Turtle": "/videos/The red turtle.webm",
    "Earwig and the Witch": "/videos/Earwig and the Witch.webm",
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
  const [trailerMovie, setTrailerMovie] = useState(null);

  const handleOpenTrailer = (movie, fallbackIndex) => {
    const mappedIndex = trailerIndexMap[movie.title];

    if (typeof mappedIndex === "number") {
      setTrailerIndex(mappedIndex);
      setTrailerMovie(movie);
    } else {
      // No trailer available - show message
      setTrailerIndex(-1); // Use -1 to indicate no trailer
      setTrailerMovie(movie);
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
        
        // Set initial background video/image for first item
        if (items.length > 0) {
          const firstItem = items[0];
          const firstVideo = videoMap[firstItem.title];
          const staticFallback = firstItem.movie_banner || firstItem.image;
          if (firstVideo) {
            setActiveVideo(firstVideo);
            setActiveImage(null);
          } else if (staticFallback) {
            setActiveVideo(null);
            setActiveImage(staticFallback);
          }
          setFallbackImage(staticFallback);
          setBackgroundOpacity(0.3);
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
          {activeVideo && (
            <motion.video
              key={activeVideo}
              src={activeVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
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
                // Fallback to static image if video fails to load
                if (fallbackImage) {
                  setActiveVideo(null);
                  setActiveImage(fallbackImage);
                }
              }}
            />
          )}
          {activeImage && !activeVideo && (
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
                // Fallback to placeholder if image fails to load
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
      <div className="relative z-10 w-full max-w-5xl mx-auto -mt-40 md:-mt-80">
        {/* Timeline Heading */}
        <motion.div
          className="relative px-4 md:px-6 pb-8 md:pb-20 text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 left-4 md:left-10 h-16 w-16 md:h-24 md:w-24 rounded-full bg-yellow-500/20 blur-3xl" />
            <div className="absolute bottom-0 right-4 md:right-16 h-16 w-16 md:h-24 md:w-24 rounded-full bg-yellow-400/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl space-y-2 md:space-y-4">
            <div className="inline-flex items-center gap-1.5 md:gap-2 rounded-full bg-yellow-500/10 px-3 md:px-4 py-1 md:py-2 text-[10px] md:text-xs font-semibold uppercase tracking-[0.24em] text-yellow-300 ring-1 ring-yellow-400/40">
              Timeline
            </div>
            <h2 className="text-xl md:text-3xl font-semibold text-white px-4">
              Journey through every film
            </h2>
            <p className="mx-auto max-w-3xl text-xs md:text-base text-slate-300 px-4">
              Follow release order, relive iconic scenes, and discover hidden gems across the Studio Ghibli collection. Your personal progress is tracked in one place.
            </p>
          </div>
        </motion.div>

        {/* Timeline Container with Line */}
        <div className="relative px-4 md:px-0">
          {/* Timeline Line (Spine) */}
          <motion.div
            className="absolute left-1/2 top-0 h-full w-0.5 md:w-px bg-white/30 -translate-x-1/2"
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
              setActiveVideo={setActiveVideo}
              setActiveImage={setActiveImage}
              setFallbackImage={setFallbackImage}
              setBackgroundOpacity={setBackgroundOpacity}
              onWatchTrailer={handleOpenTrailer}
              videoMap={videoMap}
            />
          ))}
        </div>
      </div>

      {/* Footer spacing */}
      <div className="h-[10vh] md:h-[20vh] relative z-10" />

      {/* Trailer Modal with playlist embed */}
      <Modal
        show={trailerIndex !== null}
        onClose={() => {
          setTrailerIndex(null);
          setTrailerMovie(null);
        }}
        maxWidth="2xl"
      >
        <div className="bg-black">
          <div className="flex items-center justify-between px-3 md:px-4 py-2 md:py-3 border-b border-slate-800">
            <h3 className="text-xs md:text-sm font-semibold text-white truncate pr-2">
              Trailer: {trailerMovie?.title || ""}
            </h3>
            <button
              type="button"
              onClick={() => {
                setTrailerIndex(null);
                setTrailerMovie(null);
              }}
              className="text-slate-400 hover:text-slate-200 transition flex-shrink-0"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
          <div className="relative w-full aspect-video bg-black">
            {trailerIndex === -1 ? (
              // No trailer available
              <div className="flex flex-col items-center justify-center h-full text-center px-4 md:px-6">
                <span className="material-symbols-outlined text-4xl md:text-6xl text-slate-500 mb-3 md:mb-4">
                  movie
                </span>
                <p className="text-lg md:text-xl font-semibold text-slate-300 mb-2">
                  No Trailer Available
                </p>
                <p className="text-xs md:text-sm text-slate-500">
                  A trailer for this film is not currently available in our collection.
                </p>
              </div>
            ) : trailerIndex !== null && trailerIndex >= 0 ? (
              // Trailer available - show iframe
              <iframe
                title={trailerMovie ? `Trailer for ${trailerMovie.title}` : "Trailer"}
                className="w-full h-full"
                src={`https://www.youtube.com/embed?autoplay=1&rel=0&modestbranding=1&listType=playlist&list=${playlistId}&index=${trailerIndex + 1}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : null}
          </div>
        </div>
      </Modal>
    </section>
  );
}