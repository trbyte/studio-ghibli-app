import React from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import Timeline from "./Timeline";
import { Carousel3D } from "../Components/Carousel3D";
import { CustomCursor } from "../Components/CustomCursor";
import Modal from "../Components/Modal";

function UserMenu({ authUser }) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="group inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-800/80 text-yellow-400 shadow-lg shadow-black/40 ring-1 ring-yellow-400/30 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-slate-700/80 hover:text-yellow-300 hover:ring-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400/50"
      >
        <span className="material-symbols-outlined text-3xl transition group-hover:scale-105">
          account_circle
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-slate-800/95 backdrop-blur-xl shadow-xl shadow-black/60 rounded-lg border border-yellow-400/20 z-50 overflow-hidden">
          <div className="px-4 py-2 font-semibold text-white border-b border-yellow-400/20 bg-slate-900/50">
            {authUser.name}
          </div>

          <Link
            href="/logout"
            method="post"
            as="button"
            className="block w-full text-left px-4 py-2 text-slate-200 hover:bg-slate-700/60 hover:text-yellow-400 transition"
          >
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}

function Sidebar({ open, setOpen, userList }) {
  const [editingMovie, setEditingMovie] = React.useState(null);
  const [notes, setNotes] = React.useState("");
  const [moviesMap, setMoviesMap] = React.useState({});

  // Fetch movie data to get images
  React.useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("https://ghibliapi.vercel.app/films");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        const map = {};
        data.forEach((f) => {
          map[f.id] = {
            id: f.id,
            title: f.title,
            image: f.image || f.movie_banner,
            movie_banner: f.movie_banner,
          };
        });
        
        setMoviesMap(map);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      }
    }
    
    fetchMovies();
  }, []);

  const sections = [
    { key: "favorite", label: "Favorites", icon: "star" },
    { key: "plan", label: "Plan to Watch", icon: "bookmark" },
    { key: "on_hold", label: "On-Hold", icon: "pause_circle" },
    { key: "dropped", label: "Dropped", icon: "cancel" },
    { key: "finished", label: "Finished", icon: "check_circle" },
  ];

  const handleEditClick = (movie) => {
    setEditingMovie(movie);
    // Load existing note from the movie object
    setNotes(movie.note || "");
  };

  const handleSaveNotes = () => {
    if (editingMovie) {
      // Send PATCH request to backend to save the note
      router.patch(`/film-actions/${editingMovie.id}`, {
        note: notes,
      }, {
        preserveScroll: true,
        onSuccess: () => {
          setEditingMovie(null);
          setNotes("");
        },
        onError: (errors) => {
          console.error('Failed to save note:', errors);
        }
      });
    }
  };

  const handleCloseModal = () => {
    setEditingMovie(null);
    setNotes("");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/70 via-slate-900/60 to-black/70 backdrop-blur-sm z-[55] transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-[320px] bg-slate-900/95 backdrop-blur-2xl
          shadow-2xl shadow-black/60 border-l border-yellow-400/20 z-[60] overflow-y-auto transform
          transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="sticky top-0 flex items-center justify-between bg-slate-900/90 px-4 py-3 backdrop-blur border-b border-yellow-400/20">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-400">
              Lists
            </div>
            <div className="text-lg font-semibold text-white">Your Library</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400/10 text-yellow-400 shadow-sm ring-1 ring-yellow-400/30 transition hover:bg-yellow-400/20 hover:text-yellow-300"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 space-y-5">
          {sections.map((sec) => {
            const items = userList[sec.key] || [];
            return (
              <div
                key={sec.key}
                className="rounded-2xl border border-yellow-400/20 bg-slate-800/60 p-3 shadow-lg shadow-black/40 ring-1 ring-yellow-400/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center font-semibold text-slate-100 gap-2">
                    <span className="material-symbols-outlined text-yellow-400">
                      {sec.icon}
                    </span>
                    {sec.label}
                  </div>
                  <span className="rounded-full bg-yellow-400/20 px-2.5 py-0.5 text-xs font-semibold text-yellow-300 ring-1 ring-yellow-400/30">
                    {items.length}
                  </span>
                </div>

                {items.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {items.map((movie) => {
                      const movieData = moviesMap[movie.film_id] || movie;
                      const hasImage = movieData.image || movieData.movie_banner;
                      
                      return (
                        <li
                          key={movie.id}
                          className="flex items-center justify-between gap-2 rounded-lg bg-slate-700/40 px-3 py-2 text-sm font-medium text-slate-100 ring-1 ring-yellow-400/10 hover:bg-slate-700/60 hover:ring-yellow-400/20 transition-all"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {hasImage ? (
                              <img
                                src={movieData.image || movieData.movie_banner}
                                alt={movie.title}
                                className="w-10 h-14 object-cover rounded flex-shrink-0 ring-1 ring-yellow-400/20"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  const fallback = e.target.nextElementSibling;
                                  if (fallback) fallback.style.display = 'inline';
                                }}
                              />
                            ) : null}
                            <span 
                              className="material-symbols-outlined text-yellow-400 text-base flex-shrink-0"
                              style={{ display: hasImage ? 'none' : 'inline' }}
                            >
                              movie
                            </span>
                          <span className="truncate text-slate-100">{movie.title}</span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditClick(movie);
                          }}
                          className="p-1.5 rounded-lg hover:bg-yellow-400/20 text-yellow-400 flex-shrink-0 transition-colors"
                          aria-label="Edit notes"
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                      </li>
                    );
                    })}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">No items yet</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Notes Edit Modal */}
      <Modal show={!!editingMovie} onClose={handleCloseModal} maxWidth="md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              Notes: {editingMovie?.title}
            </h3>
            <button
              onClick={handleCloseModal}
              className="text-slate-400 hover:text-slate-200 transition"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Your Notes
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={8}
                className="w-full rounded-xl border border-yellow-400/30 bg-slate-800/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/40 placeholder:text-slate-500 focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/30 resize-none"
                placeholder="Write your thoughts, favorite scenes, or anything you want to remember about this film..."
              />
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl border border-slate-600 bg-slate-800 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-xl bg-yellow-400 text-slate-950 text-sm font-semibold shadow-lg shadow-yellow-500/40 hover:bg-yellow-300 transition"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default function Landing() {
  const { auth, userList = {} } = usePage().props;
  const authUser = auth?.user;
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [movies, setMovies] = React.useState([]);
  const [moviesLoading, setMoviesLoading] = React.useState(true);

  // Fetch movies for carousel
  React.useEffect(() => {
    async function fetchMovies() {
      try {
        const res = await fetch("https://ghibliapi.vercel.app/films");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        
        const films = data.map((f) => ({
          id: f.id,
          title: f.title,
          release_date: f.release_date,
          director: f.director,
          image: f.image || f.movie_banner,
          movie_banner: f.movie_banner,
        }));
        
        setMovies(films);
      } catch (err) {
        console.error("Failed to fetch movies:", err);
      } finally {
        setMoviesLoading(false);
      }
    }
    
    fetchMovies();
  }, []);

  return (
    <>
      <CustomCursor />
      {/* NAVBAR */}
      <nav
        className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 bg-slate-950/40 backdrop-blur-md z-50"
      >
        <button
          type="button"
          onClick={() => {
            window.location.href = "/#hero";
          }}
          className="text-xl font-bold text-yellow-400 transition hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 rounded"
        >
          Ghibli Filmography
        </button>

        <div className="flex items-center space-x-3">
          {authUser && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="group inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-800/80 text-yellow-400 shadow-lg shadow-black/40 ring-1 ring-yellow-400/30 backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-slate-700/80 hover:text-yellow-300 hover:ring-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400/50"
            >
              <span className="material-symbols-outlined text-3xl transition group-hover:scale-105">
                book
              </span>
            </button>
          )}

          {authUser ? (
            <UserMenu authUser={authUser} />
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-yellow-500/40 transition hover:bg-yellow-300 hover:shadow-yellow-400/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
            >
              <span className="material-symbols-outlined text-base">login</span>
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {authUser && (
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} userList={userList} />
      )}

      {/* MAIN CONTENT */}
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 pt-20">
        
        {/* HERO SECTION */}
        <section
          id="hero"
          className="min-h-[140vh] flex flex-col justify-start items-center text-center px-6 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
        >
          <motion.div
            className="flex flex-col items-center z-10 mt-28"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-[0_0_25px_rgba(250,204,21,0.45)] text-white px-4">
              Welcome to Studio Ghibli Explorer
            </h1>
            <p className="text-base sm:text-lg max-w-2xl mb-6 text-center text-slate-300 px-4">
              Explore the worlds, characters, and timeless stories of Studio Ghibli. Track your favorites, plan what to watch next, and celebrate every scene.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-yellow-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-yellow-500/50 transition hover:bg-yellow-300 hover:shadow-yellow-400/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              Contact Us
            </a>
          </motion.div>

          <div className="w-full mt-4 sm:mt-6 md:mt-8 relative">
            {!moviesLoading ? (
              <Carousel3D 
                movies={movies}
                onSelectMovie={(movie) => {
                  // Scroll to specific movie in timeline
                  const movieElement = document.getElementById(`timeline-movie-${movie.id}`);
                  if (movieElement) {
                    // Calculate position to center the element in viewport
                    const elementRect = movieElement.getBoundingClientRect();
                    const absoluteElementTop = elementRect.top + window.pageYOffset;
                    const middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
                    window.scrollTo({
                      top: middle,
                      behavior: 'smooth'
                    });
                  } else {
                    // Fallback: scroll to timeline section if movie not found
                    const timelineElement = document.getElementById('timeline');
                    if (timelineElement) {
                      timelineElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }
                }}
              />
            ) : (
              <div className="h-[350px] sm:h-[400px] md:h-[450px] flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Bottom gradient transition to black timeline */}
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent via-slate-950/50 to-black z-10 pointer-events-none" />
        </section>

        <Timeline userList={userList} />

        {/* Contact Section */}
        <motion.section
          id="contact"
          className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-yellow-900 px-6 py-20"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Top gradient transition from black timeline */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black via-slate-950/50 to-transparent z-10 pointer-events-none" />
          
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-yellow-500/30 blur-3xl" />
            <div className="absolute right-0 bottom-10 h-40 w-40 rounded-full bg-sky-500/30 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl bg-slate-900/80 p-8 shadow-2xl shadow-black/60 ring-1 ring-yellow-400/40 backdrop-blur">
            <div className="flex flex-col items-start gap-3 text-left">
              <p className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-yellow-300 ring-1 ring-yellow-400/40">
                Get in touch
              </p>
              <h2 className="text-3xl font-semibold text-white">Contact</h2>
              <p className="max-w-2xl text-base text-slate-200">
                Questions, feedback, or collaboration ideas? Reach out and we’ll
                get back to you soon.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-yellow-400/40 bg-slate-900/80 p-5 shadow-sm shadow-black/50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-yellow-300">mail</span>
                    <div>
                      <div className="text-sm font-semibold text-white">Email us</div>
                      <a
                        href="mailto:info@ghibliapp.com"
                        className="text-sm text-yellow-300 underline underline-offset-4"
                      >
                        info@ghibliapp.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-sky-500/40 bg-slate-900/80 p-5 shadow-sm shadow-black/50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-sky-300">chat</span>
                    <div>
                      <div className="text-sm font-semibold text-white">Community</div>
                      <p className="text-sm text-slate-200">
                        Join discussions and share your favorite Ghibli moments.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <a
                      href="https://discord.gg"
                      className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200 ring-1 ring-sky-400/40"
                    >
                      <span className="material-symbols-outlined text-sm">forum</span>
                      Discord
                    </a>
                    <a
                      href="https://twitter.com"
                      className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-200 ring-1 ring-sky-400/40"
                    >
                      <span className="material-symbols-outlined text-sm">alternate_email</span>
                      Twitter
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-yellow-400/40 bg-slate-900/80 p-5 shadow-sm shadow-black/50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-yellow-300">code</span>
                    <div>
                      <div className="text-sm font-semibold text-white">GitHub</div>
                      <p className="text-sm text-slate-200">
                        Browse the codebase, open issues, or contribute.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <a
                      href="https://github.com/your-org/studio-ghibli-app"
                      className="inline-flex items-center gap-2 rounded-full bg-yellow-500/10 px-3 py-1.5 text-xs font-semibold text-yellow-200 ring-1 ring-yellow-400/60 transition hover:bg-yellow-500/20"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      View on GitHub
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-yellow-400/40 bg-slate-950/90 p-6 shadow-lg shadow-black/70 ring-1 ring-yellow-400/60">
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-left">
                      <label className="block text-sm font-semibold text-slate-200">
                        Name
                      </label>
                      <input
                        type="text"
                        className="mt-1 w-full rounded-xl border border-yellow-400/60 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 shadow-inner shadow-black/40 placeholder:text-slate-400 focus:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        placeholder="Sophie"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-sm font-semibold text-slate-200">
                        Email
                      </label>
                      <input
                        type="email"
                        className="mt-1 w-full rounded-xl border border-yellow-400/60 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 shadow-inner shadow-black/40 placeholder:text-slate-400 focus:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-semibold text-slate-200">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="mt-1 w-full rounded-xl border border-yellow-400/60 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 shadow-inner shadow-black/40 placeholder:text-slate-400 focus:border-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                      placeholder="Share your thoughts..."
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-yellow-500/60 transition hover:bg-yellow-300 hover:shadow-yellow-400/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300"
                  >
                    <span className="material-symbols-outlined text-base">send</span>
                    Send message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.section>

        <footer className="mt-0 border-t border-slate-800 bg-slate-950/95 px-6 py-8 text-slate-200 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold text-slate-50">
                Studio Ghibli Timeline
              </div>
              <div className="text-xs text-slate-400">
                © {new Date().getFullYear()} Studio Ghibli Timeline. All rights reserved.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
              <a
                href="#hero"
                className="rounded-full bg-slate-900 px-3 py-1.5 text-slate-100 ring-1 ring-slate-700 transition hover:bg-slate-800"
              >
                Hero
              </a>
              <a
                href="#timeline"
                className="rounded-full bg-slate-900 px-3 py-1.5 text-slate-100 ring-1 ring-slate-700 transition hover:bg-slate-800"
              >
                Timeline
              </a>
              <a
                href="#contact"
                className="rounded-full bg-slate-900 px-3 py-1.5 text-slate-100 ring-1 ring-slate-700 transition hover:bg-slate-800"
              >
                Contact
              </a>
              <a
                href="https://github.com/your-org/studio-ghibli-app"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-emerald-200 ring-1 ring-emerald-400/60 transition hover:bg-emerald-500/20"
              >
                <span className="material-symbols-outlined text-sm">code</span>
                GitHub
              </a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
