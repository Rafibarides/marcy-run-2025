import styled from 'styled-components'
import { useRef, useCallback } from 'react'
import { useGameLoop } from '../../hooks/useGameLoop'
import { GAME_CONFIG } from '../../utils/constants'

const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: ${GAME_CONFIG.VIEWPORT.WIDTH}px;
  height: ${GAME_CONFIG.VIEWPORT.HEIGHT}px;
  overflow: hidden;
  z-index: 1;
`

const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  width: 200%;
  background-image: url('/public/assets/images/background.jpg');
  background-repeat: repeat-x;
  background-size: contain;
  transform: translateX(${props => props.$offset}px);
`

const Moon = styled.img`
  position: absolute;
  width: 40px;
  height: 40px;
  top: 15%;
  right: 15%;
  z-index: 2;
  opacity: 0;
`

export default function Background() {
  const offsetRef = useRef(0)
  const backgroundRef = useRef(null)

  const scroll = useCallback(() => {
    offsetRef.current -= GAME_CONFIG.BACKGROUND_SPEED
    if (offsetRef.current <= -backgroundRef.current.offsetWidth / 2) {
      offsetRef.current = 0
    }
    backgroundRef.current.style.transform = `translateX(${offsetRef.current}px)`
  }, [])

  useGameLoop(scroll)

  return (
    <BackgroundContainer>
      <BackgroundImage ref={backgroundRef} $offset={0} />
      <Moon src="/public/assets/images/moon.png" alt="moon" />
    </BackgroundContainer>
  )
}
