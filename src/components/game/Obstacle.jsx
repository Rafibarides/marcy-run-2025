import { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { GAME_CONFIG, GAME_STATES } from '../../utils/constants'
import { checkCollision } from '../../utils/collision'
import { motion } from 'framer-motion'
import { useGameLoop } from '../../hooks/useGameLoop'

const ObstacleContainer = styled.div`
  position: absolute;
  width: ${GAME_CONFIG.VIEWPORT.WIDTH}px;
  height: ${GAME_CONFIG.VIEWPORT.HEIGHT}px;
  pointer-events: none;
  z-index: 2;
`

const ObstacleSprite = styled(motion.img).attrs(props => ({
  style: {
    left: `${props.$x}px`,
    bottom: `${props.$y}px`
  }
}))`
  position: absolute;
  width: ${GAME_CONFIG.OBSTACLE_SIZE.WIDTH}px;
  height: ${GAME_CONFIG.OBSTACLE_SIZE.HEIGHT}px;
  z-index: 2;
`

const DebugBox = styled.div.attrs(props => ({
  style: {
    left: `${props.$x}px`,
    bottom: `${props.$y}px`
  }
}))`
  position: absolute;
  border: 2px solid red;
  background-color: rgba(255, 0, 0, 0.2);
  pointer-events: none;
  width: ${GAME_CONFIG.OBSTACLE_SIZE.WIDTH}px;
  height: ${GAME_CONFIG.OBSTACLE_SIZE.HEIGHT}px;
  z-index: 5;
`

const ObstacleCollisionBoundary = styled.div.attrs(props => ({
  style: {
    left: `${props.$x}px`,
    bottom: `${props.$y}px`,
    width: `${props.$width}px`,
    height: `${props.$height}px`
  }
}))`
  position: absolute;
  pointer-events: none;
  border: 2px dashed orange;
  opacity: 0.5;
  z-index: 10;
`

export default function Obstacle() {
  const { characterY, setGameState } = useGame()
  const [obstacles, setObstacles] = useState([])

  const generateObstacle = useCallback(() => {
    const newObstacle = {
      id: Date.now(),
      x: GAME_CONFIG.VIEWPORT.WIDTH,
      y: GAME_CONFIG.GROUND_HEIGHT + GAME_CONFIG.OBSTACLE_BASELINE_OFFSET,
      hit: false
    }

    setObstacles(prev => [...prev, newObstacle])
  }, [])

  const updateObstacles = useCallback(() => {
    setObstacles(prev => {
      const updatedObstacles = []
      for (let obstacle of prev) {
        if (obstacle.hit) continue

        const newX = obstacle.x - GAME_CONFIG.GAME_SPEED

        const obstacleRect = {
          x: newX,
          y: obstacle.y,
          width: GAME_CONFIG.OBSTACLE_SIZE.WIDTH,
          height: GAME_CONFIG.OBSTACLE_SIZE.HEIGHT
        }
        const characterRect = {
          x: 50,
          y: characterY,
          width: GAME_CONFIG.CHARACTER_SIZE.WIDTH,
          height: GAME_CONFIG.CHARACTER_SIZE.HEIGHT
        }
        const collisionBuffer = 10
        const adjustedObstacleRect = {
          ...obstacleRect,
          x: obstacleRect.x - collisionBuffer,
          y: obstacleRect.y - collisionBuffer,
          width: obstacleRect.width + collisionBuffer * 2,
          height: obstacleRect.height + collisionBuffer * 2
        }

        if (checkCollision(adjustedObstacleRect, characterRect)) {
          obstacle.hit = true
          setGameState(GAME_STATES.GAME_OVER)
          continue
        }

        // Keep obstacle if still on screen
        if (newX > -GAME_CONFIG.OBSTACLE_SIZE.WIDTH) {
          updatedObstacles.push({ ...obstacle, x: newX })
        }
      }
      return updatedObstacles
    })
  }, [characterY, setGameState])

  useGameLoop(updateObstacles)

  useEffect(() => {
    const spawnInterval = Math.random() * 
      (GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL.MAX - GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL.MIN) + 
      GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL.MIN
    
    const intervalId = setInterval(generateObstacle, spawnInterval)
    return () => clearInterval(intervalId)
  }, [generateObstacle])

  return (
    <ObstacleContainer>
      {obstacles.map(obstacle => {
        const collisionBuffer = 10
        const adjustedX = obstacle.x - collisionBuffer
        const adjustedY = obstacle.y - collisionBuffer
        const adjustedWidth = GAME_CONFIG.OBSTACLE_SIZE.WIDTH + collisionBuffer * 2
        const adjustedHeight = GAME_CONFIG.OBSTACLE_SIZE.HEIGHT + collisionBuffer * 2

        return (
          <div key={obstacle.id}>
            {/* Debug box (red) without buffer */}
            <DebugBox $x={obstacle.x} $y={obstacle.y} />

            {/* Debug box (orange, dashed) to show collision area with buffer */}
            <ObstacleCollisionBoundary
              $x={adjustedX}
              $y={adjustedY}
              $width={adjustedWidth}
              $height={adjustedHeight}
            />

            <ObstacleSprite
              src="/assets/images/obstacle.png"
              alt="obstacle"
              $x={obstacle.x}
              $y={obstacle.y}
            />
          </div>
        )
      })}
    </ObstacleContainer>
  )
}
