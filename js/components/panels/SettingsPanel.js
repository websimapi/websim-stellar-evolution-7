export default {
    props: {
        gameState: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            settings: {
                enableSounds: true,
                soundVolume: 50,
                enableTTS: true,
                ttsVolume: 70,
                enableImages: true,
                darkMode: true,
                fontSize: 'medium',
                autoSaveInterval: 60
            },
            savingSettings: false,
            showResetConfirm: false
        };
    },
    created() {
        // Copy settings from game state
        if (this.gameState.settings) {
            Object.keys(this.settings).forEach(key => {
                if (this.gameState.settings[key] !== undefined) {
                    this.settings[key] = this.gameState.settings[key];
                }
            });
        }
    },
    methods: {
        async saveSettings() {
            this.savingSettings = true;
            
            try {
                // Create a copy to avoid mutations
                const settingsCopy = JSON.parse(JSON.stringify(this.settings));
                
                // Emit save event to parent
                // In a real app, this would save to the game state
                this.$emit('save-settings', settingsCopy);
                
                // Update game state settings
                this.gameState.settings = settingsCopy;
                
                await new Promise(resolve => setTimeout(resolve, 500)); // Simulated delay
                
                // Show success message
                alert('Settings saved successfully');
            } catch (error) {
                console.error('Error saving settings:', error);
                alert('Failed to save settings');
            } finally {
                this.savingSettings = false;
            }
        },
        resetGame() {
            this.showResetConfirm = true;
        },
        confirmReset() {
            localStorage.removeItem('stellar_evolution_save');
            window.location.reload();
        },
        cancelReset() {
            this.showResetConfirm = false;
        },
        exportSave() {
            const saveData = localStorage.getItem('stellar_evolution_save');
            if (!saveData) {
                alert('No save data found');
                return;
            }
            
            // Create a downloadable file
            const blob = new Blob([saveData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `stellar_evolution_save_${new Date().toISOString().slice(0, 10)}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },
        importSave() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            
            input.onchange = (event) => {
                const file = event.target.files[0];
                if (!file) return;
                
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const saveData = e.target.result;
                        const parsedData = JSON.parse(saveData);
                        
                        // Validate save data
                        if (!parsedData.resources || !parsedData.lastActiveTimestamp) {
                            throw new Error('Invalid save data');
                        }
                        
                        localStorage.setItem('stellar_evolution_save', saveData);
                        alert('Save data imported successfully. Game will now reload.');
                        window.location.reload();
                    } catch (error) {
                        console.error('Error importing save:', error);
                        alert('Failed to import save data. The file may be corrupt or invalid.');
                    }
                };
                
                reader.readAsText(file);
            };
            
            input.click();
        }
    },
    template: `
        <div class="settings-panel">
            <div class="settings-section">
                <h3>Audio Settings</h3>
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" v-model="settings.enableSounds">
                        Enable Sound Effects
                    </label>
                </div>
                
                <div class="setting-item" v-if="settings.enableSounds">
                    <label class="setting-label">Sound Volume</label>
                    <div class="setting-control">
                        <input type="range" v-model.number="settings.soundVolume" min="0" max="100" step="1">
                        <span class="setting-value">{{ settings.soundVolume }}%</span>
                    </div>
                </div>
                
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" v-model="settings.enableTTS">
                        Enable Text-to-Speech
                    </label>
                </div>
                
                <div class="setting-item" v-if="settings.enableTTS">
                    <label class="setting-label">Voice Volume</label>
                    <div class="setting-control">
                        <input type="range" v-model.number="settings.ttsVolume" min="0" max="100" step="1">
                        <span class="setting-value">{{ settings.ttsVolume }}%</span>
                    </div>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Visual Settings</h3>
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" v-model="settings.enableImages">
                        Generate Images
                    </label>
                    <div class="setting-description">
                        Generate images for discoveries and events
                    </div>
                </div>
                
                <div class="setting-item">
                    <label class="setting-label">
                        <input type="checkbox" v-model="settings.darkMode">
                        Dark Mode
                    </label>
                </div>
                
                <div class="setting-item">
                    <label class="setting-label">Font Size</label>
                    <div class="setting-control">
                        <select v-model="settings.fontSize">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Game Settings</h3>
                <div class="setting-item">
                    <label class="setting-label">Auto-Save Interval (seconds)</label>
                    <div class="setting-control">
                        <input type="number" v-model.number="settings.autoSaveInterval" min="10" max="300">
                    </div>
                </div>
            </div>
            
            <div class="settings-section">
                <h3>Game Data</h3>
                <div class="settings-buttons">
                    <button @click="exportSave" class="setting-button">Export Save</button>
                    <button @click="importSave" class="setting-button">Import Save</button>
                    <button @click="resetGame" class="setting-button danger">Reset Game</button>
                </div>
                
                <div v-if="showResetConfirm" class="reset-confirm">
                    <p>Are you sure you want to reset the game? All progress will be lost.</p>
                    <div class="reset-buttons">
                        <button @click="cancelReset" class="setting-button">Cancel</button>
                        <button @click="confirmReset" class="setting-button danger">Reset Game</button>
                    </div>
                </div>
            </div>
            
            <div class="settings-actions">
                <button @click="saveSettings" class="save-button" :disabled="savingSettings">
                    <div v-if="savingSettings" class="loading-spinner"></div>
                    <span v-else>Save Settings</span>
                </button>
            </div>
        </div>
    `,
    styles: `
        <style>
            .settings-panel {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-lg);
            }
            
            .settings-section {
                background-color: var(--terminal-bg);
                border-radius: var(--radius-md);
                padding: var(--spacing-md);
                border: 1px solid var(--border-color);
            }
            
            h3 {
                font-family: 'Orbitron', sans-serif;
                color: var(--primary-text);
                font-size: var(--font-md);
                border-bottom: 1px solid var(--border-color);
                padding-bottom: var(--spacing-xs);
                margin-bottom: var(--spacing-md);
            }
            
            .setting-item {
                margin-bottom: var(--spacing-md);
            }
            
            .setting-label {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                margin-bottom: var(--spacing-xs);
                font-weight: bold;
            }
            
            .setting-description {
                font-size: var(--font-xs);
                color: var(--secondary-text);
                margin-top: var(--spacing-xs);
                margin-left: calc(var(--spacing-md) + var(--spacing-sm));
            }
            
            .setting-control {
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
            }
            
            input[type="range"] {
                flex: 1;
                height: 6px;
                -webkit-appearance: none;
                background-color: var(--border-color);
                border-radius: 3px;
                outline: none;
            }
            
            input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                background-color: var(--accent-color);
                border-radius: 50%;
                cursor: pointer;
            }
            
            input[type="range"]::-moz-range-thumb {
                width: 16px;
                height: 16px;
                background-color: var(--accent-color);
                border-radius: 50%;
                cursor: pointer;
                border: none;
            }
            
            .setting-value {
                width: 50px;
                text-align: right;
                font-weight: bold;
            }
            
            input[type="checkbox"] {
                width: 18px;
                height: 18px;
                -webkit-appearance: none;
                background-color: var(--secondary-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all var(--transition-fast);
            }
            
            input[type="checkbox"]:checked {
                background-color: var(--accent-color);
                border-color: var(--accent-color);
            }
            
            input[type="checkbox"]:checked::after {
                content: '✓';
                color: var(--primary-bg);
                font-size: 14px;
                font-weight: bold;
            }
            
            select, input[type="number"] {
                background-color: var(--secondary-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                padding: var(--spacing-xs) var(--spacing-sm);
                color: var(--primary-text);
                font-family: 'Space Mono', monospace;
                min-width: 120px;
            }
            
            .settings-buttons {
                display: flex;
                gap: var(--spacing-sm);
                flex-wrap: wrap;
            }
            
            .setting-button {
                background-color: var(--secondary-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                padding: var(--spacing-xs) var(--spacing-md);
                color: var(--primary-text);
                font-family: 'Space Mono', monospace;
                cursor: pointer;
                transition: all var(--transition-fast);
            }
            
            .setting-button:hover {
                background-color: var(--border-color);
            }
            
            .setting-button.danger {
                color: var(--warning-color);
                border-color: var(--warning-color);
                background-color: rgba(255, 92, 92, 0.1);
            }
            
            .setting-button.danger:hover {
                background-color: rgba(255, 92, 92, 0.2);
            }
            
            .reset-confirm {
                margin-top: var(--spacing-md);
                padding: var(--spacing-md);
                background-color: rgba(255, 92, 92, 0.1);
                border-radius: var(--radius-sm);
                border: 1px solid var(--warning-color);
            }
            
            .reset-buttons {
                display: flex;
                gap: var(--spacing-md);
                margin-top: var(--spacing-md);
                justify-content: flex-end;
            }
            
            .settings-actions {
                display: flex;
                justify-content: center;
                margin-top: var(--spacing-md);
            }
            
            .save-button {
                background-color: var(--accent-color);
                color: var(--primary-bg);
                border: none;
                border-radius: var(--radius-md);
                padding: var(--spacing-sm) var(--spacing-xl);
                font-family: 'Orbitron', sans-serif;
                font-weight: bold;
                font-size: var(--font-md);
                cursor: pointer;
                transition: all var(--transition-fast);
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 180px;
                min-height: 44px;
            }
            
            .save-button:hover {
                background-color: #7df8ff;
                box-shadow: 0 0 10px rgba(93, 245, 255, 0.5);
            }
            
            .save-button:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
        </style>
    `
};

