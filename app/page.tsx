import Link from "next/link";

export default function Homepage() {
  return (
    <div className="px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
            Available on Github.{" "}
            <Link
              href="https://www.github.com/jannden/nextjs-openai-whisper-starter"
              className="font-semibold text-indigo-600"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              See code <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl [text-wrap:balance]">
            NextJS OpenAI Whisper Starter
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 [text-wrap:balance]">
            A Next.js starter project integrating OpenAI&apos;s Whisper API for speech-to-text
            functionality.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/record"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <Link href="/settings" className="text-sm font-semibold leading-6 text-gray-900">
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
