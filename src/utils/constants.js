export const GAME_CONFIG = {
  VIEWPORT: {
    WIDTH: 1280,  // Base game width
    HEIGHT: 720,  // Base game height
    ASPECT_RATIO: 1280 / 720
  },
  GRAVITY: 0.3,
  JUMP_FORCE: -20,
  JUMP_HEIGHT: 1000,
  GAME_SPEED: 5,
  BACKGROUND_SPEED: 0.1,
  GROUND_HEIGHT: 100,
  CHARACTER_BASELINE_OFFSET:-70,
  CHARACTER_SIZE: {
    WIDTH: 250,
    HEIGHT: 250
  },
  COIN_SIZE: {
    WIDTH: 90,
    HEIGHT: 90
  },
  COIN_SPAWN_INTERVAL: {
    MIN: 1500,
    MAX: 3000
  },
  COIN_VERTICAL_POSITION: 650,
  OBSTACLE_SIZE: {
    WIDTH: 50,
    HEIGHT: 70
  },
  OBSTACLE_SPAWN_INTERVAL: {
    MIN: 999999999,
    MAX: 999999999
    // MIN: 2000,
    // MAX: 4000
  }
}

export const CHARACTERS = {
  BEN: 'ben',
  GONZALO: 'gonzalo',
  MOTUN: 'motun'
}

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  GAME_OVER: 'game_over'
}

export const AUDIO = {
  BACKGROUND_MUSIC: 'music.mp3',
  COIN_COLLECT: 'coin.mp3',
  GAME_START: 'bike.mp3',
  GAME_OVER: 'loser-track.mp3'
}
