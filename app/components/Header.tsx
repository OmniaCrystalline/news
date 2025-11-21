import Image from 'next/image';
import Link from 'next/link';
import AuthButton from './AuthButton';

export default function Header() {
    return (
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
                <Link href="/" className="flex items-center gap-2 sm:gap-3">
                    <Image
                        src="/news-publishing-svgrepo-com.svg"
                        alt="Новини України"
                        width={40}
                        height={40}
                        className="h-8 w-8 sm:h-10 sm:w-10"
                        priority
                    />
                    <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 sm:text-xl lg:text-2xl">
                        <span className="hidden sm:inline">Новини України</span>
                        <span className="sm:hidden">Новини</span>
                    </h1>
                </Link>
                <div className="shrink-0">
                    <AuthButton />
                </div>
            </div>
        </header>
    );
}

