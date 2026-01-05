import React from 'react'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-blue-400 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span>v0.1.0-beta is now live</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            ROLL YOUR OWN <br /> <span className="text-blue-500">BACKEND STACK</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-400 mb-12">
            The production-ready boilerplate generator for modern teams. 
            Choose your framework, ORM, and database. Own every line of code.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              href="/builder"
              className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all transform hover:scale-105"
            >
              Start Building
            </Link>
            <div className="group relative flex items-center bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-4 font-mono text-sm overflow-hidden">
              <span className="text-blue-400 mr-2">$</span>
              <code className="text-zinc-300">npx antstack-js@latest</code>
              <button 
                onClick={() => navigator.clipboard.writeText('npx antstack-js@latest')}
                className="ml-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
              </button>
            </div>
          </div>
          
          {/* Dashboard Preview Mimic */}
          <div className="relative max-w-5xl mx-auto">
            <div className="absolute inset-0 bg-blue-500/20 blur-[120px] rounded-full -z-10" />
            <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-4 md:p-8 backdrop-blur-sm shadow-2xl overflow-hidden text-left">
               <div className="flex items-center space-x-2 mb-6 border-b border-white/5 pb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <div className="h-6 w-px bg-white/10 ml-2 mr-2" />
                  <span className="text-xs text-zinc-500 font-mono tracking-widest uppercase">antstack_scaffolder.json</span>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: 'FRAMEWORK', value: 'Hono / Express' },
                   { label: 'DATABASE', value: 'PostgreSQL / Mongo' },
                   { label: 'ORM', value: 'Drizzle / Prisma' },
                 ].map((item, i) => (
                   <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-4">
                     <p className="text-[10px] font-mono text-zinc-500 mb-1">{item.label}</p>
                     <p className="text-lg font-bold text-white">{item.value}</p>
                   </div>
                 ))}
               </div>
               
               <div className="mt-8 p-6 bg-zinc-950/50 rounded-xl border border-white/5 font-mono text-sm text-zinc-400">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-zinc-500">./src/index.ts</span>
                  </div>
                  <pre className="text-blue-300">
                    <code>{`import { Hono } from 'hono';\nconst app = new Hono();\n\napp.get('/', (c) => c.json({ \n  status: '🚀 Launching' \n}));\n\nexport default app;`}</code>
                  </pre>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-32 bg-zinc-950/50 border-t border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: 'No Framework Lock-in', 
                desc: 'Unlike traditional backends, you own the code. No proprietary libraries or hidden dependencies.',
                icon: '🔓'
              },
              { 
                title: 'Modular by Design', 
                desc: 'Swap Express for Hono or Prisma for Drizzle with ease. The architecture stays the same.',
                icon: '🧩'
              },
              { 
                title: 'Production Ready', 
                desc: 'Includes Auth, Logging, Validation, and standard Directory structure out of the box.',
                icon: '⚡'
              }
            ].map((feature, i) => (
              <div key={i} className="group">
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-blue-400 transition-colors uppercase tracking-wider">{feature.title}</h3>
                <p className="text-zinc-400 leading-relaxed font-light">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Social Proofish Footer */}
      <footer className="py-20 border-t border-white/5 text-center">
         <div className="container mx-auto px-6">
            <p className="text-zinc-500 text-sm mb-4 tracking-widest uppercase">TRUSTED BY 0 DEVELOPERS (SO FAR)</p>
            <div className="flex justify-center space-x-8 opacity-20 grayscale">
              {/* Placeholders for logos */}
              <div className="h-6 w-24 bg-white rounded" />
              <div className="h-6 w-24 bg-white rounded" />
              <div className="h-6 w-24 bg-white rounded" />
            </div>
         </div>
      </footer>
    </div>
  )
}
