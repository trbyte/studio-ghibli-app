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
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    {status}
                </div>
            )}

                <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700 ring-1 ring-sky-100">
                        Welcome back
                    </p>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Sign in to continue
                        </h1>
                        <p className="text-sm text-gray-600">
                            Access your saved films and continue your Ghibli
                            journey.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-4">
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                        <div>
                            <div className="flex items-center justify-between">
                    <InputLabel htmlFor="password" value="Password" />
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm font-semibold text-sky-700 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2"
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
                        className="mt-1 block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                        </div>
                </div>

                    <div className="flex items-center justify-between rounded-xl bg-sky-50 px-4 py-3 ring-1 ring-sky-100">
                        <label className="flex items-center gap-3">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                        />
                            <span className="text-sm text-gray-700">Remember me</span>
                        </label>
                        <span className="text-xs text-gray-500">
                            Secure login enabled
                        </span>
                </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link
                            href={route('register')}
                            className="inline-flex items-center justify-center rounded-lg border border-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
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
