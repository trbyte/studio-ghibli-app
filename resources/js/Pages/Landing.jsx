import React from "react";
import { Link, usePage } from "@inertiajs/react";
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
          className="text-xl font-bold transition hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 rounded"
        >
          Studio Ghibli
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
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-sky-200 transition hover:shadow-xl hover:shadow-emerald-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-200"
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
      <div className="min-h-screen flex flex-col text-gray-900 pt-20">
        
        {/* HERO SECTION */}
        <section
          id="hero"
          className="h-screen flex flex-col justify-start items-center text-center px-6 relative overflow-hidden"
        >
          <div className="flex flex-col items-center z-10 mt-28">
            <h1 className="text-5xl font-bold mb-4 text-center">
              Welcome to Studio Ghibli Explorer
            </h1>
            <p className="text-lg max-w-2xl mb-6 text-center text-gray-700">
              Explore the worlds, characters, and timeless stories of Studio Ghibli. Track your favorites, plan what to watch next, and celebrate every scene.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-emerald-200/50 transition hover:shadow-emerald-300/70 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-200"
            >
              <span className="material-symbols-outlined text-base">mail</span>
              Contact Us
            </a>
          </div>

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
        </section>

        {/* About Section */}
        <section
          id="timeline"
          className="relative overflow-hidden px-6 py-14 text-center"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 left-10 h-24 w-24 rounded-full bg-sky-200/40 blur-3xl" />
            <div className="absolute bottom-0 right-16 h-24 w-24 rounded-full bg-emerald-200/40 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-5xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 ring-1 ring-sky-100">
              Timeline
            </div>
            <h2 className="text-3xl font-semibold text-gray-900">
              Journey through every film
            </h2>
            <p className="mx-auto max-w-3xl text-base text-gray-600">
              Follow release order, relive iconic scenes, and discover hidden gems across the Studio Ghibli collection. Your personal progress is tracked in one place.
            </p>
          </div>
        </section>

        <Timeline userList={userList} />

        {/* Contact Section */}
        <section
          id="contact"
          className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-6 py-16"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="absolute right-0 bottom-10 h-40 w-40 rounded-full bg-sky-200/40 blur-3xl" />
          </div>

          <div className="relative mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl bg-white/80 p-8 shadow-2xl shadow-emerald-100 ring-1 ring-emerald-50 backdrop-blur">
            <div className="flex flex-col items-start gap-3 text-left">
              <p className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700 ring-1 ring-emerald-100">
                Get in touch
              </p>
              <h2 className="text-3xl font-semibold text-gray-900">Contact</h2>
              <p className="max-w-2xl text-base text-gray-600">
                Questions, feedback, or collaboration ideas? Reach out and we’ll
                get back to you soon.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-50 bg-white/90 p-5 shadow-sm shadow-emerald-50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-600">mail</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Email us</div>
                      <a
                        href="mailto:info@ghibliapp.com"
                        className="text-sm text-emerald-700 underline underline-offset-4"
                      >
                        info@ghibliapp.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-sky-50 bg-white/90 p-5 shadow-sm shadow-sky-50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-sky-600">chat</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Community</div>
                      <p className="text-sm text-gray-600">
                        Join discussions and share your favorite Ghibli moments.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-3">
                    <a
                      href="https://discord.gg"
                      className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-100"
                    >
                      <span className="material-symbols-outlined text-sm">forum</span>
                      Discord
                    </a>
                    <a
                      href="https://twitter.com"
                      className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 ring-1 ring-sky-100"
                    >
                      <span className="material-symbols-outlined text-sm">alternate_email</span>
                      Twitter
                    </a>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-50 bg-white/90 p-5 shadow-sm shadow-emerald-50">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-emerald-600">code</span>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">GitHub</div>
                      <p className="text-sm text-gray-600">
                        Browse the codebase, open issues, or contribute.
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <a
                      href="https://github.com/your-org/studio-ghibli-app"
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-100"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      View on GitHub
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-50 bg-white p-6 shadow-lg shadow-emerald-100 ring-1 ring-emerald-50">
                <form className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="text-left">
                      <label className="block text-sm font-semibold text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        className="mt-1 w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm text-gray-900 shadow-inner shadow-emerald-50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        placeholder="Sophie"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-sm font-semibold text-gray-700">
                        Email
                      </label>
                      <input
                        type="email"
                        className="mt-1 w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm text-gray-900 shadow-inner shadow-emerald-50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="text-left">
                    <label className="block text-sm font-semibold text-gray-700">
                      Message
                    </label>
                    <textarea
                      rows={4}
                      className="mt-1 w-full rounded-xl border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm text-gray-900 shadow-inner shadow-emerald-50 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      placeholder="Share your thoughts..."
                    />
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200/60 transition hover:shadow-emerald-300/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-200"
                  >
                    <span className="material-symbols-outlined text-base">send</span>
                    Send message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12 border-t border-gray-200 bg-white/80 px-6 py-8 text-gray-700 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="text-sm font-semibold text-gray-900">
                Studio Ghibli Timeline
              </div>
              <div className="text-xs text-gray-500">
                © {new Date().getFullYear()} Studio Ghibli Timeline. All rights reserved.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
              <a
                href="#hero"
                className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
              >
                Hero
              </a>
              <a
                href="#timeline"
                className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
              >
                Timeline
              </a>
              <a
                href="#contact"
                className="rounded-full bg-sky-50 px-3 py-1.5 text-sky-700 ring-1 ring-sky-100 transition hover:bg-sky-100"
              >
                Contact
              </a>
              <a
                href="https://github.com/your-org/studio-ghibli-app"
                className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-emerald-700 ring-1 ring-emerald-100 transition hover:bg-emerald-100"
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
