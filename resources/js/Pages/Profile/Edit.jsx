import { Head, Link, usePage } from '@inertiajs/react';
import { motion } from 'framer-motion';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const authUser = auth?.user;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100">
            <Head title="Settings - Profile" />

            {/* NAVBAR */}
            <nav className="fixed top-0 left-0 w-full flex justify-between items-center px-3 md:px-6 py-2 md:py-3 bg-slate-950/40 backdrop-blur-md z-50 border-b border-yellow-400/20">
                <Link
                    href="/"
                    className="text-base md:text-xl font-bold text-yellow-400 transition hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-300 rounded"
                >
                    Ghibli Filmography
                </Link>

                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 md:gap-2 rounded-full bg-slate-800/80 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-slate-200 ring-1 ring-yellow-400/30 transition hover:bg-slate-700/80 hover:text-yellow-400"
                >
                    <span className="material-symbols-outlined text-sm md:text-base">arrow_back</span>
                    <span className="hidden sm:inline">Back to Home</span>
                </Link>
            </nav>

            {/* MAIN CONTENT */}
            <motion.div
                className="pt-20 md:pt-24 pb-12 px-4 md:px-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="mx-auto max-w-4xl space-y-6">
                    {/* Page Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2 drop-shadow-[0_0_25px_rgba(250,204,21,0.45)]">
                            Settings
                        </h1>
                        <p className="text-slate-400 text-sm md:text-base">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    {/* Profile Information Section */}
                    <motion.div
                        className="rounded-2xl border border-yellow-400/20 bg-slate-900/80 p-6 md:p-8 shadow-xl shadow-black/60 backdrop-blur"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-2xl"
                        />
                    </motion.div>

                    {/* Update Password Section */}
                    <motion.div
                        className="rounded-2xl border border-yellow-400/20 bg-slate-900/80 p-6 md:p-8 shadow-xl shadow-black/60 backdrop-blur"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <UpdatePasswordForm className="max-w-2xl" />
                    </motion.div>

                    {/* Delete Account Section */}
                    <motion.div
                        className="rounded-2xl border border-red-500/20 bg-slate-900/80 p-6 md:p-8 shadow-xl shadow-black/60 backdrop-blur"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <DeleteUserForm className="max-w-2xl" />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
