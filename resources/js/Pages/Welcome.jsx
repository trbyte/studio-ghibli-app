import React, { useEffect } from "react";
import { router } from "@inertiajs/react";
import { Vortex } from "@/Components/ui/vortex";
import { motion } from "framer-motion";

export default function Welcome({ auth }) {
  const userName = auth?.user?.name || "Explorer";

  useEffect(() => {
    // Auto-redirect to landing page after 2.5 seconds
    const timer = setTimeout(() => {
      router.visit("/", {
        preserveScroll: false,
      });
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

    return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <Vortex
        backgroundColor="black"
        baseHue={60}
        rangeHue={180}
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center"
        >
          <h2 className="text-yellow-400 text-3xl md:text-7xl font-bold text-center mb-4 drop-shadow-[0_0_25px_rgba(250,204,21,0.5)]">
            Welcome, {userName}!
                                                </h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-slate-200 text-base md:text-2xl max-w-2xl mt-6 text-center"
          >
            Step into the magical world of Studio Ghibli
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-slate-300 text-sm md:text-lg max-w-xl mt-4 text-center"
          >
            Explore timeless stories, track your favorites, and discover the wonder of animated masterpieces.
          </motion.p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.visit("/")}
            className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 transition duration-200 rounded-lg text-slate-950 font-semibold shadow-lg shadow-yellow-500/50"
          >
            Enter Studio Ghibli Explorer
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-8 text-slate-400 text-xs md:text-sm"
        >
          Redirecting automatically...
        </motion.div>
      </Vortex>
            </div>
    );
}
