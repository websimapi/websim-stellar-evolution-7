import { createApp } from 'vue';
import StatusBar from './components/StatusBar.js';
import TerminalOutput from './components/TerminalOutput.js';
import CommandInput from './components/CommandInput.js';
import SidePanel from './components/SidePanel.js';
import AudioManager from './components/AudioManager.js';
import { initialGameState } from './models/gameState.js';
import { processUserCommand } from './services/commandProcessor.js';
import { saveGame, loadGame } from './services/storageService.js';
import { formatResources } from './utils/formatters.js';
import { startGameTimers, stopGameTimers } from './services/timeService.js';

const app = createApp({
    components: {
        StatusBar,
        TerminalOutput,
        CommandInput,
        SidePanel,
        AudioManager
    },
    data() {
        return {
            gameState: initialGameState(),
            gameMessages: [],
            isProcessing: false,
            activePanel: null,
            activeTTS: false,
            timers: {
                autosave: null,
                resourceTick: null
            }
        };
    },
    created() {
        // Load saved game or initialize new game
        const savedGame = loadGame();
        if (savedGame) {
            this.gameState = savedGame;
            this.addSystemMessage("Game state loaded successfully.");
            
            // Calculate offline progress
            const lastActive = new Date(this.gameState.lastActiveTimestamp);
            const now = new Date();
            const timeDiff = (now - lastActive) / 1000; // in seconds
            
            if (timeDiff > 60) { // If more than a minute has passed
                this.calculateOfflineProgress(timeDiff);
            }
        } else {
            this.startNewGame();
        }
        
        // Start game timers
        this.startTimers();
        
        // Listen for window events
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        window.addEventListener('visibilitychange', this.handleVisibilityChange);
    },
    mounted() {
        // Initial scroll to bottom
        this.scrollToBottom();
    },
    beforeUnmount() {
        this.stopTimers();
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        window.removeEventListener('visibilitychange', this.handleVisibilityChange);
    },
    methods: {
        startNewGame() {
            this.gameMessages = [];
            
            // Welcome message
            this.addSystemMessage(
                "Welcome to Stellar Evolution", 
                "positive",
                `A journey through the stars begins with your guidance. 
                You control a nascent stellar civilization, ready to explore 
                the cosmos and expand beyond its humble origins.`
            );
            
            // Tutorial message
            this.addSystemMessage(
                "Getting Started", 
                "info",
                `Try entering commands like "explore our solar system" or 
                "research basic energy technology" to begin your journey.`
            );
            
            // Initial game state
            this.gameState = initialGameState();
            this.saveGameState();
        },
        async processCommand(command) {
            if (!command.trim()) return;
            
            // Add user command to messages
            this.addUserMessage(command);
            
            // Set processing state
            this.isProcessing = true;
            
            try {
                // Process command
                const response = await processUserCommand(command, this.gameState);
                
                // Update game state with changes
                if (response.gameStateChanges) {
                    Object.keys(response.gameStateChanges).forEach(key => {
                        if (typeof response.gameStateChanges[key] === 'object' && response.gameStateChanges[key] !== null) {
                            this.gameState[key] = {
                                ...this.gameState[key],
                                ...response.gameStateChanges[key]
                            };
                        } else {
                            this.gameState[key] = response.gameStateChanges[key];
                        }
                    });
                }
                
                // Add response message
                this.addGameMessage(
                    response.narrative.mainText,
                    response.narrative.tone || 'neutral',
                    response.narrative.detailText,
                    response.narrative.imagePrompt
                );
                
                // Play any sound effects
                if (response.uiUpdates?.soundEffects && this.$refs.audioManager) {
                    response.uiUpdates.soundEffects.forEach(sound => {
                        this.$refs.audioManager.playSound(sound);
                    });
                }
                
                // Handle any UI updates
                if (response.uiUpdates?.notifications) {
                    response.uiUpdates.notifications.forEach(notification => {
                        // TODO: Implement notification system
                    });
                }
                
                // Save game state after successful command
                this.saveGameState();
                
            } catch (error) {
                console.error('Error processing command:', error);
                this.addSystemMessage(
                    "Communication Error", 
                    "error",
                    "There was an issue processing your command. Please try again."
                );
            } finally {
                this.isProcessing = false;
                this.scrollToBottom();
            }
        },
        addUserMessage(text) {
            this.gameMessages.push({
                id: Date.now(),
                type: 'user',
                text: text,
                timestamp: new Date().toISOString()
            });
        },
        addGameMessage(text, tone = 'neutral', detailText = null, imagePrompt = null) {
            const message = {
                id: Date.now(),
                type: 'game',
                text: text,
                tone: tone,
                timestamp: new Date().toISOString()
            };
            
            if (detailText) {
                message.detailText = detailText;
            }
            
            if (imagePrompt && this.gameState.settings.enableImages) {
                message.imagePrompt = imagePrompt;
                message.imageLoading = true;
            }
            
            this.gameMessages.push(message);
            
            // Play text-to-speech if enabled
            if (this.gameState.settings.enableTTS) {
                this.activeTTS = true;
                this.$refs.audioManager.speak(text, tone).finally(() => {
                    this.activeTTS = false;
                });
            }
        },
        addSystemMessage(title, tone = 'neutral', text = null) {
            this.gameMessages.push({
                id: Date.now(),
                type: 'system',
                title: title,
                text: text,
                tone: tone,
                timestamp: new Date().toISOString()
            });
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const terminal = this.$refs.terminalWindow;
                if (terminal) {
                    terminal.scrollTop = terminal.scrollHeight;
                }
            });
        },
        saveGameState() {
            this.gameState.lastActiveTimestamp = new Date().toISOString();
            saveGame(this.gameState);
        },
        calculateOfflineProgress(secondsElapsed) {
            // Calculate resource generation during offline time
            const resourceRates = this.gameState.resourceRates;
            const resources = this.gameState.resources;
            
            Object.keys(resourceRates).forEach(resource => {
                const generated = resourceRates[resource] * secondsElapsed;
                if (generated > 0) {
                    resources[resource] += generated;
                }
            });
            
            // Format time for display
            let timeAway = '';
            if (secondsElapsed < 3600) {
                timeAway = `${Math.floor(secondsElapsed / 60)} minutes`;
            } else if (secondsElapsed < 86400) {
                timeAway = `${Math.floor(secondsElapsed / 3600)} hours`;
            } else {
                timeAway = `${Math.floor(secondsElapsed / 86400)} days`;
            }
            
            // Add message about offline progress
            this.addSystemMessage(
                "Offline Progress", 
                "info",
                `While you were away for ${timeAway}, your civilization continued to advance. 
                ${formatResources(resources)} resources have been accumulated.`
            );
            
            // Check for any events that might have occurred while away
            // TODO: Implement offline events
            
            // Save updated state
            this.saveGameState();
        },
        openPanel(panel) {
            this.activePanel = panel;
        },
        closePanel() {
            this.activePanel = null;
        },
        startTimers() {
            this.timers = startGameTimers(this.gameState, this.saveGameState.bind(this));
        },
        stopTimers() {
            stopGameTimers(this.timers);
        },
        handleBeforeUnload() {
            this.saveGameState();
        },
        handleVisibilityChange() {
            if (document.visibilityState === 'hidden') {
                this.saveGameState();
                this.stopTimers();
            } else {
                this.startTimers();
                
                // Check for offline progress when returning
                const lastActive = new Date(this.gameState.lastActiveTimestamp);
                const now = new Date();
                const timeDiff = (now - lastActive) / 1000; // in seconds
                
                if (timeDiff > 60) {
                    this.calculateOfflineProgress(timeDiff);
                }
            }
        }
    }
});

app.mount('#app');

