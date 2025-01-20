import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { useGameLoop } from '../../hooks/useGameLoop'
import { GAME_CONFIG } from '../../utils/constants'
import { getAssetPath } from '../../utils/assetPath'
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

  const updatePhysics = useCallback((dt) => {
    setPosition(prev => {
      const newY = prev.y + velocity * dt

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
      setVelocity(prevVel => prevVel - GAME_CONFIG.GRAVITY * dt)

      return { y: newY }
    })
  }, [velocity])

  const jump = useCallback(() => {
    // Use a smaller jump force for a lower peak
    if (!isJumping && canJump) {
      setVelocity(20)  // Reduced from 22 to make jump height more consistent
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

    const handleMouseDown = () => {
      jump()
    }

    const handleMouseUp = () => {
      setCanJump(true)
    }

    // Add both keyboard and mouse event listeners
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [jump])

  useGameLoop(updatePhysics)

  useEffect(() => {
    setCharacterY(position.y)
  }, [position.y, setCharacterY])

  const spritePath = getAssetPath(`/assets/images/${selectedCharacter}.avif`)

  return (
    <>
      <DebugBox
        $y={position.y}
        animate={{
          scale: isJumping ? [1, 0.95, 1] : 1,
          y: isJumping ? 0 : [0, -2, 0],
          rotate: isJumping ? [-2, 2] : [-1, 1],
        }}
        transition={{
          scale: {
            type: 'spring',
            stiffness: 100,
            damping: 8,
          },
          y: {
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          },
          rotate: {
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
      />
      <CharacterSprite
        src={spritePath}
        alt="character"
        $y={position.y}
        animate={{
          scale: isJumping ? [1, 0.95, 1] : 1,
          y: isJumping ? 0 : [0, -2, 0],
          rotate: isJumping ? [-2, 2] : [-1, 1],
        }}
        transition={{
          scale: {
            type: 'spring',
            stiffness: 100,
            damping: 8,
          },
          y: {
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          },
          rotate: {
            duration: 0.6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }
        }}
      />
    </>
  )
}


