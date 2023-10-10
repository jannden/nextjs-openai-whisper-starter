import Link from "next/link";
import "./globals.css";
import NavMenu from "@/components/NavMenu";
import { Github } from "lucide-react";
import NavMenuMobileButton from "@/components/NavMenuMobileButton";
import NavMenuMobile from "@/components/NavMenuMobile";

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="h-full">
        <nav className="bg-gray-800">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <Link href="/">
                  <h1 className="text-lg md:text-xl tracking-tight text-gray-400 hover:text-white">
                    NextJS OpenAI Whisper Starter
                  </h1>
                </Link>
                <NavMenu />
              </div>
              <div className="hidden md:block">
                <div className="ml-4 flex items-center md:ml-6">
                  <Link
                    href="https://www.github.com/jannden/nextjs-openai-whisper-starter"
                    className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">View GitHub</span>
                    <Github />
                  </Link>
                </div>
              </div>
              <NavMenuMobileButton />
            </div>
          </div>
          <NavMenuMobile />
        </nav>

        {children}
      </body>
    </html>
  );
}
