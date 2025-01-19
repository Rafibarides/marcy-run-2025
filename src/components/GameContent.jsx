import styled from 'styled-components'
import { useGame } from '../hooks/useGame'
import StartMenu from './ui/StartMenu'
import GameOver from './ui/GameOver'
import GameHUD from './ui/GameHUD'
import Character from './game/Character'
import Ground from './game/Ground'
import Background from './game/Background'
import Coin from './game/Coin'
import Obstacle from './game/Obstacle'
import { GAME_STATES, GAME_CONFIG } from '../utils/constants'
import { useEffect, useState } from 'react'
import LoadingScreen from './ui/LoadingScreen'
import { useAudio } from '../hooks/useAudio'
import { Howl } from 'howler'

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: black;
  overflow: hidden;
`

const GameScaler = styled.div`
  position: relative;
  width: ${GAME_CONFIG.VIEWPORT.WIDTH}px;
  height: ${GAME_CONFIG.VIEWPORT.HEIGHT}px;
  transform: scale(${props => props.$scale});
  transform-origin: center center;
`

const GameArea = styled.div`
  position: relative;
  width: ${GAME_CONFIG.VIEWPORT.WIDTH}px;
  height: ${GAME_CONFIG.VIEWPORT.HEIGHT}px;
  overflow: hidden;
`

const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = reject
    img.src = src
  })
}

const preloadFont = (fontFamily) => {
  return document.fonts.load(`1em ${fontFamily}`)
}

export function GameContent() {
  const { gameState, assetsLoaded, setAssetsLoaded } = useGame()
  const [scale, setScale] = useState(1)
  useAudio()

  useEffect(() => {
    const updateScale = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const windowRatio = windowWidth / windowHeight
      const gameRatio = GAME_CONFIG.VIEWPORT.ASPECT_RATIO

      let newScale
      if (windowRatio > gameRatio) {
        // Window is wider - fit to height
        newScale = windowHeight / GAME_CONFIG.VIEWPORT.HEIGHT
      } else {
        // Window is taller - fit to width
        newScale = windowWidth / GAME_CONFIG.VIEWPORT.WIDTH
      }
      setScale(newScale)
    }

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Preload all images
        const imagePromises = [
          '/assets/images/menu.png',
          '/assets/images/logo.png',
          '/assets/images/background.jpg',
          '/assets/images/ground.png',
          '/assets/images/moon.png',
          '/assets/images/obstacle.png',
          '/assets/images/coin.png',
          '/assets/images/ben.png',
          '/assets/images/gonzalo.png',
          '/assets/images/motun.png'
        ].map(preloadImage)

        // Preload fonts
        const fontPromises = [
          preloadFont('Kid Games'),
          preloadFont('Poxel Font')
        ]

        // Preload audio
        const audioPromises = [
          new Promise((resolve, reject) => {
            new Howl({
              src: ['/assets/audio/coin.mp3'],
              preload: true,
              onload: () => resolve(),
              onloaderror: (_, err) => reject(err)
            })
          }),
          new Promise((resolve, reject) => {
            new Howl({
              src: ['/assets/audio/loser-track.mp3'],
              preload: true,
              onload: () => resolve(),
              onloaderror: (_, err) => reject(err)
            })
          }),
        ]

        // Wait for all assets (images, fonts, audio) to load
        await Promise.all([
          ...imagePromises,
          ...fontPromises,
          ...audioPromises
        ])
        setAssetsLoaded(true)
      } catch (error) {
        console.error('Failed to load assets:', error)
        // Set loaded anyway to prevent infinite loading
        setAssetsLoaded(true)
      }
    }

    loadAssets()
  }, [setAssetsLoaded])

  if (!assetsLoaded) {
    return <LoadingScreen />
  }

  return (
    <GameContainer>
      <GameScaler $scale={scale}>
        {gameState === GAME_STATES.MENU && <StartMenu />}
        {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.GAME_OVER) && (
          <GameArea>
            <Background />
            <Character />
            <Coin />
            <Obstacle />
            <Ground />
            <GameHUD />
            {gameState === GAME_STATES.GAME_OVER && <GameOver />}
          </GameArea>
        )}
      </GameScaler>
    </GameContainer>
  )
} 