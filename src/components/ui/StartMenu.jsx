import { useEffect, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { GAME_STATES, CHARACTERS } from '../../utils/constants'
import { motion } from 'framer-motion'
import { Howl } from 'howler'
import { getAssetPath } from '../../utils/assetPath'
import { GAME_CONFIG } from '../../utils/constants'

// Extract critical styles to reduce style calculation time
const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background-image: url(${props => props.style?.backgroundImage});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`

// Add a new overlay container for the dark semi-transparent effect if needed
const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`

// Optimize content wrapper performance
const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  width: ${GAME_CONFIG.VIEWPORT.WIDTH}px;
  height: ${GAME_CONFIG.VIEWPORT.HEIGHT}px;
  /* Add containment for better performance */
  contain: layout style;
  ${props => props.$isMobile && `
    width: 100%;
    height: 100%;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    padding: 4rem 2rem;
    max-width: 100vw;
    overflow: hidden;
  `}
`

const Logo = styled.img`
  width: ${props => props.$isMobile ? '100px' : '300px'};
  height: auto;
  aspect-ratio: 1652/836;  /* Based on the original logo dimensions (1652x836) */
  ${props => props.$isMobile && `
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
  `}
`

const StartPrompt = styled.div`
  font-family: 'Kid Games', sans-serif;
  font-size: ${props => props.$isMobile ? '1.5rem' : '2rem'};
  text-align: center;
  animation: pulse 1.5s infinite;
  ${props => props.$isMobile && `
    flex: 1;
    max-width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 10;
    pointer-events: auto;
  `}

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
  width: ${props => props.$isMobile ? '350px' : '500px'};
  height: ${props => props.$isMobile ? '300px' : '350px'};
  position: relative;
  gap: 0;
`

const Character = styled(motion.img)`
  width: ${props => props.$isMobile ? '100px' : '175px'};
  height: ${props => props.$isMobile ? '100px' : '175px'};
  max-width: ${props => props.$isMobile ? '100px' : '175px'};
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  ${props => props.$isMobile && `
    transform: scale(0.8);
  `}
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
  img {
    width: ${props => props.$isMobile ? '20px' : '25px'};
    height: ${props => props.$isMobile ? '20px' : '25px'};
  }
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`

const CHARACTER_COSTS = {
  [CHARACTERS.GONZALO]: 500,
  [CHARACTERS.MOTUN]: 1000
}

// Replace the old map of raw file paths with Howl instances:
const characterAudioMap = {
  [CHARACTERS.BEN]: new Howl({ 
    src: [getAssetPath('/assets/audio/ben.mp3')], 
    volume: 0.3 
  }),
  [CHARACTERS.GONZALO]: new Howl({ 
    src: [getAssetPath('/assets/audio/gonzalo.mp3')], 
    volume: 0.3 
  }),
  [CHARACTERS.MOTUN]: new Howl({ 
    src: [getAssetPath('/assets/audio/motun.mp3')], 
    volume: 0.3 
  })
}

// Update GameAreaWrapper to be centered absolutely
const GameAreaWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default function StartMenu() {
  const [scale, setScale] = useState(1)
  
  // Add scaling calculation effect
  useEffect(() => {
    const updateScale = () => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const windowRatio = windowWidth / windowHeight
      const gameRatio = GAME_CONFIG.VIEWPORT.WIDTH / GAME_CONFIG.VIEWPORT.HEIGHT

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

  // Basic check for mobile devices
  const isMobile = useMemo(
    () => /Mobi|Android/i.test(navigator.userAgent),
    []
  )

  const {
    setGameState,
    selectedCharacter, setSelectedCharacter,
    setScore,
    coins, setCoins,
    unlockedCharacters, setUnlockedCharacters
  } = useGame()

  const characters = Object.values(CHARACTERS)
  const selectedIndex = characters.indexOf(selectedCharacter)

  const handleSelectCharacter = useCallback((character) => {
    setSelectedCharacter(character)
    const sound = characterAudioMap[character]
    if (sound) {
      sound.play()
    }
  }, [setSelectedCharacter])

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

      handleSelectCharacter(charArray[currentIndex])
    }
  }, [
    selectedCharacter,
    unlockedCharacters,
    setScore,
    setGameState,
    handleSelectCharacter
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

  const handleMobileTap = () => {
    if (unlockedCharacters.includes(selectedCharacter)) {
      setScore(0)
      setGameState(GAME_STATES.PLAYING)
    } else {
      alert("This character is locked. Unlock it first!")
    }
  }

  // Add event listener for space key
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  return (
    <MenuContainer
      style={{ backgroundImage: `url(${getAssetPath('/assets/images/menu.avif')})` }}
    >
      <Overlay>
        <GameAreaWrapper $scale={scale}>
          <ContentWrapper $isMobile={isMobile}>
            <Logo 
              src={getAssetPath('/assets/images/logo.avif')} 
              alt="Marcy Run" 
              $isMobile={isMobile}
              width={isMobile ? "100" : "300"}
              height={isMobile ? "51" : "152"}
            />
            <CharacterSelect $isMobile={isMobile}>
              {characters.map((character, index) => {
                const locked = !unlockedCharacters.includes(character)
                const cost = CHARACTER_COSTS[character] || 0

                const difference = index - selectedIndex
                const xOffset = difference * (isMobile ? 100 : 180)
                const scale = difference === 0 ? 1.1 : 0.75
                const opacity = difference === 0 ? 1 : 0.5

                return (
                  <motion.div
                    key={character}
                    style={{ position: 'absolute' }}
                    onClick={() => handleSelectCharacter(character)}
                    animate={{
                      x: xOffset,
                      scale,
                      opacity,
                      rotateY: difference * 10
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 80,
                      damping: 10
                    }}
                    whileHover={{
                      cursor: locked ? 'default' : 'pointer',
                      scale: locked ? scale : 1.1
                    }}
                  >
                    <CharacterWrapper>
                      <Character
                        src={getAssetPath(`/assets/images/${character}.avif`)}
                        alt={character}
                        $selected={selectedCharacter === character}
                        $isMobile={isMobile}
                      />
                      {locked && (
                        <LockOverlay
                          src={getAssetPath('/assets/images/lock.avif')}
                          alt="locked"
                        />
                      )}
                    </CharacterWrapper>
                    {locked && (
                      <UnlockInfo $isMobile={isMobile}>
                        <CostDisplay>
                          {cost} <img src={getAssetPath('/assets/images/coin.avif')} alt="marcy-coins" />
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
            <StartPrompt 
              $isMobile={isMobile}
              onClick={isMobile ? handleMobileTap : undefined}
            >
              {isMobile ? 'TAP TO START GAME' : 'HIT SPACE TO START GAME'}
              {unlockedCharacters.includes(selectedCharacter) ? '' : ' (LOCKED)'}
            </StartPrompt>
          </ContentWrapper>
        </GameAreaWrapper>
      </Overlay>
    </MenuContainer>
  )
}
