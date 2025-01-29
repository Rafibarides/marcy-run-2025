import { lazy, Suspense } from 'react'
import styled from 'styled-components'
import { useGame } from '../hooks/useGame'
import { GAME_STATES, GAME_CONFIG } from '../utils/constants'
import { useEffect, useState} from 'react'
import LoadingScreen from './ui/LoadingScreen'
import { useAudio } from '../hooks/useAudio'
import { Howl } from 'howler'
import { getAssetPath } from '../utils/assetPath'

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
  /* Only apply game viewport scaling when not in menu state */
  ${props => props.$gameState === GAME_STATES.MENU ? `
    width: 100vw;
    height: 100vh;
  ` : `
    width: ${GAME_CONFIG.VIEWPORT.WIDTH}px;
    height: ${GAME_CONFIG.VIEWPORT.HEIGHT}px;
    transform: scale(${props.$scale});
    transform-origin: center center;
  `}
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

// Lazy load components
const StartMenu = lazy(() => import('./ui/StartMenu'))
const GameOver = lazy(() => import('./ui/GameOver'))
const GameHUD = lazy(() => import('./ui/GameHUD'))
const Character = lazy(() => import('./game/Character'))
const Ground = lazy(() => import('./game/Ground'))
const Background = lazy(() => import('./game/Background'))
const Coin = lazy(() => import('./game/Coin'))
const Obstacle = lazy(() => import('./game/Obstacle'))
const NightMode = lazy(() => import('./ui/NightMode'))
const Moon = lazy(() => import('./game/Moon'))

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
          getAssetPath('/assets/images/menu.avif'),
          getAssetPath('/assets/images/logo.avif'),
          getAssetPath('/assets/images/background.avif'),
          getAssetPath('/assets/images/background-night.avif'),
          getAssetPath('/assets/images/ground.avif'),
          getAssetPath('/assets/images/moon.avif'),
          getAssetPath('/assets/images/obstacle.avif'),
          getAssetPath('/assets/images/coin.avif'),
          getAssetPath('/assets/images/ben.avif'),
          getAssetPath('/assets/images/gonzalo.avif'),
          getAssetPath('/assets/images/motun.avif')
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
              src: [getAssetPath('/assets/audio/coin.mp3')],
              preload: true,
              onload: () => resolve(),
              onloaderror: (_, err) => reject(err)
            })
          }),
          new Promise((resolve, reject) => {
            new Howl({
              src: [getAssetPath('/assets/audio/loser-track.mp3')],
              preload: true,
              onload: () => resolve(),
              onloaderror: (_, err) => reject(err)
            })
          }),
          new Promise((resolve, reject) => {
            new Howl({
              src: [getAssetPath('/assets/audio/ben.mp3')],
              preload: true,
              onload: () => resolve(),
              onloaderror: (_, err) => reject(err)
            })
          }),
          new Promise((resolve, reject) => {
            new Howl({
              src: [getAssetPath('/assets/audio/gonzalo.mp3')],
              preload: true,
              onload: () => resolve(),
              onloaderror: (_, err) => reject(err)
            })
          }),
          new Promise((resolve, reject) => {
            new Howl({
              src: [getAssetPath('/assets/audio/motun.mp3')],
              preload: true,
              onload: () => resolve(),
              onloaderror: (_, err) => reject(err)
            })
          }),
          new Promise((resolve, reject) => {
            new Howl({
              src: [getAssetPath('/assets/audio/music.mp3')],
              preload: true,
              onload: () => resolve(),
              onloaderror: (_, err) => reject(err)
            })
          })
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
      <GameScaler 
        $scale={scale} 
        $gameState={gameState}
      >
        {/* Split Suspense boundaries to prioritize menu loading */}
        <Suspense fallback={
          <div style={{
            backgroundImage: `url(${getAssetPath('/assets/images/menu.avif')})`,
            width: '100%',
            height: '100%',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}/>
        }>
          {gameState === GAME_STATES.MENU && <StartMenu />}
        </Suspense>
        <Suspense fallback={<LoadingScreen />}>
          {(gameState === GAME_STATES.PLAYING || gameState === GAME_STATES.GAME_OVER) && (
            <GameArea>
              <Background />
              <NightMode />
              <Moon />
              <Character />
              <Ground />
              <Coin />
              <Obstacle />
            </GameArea>
          )}
          <GameHUD />
          {gameState === GAME_STATES.GAME_OVER && <GameOver />}
        </Suspense>
      </GameScaler>
    </GameContainer>
  )
} 