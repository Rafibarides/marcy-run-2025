import styled from 'styled-components'
import { useRef, useCallback } from 'react'
import { useGameLoop } from '../../hooks/useGameLoop'
import { GAME_CONFIG } from '../../utils/constants'
import { getAssetPath } from '../../utils/assetPath'

// Original image dimensions from roadmap
const GROUND_IMAGE_WIDTH = 8647
const GROUND_IMAGE_HEIGHT = 691
const VIEWPORT_WIDTH = GAME_CONFIG.VIEWPORT.WIDTH

// Calculate the scaled width while maintaining aspect ratio
const SCALE_FACTOR = GAME_CONFIG.GROUND_HEIGHT / GROUND_IMAGE_HEIGHT
const SCALED_GROUND_WIDTH = GROUND_IMAGE_WIDTH * SCALE_FACTOR

const GroundContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: ${VIEWPORT_WIDTH}px;
  height: ${GAME_CONFIG.GROUND_HEIGHT}px;
  overflow: hidden;
  z-index: 3;
`

const GroundImage = styled.div`
  position: absolute;
  bottom: 0;
  height: 100%;
  /* Use scaled width × 2 for perfect tiling while maintaining aspect ratio */
  width: ${SCALED_GROUND_WIDTH * 2}px;
  background-image: url(${getAssetPath('/assets/images/ground.png')});
  background-repeat: repeat-x;
  /* Use cover to maintain aspect ratio */
  background-size: ${SCALED_GROUND_WIDTH}px 100%;
  transform: translateX(${props => props.$offset}px);
`

export default function Ground() {
  const offsetRef = useRef(0)
  const groundRef = useRef(null)

  const scroll = useCallback(() => {
    offsetRef.current -= GAME_CONFIG.GAME_SPEED
    
    // Reset when we've scrolled exactly one scaled ground image width
    if (offsetRef.current <= -SCALED_GROUND_WIDTH) {
      offsetRef.current += SCALED_GROUND_WIDTH
    }
    
    groundRef.current.style.transform = `translateX(${offsetRef.current}px)`
  }, [])

  useGameLoop(scroll)

  return (
    <GroundContainer>
      <GroundImage ref={groundRef} $offset={0} />
    </GroundContainer>
  )
}
