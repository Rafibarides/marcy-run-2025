import { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { useGameLoop } from '../../hooks/useGameLoop'
import { GAME_CONFIG, GAME_STATES } from '../../utils/constants'
import { checkCollision } from '../../utils/collision'

const ObstacleContainer = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 2;
`

const ObstacleSprite = styled.img`
  position: absolute;
  width: ${GAME_CONFIG.OBSTACLE_SIZE.WIDTH}px;
  height: ${GAME_CONFIG.OBSTACLE_SIZE.HEIGHT}px;
  bottom: ${GAME_CONFIG.GROUND_HEIGHT}px;
  transform: translateX(${props => props.$x}px);
`

export default function Obstacle() {
  const { setGameState } = useGame()
  const [obstacles, setObstacles] = useState([])

  const generateObstacle = useCallback(() => {
    return {
      id: Date.now(),
      x: window.innerWidth,
      hit: false
    }
  }, [])

  const spawnObstacle = useCallback(() => {
    const newObstacle = generateObstacle()
    setObstacles(prev => [...prev, newObstacle])
  }, [generateObstacle])

  // Spawn obstacles at random intervals
  useEffect(() => {
    const spawnInterval = Math.random() * 
      (GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL.MAX - GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL.MIN) + 
      GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL.MIN
    
    const intervalId = setInterval(spawnObstacle, spawnInterval)
    return () => clearInterval(intervalId)
  }, [spawnObstacle])

  // Move obstacles and check for collisions
  const updateObstacles = useCallback(() => {
    setObstacles(prev => {
      const updatedObstacles = prev
        .map(obstacle => ({
          ...obstacle,
          x: obstacle.x - GAME_CONFIG.GAME_SPEED
        }))
        .filter(obstacle => obstacle.x > -GAME_CONFIG.OBSTACLE_SIZE.WIDTH)

      // Check for collisions with character
      const characterRect = {
        x: 50, // Character's fixed x position
        y: window.innerHeight - GAME_CONFIG.GROUND_HEIGHT - GAME_CONFIG.CHARACTER_SIZE.HEIGHT,
        width: GAME_CONFIG.CHARACTER_SIZE.WIDTH,
        height: GAME_CONFIG.CHARACTER_SIZE.HEIGHT
      }

      for (const obstacle of updatedObstacles) {
        if (obstacle.hit) continue

        const obstacleRect = {
          x: obstacle.x,
          y: window.innerHeight - GAME_CONFIG.GROUND_HEIGHT - GAME_CONFIG.OBSTACLE_SIZE.HEIGHT,
          width: GAME_CONFIG.OBSTACLE_SIZE.WIDTH,
          height: GAME_CONFIG.OBSTACLE_SIZE.HEIGHT
        }

        if (checkCollision(obstacleRect, characterRect)) {
          setGameState(GAME_STATES.GAME_OVER)
          break
        }
      }

      return updatedObstacles
    })
  }, [setGameState])

  useGameLoop(updateObstacles)

  return (
    <ObstacleContainer>
      {obstacles.map(obstacle => (
        <ObstacleSprite
          key={obstacle.id}
          src="/public/assets/images/obstacle.png"
          alt="obstacle"
          $x={obstacle.x}
        />
      ))}
    </ObstacleContainer>
  )
}
