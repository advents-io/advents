const PROBABILISTIC_ATTRIBUTION_WINDOW_INTERVAL = 24 * 60 * 60 * 1000 // 24h

const getProbabilisticAttributionWindowStart = (): Date =>
  getAttributionWindowStart(PROBABILISTIC_ATTRIBUTION_WINDOW_INTERVAL)

const getAttributionWindowStart = (interval: number): Date => {
  const now = new Date()
  const attributionWindowStart = new Date(now.getTime() - interval)

  return attributionWindowStart
}

export const attributionSettings = {
  getProbabilisticAttributionWindowStart,
}
