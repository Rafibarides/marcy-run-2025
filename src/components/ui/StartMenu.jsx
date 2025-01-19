import { useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { GAME_STATES, CHARACTERS } from '../../utils/constants'
import { motion } from 'framer-motion'

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 2rem;
  background-image: url('/assets/images/menu.png');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  z-index: 2;
  opacity: 1;
  visibility: visible;
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
  justify-content: center;
  align-items: center;
`

const Character = styled(motion.img)`
  width: 200px;
  height: 200px;
  max-width: 200px;
  cursor: pointer;
  border: 3px solid ${props => props.$selected ? '#646cff' : 'transparent'};
  border-radius: 10px;
  transition: border-color 0.2s;
  object-fit: contain;

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
    } else if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      const characters = Object.values(CHARACTERS)
      const currentIndex = characters.indexOf(selectedCharacter)
      let newIndex

      if (event.code === 'ArrowLeft') {
        // Move left, wrap around to end if at start
        newIndex = currentIndex <= 0 ? characters.length - 1 : currentIndex - 1
      } else {
        // Move right, wrap around to start if at end
        newIndex = currentIndex >= characters.length - 1 ? 0 : currentIndex + 1
      }

      setSelectedCharacter(characters[newIndex])
    }
  }, [setGameState, setScore, selectedCharacter, setSelectedCharacter])

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
      <ContentWrapper>
        <Logo src="/assets/images/logo.png" alt="Marcy Run" />
        <CharacterSelect>
          {Object.values(CHARACTERS).map(character => (
            <Character
              key={character}
              src={`/assets/images/${character}.png`}
              alt={character}
              $selected={selectedCharacter === character}
              onClick={() => handleCharacterSelect(character)}
              animate={selectedCharacter === character ? {
                scale: [1, 1.05, 1],
                rotate: [-2, 2, 0],
                transition: {
                  duration: 0.3,
                  ease: "easeOut",
                  times: [0, 0.5, 1]
                }
              } : {
                scale: 1,
                rotate: 0
              }}
              whileHover={{
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            />
          ))}
        </CharacterSelect>
        <StartPrompt>HIT SPACE TO START GAME</StartPrompt>
      </ContentWrapper>
    </MenuContainer>
  )
}
