import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

const heroImage =
    'https://images.unsplash.com/photo-1504269992552-910d24c42f51?auto=format&fit=crop&w=1400&q=80';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-10 text-slate-100">
            <div className="mx-auto flex min-h-[80vh] items-center justify-center">
                <div className="grid w-full max-w-6xl grid-cols-1 gap-8 rounded-3xl bg-slate-900/80 p-4 shadow-2xl shadow-black/60 backdrop-blur border border-yellow-400/20 lg:grid-cols-[1.1fr_minmax(360px,420px)]">
                    <div className="relative hidden overflow-hidden rounded-2xl bg-slate-800/40 lg:block">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-slate-900/80 to-slate-950/90"
                        aria-hidden="true"
                    />
                    <div
                        className="absolute inset-0 scale-105 bg-cover bg-center opacity-30"
                        style={{ backgroundImage: `url('${heroImage}')` }}
                        aria-hidden="true"
                    />
                    <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
                        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-yellow-400/80">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400/15 ring-1 ring-yellow-400/30 backdrop-blur">
                                ✧
                            </span>
                            Studio Ghibli Universe
                        </div>
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-yellow-400/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400/90 ring-1 ring-yellow-400/30 backdrop-blur">
                                Animated worlds, real feelings
                            </div>
                            <p className="text-3xl font-semibold leading-tight text-yellow-400 drop-shadow-[0_0_25px_rgba(250,204,21,0.45)] sm:text-4xl">
                                Step into the charm of your favorite Ghibli
                                stories.
                            </p>
                            <p className="max-w-md text-sm text-slate-300">
                                Sign in or create an account to explore films,
                                save favorites, and relive the magic of the
                                studio&apos;s timeless adventures.
                            </p>
                        </div>
                    </div>
                </div>

                    <motion.div 
                        className="flex flex-col gap-6 rounded-2xl bg-slate-800/60 p-6 shadow-lg shadow-black/60 ring-1 ring-yellow-400/20 backdrop-blur"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-3">
                            <Link href="/" className="group inline-flex items-center gap-3">
                                <ApplicationLogo className="h-12 w-12 fill-current text-yellow-400 transition duration-200 group-hover:scale-105 group-hover:text-yellow-300" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-yellow-400">
                                        Studio Ghibli
                                    </span>
                                    <span className="text-lg font-semibold text-slate-100">
                                        Fan Library
                                    </span>
                                </div>
                </Link>
            </div>
                {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
