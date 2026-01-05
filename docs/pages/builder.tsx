import React, { useState } from 'react'

const FRAMEWORKS = [
  { id: 'express', name: 'Express', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  { id: 'hono', name: 'Hono', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  { id: 'fastify', name: 'Fastify', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
]

const DATABASES = [
  { id: 'postgresql', name: 'PostgreSQL', icon: '🐘' },
  { id: 'mongodb', name: 'MongoDB', icon: '🍃' },
  { id: 'mysql', name: 'MySQL', icon: '🐬' },
]

const ORMS = [
  { id: 'prisma', name: 'Prisma', desc: 'Typesafe Developer Experience' },
  { id: 'drizzle', name: 'Drizzle', desc: 'Lightweight & SQL-like' },
]

export default function BuilderPage() {
  const [framework, setFramework] = useState('express')
  const [database, setDatabase] = useState('postgresql')
  const [orm, setOrm] = useState('prisma')
  const [projectName, setProjectName] = useState('my-antstack-app')

  const command = `npx antstack-js@latest ${projectName} --framework ${framework} --database ${database} --orm ${orm}`

  return (
    <div className="min-h-screen bg-[#050505] text-white py-20 selection:bg-blue-500/30">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight uppercase">
            Build your <span className="text-blue-500">Perfect Stack</span>
          </h1>
          <p className="text-zinc-500 font-light max-w-lg mx-auto">
            Select your configuration and we'll generate the command to scaffold your next production-ready backend.
          </p>
        </header>

        <div className="space-y-12">
          {/* Project Name */}
          <section>
             <label className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-4">01. Project Name</label>
             <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-blue-500 transition-colors font-mono"
              placeholder="my-antstack-app"
             />
          </section>

          {/* Framework */}
          <section>
            <label className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-4">02. Framework</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FRAMEWORKS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFramework(f.id)}
                  className={`px-6 py-4 rounded-xl border transition-all text-left ${
                    framework === f.id 
                      ? `${f.color} scale-[1.02] shadow-lg shadow-black` 
                      : 'bg-zinc-900/30 border-white/5 text-zinc-500 hover:border-white/10'
                  }`}
                >
                  <span className="font-bold">{f.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Database */}
          <section>
            <label className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-4">03. Database</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DATABASES.map((db) => (
                <button
                  key={db.id}
                  onClick={() => setDatabase(db.id)}
                  className={`px-6 py-4 rounded-xl border transition-all flex items-center space-x-4 ${
                    database === db.id 
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 scale-[1.02]' 
                      : 'bg-zinc-900/30 border-white/5 text-zinc-500 hover:border-white/10'
                  }`}
                >
                  <span className="text-xl">{db.icon}</span>
                  <span className="font-bold">{db.name}</span>
                </button>
              ))}
            </div>
          </section>

          {/* ORM */}
          <section>
            <label className="block text-[10px] font-mono tracking-widest text-zinc-500 uppercase mb-4">04. ORM</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ORMS.map((o) => (
                <button
                  key={o.id}
                  onClick={() => setOrm(o.id)}
                  className={`px-6 py-6 rounded-xl border transition-all text-left ${
                    orm === o.id 
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 scale-[1.02]' 
                      : 'bg-zinc-900/30 border-white/5 text-zinc-500 hover:border-white/10'
                  }`}
                >
                  <p className="font-bold text-lg mb-1">{o.name}</p>
                  <p className="text-sm font-light opacity-60">{o.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Result */}
          <section className="pt-12">
             <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
               <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex justify-between items-center">
                  <span className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Generated Command</span>
                  <div className="flex space-x-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
                  </div>
               </div>
               <div className="p-8 group relative">
                 <pre className="font-mono text-blue-400 text-lg break-all whitespace-pre-wrap leading-relaxed">
                   <code>{command}</code>
                 </pre>
                 <button 
                  onClick={() => navigator.clipboard.writeText(command)}
                  className="absolute bottom-4 right-4 px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-zinc-200 transition-all active:scale-95"
                 >
                   COPY COMMAND
                 </button>
               </div>
             </div>
             
             <p className="mt-8 text-center text-zinc-600 text-xs font-mono">
               PASTE THIS IN YOUR TERMINAL TO START BUILDING
             </p>
          </section>
        </div>
      </div>
    </div>
  )
}
