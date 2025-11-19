# 🐉 D&D Adventure - Lost Mines of Phandelver

A Progressive Web App for playing Dungeons & Dragons adventures with character creation, dice rolling, and AI Dungeon Master narration.

## ✨ Features

### Character Creation
- **Ability Score Generation**: Roll stats using the classic 4d6 drop lowest method
- **Race Selection**: Choose from Human, Elf, Dwarf, Halfling, or Half-Elf
- **Class Selection**: Choose from Fighter, Cleric, Rogue, or Wizard
- **Automatic Calculations**: HP and ability modifiers calculated automatically
- **Full Character Sheet**: View all character stats, abilities, and modifiers

### Gameplay
- **Interactive Adventure**: Play through a simplified version of Lost Mines of Phandelver
- **AI Dungeon Master**: The app acts as your DM, narrating the story and managing encounters
- **Dice Rolling System**: Built-in dice roller for d4, d6, d8, d10, d12, and d20
- **Skill Checks**: Automatic dice rolling with modifiers for skill checks
- **Combat System**: Initiative, attack rolls, and damage tracking
- **Multiple Paths**: Your choices affect the story outcome
- **Save/Load**: Game progress automatically saved to continue later

### Progressive Web App
- **Installable**: Add to your home screen on mobile devices
- **Offline Play**: Works without internet connection after first load
- **Mobile-First Design**: Optimized for mobile devices with responsive design
- **Dark Theme**: Easy on the eyes fantasy-themed interface

## 🎮 How to Play

### Starting a New Adventure

1. **Open the App**: Open `index.html` in your web browser or visit the hosted URL
2. **Start New Adventure**: Click the "Start New Adventure" button on the welcome screen
3. **Create Your Character**:
   - Enter your player name
   - Enter your character name
   - Select a race (affects your character's background)
   - Select a class (determines your abilities)
   - Click "Roll Stats" to generate ability scores
   - Review your character and click "Begin Adventure"

### Playing the Game

1. **Read the Story**: The DM (app) will narrate the adventure in the Adventure Log
2. **Make Choices**: Select from available actions in the Actions panel
3. **Roll Dice**: Use the dice roller when needed or let the app roll automatically for checks
4. **Track Progress**: Your character sheet updates automatically during the adventure
5. **Save Often**: Click "Save Game" to save your progress

### Continuing a Saved Game

1. Open the app
2. Click "Continue Adventure" on the welcome screen
3. Your character and story progress will be restored

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with flexbox and grid layouts
- **Vanilla JavaScript**: No frameworks required
- **Service Worker API**: For offline functionality
- **LocalStorage API**: For game save/load persistence
- **PWA Manifest**: For app installation

### Browser Support
- Chrome/Edge (recommended)
- Firefox
- Safari
- Any modern browser with PWA support

### Installation as PWA

**On Desktop:**
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar
3. Click "Install"

**On Mobile:**
1. Open the app in your mobile browser
2. Tap the share button
3. Select "Add to Home Screen"

## 📁 Project Structure

```
DnD-pwa-2/
├── index.html          # Main HTML file
├── styles.css          # Styling and themes
├── app.js              # Main application logic
├── manifest.json       # PWA manifest
├── service-worker.js   # Service worker for offline functionality
├── icon-192.png        # App icon (192x192)
├── icon-512.png        # App icon (512x512)
└── README.md           # This file
```

## 🎲 Game Features

### Adventure Content
- **Lost Mines of Phandelver**: A simplified version of the classic D&D starter adventure
- **Multiple Encounters**: Goblins, Redbrands, and other creatures
- **Town Exploration**: Visit Phandalin and interact with NPCs
- **Quest System**: Track your progress through the adventure

### Game Mechanics
- **D&D 5e Inspired**: Based on 5th edition rules (simplified)
- **Ability Checks**: Perception, Stealth, Persuasion, Intimidation
- **Combat**: Initiative, attack rolls, damage rolls, HP tracking
- **Character Progression**: Level 1 characters with room for expansion

## 🚀 Deployment

### Local Development
Simply open `index.html` in a web browser. For testing PWA features, use a local server:

```bash
# Using Python
python3 -m http.server 8080

# Using Node.js
npx http-server -p 8080
```

### Hosting
Upload all files to any static hosting service:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Any web server

## 🎯 Future Enhancements

Possible future additions:
- More character races and classes
- Character leveling system
- Inventory management
- Multiple adventures
- Multiplayer support
- Custom adventure creator
- More detailed combat
- Spell casting system
- Equipment and loot system

## 📜 License & Credits

This is a fan-made educational project based on D&D mechanics. Lost Mines of Phandelver content is simplified and used under fair use for educational purposes.

Dungeons & Dragons is a trademark of Wizards of the Coast LLC.

## 🤝 Contributing

Feel free to fork this project and add your own adventures, features, or improvements!

## 📞 Support

For issues or questions, please open an issue on the GitHub repository.

---

**Have fun adventuring!** 🗡️🛡️✨