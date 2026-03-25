import Head from 'next/head'
import dynamic from 'next/dynamic'

const MainApp = dynamic(() => import('../components/MainApp'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-ocean-900 text-white flex items-center justify-center">
      <p className="text-sm text-white/60">Opening Intelligence Platform BUSINESS...</p>
    </div>
  ),
})

export default function AppLivePage() {
  return (
    <>
      <Head>
        <title>IPB Live</title>
        <meta
          name="description"
          content="Source-backed live route for Intelligence Platform BUSINESS."
        />
      </Head>
      <MainApp />
    </>
  )
}
