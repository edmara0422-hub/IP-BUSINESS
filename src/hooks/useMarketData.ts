'use client'

import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(r => r.json())

export function useMarketData() {
  const { data, error, isLoading, mutate } = useSWR('/api/market', fetcher, {
    refreshInterval: 5 * 60 * 1000, // revalida a cada 5 min
    revalidateOnFocus: false,        // não rebusca ao focar a janela
    dedupingInterval: 60 * 1000,     // múltiplos componentes compartilham 1 req/min
    keepPreviousData: true,          // mostra dado antigo enquanto revalida (UI não pisca)
  })

  return {
    marketData: data ?? null,
    loading: isLoading,
    error: !!error,
    refresh: mutate,
  }
}
