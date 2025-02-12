"use client";
import CustomLink from "../components/CustomLink";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <header className="text-center mb-12">
        <img
          src="/banner.webp"
          alt="TTRPG Generator Banner"
          className="w-full max-w-md h-auto mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-4">Welcome to the TTRPG Generator</h1>
        <p className="text-lg">
          Generate random dice rolls for your tabletop role-playing games with ease.
        </p>
      </header>
      <main className="w-full max-w-md space-y-4">
        <CustomLink
          href="/mroll"
          className="block w-full text-center py-3 bg-gray-800 rounded hover:bg-gray-700 transition"
          aria-label="Manual Dice Roller"
        >
          Manual Dice Roller
        </CustomLink>
        <CustomLink
          href="/bulk"
          className="block w-full text-center py-3 bg-gray-800 rounded hover:bg-gray-700 transition"
          aria-label="Generate in Bulk"
        >
          Generate in Bulk
        </CustomLink>
        <CustomLink
          href="/content"
          className="block w-full text-center py-3 bg-gray-800 rounded hover:bg-gray-700 transition"
          aria-label="My Content"
        >
          My Content
        </CustomLink>
      </main>
      <footer className="mt-12 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} TTRPG Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}
