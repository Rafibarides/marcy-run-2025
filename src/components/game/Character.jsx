import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { useGameLoop } from '../../hooks/useGameLoop'
import { GAME_CONFIG } from '../../utils/constants'
// import { isOnGround } from '../../utils/collision'

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
  const [position, setPosition] = useState({
    y: GAME_CONFIG.GROUND_HEIGHT + GAME_CONFIG.CHARACTER_BASELINE_OFFSET
  })
  const [velocity, setVelocity] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const [canJump, setCanJump] = useState(true)

  useEffect(() => {
    // Change your gravity to a negative value in constants, or just do velocity + a negative
    // E.g., keep GAME_CONFIG.GRAVITY = 0.2, but subtract it from velocity:
    // velocity => velocity - 0.2
    // We'll do that below.
  }, [])

  const updatePhysics = useCallback(() => {
    setPosition(prev => {
      const newY = prev.y + velocity

      // Ground collision if we've dropped below groundHeight
      // Because we are counting up from the bottom, newY <= ground means we've landed
      if (newY <= GAME_CONFIG.GROUND_HEIGHT + GAME_CONFIG.CHARACTER_BASELINE_OFFSET) {
        // If traveling downward, stop the fall
        if (velocity < 0) {
          setVelocity(0)
          setIsJumping(false)
          return {
            y: GAME_CONFIG.GROUND_HEIGHT + GAME_CONFIG.CHARACTER_BASELINE_OFFSET
          }
        }
      }

      // Subtract gravity each update
      setVelocity(prevVel => prevVel - GAME_CONFIG.GRAVITY)

      return { y: newY }
    })
  }, [velocity])

  const jump = useCallback(() => {
    // Use a positive JUMP_FORCE if you want upward movement
    if (!isJumping && canJump) {
      setVelocity(20)  // Example jump force
      setIsJumping(true)
      setCanJump(false)
    }
  }, [isJumping, canJump])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code === 'Space') {
        jump()
      }
    }

    const handleKeyUp = (event) => {
      if (event.code === 'Space') {
        setCanJump(true)
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
          scale: isJumping ? [1, 0.95, 1] : 1,
        }}
        transition={{
          scale: { duration: 0.4 }
        }}
      />
      <CharacterSprite
        src={`/public/assets/images/${selectedCharacter}.png`}
        alt="character"
        $y={position.y}
        animate={{
          scale: isJumping ? [1, 0.95, 1] : 1,
          rotate: isJumping ? [-2, 2] : 0
        }}
        transition={{
          scale: {
            duration: 0.5,
            ease: 'easeInOut'
          },
          rotate: {
            duration: 0.5,
            repeat: isJumping ? Infinity : 0,
            repeatType: 'reverse'
          }
        }}
      />
    </>
  )
}


