# Marcy Run Roadmap

## App Summary
Marcy Run is a simple, single-page game built for fun and engagement. Players navigate through a seamless scrolling world, avoiding obstacles and collecting coins. The game features:
- Multiple character selection
- Parallax background effects
- Real-time scoring and coin tracking
- Background music and sound effects

The app emphasizes clean, logical game mechanics and a visually engaging experience.

---

## Roadmap

### Phase 1: Initial Setup
1. **Project Initialization**
   - Create a new GitHub repository.
   - Set up the React project using Create React App or Vite.
   - Establish a clear file structure.

2. **Game Framework**
   - Define the main game loop.
   - Build core components (Character, Ground, Background, Coin).
   - Integrate Howler.js for audio playback.

3. **Assets Integration**
   - Add images, audio files, and fonts to the project.
   - Optimize asset sizes for performance.

### Phase 2: Core Mechanics
1. **Character Movement**
   - Implement jumping and gravity physics.
   - Add collision detection with obstacles.

2. **Ground and Background**
   - Create seamless ground tiling with scaling support.
   - Implement parallax effect for the background.

3. **Coin Collection**
   - Add logic to spawn coins.
   - Play sound effect on collection.

### Phase 3: Polish and Finalize
1. **UI Enhancements**
   - Add start menu and game-over screen.
   - Display score and coin count dynamically.

2. **Testing and Optimization**
   - Test across devices and browsers.
   - Optimize performance for smooth animations.

3. **Deployment**
   - Use GitHub Pages for deployment.
   - Connect a custom domain via GoDaddy.

---

## Assets

### Images
- **Background**: 
  - File Name: `background.jpg`
  - Dimensions: 4500x1201
  - File Type: JPEG
  - Role: Static backdrop for the parallax effect.

- **Character Assets**:
  - `ben.png`
    - Dimensions: 4179x3894
    - File Type: PNG
    - Role: Main character option.
  - `gonzalo.png`
    - Dimensions: 4693x3686
    - File Type: PNG
    - Role: Character option.
  - `motun.png`
    - Dimensions: 3219x3751
    - File Type: PNG
    - Role: Character option.

- **Ground**:
  - File Name: `ground.png`
  - Dimensions: 8647x691
  - File Type: PNG
  - Role: Seamless tiling ground.

- **Coin**:
  - File Name: `coin.png`
  - Dimensions: 1024x1024
  - File Type: PNG
  - Role: Collectible coin element.

- **Logo**:
  - File Name: `logo.png`
  - Dimensions: 1652x836
  - File Type: PNG
  - Role: Displayed in the start and game-over screens.

- **Moon**:
  - File Name: `moon.png`
  - Dimensions: 930x930
  - File Type: PNG
  - Role: Static parallax background element.

  - **Obstacle**:
  - File Name: `obstacle.png`
  - Dimensions: 512x512
  - File Type: PNG
  - Role: Obstacle element, game over when hit.

### Audio
- **Background Music**:
  - File Name: `music.mp3`
  - Length: 2:14
  - Role: Loops during game play.

- **Sound Effects**:
  - `bike.mp3`: Played at game start.
  - `coin.mp3`: Played when collecting coins.
  - `loser-track.mp3`: Played when game ends.

### Fonts
- `kid-games.ttf`: Used for "Hit Space to Start Game" prompt.
- `poxel-font.ttf`: Used for score and coin display.

---

## Technologies & Libraries
- **Frontend**: React
- **Styling**: CSS, Styled Components
- **Audio**: Howler.js
- **Animation**: Framer Motion
- **State Management**: React State
- **Deployment**: GitHub Pages with GoDaddy custom domain

---

## Game Logic Clarifications and Hints
- **Game Loop**: 
  - A continuous update-render cycle ensures smooth animations and game state management.

- **Physics**: 
  - Gravity brings the character back down after a jump.
  - Use Axis-Aligned Bounding Box 'AABB' collision detection between the character, obstacles, and coins.

- **Parallax Effect**:
  - The background moves slower than the ground layer to create depth.

- **Seamless Tiling**:
  - Duplicate the ground layer, ensuring front and back edges match perfectly.

- **Scaling**:
  - Use relative units for sizing to maintain aspect ratio across devices.
