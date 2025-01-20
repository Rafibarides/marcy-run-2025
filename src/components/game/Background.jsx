import styled from 'styled-components'
import { useRef, useCallback } from 'react'
import { useGameLoop } from '../../hooks/useGameLoop'
import { GAME_CONFIG } from '../../utils/constants'
import { useGame } from '../../hooks/useGame'

// Original image dimensions from roadmap
const BG_IMAGE_WIDTH = 4500
const BG_IMAGE_HEIGHT = 1201
const VIEWPORT_WIDTH = GAME_CONFIG.VIEWPORT.WIDTH
const VIEWPORT_HEIGHT = GAME_CONFIG.VIEWPORT.HEIGHT

// Calculate the scaled width while maintaining aspect ratio
const SCALE_FACTOR = VIEWPORT_HEIGHT / BG_IMAGE_HEIGHT
const SCALED_BG_WIDTH = BG_IMAGE_WIDTH * SCALE_FACTOR

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${VIEWPORT_WIDTH}px;
  height: ${VIEWPORT_HEIGHT}px;
  overflow: hidden;
  z-index: 1;
`

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  /* Use scaled width × 2 for perfect tiling while maintaining aspect ratio */
  width: ${SCALED_BG_WIDTH * 2}px;
  background-image: url(${props => props.$isNightMode ? '/assets/images/background-night.jpg' : '/assets/images/background.jpg'});
  background-repeat: repeat-x;
  /* Use exact sizing to maintain aspect ratio */
  background-size: ${SCALED_BG_WIDTH}px 100%;
  transform: translateX(${props => props.$offset}px);
`

const Moon = styled.img`
  position: fixed;
  width: 70px;
  height: 70px;
  top: 15%;
  right: 15%;
  z-index: 9999;
  mix-blend-mode: normal;
  opacity: ${props => props.$isNightMode ? 1 : 0.05};
  transition: opacity 0.3s ease;
`

export default function Background() {
  const offsetRef = useRef(0)
  const backgroundRef = useRef(null)
  const { isNightMode } = useGame()

  const scroll = useCallback(() => {
    offsetRef.current -= GAME_CONFIG.BACKGROUND_SPEED
    
    // Reset when we've scrolled exactly one scaled background image width
    if (offsetRef.current <= -SCALED_BG_WIDTH) {
      offsetRef.current += SCALED_BG_WIDTH
    }
    
    backgroundRef.current.style.transform = `translateX(${offsetRef.current}px)`
  }, [])

  useGameLoop(scroll)

  return (
    <BackgroundContainer>
      <BackgroundImage 
        ref={backgroundRef} 
        $offset={0} 
        $isNightMode={isNightMode} 
      />
      <Moon 
        src="/assets/images/moon.png" 
        alt="moon" 
        $isNightMode={isNightMode}
      />
    </BackgroundContainer>
  )
}
