import AppLogoIcon from '@/components/app-logo-icon';
import AppearanceToggleDropdown from '@/components/appearance-dropdown';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AuthSplitLayout({ children, title, description }: AuthLayoutProps) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="relative grid h-dvh flex-col items-center justify-center px-8 sm:px-0 lg:max-w-none lg:grid-cols-2 lg:px-0">
            {/* LADO IZQUIERDO (VIDEO) */}
            <div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
                <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline>
                    <source src="/videos/0126-2.mp4" type="video/mp4" />
                </video>

                <Link href={route('home')} className="relative z-20 flex items-center text-lg font-medium">
                    <AppLogoIcon className="mr-2 size-8 fill-current text-white" />
                    {name}
                </Link>
            </div>

            {/* LADO DERECHO */}
            <div className="w-full lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[420px]">
                    {/* TOP BAR */}
                    <div className="flex w-full items-center justify-end gap-2 pb-2">
                        <a
                            href="https://miracode.tech/precios/"
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver
                        </a>

                        <AppearanceToggleDropdown />
                    </div>

                    {/* LOGO + NOMBRE */}
                    <div className="mx-auto flex items-center justify-center gap-4">
                        <img src="/images/logo.png" alt="MiraCode" className="h-16 w-16 object-contain" />

                        <div className="space-y-1 text-left">
                            <p className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                                MiraCode
                            </p>
                            <p className="text-sm text-zinc-500 dark:text-zinc-400">Catálogo Online</p>
                        </div>
                    </div>
                    {/* FORM */}
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        <div className="flex flex-col items-center gap-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-sm text-balance">{description}</p>
                        </div>

                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
