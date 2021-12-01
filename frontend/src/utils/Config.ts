export function getApi(url: string) {
  const port = window.location.port === '80' ? 81 : 8000
  return `http://${window.location.hostname}:${port}/api${url}`
}
