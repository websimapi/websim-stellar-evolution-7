export default {
    props: {
        isLoading: {
            type: Boolean,
            default: false
        }
    },
    emits: ['submit-command'],
    data() {
        return {
            command: '',
            commandHistory: [],
            historyIndex: -1,
            isMobileDevice: false
        };
    },
    mounted() {
        // Check if this is a mobile device
        this.isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Focus input on desktop devices
        if (!this.isMobileDevice) {
            this.$refs.commandInput.focus();
        }
    },
    methods: {
        submitCommand() {
            if (!this.command.trim() || this.isLoading) return;
            
            // Emit the command
            this.$emit('submit-command', this.command);
            
            // Add to history
            this.commandHistory.unshift(this.command);
            if (this.commandHistory.length > 50) {
                this.commandHistory.pop();
            }
            
            // Reset
            this.command = '';
            this.historyIndex = -1;
            
            // Focus input
            this.$refs.commandInput.focus();
        },
        handleKeyUp(event) {
            if (event.key === 'ArrowUp') {
                this.historyIndex = Math.min(this.historyIndex + 1, this.commandHistory.length - 1);
                if (this.historyIndex >= 0) {
                    this.command = this.commandHistory[this.historyIndex];
                }
            } else if (event.key === 'ArrowDown') {
                this.historyIndex = Math.max(this.historyIndex - 1, -1);
                if (this.historyIndex >= 0) {
                    this.command = this.commandHistory[this.historyIndex];
                } else {
                    this.command = '';
                }
            }
        },
        startVoiceInput() {
            // This is just a placeholder for voice input functionality
            // In a real implementation, you would use the Web Speech API
            alert('Voice input functionality is not implemented in this demo.');
        }
    },
    template: `
        <div class="command-input-container">
            <div class="command-prompt">
                <span>&gt;</span>
            </div>
            <input 
                ref="commandInput"
                type="text" 
                class="command-input" 
                v-model="command" 
                @keyup.enter="submitCommand"
                @keyup="handleKeyUp"
                placeholder="Enter your directive..."
                :disabled="isLoading"
                autocomplete="off"
            />
            <button @click="startVoiceInput" class="voice-input-button" :disabled="isLoading">
                <svg viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
                </svg>
            </button>
            <button @click="submitCommand" class="submit-button" :disabled="isLoading || !command.trim()">
                <div v-if="isLoading" class="loading-spinner"></div>
                <svg v-else viewBox="0 0 24 24" width="20" height="20">
                    <path fill="currentColor" d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
                </svg>
            </button>
        </div>
    `,
    styles: `
        <style>
            .command-input-container {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }
            
            .command-prompt {
                color: var(--accent-color);
                font-weight: bold;
                font-size: var(--font-lg);
            }
            
            .command-input {
                flex: 1;
                background-color: var(--input-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                padding: var(--spacing-sm) var(--spacing-md);
                color: var(--primary-text);
                font-family: 'Space Mono', monospace;
                font-size: var(--font-md);
                transition: border-color var(--transition-fast);
            }
            
            .command-input:focus {
                outline: none;
                border-color: var(--accent-color);
                box-shadow: 0 0 5px rgba(93, 245, 255, 0.3);
            }
            
            .command-input:disabled {
                opacity: 0.7;
                cursor: not-allowed;
            }
            
            .voice-input-button, .submit-button {
                background-color: var(--input-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                cursor: pointer;
                color: var(--secondary-text);
                transition: all var(--transition-fast);
            }
            
            .voice-input-button:hover, .submit-button:hover {
                background-color: var(--border-color);
                color: var(--primary-text);
            }
            
            .voice-input-button:disabled, .submit-button:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .submit-button {
                color: var(--accent-color);
            }
            
            @media (max-width: 768px) {
                .command-input {
                    font-size: var(--font-sm);
                }
                
                .voice-input-button, .submit-button {
                    width: 36px;
                    height: 36px;
                }
            }
        </style>
    `
};

