import ResourcePanel from './panels/ResourcePanel.js';
import TechPanel from './panels/TechPanel.js';
import ExplorePanel from './panels/ExplorePanel.js';
import SettingsPanel from './panels/SettingsPanel.js';

export default {
    components: {
        ResourcePanel,
        TechPanel,
        ExplorePanel,
        SettingsPanel
    },
    props: {
        activePanel: {
            type: String,
            default: null
        },
        gameState: {
            type: Object,
            required: true
        }
    },
    emits: ['close'],
    computed: {
        panelTitle() {
            if (!this.activePanel) return '';
            
            switch(this.activePanel) {
                case 'resource': return 'Resources & Production';
                case 'tech': return 'Research & Technology';
                case 'explore': return 'Exploration & Discoveries';
                case 'settings': return 'Game Settings';
                default: return '';
            }
        }
    },
    methods: {
        closePanel() {
            this.$emit('close');
        }
    },
    template: `
        <div class="side-panel-container" :class="{ 'active': activePanel }">
            <div class="side-panel" :class="{ 'slide-in': activePanel }">
                <div class="panel-header">
                    <h2>{{ panelTitle }}</h2>
                    <button class="close-button" @click="closePanel">
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                    </button>
                </div>
                
                <div class="panel-content">
                    <resource-panel v-if="activePanel === 'resource'" :game-state="gameState"></resource-panel>
                    <tech-panel v-else-if="activePanel === 'tech'" :game-state="gameState"></tech-panel>
                    <explore-panel v-else-if="activePanel === 'explore'" :game-state="gameState"></explore-panel>
                    <settings-panel v-else-if="activePanel === 'settings'" :game-state="gameState"></settings-panel>
                </div>
            </div>
            
            <div class="panel-backdrop" @click="closePanel"></div>
        </div>
    `,
    styles: `
        <style>
            .side-panel-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 100;
            }
            
            .side-panel-container.active {
                pointer-events: auto;
            }
            
            .panel-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                opacity: 0;
                transition: opacity var(--transition-normal);
            }
            
            .side-panel-container.active .panel-backdrop {
                opacity: 1;
            }
            
            .side-panel {
                position: absolute;
                top: 0;
                right: 0;
                width: 350px;
                height: 100%;
                background-color: var(--secondary-bg);
                box-shadow: -5px 0 15px rgba(0, 0, 0, 0.3);
                transform: translateX(100%);
                transition: transform var(--transition-normal);
                display: flex;
                flex-direction: column;
            }
            
            .side-panel.slide-in {
                transform: translateX(0);
            }
            
            .panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-md);
                border-bottom: 1px solid var(--border-color);
            }
            
            .panel-header h2 {
                font-family: 'Orbitron', sans-serif;
                color: var(--accent-color);
                font-size: var(--font-lg);
            }
            
            .close-button {
                background: none;
                border: none;
                color: var(--secondary-text);
                cursor: pointer;
                transition: color var(--transition-fast);
            }
            
            .close-button:hover {
                color: var(--primary-text);
            }
            
            .panel-content {
                flex: 1;
                overflow-y: auto;
                padding: var(--spacing-md);
            }
            
            @media (max-width: 768px) {
                .side-panel {
                    width: 85%;
                }
            }
        </style>
    `
};

