import { useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { GAME_STATES, CHARACTERS } from '../../utils/constants'

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 2rem;
`

const Logo = styled.img`
  width: 300px;
  height: auto;
`

const StartPrompt = styled.div`
  font-family: 'Kid Games', sans-serif;
  font-size: 2rem;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`

const CharacterSelect = styled.div`
  display: flex;
  gap: 2rem;
`

const Character = styled.img`
  width: auto;
  height: 100px;
  cursor: pointer;
  border: 3px solid ${props => props.$selected ? '#646cff' : 'transparent'};
  border-radius: 10px;
  transition: transform 0.2s;
  object-fit: contain;
  max-width: 100px;

  &:hover {
    transform: scale(1.1);
  }
`

export default function StartMenu() {
  const { setGameState, selectedCharacter, setSelectedCharacter, setScore } = useGame()

  const handleKeyPress = useCallback((event) => {
    if (event.code === 'Space') {
      setScore(0)
      setGameState(GAME_STATES.PLAYING)
    }
  }, [setGameState, setScore])

  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character)
  }

  // Add event listener for space key
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return (
    <MenuContainer>
      <Logo src="/public/assets/images/logo.png" alt="Marcy Run" />
      <CharacterSelect>
        {Object.values(CHARACTERS).map(character => (
          <Character
            key={character}
            src={`/public/assets/images/${character}.png`}
            alt={character}
            $selected={selectedCharacter === character}
            onClick={() => handleCharacterSelect(character)}
          />
        ))}
      </CharacterSelect>
      <StartPrompt>HIT SPACE TO START GAME</StartPrompt>
    </MenuContainer>
  )
}
