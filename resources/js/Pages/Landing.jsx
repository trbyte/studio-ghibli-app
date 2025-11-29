import React from "react";
import { Link, usePage } from "@inertiajs/react";

function UserMenu({ authUser }) {
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative inline-block text-left">
      {/* Profile Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full transition hover:text-gray-300"
      >
        <span className="material-symbols-outlined text-3xl">
          account_circle
        </span>
      </button>

      {/* Dropdown */}
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

function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55]"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 
                    bg-white/90 backdrop-blur-lg
                    shadow-xl border-l z-[60]
                    overflow-y-auto
                    transform transition-transform duration-300 ${
                      open ? "translate-x-0" : "translate-x-full"
                    }`}
      >
        <div className="p-4 text-lg font-semibold border-b">Your List</div>
        <div className="p-4 text-gray-600">
          <p>No items yet...</p>
        </div>
      </div>
    </>
  );
}

export default function Landing() {
  const { auth } = usePage().props;
  const authUser = auth?.user;
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <>
      {/* NAVBAR */}
      <nav
        className="
          fixed top-0 left-0 w-full
          flex justify-between items-center
          px-6 py-3
          bg-transparent
          backdrop-blur-sm
          z-50
        "
      >
        <div className="text-xl font-bold">Studio Ghibli</div>

        <div className="flex items-center space-x-3">
          {/* Book Icon → Opens Sidebar */}
          {authUser && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 rounded-full transition hover:text-gray-300"
            >
              <span className="material-symbols-outlined text-3xl">book</span>
            </button>
          )}

          {/* User Menu */}
          {authUser ? (
            <UserMenu authUser={authUser} />
          ) : (
            <Link
              href="/login"
              className="bg-gray-200 text-gray-900 px-4 py-2 rounded-md font-semibold hover:bg-gray-300 transition"
            >
              Log In
            </Link>
          )}
        </div>
      </nav>

      {/* SIDEBAR — OUTSIDE NAVBAR */}
      {authUser && (
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      )}

      {/* MAIN CONTENT */}
      <div className="min-h-screen flex flex-col text-gray-900 pt-20">
        
        {/* HERO SECTION */}
        <section className="h-screen flex flex-col justify-start items-center text-center px-6 relative overflow-hidden">
          <div className="flex flex-col items-center z-10 mt-28">
            <h1 className="text-5xl font-bold mb-4 text-center">
              Welcome to Studio Ghibli Explorer
            </h1>
            <p className="text-lg max-w-xl mb-6 text-center">
              Explore the world of Studio Ghibli. Lorem ipsum, dolor sit amet
              consectetur adipisicing elit.
            </p>
            <Link
              href="/login"
              className="bg-gray-200 text-gray-900 px-6 py-3 rounded-md font-bold hover:bg-gray-300 transition"
            >
              Get Started
            </Link>
          </div>

          {/* 3D Rotating Cards */}
          <div className="wrapper z-0 absolute bottom-0 mb-12">
            <div className="inner" style={{ "--quantity": 10 }}>
              {[...Array(10).keys()].map((i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    "--index": i,
                    "--color-card": [
                      "142, 249, 252",
                      "142, 252, 204",
                      "142, 252, 157",
                      "215, 252, 142",
                      "252, 252, 142",
                      "252, 208, 142",
                      "252, 142, 142",
                      "252, 142, 239",
                      "204, 142, 252",
                      "142, 202, 252",
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
        <section id="about" className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p className="max-w-2xl mx-auto text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit...
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <p className="max-w-2xl mx-auto text-base">
            Email us at{" "}
            <a href="mailto:info@ghibliapp.com" className="underline">
              info@ghibliapp.com
            </a>
          </p>
        </section>

        {/* Footer */}
        <footer className="p-6 text-center border-t border-gray-300">
          &copy; {new Date().getFullYear()} Studio Ghibli App
        </footer>
      </div>
    </>
  );
}
