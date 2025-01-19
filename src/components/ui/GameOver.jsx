import { useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { GAME_STATES } from '../../utils/constants'

const GameOverContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 2rem;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`

const GameOverText = styled.h1`
  font-family: 'Kid Games', sans-serif;
  font-size: 4rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
`

const FinalScore = styled.div`
  font-family: 'Poxel Font', sans-serif;
  font-size: 2rem;
  color: gold;
`

const RestartPrompt = styled.div`
  font-family: 'Kid Games', sans-serif;
  font-size: 1.5rem;
  color: white;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`

export default function GameOver() {
  const { setGameState, coins, setCoins, setScore } = useGame()

  const handleKeyPress = useCallback((event) => {
    if (event.code === 'Space') {
      // Reset all game state
      setCoins(0)
      setScore(0)
      
      // Force a re-render of game components by changing state to MENU briefly
      setGameState(GAME_STATES.MENU)
      
      // Small timeout to ensure clean reset
      setTimeout(() => {
        setGameState(GAME_STATES.PLAYING)
      }, 0)
    }
  }, [setGameState, setCoins, setScore])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return (
    <GameOverContainer>
      <GameOverText>GAME OVER</GameOverText>
      <FinalScore>Final Score: {coins} coins</FinalScore>
      <RestartPrompt>PLAY AGAIN</RestartPrompt>
    </GameOverContainer>
  )
}
