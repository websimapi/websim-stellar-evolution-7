export default {
    props: {
        gameState: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            activeCategory: 'all'
        };
    },
    computed: {
        categories() {
            return [
                { id: 'all', name: 'All Technologies' },
                { id: 'energy', name: 'Energy Technologies' },
                { id: 'propulsion', name: 'Propulsion Systems' },
                { id: 'computing', name: 'Computing' },
                { id: 'materials', name: 'Materials Science' },
                { id: 'biology', name: 'Biology' }
            ];
        },
        technologies() {
            const techs = this.gameState.technologies || [];
            
            if (this.activeCategory === 'all') {
                return techs;
            }
            
            return techs.filter(tech => tech.category === this.activeCategory);
        },
        currentResearch() {
            return this.gameState.currentResearch || null;
        },
        formatNumber() {
            return function(num) {
                if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
                if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
                if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
                if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
                return Math.floor(num);
            };
        }
    },
    methods: {
        setCategory(categoryId) {
            this.activeCategory = categoryId;
        },
        getCategoryIcon(categoryId) {
            switch(categoryId) {
                case 'energy':
                    return 'M7,2V13H10V22L17,10H13L17,2H7Z';
                case 'propulsion':
                    return 'M8,2A2,2 0 0,0 6,4V20A2,2 0 0,0 8,22H16A2,2 0 0,0 18,20V4A2,2 0 0,0 16,2H8M9,4H15V5H9V4M9,7H15V8H9V7M9,10H13V11H9V10M9,16H15V17H9V16M9,19H15V20H9V19Z';
                case 'computing':
                    return 'M4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H16L12,22L8,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M4,4V16H8.83L12,19.17L15.17,16H20V4H4M6,7H18V9H6V7M6,11H16V13H6V11Z';
                case 'materials':
                    return 'M12,2L2,12H6V22H18V12H22L12,2M12,5.5L16.5,10H15V18H9V10H7.5L12,5.5Z';
                case 'biology':
                    return 'M15,4.7L12,3L9,4.7V8.3L12,10L15,8.3V4.7M10,16.8L7,15.1V11.5L10,13.2V16.8M16,11.5V15.1L13,16.8V13.2L16,11.5M12,12.9L9,11.2V7.8L12,9.5L15,7.8V11.2L12,12.9M12,21L3,17V13.5L5,14.5V16.6L12,19.9L19,16.6V14.5L21,13.5V17L12,21Z';
                default:
                    return 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z';
            }
        },
        getStatusClass(tech) {
            if (tech.status === 'researched') return 'researched';
            if (tech.status === 'researching') return 'researching';
            if (tech.status === 'available') return 'available';
            return 'locked';
        }
    },
    template: `
        <div class="tech-panel">
            <div class="tech-categories">
                <button v-for="category in categories" 
                        :key="category.id" 
                        @click="setCategory(category.id)"
                        :class="{ active: activeCategory === category.id }"
                        class="category-button">
                    <svg v-if="category.id !== 'all'" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="currentColor" :d="getCategoryIcon(category.id)"/>
                    </svg>
                    {{ category.name }}
                </button>
            </div>
            
            <div class="current-research" v-if="currentResearch">
                <h3>Current Research</h3>
                <div class="research-card">
                    <div class="research-header">
                        <div class="research-name">{{ currentResearch.name }}</div>
                        <div class="research-category">{{ currentResearch.category }}</div>
                    </div>
                    
                    <div class="research-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" :style="{ width: (currentResearch.progress / currentResearch.cost * 100) + '%' }"></div>
                        </div>
                        <div class="progress-text">
                            {{ formatNumber(currentResearch.progress) }} / {{ formatNumber(currentResearch.cost) }} knowledge
                        </div>
                    </div>
                    
                    <div class="research-eta">
                        <span>Estimated time: {{ Math.ceil((currentResearch.cost - currentResearch.progress) / gameState.resourceRates.knowledge) }} seconds</span>
                    </div>
                    
                    <div class="research-description">{{ currentResearch.description }}</div>
                </div>
            </div>
            
            <div class="tech-list">
                <h3>{{ activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1) }} Technologies</h3>
                
                <div v-if="technologies.length === 0" class="empty-state">
                    No technologies available in this category yet.
                </div>
                
                <div v-else class="tech-grid">
                    <div v-for="tech in technologies" :key="tech.id" class="tech-card" :class="getStatusClass(tech)">
                        <div class="tech-header">
                            <div class="tech-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path fill="currentColor" :d="getCategoryIcon(tech.category)"/>
                                </svg>
                            </div>
                            <div class="tech-info">
                                <div class="tech-name">{{ tech.name }}</div>
                                <div class="tech-status">{{ tech.status.charAt(0).toUpperCase() + tech.status.slice(1) }}</div>
                            </div>
                        </div>
                        
                        <div class="tech-description">{{ tech.description }}</div>
                        
                        <div class="tech-requirements" v-if="tech.status === 'locked'">
                            <div class="requirement-label">Requirements:</div>
                            <ul>
                                <li v-for="(req, index) in tech.requirements" :key="index">{{ req }}</li>
                            </ul>
                        </div>
                        
                        <div class="tech-cost" v-if="tech.status === 'available'">
                            <span>Cost: {{ formatNumber(tech.cost) }} knowledge</span>
                        </div>
                        
                        <div class="tech-unlocks" v-if="tech.status === 'researched'">
                            <div class="unlock-label">Unlocked:</div>
                            <ul>
                                <li v-for="(unlock, index) in tech.unlocks" :key="index">{{ unlock }}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: `
        <style>
            .tech-panel {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-lg);
            }
            
            .tech-categories {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-sm);
            }
            
            .category-button {
                background-color: var(--terminal-bg);
                border: 1px solid var(--border-color);
                border-radius: var(--radius-sm);
                padding: var(--spacing-xs) var(--spacing-sm);
                cursor: pointer;
                color: var(--secondary-text);
                font-family: 'Space Mono', monospace;
                font-size: var(--font-xs);
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
                transition: all var(--transition-fast);
            }
            
            .category-button:hover {
                background-color: var(--border-color);
                color: var(--primary-text);
            }
            
            .category-button.active {
                background-color: var(--accent-color);
                color: var(--primary-bg);
                border-color: var(--accent-color);
            }
            
            h3 {
                font-family: 'Orbitron', sans-serif;
                color: var(--primary-text);
                font-size: var(--font-md);
                border-bottom: 1px solid var(--border-color);
                padding-bottom: var(--spacing-xs);
                margin-bottom: var(--spacing-md);
            }
            
            .research-card {
                background-color: var(--terminal-bg);
                border-radius: var(--radius-md);
                padding: var(--spacing-md);
                border: 1px solid var(--border-color);
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm);
            }
            
            .research-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .research-name {
                font-weight: bold;
                font-size: var(--font-md);
            }
            
            .research-category {
                font-size: var(--font-xs);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--radius-sm);
                background-color: var(--border-color);
                text-transform: capitalize;
            }
            
            .research-progress {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
            }
            
            .progress-bar {
                width: 100%;
                height: 8px;
                background-color: var(--border-color);
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background-color: var(--knowledge-color);
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: var(--font-xs);
                color: var(--secondary-text);
                text-align: right;
            }
            
            .research-eta {
                font-size: var(--font-sm);
                color: var(--energy-color);
            }
            
            .research-description {
                margin-top: var(--spacing-sm);
                font-size: var(--font-sm);
            }
            
            .tech-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--spacing-md);
            }
            
            .tech-card {
                background-color: var(--terminal-bg);
                border-radius: var(--radius-md);
                padding: var(--spacing-md);
                border: 1px solid var(--border-color);
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm);
            }
            
            .tech-card.researched {
                border-color: var(--success-color);
                background-color: rgba(101, 221, 155, 0.1);
            }
            
            .tech-card.researching {
                border-color: var(--energy-color);
                background-color: rgba(255, 203, 69, 0.1);
            }
            
            .tech-card.available {
                border-color: var(--accent-color);
                background-color: rgba(93, 245, 255, 0.1);
            }
            
            .tech-header {
                display: flex;
                gap: var(--spacing-sm);
            }
            
            .tech-icon {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--secondary-bg);
                border-radius: var(--radius-sm);
            }
            
            .tech-card.researched .tech-icon {
                color: var(--success-color);
            }
            
            .tech-card.researching .tech-icon {
                color: var(--energy-color);
            }
            
            .tech-card.available .tech-icon {
                color: var(--accent-color);
            }
            
            .tech-info {
                flex: 1;
            }
            
            .tech-name {
                font-weight: bold;
                font-size: var(--font-md);
            }
            
            .tech-status {
                font-size: var(--font-xs);
                color: var(--secondary-text);
            }
            
            .tech-card.researched .tech-status {
                color: var(--success-color);
            }
            
            .tech-card.researching .tech-status {
                color: var(--energy-color);
            }
            
            .tech-card.available .tech-status {
                color: var(--accent-color);
            }
            
            .tech-description {
                font-size: var(--font-sm);
            }
            
            .tech-requirements, .tech-unlocks {
                margin-top: var(--spacing-sm);
                font-size: var(--font-sm);
            }
            
            .requirement-label, .unlock-label {
                font-weight: bold;
            }
            
            ul {
                margin: var(--spacing-xs) 0 0 var(--spacing-md);
            }
            
            li {
                margin-bottom: var(--spacing-xs);
            }
            
            .tech-cost {
                font-size: var(--font-sm);
                color: var(--knowledge-color);
            }
            
            .empty-state {
                text-align: center;
                padding: var(--spacing-lg);
                background-color: var(--terminal-bg);
                border-radius: var(--radius-md);
                color: var(--secondary-text);
                font-style: italic;
            }
        </style>
    `
};

