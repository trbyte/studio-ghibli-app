import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm Password" />

            <div className="space-y-6">
                <div className="space-y-2">
                    <p className="inline-flex items-center gap-2 rounded-full bg-yellow-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-yellow-400 ring-1 ring-yellow-400/30">
                        Security Check
                    </p>
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold text-yellow-400">
                            Confirm your password
                        </h1>
                        <p className="text-sm text-slate-400">
                            This is a secure area of the application. Please confirm your password before continuing.
                        </p>
                    </div>
                </div>

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <InputLabel htmlFor="password" value="Password" className="text-slate-200" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full bg-slate-800/60 border-yellow-400/30 text-slate-100 placeholder:text-slate-500 focus:border-yellow-400/50 focus:ring-yellow-400/30"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    <div className="flex items-center justify-end">
                        <PrimaryButton disabled={processing}>
                            Confirm
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </GuestLayout>
    );
}
