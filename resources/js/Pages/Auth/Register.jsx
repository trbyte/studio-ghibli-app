import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-400 ring-1 ring-yellow-400/30">
                        Join the library
                    </p>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-yellow-400">
                            Create your Studio Ghibli account
                        </h1>
                        <p className="text-sm text-slate-400">
                            Save watchlists, track favorites, and unlock a
                            personalized journey.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div className="space-y-4">
                <div>
                    <InputLabel htmlFor="name" value="Name" className="text-slate-200" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-slate-800/60 border-yellow-400/30 text-slate-100 placeholder:text-slate-500 focus:border-yellow-400/50 focus:ring-yellow-400/30"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                        <div>
                    <InputLabel htmlFor="email" value="Email" className="text-slate-200" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-slate-800/60 border-yellow-400/30 text-slate-100 placeholder:text-slate-500 focus:border-yellow-400/50 focus:ring-yellow-400/30"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                        <div>
                    <InputLabel htmlFor="password" value="Password" className="text-slate-200" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-slate-800/60 border-yellow-400/30 text-slate-100 placeholder:text-slate-500 focus:border-yellow-400/50 focus:ring-yellow-400/30"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                        <div>
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                        className="text-slate-200"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-slate-800/60 border-yellow-400/30 text-slate-100 placeholder:text-slate-500 focus:border-yellow-400/50 focus:ring-yellow-400/30"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                        </div>
                </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link
                        href={route('login')}
                            className="inline-flex items-center justify-center rounded-full border border-yellow-400/30 px-4 py-2 text-sm font-semibold text-yellow-400 transition hover:border-yellow-400/50 hover:bg-yellow-400/10 hover:text-yellow-300"
                    >
                            Already have an account? Sign in
                    </Link>

                        <PrimaryButton className="justify-center px-6" disabled={processing}>
                            Create account
                    </PrimaryButton>
                </div>
            </form>
            </div>
        </GuestLayout>
    );
}
