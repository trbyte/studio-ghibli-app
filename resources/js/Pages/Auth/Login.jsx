import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="space-y-6">
            {status && (
                    <div className="rounded-xl border border-green-400/30 bg-green-400/10 px-4 py-3 text-sm font-medium text-green-400">
                    {status}
                </div>
            )}

                <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-400 ring-1 ring-yellow-400/30">
                        Welcome back
                    </p>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-yellow-400">
                            Sign in to continue
                        </h1>
                        <p className="text-sm text-slate-400">
                            Access your saved films and continue your Ghibli
                            journey.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-slate-200" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-slate-800/60 border-yellow-400/30 text-slate-100 placeholder:text-slate-500 focus:border-yellow-400/50 focus:ring-yellow-400/30"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                        <div>
                            <div className="flex items-center justify-between">
                    <InputLabel htmlFor="password" value="Password" className="text-slate-200" />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-semibold text-yellow-400 hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-slate-800/60 border-yellow-400/30 text-slate-100 placeholder:text-slate-500 focus:border-yellow-400/50 focus:ring-yellow-400/30"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                        </div>
                </div>

                    <div className="flex items-center justify-between rounded-xl bg-yellow-400/10 px-4 py-3 ring-1 ring-yellow-400/20">
                        <label className="flex items-center gap-3">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                        />
                            <span className="text-sm text-slate-200">Remember me</span>
                        </label>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-sm">lock</span>
                            Secure login enabled
                        </span>
                </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center rounded-full border border-yellow-400/30 px-4 py-2 text-sm font-semibold text-yellow-400 transition hover:border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-300"
                        >
                            New here? Create an account
                        </Link>
            
                        <PrimaryButton className="justify-center px-6" disabled={processing}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
            </div>
        </GuestLayout>
    );
}
