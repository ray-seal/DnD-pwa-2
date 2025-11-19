// D&D Adventure PWA - Main Application
class DnDApp {
    constructor() {
        this.character = null;
        this.gameState = {
            currentScene: 0,
            inventory: [],
            questLog: [],
            companions: []
        };
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.loadGameState();
        this.setupEventListeners();
        this.checkContinueButton();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./service-worker.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed:', err));
        }
    }

    setupEventListeners() {
        // Welcome screen
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showScreen('character-creation-screen');
        });

        document.getElementById('continue-btn').addEventListener('click', () => {
            if (this.character) {
                this.showScreen('game-screen');
                this.displayCharacterSheet();
                this.continueAdventure();
            }
        });

        // Character creation
        document.getElementById('roll-stats-btn').addEventListener('click', () => {
            this.rollStats();
        });

        document.getElementById('character-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createCharacter();
        });

        // Game screen
        document.querySelectorAll('.btn-dice').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dice = e.target.dataset.dice;
                this.rollDice(dice);
            });
        });

        document.getElementById('save-btn').addEventListener('click', () => {
            this.saveGame();
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to start a new adventure? Current progress will be lost.')) {
                this.resetGame();
            }
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    checkContinueButton() {
        const continueBtn = document.getElementById('continue-btn');
        if (this.character) {
            continueBtn.style.display = 'inline-block';
        } else {
            continueBtn.style.display = 'none';
        }
    }

    // Dice Rolling
    rollDice(dice) {
        const sides = parseInt(dice.substring(1));
        const result = Math.floor(Math.random() * sides) + 1;
        
        const resultDiv = document.getElementById('dice-result');
        resultDiv.innerHTML = `<div class="loading">🎲 Rolling ${dice}...</div>`;
        
        setTimeout(() => {
            resultDiv.innerHTML = `🎲 ${dice}: <span style="color: var(--secondary-color); font-size: 2rem;">${result}</span>`;
            this.addStoryEntry(`Rolled ${dice}: ${result}`, 'dice');
        }, 500);
        
        return result;
    }

    rollStats() {
        const stats = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        stats.forEach(stat => {
            // Roll 4d6, drop lowest
            const rolls = [
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1,
                Math.floor(Math.random() * 6) + 1
            ];
            rolls.sort((a, b) => a - b);
            const total = rolls.slice(1).reduce((sum, val) => sum + val, 0);
            document.getElementById(stat).value = total;
        });
    }

    // Character Creation
    createCharacter() {
        this.character = {
            playerName: document.getElementById('player-name').value,
            characterName: document.getElementById('character-name').value,
            race: document.getElementById('race').value,
            class: document.getElementById('class').value,
            stats: {
                strength: parseInt(document.getElementById('strength').value),
                dexterity: parseInt(document.getElementById('dexterity').value),
                constitution: parseInt(document.getElementById('constitution').value),
                intelligence: parseInt(document.getElementById('intelligence').value),
                wisdom: parseInt(document.getElementById('wisdom').value),
                charisma: parseInt(document.getElementById('charisma').value)
            },
            hp: 10 + this.getModifier(parseInt(document.getElementById('constitution').value)),
            maxHp: 10 + this.getModifier(parseInt(document.getElementById('constitution').value)),
            level: 1
        };

        this.gameState.currentScene = 0;
        this.saveGame();
        this.showScreen('game-screen');
        this.displayCharacterSheet();
        this.startAdventure();
    }

    getModifier(stat) {
        return Math.floor((stat - 10) / 2);
    }

    displayCharacterSheet() {
        const info = document.getElementById('character-info');
        const char = this.character;
        
        info.innerHTML = `
            <p><strong>Player:</strong> ${char.playerName}</p>
            <p><strong>Character:</strong> ${char.characterName}</p>
            <p><strong>Race:</strong> ${char.race}</p>
            <p><strong>Class:</strong> ${char.class}</p>
            <p><strong>Level:</strong> ${char.level}</p>
            <p><strong>HP:</strong> ${char.hp}/${char.maxHp}</p>
            <hr style="margin: 10px 0; border-color: var(--border-color);">
            <p><strong>STR:</strong> ${char.stats.strength} (${this.formatModifier(this.getModifier(char.stats.strength))})</p>
            <p><strong>DEX:</strong> ${char.stats.dexterity} (${this.formatModifier(this.getModifier(char.stats.dexterity))})</p>
            <p><strong>CON:</strong> ${char.stats.constitution} (${this.formatModifier(this.getModifier(char.stats.constitution))})</p>
            <p><strong>INT:</strong> ${char.stats.intelligence} (${this.formatModifier(this.getModifier(char.stats.intelligence))})</p>
            <p><strong>WIS:</strong> ${char.stats.wisdom} (${this.formatModifier(this.getModifier(char.stats.wisdom))})</p>
            <p><strong>CHA:</strong> ${char.stats.charisma} (${this.formatModifier(this.getModifier(char.stats.charisma))})</p>
        `;
    }

    formatModifier(mod) {
        return mod >= 0 ? `+${mod}` : `${mod}`;
    }

    // Story Management
    addStoryEntry(text, type = 'dm') {
        const storyContent = document.getElementById('story-content');
        const entry = document.createElement('div');
        entry.className = `story-entry ${type}`;
        entry.innerHTML = text;
        storyContent.appendChild(entry);
        storyContent.scrollTop = storyContent.scrollHeight;
    }

    // Adventure: Lost Mines of Phandelver (Simplified Free Version)
    startAdventure() {
        this.addStoryEntry(`<strong>Welcome, ${this.character.characterName}!</strong><br><br>
            You have been hired by Gundren Rockseeker, a dwarf merchant, to escort a wagon of supplies to the town of Phandalin. 
            Gundren and his bodyguard Sildar Hallwinter have gone ahead, and you're driving the wagon with your companions.<br><br>
            As you travel along the High Road, you come around a bend and spot two dead horses on the road ahead, 
            their saddlebags spilling across the dirt. The woods press close to the trail here, with a steep embankment and dense thickets on either side.`, 'dm');

        this.gameState.currentScene = 1;
        this.showSceneActions();
    }

    continueAdventure() {
        if (this.gameState.currentScene === 0) {
            this.startAdventure();
        } else {
            this.showSceneActions();
        }
    }

    showSceneActions() {
        const actionButtons = document.getElementById('action-buttons');
        actionButtons.innerHTML = '';

        const scenes = this.getAdventureScenes();
        const currentSceneData = scenes[this.gameState.currentScene];

        if (currentSceneData && currentSceneData.actions) {
            currentSceneData.actions.forEach(action => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-secondary';
                btn.textContent = action.text;
                btn.addEventListener('click', () => action.handler());
                actionButtons.appendChild(btn);
            });
        }
    }

    getAdventureScenes() {
        return {
            1: {
                actions: [
                    {
                        text: 'Investigate the horses',
                        handler: () => {
                            this.addStoryEntry('You approach the dead horses cautiously. They appear to have been killed by black-feathered arrows. You recognize them as Gundren\'s horses!', 'player');
                            this.addStoryEntry('<strong>DM:</strong> Make a Perception check to search the area.', 'dm');
                            
                            const perceptionMod = this.getModifier(this.character.stats.wisdom);
                            const roll = this.rollDice('d20');
                            setTimeout(() => {
                                const total = roll + perceptionMod;
                                if (total >= 12) {
                                    this.addStoryEntry(`<strong>Success!</strong> (${total}) You notice signs of an ambush. Fresh goblin tracks lead into the woods to the north.`, 'dm');
                                } else {
                                    this.addStoryEntry(`<strong>Failure.</strong> (${total}) You find the tracks confusing and hard to follow.`, 'dm');
                                }
                            }, 1000);
                        }
                    },
                    {
                        text: 'Follow the tracks into the woods',
                        handler: () => {
                            this.addStoryEntry('You follow the goblin tracks through the dense undergrowth. After about 10 minutes, you hear harsh goblin voices ahead.', 'player');
                            this.gameState.currentScene = 2;
                            this.encounterGoblins();
                        }
                    },
                    {
                        text: 'Continue to Phandalin',
                        handler: () => {
                            this.addStoryEntry('You decide to press on to Phandalin. The journey takes several hours.', 'player');
                            this.gameState.currentScene = 3;
                            this.arriveInPhandalin();
                        }
                    }
                ]
            },
            2: {
                actions: [
                    {
                        text: 'Attack the goblins',
                        handler: () => this.combatEncounter('goblins', 2)
                    },
                    {
                        text: 'Try to sneak past',
                        handler: () => {
                            this.addStoryEntry('<strong>DM:</strong> Make a Stealth check.', 'dm');
                            const stealthMod = this.getModifier(this.character.stats.dexterity);
                            const roll = this.rollDice('d20');
                            setTimeout(() => {
                                const total = roll + stealthMod;
                                if (total >= 14) {
                                    this.addStoryEntry(`<strong>Success!</strong> (${total}) You sneak past the goblins undetected.`, 'dm');
                                    this.gameState.currentScene = 3;
                                    this.arriveInPhandalin();
                                } else {
                                    this.addStoryEntry(`<strong>Failure!</strong> (${total}) The goblins spot you! Roll initiative!`, 'dm');
                                    setTimeout(() => this.combatEncounter('goblins', 2), 1000);
                                }
                            }, 1000);
                        }
                    },
                    {
                        text: 'Attempt to negotiate',
                        handler: () => {
                            this.addStoryEntry('You try to speak with the goblins.', 'player');
                            this.addStoryEntry('<strong>DM:</strong> Make a Persuasion check.', 'dm');
                            const charismaMod = this.getModifier(this.character.stats.charisma);
                            const roll = this.rollDice('d20');
                            setTimeout(() => {
                                const total = roll + charismaMod;
                                if (total >= 16) {
                                    this.addStoryEntry(`<strong>Success!</strong> (${total}) The goblins are intimidated and flee!`, 'dm');
                                    this.gameState.currentScene = 3;
                                    this.arriveInPhandalin();
                                } else {
                                    this.addStoryEntry(`<strong>Failure!</strong> (${total}) The goblins attack!`, 'dm');
                                    setTimeout(() => this.combatEncounter('goblins', 2), 1000);
                                }
                            }, 1000);
                        }
                    }
                ]
            },
            3: {
                actions: [
                    {
                        text: 'Visit the Townmaster\'s Hall',
                        handler: () => {
                            this.addStoryEntry('You enter the Townmaster\'s Hall. Harbin Wester, the townmaster, greets you nervously.', 'player');
                            this.addStoryEntry('<strong>Harbin Wester:</strong> "Welcome to Phandalin! We\'ve been having trouble with the Redbrands - a gang of ruffians who have taken over the town. Can you help us?"', 'dm');
                            this.gameState.questLog.push('Deal with the Redbrand menace');
                            this.addStoryEntry('Quest added: Deal with the Redbrand menace', 'dm');
                        }
                    },
                    {
                        text: 'Visit the Sleeping Giant tap house',
                        handler: () => {
                            this.addStoryEntry('You enter a run-down tap house. Several tough-looking ruffians in scarlet cloaks eye you suspiciously.', 'player');
                            this.addStoryEntry('<strong>DM:</strong> These are Redbrands! They demand you pay them or leave.', 'dm');
                            this.gameState.currentScene = 4;
                            this.showSceneActions();
                        }
                    },
                    {
                        text: 'Explore the town',
                        handler: () => {
                            this.addStoryEntry('You explore Phandalin. It\'s a small frontier settlement with a general store, an inn, and various other buildings. The people seem nervous and afraid.', 'player');
                            this.addStoryEntry('You learn that the Redbrands have been terrorizing the town and their leader operates from Tresendar Manor on the hill.', 'dm');
                        }
                    }
                ]
            },
            4: {
                actions: [
                    {
                        text: 'Fight the Redbrands',
                        handler: () => this.combatEncounter('redbrands', 3)
                    },
                    {
                        text: 'Leave peacefully',
                        handler: () => {
                            this.addStoryEntry('You decide to leave the tap house. The Redbrands laugh as you go.', 'player');
                            this.gameState.currentScene = 3;
                            this.showSceneActions();
                        }
                    },
                    {
                        text: 'Intimidate them',
                        handler: () => {
                            this.addStoryEntry('<strong>DM:</strong> Make an Intimidation check.', 'dm');
                            const charismaMod = this.getModifier(this.character.stats.charisma);
                            const roll = this.rollDice('d20');
                            setTimeout(() => {
                                const total = roll + charismaMod;
                                if (total >= 15) {
                                    this.addStoryEntry(`<strong>Success!</strong> (${total}) The Redbrands back down and let you pass.`, 'dm');
                                } else {
                                    this.addStoryEntry(`<strong>Failure!</strong> (${total}) The Redbrands draw their weapons!`, 'dm');
                                    setTimeout(() => this.combatEncounter('redbrands', 3), 1000);
                                }
                            }, 1000);
                        }
                    }
                ]
            }
        };
    }

    encounterGoblins() {
        this.addStoryEntry('<strong>DM:</strong> You find a small camp with two goblins arguing over some stolen goods. What do you do?', 'dm');
        this.showSceneActions();
    }

    arriveInPhandalin() {
        this.addStoryEntry('You arrive in Phandalin, a small frontier town. The streets are quiet, and you notice people hurrying indoors when they see strangers.', 'player');
        this.addStoryEntry('<strong>DM:</strong> Phandalin has seen better days. What would you like to do?', 'dm');
        this.showSceneActions();
    }

    combatEncounter(enemyType, enemyCount) {
        this.addStoryEntry(`<strong>COMBAT!</strong> You face ${enemyCount} ${enemyType}!`, 'dm');
        this.addStoryEntry('Roll for initiative!', 'dm');
        
        const initiative = this.rollDice('d20') + this.getModifier(this.character.stats.dexterity);
        setTimeout(() => {
            this.addStoryEntry(`Your initiative: ${initiative}`, 'dice');
            
            // Simplified combat
            const attackRoll = this.rollDice('d20');
            setTimeout(() => {
                const attackMod = this.getModifier(this.character.stats.strength);
                const totalAttack = attackRoll + attackMod;
                
                if (totalAttack >= 12) {
                    const damage = this.rollDice('d8') + attackMod;
                    setTimeout(() => {
                        this.addStoryEntry(`<strong>Hit!</strong> You deal ${damage} damage!`, 'dm');
                        this.addStoryEntry(`After a fierce battle, you defeat the ${enemyType}!`, 'dm');
                        
                        // Award XP and loot
                        this.addStoryEntry('You gain 50 XP and find some gold pieces.', 'dm');
                        
                        if (this.gameState.currentScene === 2) {
                            this.gameState.currentScene = 3;
                            setTimeout(() => this.arriveInPhandalin(), 2000);
                        } else if (this.gameState.currentScene === 4) {
                            this.addStoryEntry('The other Redbrands flee! The townsfolk cheer!', 'dm');
                            this.addStoryEntry('<strong>Quest Complete:</strong> Deal with the Redbrand menace', 'dm');
                        }
                    }, 1500);
                } else {
                    this.addStoryEntry(`<strong>Miss!</strong> Your attack misses.`, 'dm');
                    this.addStoryEntry('The enemy attacks back...', 'dm');
                    
                    const enemyRoll = Math.floor(Math.random() * 20) + 1;
                    setTimeout(() => {
                        if (enemyRoll >= 10) {
                            const damage = Math.floor(Math.random() * 6) + 1;
                            this.character.hp -= damage;
                            this.addStoryEntry(`<strong>You take ${damage} damage!</strong> HP: ${this.character.hp}/${this.character.maxHp}`, 'dm');
                            this.displayCharacterSheet();
                            
                            if (this.character.hp <= 0) {
                                this.addStoryEntry('<strong>You have been defeated!</strong> Your adventure ends here...', 'dm');
                                setTimeout(() => {
                                    alert('Game Over! Starting new adventure...');
                                    this.resetGame();
                                }, 2000);
                                return;
                            }
                        }
                        this.addStoryEntry('Combat continues! Use the dice roller to make your next attack.', 'dm');
                    }, 1500);
                }
            }, 1500);
        }, 1000);
    }

    // Save/Load
    saveGame() {
        const gameData = {
            character: this.character,
            gameState: this.gameState
        };
        localStorage.setItem('dndGameSave', JSON.stringify(gameData));
        this.addStoryEntry('Game saved!', 'dm');
    }

    loadGameState() {
        const savedGame = localStorage.getItem('dndGameSave');
        if (savedGame) {
            const gameData = JSON.parse(savedGame);
            this.character = gameData.character;
            this.gameState = gameData.gameState;
        }
    }

    resetGame() {
        localStorage.removeItem('dndGameSave');
        this.character = null;
        this.gameState = {
            currentScene: 0,
            inventory: [],
            questLog: [],
            companions: []
        };
        document.getElementById('story-content').innerHTML = '';
        this.showScreen('welcome-screen');
        this.checkContinueButton();
    }
}

// Initialize the app
const app = new DnDApp();
