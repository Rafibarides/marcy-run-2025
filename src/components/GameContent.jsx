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

export function GameContent() {
  const { gameState } = useGame()
  const [scale, setScale] = useState(1)

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

  return (
    <GameContainer>
      <GameScaler $scale={scale}>
        {gameState === GAME_STATES.MENU && <StartMenu />}
        {gameState === GAME_STATES.PLAYING && (
          <GameArea>
            <Background />
            <Character />
            <Coin />
            <Obstacle />
            <Ground />
            <GameHUD />
          </GameArea>
        )}
        {gameState === GAME_STATES.GAME_OVER && <GameOver />}
      </GameScaler>
    </GameContainer>
  )
} 