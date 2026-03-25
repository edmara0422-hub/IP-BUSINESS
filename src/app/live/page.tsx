'use client'

import dynamic from 'next/dynamic'

const MainApp = dynamic(() => import('@/components/MainApp'), {
  ssr: false,
  loading: () => null,
})

export default function LivePage() {
  return <MainApp />
}
