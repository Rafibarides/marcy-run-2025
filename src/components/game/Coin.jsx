import { useState, useCallback, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { GAME_CONFIG } from '../../utils/constants'
import { checkCollision } from '../../utils/collision'
import { motion } from 'framer-motion'
import { useGameLoop } from '../../hooks/useGameLoop'
import { toCSSPosition } from '../../utils/coordinates'
import { Howl } from 'howler'
import { AUDIO } from '../../utils/constants'

const CoinContainer = styled.div`
  position: absolute;
  width: ${GAME_CONFIG.VIEWPORT.WIDTH}px;
  height: ${GAME_CONFIG.VIEWPORT.HEIGHT}px;
  pointer-events: none;
  z-index: 999;
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
  z-index: 999;
`

const DebugBox = styled.div.attrs(props => ({
  style: {
    ...toCSSPosition({ x: props.$x, y: props.$y })
  }
}))`
  position: absolute;
  border: 2px solid blue;
  background-color: rgba(0, 0, 255, 0);
  pointer-events: none;
  width: ${GAME_CONFIG.COIN_SIZE.WIDTH}px;
  height: ${GAME_CONFIG.COIN_SIZE.HEIGHT}px;
  z-index: 5;
  opacity: 0;
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
  opacity: 0;
  z-index: 10;
`

export default function Coin() {
  const { characterY, setCoins } = useGame()
  const [coinSets, setCoinSets] = useState([])
  const coinSoundRef = useRef(null)
  const timeSinceLastCoinSpawnRef = useRef(0)
  const [spawnInterval, setSpawnInterval] = useState(null)

  const resetSpawnInterval = useCallback(() => {
    setSpawnInterval(
      Math.random() * 
      (GAME_CONFIG.COIN_SPAWN_INTERVAL.MAX - GAME_CONFIG.COIN_SPAWN_INTERVAL.MIN) + 
      GAME_CONFIG.COIN_SPAWN_INTERVAL.MIN
    )
  }, [])

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

  useEffect(() => {
    coinSoundRef.current = new Howl({
      src: [`/assets/audio/${AUDIO.COIN_COLLECT}`],
      volume: 0.5,
      preload: true
    })
    resetSpawnInterval()
  }, [resetSpawnInterval])

  const updateCoins = useCallback((deltaTime) => {
    timeSinceLastCoinSpawnRef.current += deltaTime
    if (spawnInterval && timeSinceLastCoinSpawnRef.current >= spawnInterval) {
      generateCoinSet()
      resetSpawnInterval()
      timeSinceLastCoinSpawnRef.current = 0
    }

    setCoinSets(prev => {
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

          // Play the coin sound
          coinSoundRef.current?.play()

          continue
        }

        // If no collision and coin is still on screen
        if (newX > -GAME_CONFIG.COIN_SIZE.WIDTH) {
          updatedCoins.push({ ...coin, x: newX })
        }
      }
      return updatedCoins
    })
  }, [characterY, setCoins, generateCoinSet, spawnInterval, resetSpawnInterval])

  useGameLoop(updateCoins)

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
