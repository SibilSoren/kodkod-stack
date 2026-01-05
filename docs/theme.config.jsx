export default {
  logo: (
    <div className="flex items-center space-x-2">
      <img src="/logo.png" alt="antstack-js" className="h-8 w-8 object-contain" />
      <span className="font-bold text-xl tracking-tight">antstack-js</span>
    </div>
  ),
  project: {
    link: 'https://github.com/SibilSoren/antstack-js'
  },
  docsRepositoryBase: 'https://github.com/SibilSoren/antstack-js/tree/main/docs',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – antstack-js'
    }
  },
  footer: {
    text: (
      <div className="flex flex-col items-center sm:items-start text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} antstack-js. Roll your own stack.</p>
      </div>
    )
  },
  nextThemes: {
    defaultTheme: 'dark'
  }
}
