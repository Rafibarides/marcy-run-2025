import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { useGameLoop } from '../../hooks/useGameLoop'
import { GAME_CONFIG } from '../../utils/constants'
import { isOnGround } from '../../utils/collision'

const CharacterSprite = styled(motion.img).attrs(props => ({
  style: {
    bottom: `${props.$y}px`
  }
}))`
  position: absolute;
  width: auto;
  height: ${GAME_CONFIG.CHARACTER_SIZE.HEIGHT}px;
  left: 50px;
  z-index: 4;
  object-fit: contain;
  max-width: ${GAME_CONFIG.CHARACTER_SIZE.WIDTH}px;
`

const DebugBox = styled(motion.div).attrs(props => ({
  style: {
    bottom: `${props.$y}px`
  }
}))`
  position: absolute;
  border: 2px solid red;
  background-color: rgba(255, 0, 0, 0);
  pointer-events: none;
  width: ${GAME_CONFIG.CHARACTER_SIZE.WIDTH}px;
  height: ${GAME_CONFIG.CHARACTER_SIZE.HEIGHT}px;
  left: 50px;
  z-index: 5;
  opacity: 0;
`

export default function Character() {
  const { selectedCharacter, setCharacterY } = useGame()
  const [position, setPosition] = useState({ y: GAME_CONFIG.GROUND_HEIGHT + GAME_CONFIG.CHARACTER_BASELINE_OFFSET })
  const [velocity, setVelocity] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const [isSpacePressed, setIsSpacePressed] = useState(false)

  const updatePhysics = useCallback(() => {
    setPosition(prev => {
      const newY = prev.y + velocity
      
      // Ground collision check
      if (isOnGround({ y: newY, height: GAME_CONFIG.CHARACTER_SIZE.HEIGHT }, GAME_CONFIG.GROUND_HEIGHT)) {
        if (velocity >= 0) {
          setVelocity(0)
          setIsJumping(false)
          return { y: GAME_CONFIG.GROUND_HEIGHT + GAME_CONFIG.CHARACTER_BASELINE_OFFSET }
        }
      }
      
      // Apply gravity, but not if space is held and we're below max height
      const maxHeight = GAME_CONFIG.GROUND_HEIGHT + GAME_CONFIG.JUMP_HEIGHT
      if (isSpacePressed && newY < maxHeight && velocity > -2) {
        setVelocity(-2) // Maintain small upward velocity for floating
      } else {
        setVelocity(prev => prev + GAME_CONFIG.GRAVITY)
      }
      
      return { y: Math.max(newY, GAME_CONFIG.GROUND_HEIGHT + 100 ) }
    })
  }, [velocity, isSpacePressed])

  const jump = useCallback(() => {
    if (!isJumping) {
      setVelocity(GAME_CONFIG.JUMP_FORCE)
      setIsJumping(true)
    }
  }, [isJumping])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        setIsSpacePressed(true)
        jump()
      }
    }

    const handleKeyUp = (event) => {
      if (event.code === 'Space') {
        setIsSpacePressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [jump])

  useGameLoop(updatePhysics)

  useEffect(() => {
    setCharacterY(position.y)
  }, [position.y, setCharacterY])

  return (
    <>
      <DebugBox
        $y={position.y}
        animate={{
          y: isJumping ? [-200, 0] : 0,
          scale: isJumping ? [1, 0.95, 1] : 1
        }}
        transition={{
          y: {
            type: "spring",
            stiffness: 200,
            damping: 30,
            mass: 4
          },
          scale: {
            duration: 0.4
          }
        }}
      />
      <CharacterSprite
        src={`/public/assets/images/${selectedCharacter}.png`}
        alt="character"
        $y={position.y}
        animate={{
          y: isJumping ? [-200, 0] : 0,
          scale: isJumping ? [1, 0.95, 1] : 1,
          rotate: isJumping ? [-2, 2] : 0
        }}
        transition={{
          y: {
            type: "spring",
            stiffness: 200,
            damping: 30,
            mass: 4
          },
          scale: {
            duration: 0.4,
            ease: "easeInOut"
          },
          rotate: {
            duration: 0.5,
            repeat: isJumping ? Infinity : 0,
            repeatType: "reverse"
          }
        }}
      />
    </>
  )
}


