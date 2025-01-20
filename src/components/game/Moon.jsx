import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'

const MoonSprite = styled.img`
  position: fixed;
  width: 70px;
  height: 70px;
  top: 15%;
  right: 15%;
  z-index: 9999;
  mix-blend-mode: normal;
  opacity: ${props => props.$isNightMode ? 1 : 0.1};
  transition: opacity 0.3s ease;
`

export default function Moon() {
  const { isNightMode } = useGame()
  return (
    <MoonSprite
      src="public/assets/images/moon.png"
      alt="moon"
      $isNightMode={isNightMode}
    />
  )
} 