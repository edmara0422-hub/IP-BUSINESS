'use client'

import dynamic from 'next/dynamic'

const SplashScreen = dynamic(() => import('@/components/SplashScreen'), {
    ssr: false,
    loading: () => null,
})

export default function SplashPreviewPage() {
    return <SplashScreen onComplete={() => undefined} />
}
