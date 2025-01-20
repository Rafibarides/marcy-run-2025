export const GAME_CONFIG = {
  VIEWPORT: {
    WIDTH: 1280,  // Base game width
    HEIGHT: 720,  // Base game height
    ASPECT_RATIO: 1280 / 720
  },
  GRAVITY: 0.3,
  JUMP_FORCE: -20,
  JUMP_HEIGHT: 10000,
  GAME_SPEED: 7,
  BACKGROUND_SPEED: 0.1,
  GROUND_HEIGHT: 100,
  CHARACTER_BASELINE_OFFSET: -70,
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
    WIDTH: 80,
    HEIGHT: 80
  },
  OBSTACLE_SPAWN_INTERVAL: {
    MIN: 2000,  // 2 seconds minimum between obstacles
    MAX: 4000   // 4 seconds maximum between obstacles
  },
  OBSTACLE_BASELINE_OFFSET: -40, // Adjust this to change obstacle height from ground
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
  COIN_SOUND: 'coin.mp3',
  LOSER_TRACK: 'loser-track.mp3',
  BEN_SOUND: 'ben.mp3',
  GONZALO_SOUND: 'gonzalo.mp3',
  MOTUN_SOUND: 'motun.mp3'
}
