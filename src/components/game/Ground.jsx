import styled from 'styled-components'
import { useRef, useCallback } from 'react'
import { useGameLoop } from '../../hooks/useGameLoop'
import { GAME_CONFIG } from '../../utils/constants'

const GroundContainer = styled.div`
  position: absolute;
  bottom: 0;
  width: ${GAME_CONFIG.VIEWPORT.WIDTH}px;
  height: ${GAME_CONFIG.GROUND_HEIGHT}px;
  overflow: hidden;
  z-index: 3;
`

const GroundImage = styled.div`
  position: absolute;
  bottom: 0;
  height: 100%;
  width: 200%;
  background-image: url('/public/assets/images/ground.png');
  background-repeat: repeat-x;
  background-size: auto 100%;
  transform: translateX(${props => props.$offset}px);
`

export default function Ground() {
  const offsetRef = useRef(0)
  const groundRef = useRef(null)

  const scroll = useCallback(() => {
    offsetRef.current -= GAME_CONFIG.GAME_SPEED
    // Reset position when ground has scrolled half its width
    if (offsetRef.current <= -groundRef.current.offsetWidth / 2) {
      offsetRef.current = 0
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
