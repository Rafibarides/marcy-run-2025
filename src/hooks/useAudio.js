import { useEffect, useRef } from 'react'
import { Howl } from 'howler'
import { useGame } from './useGame'
import { GAME_STATES, AUDIO } from '../utils/constants'
import { getAssetPath } from '../utils/assetPath'

export const useAudio = () => {
  const { gameState } = useGame()
  const backgroundMusicRef = useRef(null)

  useEffect(() => {
    // Initialize background music with getAssetPath
    backgroundMusicRef.current = new Howl({
      src: [getAssetPath(`/assets/audio/${AUDIO.BACKGROUND_MUSIC}`)],
      loop: true,
      volume: 0.5,
      preload: true
    })

    // Cleanup on unmount
    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.stop()
      }
    }
  }, [])

  // Handle game state changes
  useEffect(() => {
    if (!backgroundMusicRef.current) return

    if (gameState === GAME_STATES.PLAYING) {
      backgroundMusicRef.current.play()
    } else {
      backgroundMusicRef.current.stop()
    }
  }, [gameState])

  return {
    playBackgroundMusic: () => backgroundMusicRef.current?.play(),
    stopBackgroundMusic: () => backgroundMusicRef.current?.stop()
  }
}
