import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] text-green-700 dark:text-green-400 font-mono selection:bg-green-500/30">
      {/* Terminal Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Terminal Window */}
          <div className="bg-white dark:bg-[#1a1a1a] border border-green-500/30 dark:border-green-500/20 rounded-lg overflow-hidden shadow-xl dark:shadow-2xl dark:shadow-green-500/5">
            {/* Terminal Header */}
            <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-[#0d0d0d] border-b border-green-500/20 dark:border-green-500/10">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <span className="text-xs text-green-600/50 dark:text-green-500/50 ml-4">antstack@dev:~</span>
            </div>
            
            {/* Terminal Content */}
            <div className="p-6 md:p-8 space-y-4 text-sm md:text-base">
              <div className="text-green-600/60 dark:text-green-500/60">
                <span className="text-green-600 dark:text-green-400">$</span> cat /etc/antstack/about.txt
              </div>
              
              <pre className="text-green-800 dark:text-green-300 leading-relaxed text-[11px] sm:text-xs md:text-sm overflow-x-auto">
{` █████╗ ███╗   ██╗████████╗███████╗████████╗ █████╗  ██████╗██╗  ██╗
██╔══██╗████╗  ██║╚══██╔══╝██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
███████║██╔██╗ ██║   ██║   ███████╗   ██║   ███████║██║     █████╔╝ 
██╔══██║██║╚██╗██║   ██║   ╚════██║   ██║   ██╔══██║██║     ██╔═██╗ 
██║  ██║██║ ╚████║   ██║   ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝`}
              </pre>
              
              <p className="text-green-600 dark:text-green-400 text-center mt-4 text-lg tracking-widest">
                Roll Your Own Backend Stack
              </p>

              <div className="pt-4 text-green-600/60 dark:text-green-500/60">
                <span className="text-green-600 dark:text-green-400">$</span> antstack --help
              </div>
              
              <div className="text-green-700/80 dark:text-green-300/80 pl-4 border-l-2 border-green-500/30 dark:border-green-500/20">
                <p className="mb-2">Production-ready backend boilerplate generator.</p>
                <p className="text-green-600/50 dark:text-green-500/50">Choose your framework, ORM, and database.</p>
                <p className="text-green-600/50 dark:text-green-500/50">Own every line of code. No vendor lock-in.</p>
              </div>

              <div className="pt-4 text-green-600/60 dark:text-green-500/60">
                <span className="text-green-600 dark:text-green-400">$</span> npx antstack-js@latest my-app
              </div>
              
              <div className="text-amber-600 dark:text-amber-400/80 animate-pulse">
                ▌ Ready to scaffold...
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Link 
              href="/builder"
              className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white dark:text-black font-bold rounded border border-green-500 dark:border-green-400 hover:bg-green-500 dark:hover:bg-green-400 transition-all text-center"
            >
              → Start Building
            </Link>
            <Link 
              href="/docs"
              className="px-6 py-3 bg-transparent text-green-600 dark:text-green-400 font-bold rounded border border-green-500/40 dark:border-green-500/30 hover:border-green-500 dark:hover:border-green-400 hover:bg-green-500/10 dark:hover:bg-green-500/10 transition-all text-center"
            >
              $ Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 border-t border-green-500/20 dark:border-green-500/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-green-600/60 dark:text-green-500/60 mb-8">
            <span className="text-green-600 dark:text-green-400">$</span> ls -la /features/
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'frameworks/',
                desc: 'Express, Hono, Fastify',
                detail: 'Pick your HTTP framework'
              },
              {
                name: 'orms/',
                desc: 'Prisma, Drizzle',
                detail: 'Type-safe data layer'
              },
              {
                name: 'databases/',
                desc: 'PostgreSQL, MongoDB, MySQL',
                detail: 'Any database you need'
              },
              {
                name: 'architecture/',
                desc: 'Service-Controller-Repository',
                detail: 'Clean, scalable patterns'
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-[#1a1a1a] border border-green-500/30 dark:border-green-500/20 rounded p-4 hover:border-green-500/50 dark:hover:border-green-500/40 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-blue-600 dark:text-blue-400">drwxr-xr-x</span>
                  <span className="text-green-700 dark:text-green-300">{feature.name}</span>
                </div>
                <div className="text-green-600/70 dark:text-green-500/70 text-sm">
                  <span className="text-amber-600 dark:text-amber-400"># {feature.desc}</span>
                  <p className="mt-1 text-green-600/50 dark:text-green-500/50">{feature.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Install */}
      <section className="py-16 border-t border-green-500/20 dark:border-green-500/10">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-green-600/60 dark:text-green-500/60 mb-4">
            <span className="text-green-600 dark:text-green-400">$</span> echo "Quick Install"
          </div>
          
          <div className="bg-white dark:bg-[#1a1a1a] border border-green-500/30 dark:border-green-500/20 rounded p-6">
            <code className="text-lg text-green-700 dark:text-green-300">
              npx antstack-js@latest &lt;project-name&gt; \<br />
              <span className="text-green-600/60 dark:text-green-500/60 ml-4">--framework</span> <span className="text-amber-600 dark:text-amber-400">express|hono</span> \<br />
              <span className="text-green-600/60 dark:text-green-500/60 ml-4">--database</span> <span className="text-amber-600 dark:text-amber-400">postgresql|mongodb</span> \<br />
              <span className="text-green-600/60 dark:text-green-500/60 ml-4">--orm</span> <span className="text-amber-600 dark:text-amber-400">prisma|drizzle</span>
            </code>
          </div>
          
          <p className="text-green-600/50 dark:text-green-500/50 text-sm mt-4 text-center">
            Or use the interactive wizard – just run <code className="text-green-600 dark:text-green-400">npx antstack-js@latest</code>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-green-500/20 dark:border-green-500/10 text-center text-green-600/40 dark:text-green-500/40 text-sm">
        <p>Built with ♥ for developers who own their code</p>
        <p className="mt-2">
          <span className="text-green-600 dark:text-green-400">$</span> exit 0
        </p>
      </footer>
    </main>
  );
}
