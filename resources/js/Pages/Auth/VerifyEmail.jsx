import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-400 ring-1 ring-yellow-400/30">
                        Verify Email
                    </p>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-yellow-400">
                            Verify your email address
                        </h1>
                        <p className="text-sm text-slate-400">
                            Thanks for signing up! Before getting started, could you verify
                            your email address by clicking on the link we just emailed to
                            you? If you didn't receive the email, we will gladly send you
                            another.
                        </p>
                    </div>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm font-medium text-green-400">
                        A new verification link has been sent to the email address
                        you provided during registration.
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div className="flex items-center justify-between">
                        <PrimaryButton disabled={processing}>
                            Resend Verification Email
                        </PrimaryButton>

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="rounded-full text-sm text-yellow-400 underline hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-slate-800"
                        >
                            Log In
                        </Link>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
