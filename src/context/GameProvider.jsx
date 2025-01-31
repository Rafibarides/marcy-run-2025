import { useState } from 'react'
import PropTypes from 'prop-types'
import { GAME_STATES, CHARACTERS, GAME_CONFIG } from '../utils/constants'
import { GameContext } from './GameContext.js'

export function GameProvider({ children }) {
  const [gameState, setGameState] = useState(GAME_STATES.MENU)
  const [score, setScore] = useState(0)
  const [coins, setCoins] = useState(0)
  const [selectedCharacter, setSelectedCharacter] = useState(CHARACTERS.BEN)
  const [characterY, setCharacterY] = useState(GAME_CONFIG.GROUND_HEIGHT)
  const [characterPosition, setCharacterPosition] = useState({
    x: 50,
    y: GAME_CONFIG.GROUND_HEIGHT
  })
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [isNightMode, setIsNightMode] = useState(false)
  const [unlockedCharacters, setUnlockedCharacters] = useState([CHARACTERS.BEN])

  const value = {
    gameState,
    setGameState,
    score,
    setScore,
    coins,
    setCoins,
    selectedCharacter,
    setSelectedCharacter,
    characterY,
    setCharacterY,
    characterPosition,
    setCharacterPosition,
    assetsLoaded,
    setAssetsLoaded,
    isNightMode,
    setIsNightMode,
    unlockedCharacters,
    setUnlockedCharacters
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

GameProvider.propTypes = {
  children: PropTypes.node.isRequired
} 