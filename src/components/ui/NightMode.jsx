import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { useEffect, useCallback } from 'react'

const NightModeOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #1c0078;
  mix-blend-mode: hard-light;
  isolation: isolate;
  pointer-events: none;
  z-index: 5;
  opacity: ${props => props.$isActive ? 0.7 : 0};
  transition: opacity 0.3s ease;
`

const NightModeButton = styled.button`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${props => props.$isNightMode ? '#1c0078' : '#f9f9f9'};
  color: ${props => props.$isNightMode ? '#fff' : '#000'};
  border: 2px solid ${props => props.$isNightMode ? '#fff' : '#000'};
  padding: 8px 16px;
  font-family: 'Poxel Font', sans-serif;
  cursor: pointer;
  z-index: 999;
  transition: all 0.3s ease;
  pointer-events: all;

  &:hover {
    transform: translateX(-50%) scale(1.1);
  }
`

export default function NightMode() {
  const { isNightMode, setIsNightMode } = useGame()

  const toggleNightMode = useCallback(() => {
    setIsNightMode(prev => !prev)
  }, [setIsNightMode])

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key.toLowerCase() === 'n') {
        toggleNightMode()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [toggleNightMode])

  return (
    <>
      <NightModeButton 
        onClick={(e) => {
          e.stopPropagation()
          toggleNightMode()
        }}
        $isNightMode={isNightMode}
      >
        {isNightMode ? 'DAY MODE' : 'NIGHT MODE'}
      </NightModeButton>
      <NightModeOverlay $isActive={isNightMode} />
    </>
  )
} 