import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { useEffect } from 'react'
import { GAME_STATES } from '../../utils/constants'

const HUDContainer = styled.div`
  position: fixed;
  top: 20px;
  width: 100%;
  padding: 0 40px;
  z-index: 11;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
`

const GameText = styled.div`
  font-family: 'Poxel Font', sans-serif;
  font-size: 24px;
  color: white;
`

export default function GameHUD() {
  const { coins, score, setScore, gameState } = useGame()

  // Update score based on time
  useEffect(() => {
    let scoreInterval
    if (gameState === GAME_STATES.PLAYING) {
      scoreInterval = setInterval(() => {
        setScore(prevScore => prevScore + 1)
      }, 100) // Increment score every 100ms
    }
    return () => clearInterval(scoreInterval)
  }, [gameState, setScore])

  return (
    <HUDContainer>
      <GameText>Coins: {coins}</GameText>
      <GameText>Score: {score}</GameText>
    </HUDContainer>
  )
} 