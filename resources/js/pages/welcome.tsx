import { login } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-start lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {!auth.user && (
                            <Link
                                href={login()}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Log in
                            </Link>
                        )}
                    </nav>
                </header>

                <main className="flex w-full flex-1 items-center justify-center">
                    <section className="relative w-full max-w-6xl px-6 py-16 text-center">
                        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-6">
                            <img src="/ethioinnovation.png" alt="Ethio Innovation" className="h-20 w-auto max-w-[360px] object-contain rounded-md shadow" />
                            <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl dark:text-[#EDEDEC]">
                                Ethio Innovation Software Development
                            </h1>
                            <p className="max-w-2xl text-[13px] leading-6 text-[#706f6c] dark:text-[#A1A09A]">
                                Welcome.
                            </p>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
