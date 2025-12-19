import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
                    <span className="material-symbols-outlined">person</span>
                    Profile Information
                </h2>

                <p className="mt-2 text-sm text-slate-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <InputLabel htmlFor="name" value="Name" className="text-slate-200" />

                    <TextInput
                        id="name"
                        className="mt-1 block w-full bg-slate-800/60 border-yellow-400/30 text-slate-100 placeholder:text-slate-500 focus:border-yellow-400/50 focus:ring-yellow-400/30"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />

                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="email" value="Email" className="text-slate-200" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full bg-slate-800/60 border-yellow-400/30 text-slate-100 placeholder:text-slate-500 focus:border-yellow-400/50 focus:ring-yellow-400/30"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="rounded-lg border border-yellow-400/30 bg-yellow-400/10 p-4">
                        <p className="text-sm text-slate-200">
                            Your email address is unverified.
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 text-yellow-400 underline hover:text-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 rounded"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-400 flex items-center gap-1">
                            <span className="material-symbols-outlined text-base">check_circle</span>
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
