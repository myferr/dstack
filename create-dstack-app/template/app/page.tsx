import { FaGithub } from "react-icons/fa6";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to DStack!
        </h1>
        <p className="text-lg md:text-xl text-base-content/70 mb-4">
          Built with <strong className="text-accent">Next.js 15</strong>,{" "}
          <strong className="text-primary">TypeScript</strong>,{" "}
          <strong className="text-info">TailwindCSS</strong>, and{" "}
          <strong className="text-warning">daisyUI</strong>.
        </p>
        <p className="text-lg md:text-xl text-base-content/70 mb-6">
          Get started by editing the{" "}
          <code className="font-mono bg-base-300 p-1 rounded">
            app/page.tsx
          </code>{" "}
          file.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="https://github.com/myferr/dstack"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary gap-2 no-underline"
          >
            <FaGithub /> GitHub
          </a>
          <div className="dropdown mb-72">
            <div tabIndex={0} role="button" className="btn m-1">
              Theme
              <svg
                width="12px"
                height="12px"
                className="inline-block h-2 w-2 fill-current opacity-60"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 2048"
              >
                <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
              </svg>
            </div>
            <div
              tabIndex={0}
              className="dropdown-content bg-base-300 rounded-box z-10 w-64 p-2 shadow-2xl max-h-[20rem] overflow-y-auto"
            >
              {[
                "light",
                "dark",
                "cupcake",
                "bumblebee",
                "emerald",
                "corporate",
                "synthwave",
                "retro",
                "cyberpunk",
                "valentine",
                "halloween",
                "garden",
                "forest",
                "aqua",
                "lofi",
                "pastel",
                "fantasy",
                "wireframe",
                "black",
                "luxury",
                "dracula",
                "cmyk",
                "autumn",
                "business",
                "acid",
                "lemonade",
                "night",
                "coffee",
                "winter",
                "dim",
                "nord",
                "sunset",
                "caramellatte",
                "abyss",
                "silk",
              ].map((theme) => (
                <input
                  key={theme}
                  type="radio"
                  name="theme-dropdown"
                  className="theme-controller w-full btn btn-sm btn-block btn-ghost justify-start"
                  aria-label={theme.charAt(0).toUpperCase() + theme.slice(1)}
                  value={theme}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
