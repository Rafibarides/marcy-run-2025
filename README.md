# Marcy Run

Welcome to **Marcy Run**, an endless runner game built with React! 
Take on the challenge of collecting coins while dodging obstacles in a fun and engaging environment inspired by the Chrome Dinosaur Game. This README will guide you through the game's features, technical details, and setup instructions.

## Features

### Gameplay
- **Character Jumping:** Use the space bar to make your character jump.
- **Obstacle Avoidance:** Dodge obstacles like cactuses and other creative elements.
- **Coin Collection:** Increase your score by collecting coins.
- **Game Over Mechanics:** The game ends when you hit an obstacle, with a restart option.

### Graphics & Design
- **Seamless Parallax Background:** Includes a scrolling ground layer and a slightly slower-moving background for depth.
- **Custom Characters:** Choose from three unique character PNGs.
- **Responsive Design:** Maintains consistent aspect ratios and scales proportionally across devices.

### Audio
- **Dynamic Sound Effects:**
  - Background music: Loops continuously during gameplay.
  - Coin sound: Plays on collecting a coin.
  - Crash sound: Signals game over.
  - Motorcycle start sound: Plays when the game begins.

## Assets

### Images
- **Background:** `background.jpg` (4500x1201)
- **Ground:** `ground.png` (8647x691, seamless tiling)
- **Characters:**
  - `ben.png` (4179x3894)
  - `gonzalo.png` (4693x3686)
  - `motun.png` (3219x3751)
- **Coins:** `coin.png` (1024x1024)
- **Additional Elements:**
  - `logo.png` (1652x836)
  - `moon.png` (930x930, static in the background)

### Fonts
- `kidgames.ttf`: Used for the "Hit Space to Start Game" text.
- `poxel-font.ttf`: Displays "Score" and "Coins" in a pixelated style.

### Audio
- **Background Music:** `music.mp3` (2:14, loops continuously)
- **Sound Effects:**
  - `bike.mp3`: Start sound effect.
  - `coin.mp3`: Coin collection sound.
  - `loser-track.mp3`: Game over sound.

## Technical Overview

### Tech Stack
- **Frontend:** React
- **Styling:** CSS for animations and responsive design
- **Audio Playback:** [Howler.js](https://howlerjs.com/)
- **Asset Storage:** Firebase Storage


## Getting Started

### Prerequisites
- Node.js and npm installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/marcy-run.git
   cd marcy-run
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open your browser and navigate to `http://localhost:3000` to play!


## Contributing
Contributions are welcome! Feel free to fork the repository and submit a pull request. For major changes, please open an issue first to discuss your ideas.

## License
This project is licensed under the MIT License. See `LICENSE` for details.

## Contact
For questions, suggestions, or any feedback, please contact **Rafi Barides** at [rafibaridesmusic@gmail.com](mailto:rafibaridesmusic@gmail.com).

---
Thank you for checking out **Marcy Run**! Enjoy the game and have fun!
