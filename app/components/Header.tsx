import Image from 'next/image';
import Link from 'next/link';
import AuthButton from './AuthButton';

export default function Header() {
    return (
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/news-publishing-svgrepo-com.svg"
                        alt="Новини України"
                        width={40}
                        height={40}
                        className="h-10 w-10"
                        priority
                    />
                    <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                        Новини України
                    </h1>
                </Link>
                <AuthButton />
            </div>
        </header>
    );
}

