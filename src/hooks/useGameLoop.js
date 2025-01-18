import { useEffect, useRef, useCallback } from 'react'
import { useGame } from './useGame'
import { GAME_STATES } from '../utils/constants'

export const useGameLoop = (callback) => {
  const { gameState } = useGame()
  const frameIdRef = useRef(null)
  const previousTimeRef = useRef(0)

  const loop = useCallback((currentTime) => {
    if (previousTimeRef.current === 0) {
      previousTimeRef.current = currentTime
    }

    const deltaTime = currentTime - previousTimeRef.current
    previousTimeRef.current = currentTime

    if (gameState === GAME_STATES.PLAYING) {
      callback(deltaTime)
    }

    frameIdRef.current = requestAnimationFrame(loop)
  }, [callback, gameState])

  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(loop)
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }
    }
  }, [loop])
}
