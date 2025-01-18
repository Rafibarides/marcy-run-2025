import { useState, useCallback, useEffect } from 'react'
import styled from 'styled-components'
import { useGame } from '../../hooks/useGame'
import { GAME_CONFIG } from '../../utils/constants'
import { checkCollision } from '../../utils/collision'
import { motion } from 'framer-motion'
import { useGameLoop } from '../../hooks/useGameLoop'

const CoinContainer = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 2;
  margin: 0;
  padding: 0;
`

const CoinSprite = styled(motion.img)`
  position: absolute;
  width: ${GAME_CONFIG.COIN_SIZE.WIDTH}px;
  height: ${GAME_CONFIG.COIN_SIZE.HEIGHT}px;
  margin: 0;
  padding: 0;
  display: inline-block;
`

export default function Coin() {
  const { setCoins, characterY } = useGame()
  const [coinSets, setCoinSets] = useState([])

  const generateCoinSet = useCallback(() => {
    const count = Math.random() < 0.5 ? 2 : 3
    const baseX = GAME_CONFIG.VIEWPORT.WIDTH
    const COIN_SPACING = GAME_CONFIG.COIN_SIZE.WIDTH * 2

    const coins = Array(count).fill(null).map((_, index) => ({
      id: Date.now() + index,
      x: baseX + (index * COIN_SPACING),
      y: GAME_CONFIG.VIEWPORT.HEIGHT - GAME_CONFIG.COIN_VERTICAL_POSITION,
      collected: false
    }))
    return coins
  }, [])

  const spawnCoins = useCallback(() => {
    const newCoinSet = generateCoinSet()
    setCoinSets(prev => [...prev, ...newCoinSet])
  }, [generateCoinSet])

  // Update the coin movement and collision logic
  const updateCoins = useCallback(() => {
    setCoinSets(prev => {
      let collectedAny = false
      const updatedCoins = prev.map(coin => {
        if (coin.collected) return coin

        const newX = coin.x - GAME_CONFIG.GAME_SPEED

        // Use bottom-based coordinates for both coin and character
        const coinRect = {
          x: newX,
          y: coin.y - GAME_CONFIG.COIN_SIZE.HEIGHT, // Convert to top for collision check
          width: GAME_CONFIG.COIN_SIZE.WIDTH,
          height: GAME_CONFIG.COIN_SIZE.HEIGHT
        }

        const characterRect = {
          x: 50,
          y: characterY - GAME_CONFIG.CHARACTER_SIZE.HEIGHT * 0.4 ,
          width: GAME_CONFIG.CHARACTER_SIZE.WIDTH * 0.4,
          height: GAME_CONFIG.CHARACTER_SIZE.HEIGHT * 0.4
        }

        if (checkCollision(coinRect, characterRect)) {
          collectedAny = true
          return { ...coin, collected: true }
        }

        return { ...coin, x: newX }
      })

      if (collectedAny) {
        setTimeout(() => {
          setCoins(c => c + 1)
        }, 0)
        return updatedCoins.filter(coin => !coin.collected)
      }

      return updatedCoins.filter(coin => coin.x > -GAME_CONFIG.COIN_SIZE.WIDTH)
    })
  }, [setCoins, characterY])

  // Add the game loop for coin updates
  useGameLoop(updateCoins)

  // Spawn coins at intervals
  useEffect(() => {
    const spawnInterval = Math.random() * 
      (GAME_CONFIG.COIN_SPAWN_INTERVAL.MAX - GAME_CONFIG.COIN_SPAWN_INTERVAL.MIN) + 
      GAME_CONFIG.COIN_SPAWN_INTERVAL.MIN
    
    const intervalId = setInterval(spawnCoins, spawnInterval)
    return () => clearInterval(intervalId)
  }, [spawnCoins])

  return (
    <CoinContainer>
      {coinSets.map(coin => (
        <CoinSprite
          key={coin.id}
          src="/public/assets/images/coin.png"
          alt="coin"
          style={{ 
            bottom: coin.y, // Use bottom instead of top
            position: 'absolute'
          }}
          animate={{
            x: coin.x,
            y: [0, 20, 0] // Simplified bounce animation
          }}
          transition={{
            x: { duration: 0, ease: "linear" },
            y: {
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }
          }}
        />
      ))}
    </CoinContainer>
  )
}
