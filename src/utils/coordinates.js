import { GAME_CONFIG } from './constants'

/**
 * Converts game coordinates to CSS position properties
 * Game coordinates: (0,0) is bottom-left, y increases upward
 * CSS coordinates: positions from top-left, using bottom property
 */
export const toCSSPosition = (gamePos) => ({
  left: `${gamePos.x}px`,
  bottom: `${gamePos.y}px`
})

/**
 * Creates a collision box with the given position and dimensions
 * All coordinates are in game space (bottom-left origin)
 */
export const getCollisionBox = (entity) => ({
  x: entity.x,
  y: entity.y,
  width: entity.width,
  height: entity.height
})

/**
 * Converts screen coordinates to game coordinates
 * Screen: (0,0) at top-left, y increases downward
 * Game: (0,0) at bottom-left, y increases upward
 */
export const toGameSpace = (screenPos) => ({
  x: screenPos.x,
  y: GAME_CONFIG.VIEWPORT.HEIGHT - screenPos.y
})

/**
 * Converts game coordinates to screen coordinates
 * Game: (0,0) at bottom-left, y increases upward
 * Screen: (0,0) at top-left, y increases downward
 */
export const toScreenSpace = (gamePos) => ({
  x: gamePos.x,
  y: GAME_CONFIG.VIEWPORT.HEIGHT - gamePos.y
}) 