const PROBABILISTIC_ATTRIBUTION_WINDOW_INTERVAL = 24 * 60 * 60 * 1000 // 24h
const IN_APP_EVENTS_ATTRIBUTION_WINDOW_INTERVAL = 24 * 30 * 24 * 60 * 60 * 1000 // 24 months https://support.appsflyer.com/hc/en-us/articles/115005544169-In-app-events-Overview#how-does-appsflyer-attribute-events

const getProbabilisticAttributionWindowStart = (): Date =>
  getAttributionWindowStart(PROBABILISTIC_ATTRIBUTION_WINDOW_INTERVAL)

const getInAppEventsAttributionWindowStart = (): Date =>
  getAttributionWindowStart(IN_APP_EVENTS_ATTRIBUTION_WINDOW_INTERVAL)

const getAttributionWindowStart = (interval: number): Date => {
  const now = new Date()
  const attributionWindowStart = new Date(now.getTime() - interval)

  return attributionWindowStart
}

export const attributionSettings = {
  getProbabilisticAttributionWindowStart,
  getInAppEventsAttributionWindowStart,
}
