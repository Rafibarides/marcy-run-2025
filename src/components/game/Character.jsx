import { motion } from 'framer-motion'
import { useState, useEffect, useCallback, useRef } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { useGameLoop } from '../../hooks/useGameLoop'
import { GAME_CONFIG } from '../../utils/constants'
import { isOnGround } from '../../utils/collision'

const CharacterSprite = styled(motion.img)`
  position: absolute;
  width: ${GAME_CONFIG.CHARACTER_SIZE.WIDTH}px;
  height: ${GAME_CONFIG.CHARACTER_SIZE.HEIGHT}px;
  left: 50px;
  bottom: ${props => props.$y - 70}px;
  z-index: 4;
`

export default function Character() {
  const { selectedCharacter, setCharacterY } = useGame()
  const [position, setPosition] = useState({ y: GAME_CONFIG.GROUND_HEIGHT })
  const [velocity, setVelocity] = useState(0)
  const [isJumping, setIsJumping] = useState(false)
  const initialYRef = useRef(GAME_CONFIG.GROUND_HEIGHT)

  const updatePhysics = useCallback(() => {
    setPosition(prev => {
      const newY = prev.y + velocity
      
      // Check if we've reached max jump height
      const jumpHeight = initialYRef.current - newY
      if (jumpHeight >= GAME_CONFIG.JUMP_HEIGHT && velocity < 0) {
        setVelocity(0)
        return prev
      }

      // Ground collision check
      if (isOnGround({ y: newY, height: GAME_CONFIG.CHARACTER_SIZE.HEIGHT }, GAME_CONFIG.GROUND_HEIGHT)) {
        if (velocity >= 0) {
          setVelocity(0)
          setIsJumping(false)
          return { y: GAME_CONFIG.GROUND_HEIGHT }
        }
      }
      
      setVelocity(prev => prev + GAME_CONFIG.GRAVITY)
      const finalY = Math.max(newY, GAME_CONFIG.GROUND_HEIGHT)
      // Update global characterY whenever position changes
      setCharacterY(finalY)
      return { y: finalY }
    })
  }, [velocity, setCharacterY])

  const jump = useCallback(() => {
    if (isOnGround({ y: position.y, height: GAME_CONFIG.CHARACTER_SIZE.HEIGHT }, GAME_CONFIG.GROUND_HEIGHT)) {
      setVelocity(GAME_CONFIG.JUMP_FORCE)
      setIsJumping(true)
      initialYRef.current = position.y
    }
  }, [position.y])

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        jump()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [jump])

  useGameLoop(updatePhysics)

  return (
    <CharacterSprite
      src={`/public/assets/images/${selectedCharacter}.png`}
      alt="character"
      $y={position.y}
      animate={{
        y: isJumping ? -400 : 0,
        rotate: isJumping ? [-2, 2] : 0
      }}
      transition={{
        y: {
          type: "spring",
          stiffness: 200 ,
          damping: 40 ,
          mass: 5 
        },
        rotate: {
          duration: 0.5,
          repeat: isJumping ? Infinity : 0,
          repeatType: "reverse"
        }
      }}
    />
  )
}


