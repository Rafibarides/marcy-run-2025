import { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { GAME_CONFIG } from '../../utils/constants'
import { checkCollision } from '../../utils/collision'
import { motion } from 'framer-motion'
import { useGameLoop } from '../../hooks/useGameLoop'

const CoinContainer = styled.div`
  position: absolute;
  width: ${GAME_CONFIG.VIEWPORT.WIDTH}px;
  height: ${GAME_CONFIG.VIEWPORT.HEIGHT}px;
  pointer-events: none;
  z-index: 2;
`

const CoinSprite = styled(motion.img).attrs(props => ({
  style: {
    left: `${props.$x}px`,
    bottom: `${props.$y}px`
  }
}))`
  position: absolute;
  width: ${GAME_CONFIG.COIN_SIZE.WIDTH}px;
  height: ${GAME_CONFIG.COIN_SIZE.HEIGHT}px;
  z-index: 2;
`

const DebugBox = styled.div.attrs(props => ({
  style: {
    left: `${props.$x}px`,
    bottom: `${props.$y}px`
  }
}))`
  position: absolute;
  border: 2px solid blue;
  background-color: rgba(0, 0, 255, 0.2);
  pointer-events: none;
  width: ${GAME_CONFIG.COIN_SIZE.WIDTH}px;
  height: ${GAME_CONFIG.COIN_SIZE.HEIGHT}px;
  z-index: 5;
`

const CoinCollisionBoundary = styled.div.attrs(props => ({
  style: {
    left: `${props.$x}px`,
    bottom: `${props.$y}px`,
    width: `${props.$width}px`,
    height: `${props.$height}px`
  }
}))`
  position: absolute;
  pointer-events: none;
  border: 2px dashed red;
  opacity: 0.5;
  z-index: 10;
`

export default function Coin() {
  const { characterY, setCoins } = useGame()
  const [coinSets, setCoinSets] = useState([])

  const generateCoinSet = useCallback(() => {
    const count = Math.random() < 0.5 ? 2 : 3
    const baseX = GAME_CONFIG.VIEWPORT.WIDTH
    const COIN_SPACING = GAME_CONFIG.COIN_SIZE.WIDTH * 2
    const baseY = GAME_CONFIG.GROUND_HEIGHT + 200

    const newCoins = Array(count).fill(null).map((_, index) => ({
      id: Date.now() + index,
      x: baseX + (index * COIN_SPACING),
      y: baseY,
      collected: false
    }))

    // Add new coins to existing ones
    setCoinSets(prev => [...prev, ...newCoins])
  }, [])

  const updateCoins = useCallback(() => {
    setCoinSets(prev => {
      // Generate new array of coins
      const updatedCoins = []
      for (let coin of prev) {
        if (coin.collected) continue

        const newX = coin.x - GAME_CONFIG.GAME_SPEED

        const coinRect = {
          x: newX,
          y: coin.y,
          width: GAME_CONFIG.COIN_SIZE.WIDTH,
          height: GAME_CONFIG.COIN_SIZE.HEIGHT
        }
        const characterRect = {
          x: 50,
          y: characterY,
          width: GAME_CONFIG.CHARACTER_SIZE.WIDTH,
          height: GAME_CONFIG.CHARACTER_SIZE.HEIGHT
        }
        const collisionBuffer = 10
        const adjustedCoinRect = {
          ...coinRect,
          x: coinRect.x - collisionBuffer,
          y: coinRect.y - collisionBuffer,
          width: coinRect.width + collisionBuffer * 2,
          height: coinRect.height + collisionBuffer * 2
        }

        if (checkCollision(adjustedCoinRect, characterRect)) {
          // Mark the coin as collected
          coin.collected = true
          // Increment coins once
          setCoins(c => c + 1)
          continue
        }

        // If no collision and coin is still on screen
        if (newX > -GAME_CONFIG.COIN_SIZE.WIDTH) {
          updatedCoins.push({ ...coin, x: newX })
        }
      }
      return updatedCoins
    })
  }, [characterY, setCoins])

  useGameLoop(updateCoins)

  useEffect(() => {
    const spawnInterval = Math.random() * 
      (GAME_CONFIG.COIN_SPAWN_INTERVAL.MAX - GAME_CONFIG.COIN_SPAWN_INTERVAL.MIN) + 
      GAME_CONFIG.COIN_SPAWN_INTERVAL.MIN
    
    const intervalId = setInterval(generateCoinSet, spawnInterval)
    return () => clearInterval(intervalId)
  }, [generateCoinSet])

  return (
    <CoinContainer>
      {coinSets.map(coin => {
        const collisionBuffer = 10
        // This matches the “adjustedCoinRect” used above
        const adjustedX = coin.x - collisionBuffer
        const adjustedY = coin.y - collisionBuffer
        const adjustedWidth = GAME_CONFIG.COIN_SIZE.WIDTH + collisionBuffer * 2
        const adjustedHeight = GAME_CONFIG.COIN_SIZE.HEIGHT + collisionBuffer * 2

        return (
          <div key={coin.id}>
            {/* Existing debug box (blue) without buffer */}
            <DebugBox $x={coin.x} $y={coin.y} />

            {/* New debug box (red, dashed) to show the collision area with buffer */}
            <CoinCollisionBoundary
              $x={adjustedX}
              $y={adjustedY}
              $width={adjustedWidth}
              $height={adjustedHeight}
            />

            <CoinSprite
              src="/public/assets/images/coin.png"
              alt="coin"
              $x={coin.x}
              $y={coin.y}
              animate={{
                y: [0, 20, 0]
              }}
              transition={{
                y: {
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }
              }}
            />
          </div>
        )
      })}
    </CoinContainer>
  )
}
