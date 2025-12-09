import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

const heroImage =
    'https://images.unsplash.com/photo-1504269992552-910d24c42f51?auto=format&fit=crop&w=1400&q=80';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50 px-4 py-10 text-gray-800">
            <div className="mx-auto flex min-h-[80vh] items-center justify-center">
                <div className="grid w-full max-w-6xl grid-cols-1 gap-8 rounded-3xl bg-white/80 p-4 shadow-2xl shadow-sky-100 backdrop-blur lg:grid-cols-[1.1fr_minmax(360px,420px)]">
                    <div className="relative hidden overflow-hidden rounded-2xl bg-sky-900/5 lg:block">
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-sky-600/70 via-emerald-500/60 to-sky-900/60 mix-blend-multiply"
                        aria-hidden="true"
                    />
                    <div
                        className="absolute inset-0 scale-105 bg-cover bg-center"
                        style={{ backgroundImage: `url('${heroImage}')` }}
                        aria-hidden="true"
                    />
                    <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
                        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.18em] text-white/80">
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30 backdrop-blur">
                                ✧
                            </span>
                            Studio Ghibli Universe
                        </div>
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80 ring-1 ring-white/30 backdrop-blur">
                                Animated worlds, real feelings
                            </div>
                            <p className="text-3xl font-semibold leading-tight sm:text-4xl">
                                Step into the charm of your favorite Ghibli
                                stories.
                            </p>
                            <p className="max-w-md text-sm text-white/80">
                                Sign in or create an account to explore films,
                                save favorites, and relive the magic of the
                                studio&apos;s timeless adventures.
                            </p>
                        </div>
                    </div>
                </div>

                    <div className="flex flex-col gap-6 rounded-2xl bg-white/90 p-6 shadow-lg shadow-sky-100 ring-1 ring-sky-100">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="group inline-flex items-center gap-3">
                                <ApplicationLogo className="h-12 w-12 fill-current text-sky-600 transition duration-200 group-hover:scale-105 group-hover:text-emerald-500" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600">
                                        Studio Ghibli
                                    </span>
                                    <span className="text-lg font-semibold text-gray-900">
                                        Fan Library
                                    </span>
                                </div>
                            </Link>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
