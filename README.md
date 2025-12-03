# ❄️ Winter Wonderland Elf Game

A cozy 3D third-person browser-based game set in a beautiful Nordic winter landscape. Control an adorable elf character as you explore, ride a black cat, ice skate, and enjoy warm porridge in a peaceful winter wonderland.

## 🎮 Features

### Core Gameplay
- **Elf Character**: Play as a charming elf with pointed ears and festive winter clothing
- **Third-Person Camera**: Smooth camera follow system with mouse control
- **Winter Exploration**: Freely explore a beautiful snow-covered landscape

### Activities

#### 🐱 Black Cat Riding
- Press 'E' near the black cat to mount/dismount
- Ride faster than walking
- Animated cat with purring and movement states

#### ⛸️ Ice Skating
- Step onto the frozen lake to automatically start skating
- Momentum-based physics with smooth gliding
- Realistic acceleration, deceleration, and turning radius
- Special skating animations

#### 🥣 Eating Porridge
- Find porridge bowls around the map (near cabin, by the lake, etc.)
- Press 'E' to eat and restore energy
- Energy depletes over time and with activities
- Low energy affects movement speed

### Environment
- **Snowy Terrain**: Gently rolling hills covered in snow
- **Frozen Lake**: Large ice skating area in the center
- **Pine Trees**: Snow-covered trees scattered throughout
- **Cozy Cabin**: Wooden cabin with glowing windows and smoking chimney
- **Mountain Range**: Distant snow-capped mountains
- **Snowfall**: Atmospheric particle effects
- **Beautiful Lighting**: Warm golden hour lighting for maximum coziness

## 🎯 Controls

| Key | Action |
|-----|--------|
| **WASD** or **Arrow Keys** | Move elf |
| **Mouse** | Control camera |
| **Spacebar** | Jump |
| **E** | Interact (ride cat, eat porridge) |
| **Shift** | Sprint (uses more energy) |
| **ESC** | Pause menu |
| **Mouse Wheel** | Zoom camera in/out |

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Running the Game

1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open your browser to the URL shown (usually `http://localhost:5173`)
4. Click "Start Game" and enjoy!

## 🎨 Technical Details

### Technology Stack
- **Three.js**: 3D rendering engine
- **Vite**: Fast build tool and dev server
- **Web Audio API**: Sound effects and ambient audio
- **Vanilla JavaScript**: No framework overhead

### Performance
- Stylized low-poly art style for optimal browser performance
- Efficient particle systems
- Shadow mapping with optimized settings
- Target: 60 FPS on modern browsers

### Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile: ⚠️ Limited (desktop recommended)

## 🎭 Game Systems

### Energy System
- Starts at 100%
- Depletes slowly during exploration (2%/second)
- Depletes faster when sprinting (5%/second)
- Eating porridge restores 50% energy
- Low energy reduces movement speed

### Physics System
- Custom character controller
- Momentum-based ice skating
- Simple collision detection
- Gravity and jumping mechanics

### Animation System
- Idle animations (breathing, slight movements)
- Walking/running animations
- Ice skating pose and gliding
- Eating animation
- Cat animations (walking, tail swaying, idle)

## 📁 Project Structure

```
winter-elf-game/
├── index.html          # Main HTML file
├── styles.css          # UI and menu styles
├── package.json        # Dependencies
├── src/
│   ├── main.js         # Game entry point and main loop
│   ├── scene.js        # Three.js scene setup
│   ├── environment.js  # Terrain, trees, cabin, lake
│   ├── character.js    # Elf character
│   ├── cat.js          # Black cat
│   ├── controls.js     # Input handling
│   ├── camera.js       # Third-person camera
│   ├── physics.js      # Collision and physics
│   ├── skating.js      # Ice skating mechanics
│   ├── energy.js       # Energy management
│   ├── ui.js           # UI and HUD
│   ├── particles.js    # Snow particle effects
│   └── audio.js        # Audio management
```

## 🎯 Future Enhancements (Optional)

- [ ] Additional character customization
- [ ] More interactive elements in the environment
- [ ] Footprints in snow that fade over time
- [ ] Day/night cycle
- [ ] Save/load game state
- [ ] More sound effects and background music
- [ ] Mobile touch controls
- [ ] Multiplayer support

## 📝 License

MIT License - Feel free to use and modify!

## 🤝 Credits

Created with love for cozy winter experiences.

Built with:
- Three.js for 3D graphics
- Web Audio API for sound
- Vite for development

---

**Enjoy your winter adventure! ❄️🎮✨**
