import React from "react";
import { Link, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import Timeline from "./Timeline";

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
        className="group inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-emerald-700 shadow-lg shadow-emerald-100 ring-1 ring-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300"
      >
        <span className="material-symbols-outlined text-3xl transition group-hover:scale-105">
          account_circle
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md border z-50">
          <div className="px-4 py-2 font-semibold border-b">
            {authUser.name}
          </div>

          <Link
            href="/logout"
            method="post"
            as="button"
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Logout
          </Link>
        </div>
      )}
    </div>
  );
}

function Sidebar({ open, setOpen, userList }) {
  const sections = [
    { key: "favorite", label: "Favorites", icon: "star" },
    { key: "plan", label: "Plan to Watch", icon: "bookmark" },
    { key: "on_hold", label: "On-Hold", icon: "pause_circle" },
    { key: "dropped", label: "Dropped", icon: "cancel" },
    { key: "finished", label: "Finished", icon: "check_circle" },
  ];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-black/60 via-slate-900/50 to-emerald-900/40 backdrop-blur-sm z-[55] transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-screen w-[320px] bg-white/95 backdrop-blur-2xl
          shadow-2xl shadow-emerald-200/40 border-l border-white/60 z-[60] overflow-y-auto transform
          transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="sticky top-0 flex items-center justify-between bg-white/70 px-4 py-3 backdrop-blur border-b border-emerald-100">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
              Lists
            </div>
            <div className="text-lg font-semibold text-gray-900">Your Library</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-100 transition hover:bg-emerald-100"
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
                className="rounded-2xl border border-emerald-50 bg-white/70 p-3 shadow-sm shadow-emerald-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center font-semibold text-gray-800 gap-2">
                    <span className="material-symbols-outlined text-emerald-600">
                      {sec.icon}
                    </span>
                    {sec.label}
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    {items.length}
                  </span>
                </div>

                {items.length > 0 ? (
                  <ul className="mt-3 space-y-2 text-gray-700">
                    {items.map((movie) => (
                      <li
                        key={movie.id}
                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-sky-50 to-emerald-50 px-3 py-2 text-sm font-medium text-gray-800 ring-1 ring-emerald-50"
                      >
                        <span className="material-symbols-outlined text-sky-600 text-base">
                          movie
                        </span>
                        <span className="truncate">{movie.title}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-gray-400">No items yet</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function Landing() {
  const { auth, userList = {} } = usePage().props;
  const authUser = auth?.user;
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="fixed top-0 left-0 w-full flex justify-between items-center px-6 py-3 bg-transparent backdrop-blur-sm z-50"
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
              className="group inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-emerald-700 shadow-lg shadow-emerald-100 ring-1 ring-emerald-100 transition hover:-translate-y-0.5 hover:bg-emerald-50 hover:text-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-300"
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
          className="h-screen flex flex-col justify-start items-center text-center px-6 relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
        >
          <motion.div
            className="flex flex-col items-center z-10 mt-28"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <h1 className="text-5xl font-bold mb-4 text-center drop-shadow-[0_0_25px_rgba(250,204,21,0.45)] text-white">
              Welcome to Studio Ghibli Explorer
            </h1>
            <p className="text-lg max-w-2xl mb-6 text-center text-slate-300">
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

          <div className="wrapper z-0 absolute bottom-0 mb-12">
            <div className="inner" style={{ "--quantity": 10 }}>
              {[...Array(10).keys()].map((i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    "--index": i,
                    "--color-card": [
                      "142,249,252",
                      "142,252,204",
                      "142,252,157",
                      "215,252,142",
                      "252,252,142",
                      "252,208,142",
                      "252,142,142",
                      "252,142,239",
                      "204,142,252",
                      "142,202,252",
                    ][i],
                  }}
                >
                  <div className="img"></div>
                </div>
              ))}
            </div>
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
