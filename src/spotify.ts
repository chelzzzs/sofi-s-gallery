// Minimal typing and loader for Spotify's iFrame embed API
// (https://developer.spotify.com/documentation/embeds/references/iframe-api).

export type PlaybackUpdate = { isPaused: boolean; isBuffering: boolean; position: number; duration: number }

export type EmbedController = {
  loadUri: (uri: string) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  destroy: () => void
  addListener: (event: 'ready' | 'playback_update', cb: (e: { data: PlaybackUpdate }) => void) => void
}

type IFrameAPI = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: EmbedController) => void,
  ) => void
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: IFrameAPI) => void
  }
}

let api: Promise<IFrameAPI> | null = null

export const loadSpotifyApi = () =>
  (api ??= new Promise((resolve) => {
    window.onSpotifyIframeApiReady = resolve
    const script = document.createElement('script')
    script.src = 'https://open.spotify.com/embed/iframe-api/v1'
    script.async = true
    document.body.appendChild(script)
  }))
