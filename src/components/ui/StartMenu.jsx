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
  justify-content: center;
  align-items: center;
  overflow-x: hidden;
  overflow-y: visible;
  width: 500px;
  height: 350px;
  position: relative;
  gap: 0;
`

const Character = styled(motion.img)`
  width: 175px;
  height: 175px;
  max-width: 175px;
  cursor: pointer;
  border: 3px solid ${props => props.$selected ? '#646cff' : 'transparent'};
  border-radius: 10px;
  transition: border-color 0.2s;
  object-fit: contain;

  &:hover {
    transform: scale(1.1);
  }
`

const UnlockInfo = styled.div`
  font-family: 'Poxel Font', sans-serif;
  color: white;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
`

const UnlockButton = styled.button`
  font-family: 'Poxel Font', sans-serif;
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #45a049;
  }
`

const CostDisplay = styled.span`
  color: #FFD700;  // Gold/yellow color
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const LockOverlay = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  opacity: 0.6;
  pointer-events: none;
`

const CharacterWrapper = styled.div`
  position: relative;
  display: inline-block;
`

const CHARACTER_COSTS = {
  [CHARACTERS.GONZALO]: 500,
  [CHARACTERS.MOTUN]: 1000
}

export default function StartMenu() {
  const {
    setGameState,
    selectedCharacter, setSelectedCharacter,
    setScore,
    coins, setCoins,
    unlockedCharacters, setUnlockedCharacters
  } = useGame()

  const characters = Object.values(CHARACTERS)
  const selectedIndex = characters.indexOf(selectedCharacter)

  const handleKeyPress = useCallback((event) => {
    if (event.code === 'Space') {
      if (unlockedCharacters.includes(selectedCharacter)) {
        setScore(0)
        setGameState(GAME_STATES.PLAYING)
      } else {
        alert("This character is locked. Unlock it first!")
      }
    } else if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      const charArray = Object.values(CHARACTERS)
      let currentIndex = charArray.indexOf(selectedCharacter)

      if (event.code === 'ArrowLeft') {
        currentIndex = (currentIndex - 1 + charArray.length) % charArray.length
      } else {
        currentIndex = (currentIndex + 1) % charArray.length
      }

      setSelectedCharacter(charArray[currentIndex])
    }
  }, [
    selectedCharacter,
    unlockedCharacters,
    setScore,
    setGameState,
    setSelectedCharacter
  ])

  const handleUnlock = (character) => {
    const cost = CHARACTER_COSTS[character] || 0
    if (coins >= cost) {
      setCoins(coins - cost)
      setUnlockedCharacters([...unlockedCharacters, character])
      setSelectedCharacter(character) // Optionally auto-select the newly unlocked character
    } else {
      // Handle case where user does not have enough coins, e.g., show a warning
      alert(`Not enough coins for ${character}. You need ${cost} coins.`)
    }
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
          {characters.map((character, index) => {
            const locked = !unlockedCharacters.includes(character)
            const cost = CHARACTER_COSTS[character] || 0

            // Calculate how far this character is from the selected character
            const difference = index - selectedIndex

            // Fine-tune distance, scale, and opacity
            const xOffset = difference * 180
            const scale = difference === 0 ? 1.1 : 0.75
            const opacity = difference === 0 ? 1 : 0.5

            return (
              <motion.div
                key={character}
                style={{ position: 'absolute' }}
                onClick={() => setSelectedCharacter(character)}
                animate={{
                  x: xOffset,
                  scale,
                  opacity,
                  rotateY: difference * 10 // a subtle "rolodex" tilt
                }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 10
                }}
                whileHover={{
                  cursor: locked ? 'default' : 'pointer',
                  // Slightly enlarge if not locked
                  scale: locked ? scale : 1.1
                }}
              >
                <CharacterWrapper>
                  <Character
                    src={`/assets/images/${character}.png`}
                    alt={character}
                    $selected={selectedCharacter === character}
                  />
                  {locked && (
                    <LockOverlay
                      src="/assets/images/lock.png"
                      alt="locked"
                    />
                  )}
                </CharacterWrapper>
                {locked && (
                  <UnlockInfo>
                    <CostDisplay>
                      {cost} <img src="/assets/images/coin.png" alt="coins" style={{width: '25px', height: '25px'}} />
                    </CostDisplay>
                    <UnlockButton onClick={() => handleUnlock(character)}>
                      PURCHASE
                    </UnlockButton>
                  </UnlockInfo>
                )}
              </motion.div>
            )
          })}
        </CharacterSelect>
        <StartPrompt>
          HIT SPACE TO START GAME
          {unlockedCharacters.includes(selectedCharacter) ? '' : ' (LOCKED)'}
        </StartPrompt>
      </ContentWrapper>
    </MenuContainer>
  )
}
