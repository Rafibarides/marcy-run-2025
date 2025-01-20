import { useEffect, useCallback, useState, useMemo } from 'react'
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
  font-family: 'Poxel Font', sans-serif;
  font-size: 1.5rem;
  color: white;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`

const RestartPromptKid = styled.div`
  font-family: 'Kid Games', sans-serif;
  font-size: 2rem;
  text-align: center;
  ${props => props.$isMobile && `
    position: relative;
    z-index: 10;
    pointer-events: auto;
  `}
`

const MainMenuButton = styled.button`
  font-family: 'Kid Games', sans-serif;
  font-size: 1.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  background-color: #646cff;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  z-index: 1001;

  &:hover {
    background-color: #535bf2;
  }
`

export default function GameOver() {
  const isMobile = useMemo(() => /Mobi|Android/i.test(navigator.userAgent), [])
  const { setGameState, coins, setScore } = useGame()

  const [countdown, setCountdown] = useState(3)
  const [allowRestart, setAllowRestart] = useState(false)

  useEffect(() => {
    setCountdown(3)
    setAllowRestart(false)

    const intervalId = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(intervalId)
          setAllowRestart(true)
          return 0
        }
        return prevCount - 1
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  const handleMainMenu = useCallback(() => {
    // Reset score, but don't reset coins
    setScore(0)
    setGameState(GAME_STATES.MENU)
  }, [setScore, setGameState])

  const handleKeyPress = useCallback((event) => {
    if (!allowRestart) return
    if (event.code === 'Space') {
      // FULL RESTART LOGIC
      setScore(0)
      // Force a brief return to MENU
      setGameState(GAME_STATES.MENU)
      // Then set to PLAYING to start fresh
      setTimeout(() => {
        setGameState(GAME_STATES.PLAYING)
      }, 0)
    }
  }, [allowRestart, setScore, setGameState])

  const handleMobileTap = useCallback(() => {
    if (!allowRestart) return
    setScore(0)
    setGameState(GAME_STATES.MENU)
    setTimeout(() => {
      setGameState(GAME_STATES.PLAYING)
    }, 0)
  }, [allowRestart, setScore, setGameState])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return (
    <GameOverContainer onClick={isMobile ? handleMobileTap : undefined}>
      <GameOverText>GAME OVER</GameOverText>
      <FinalScore>{coins} coins</FinalScore>
      {allowRestart ? (
        <RestartPromptKid 
          $isMobile={isMobile}
          onClick={isMobile ? (e) => {
            e.stopPropagation();
            handleMobileTap();
          } : undefined}
        >
          {isMobile ? 'TAP TO PLAY AGAIN' : 'PRESS SPACE TO PLAY AGAIN'}
        </RestartPromptKid>
      ) : (
        <RestartPrompt>{countdown}</RestartPrompt>
      )}
      <MainMenuButton 
        onClick={(e) => {
          e.stopPropagation();
          handleMainMenu();
        }}
      >
        MAIN MENU
      </MainMenuButton>
    </GameOverContainer>
  )
}
