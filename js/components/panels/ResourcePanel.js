export default {
    props: {
        gameState: {
            type: Object,
            required: true
        }
    },
    computed: {
        formatNumber() {
            return function(num) {
                if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
                if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
                if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
                if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
                return Math.floor(num);
            };
        },
        resourceInfo() {
            const resources = this.gameState.resources;
            const rates = this.gameState.resourceRates;
            const capacities = this.gameState.resourceCapacities;
            
            return {
                energy: {
                    name: 'Energy',
                    value: resources.energy,
                    formatted: this.formatNumber(resources.energy),
                    rate: rates.energy,
                    formattedRate: rates.energy > 0 ? '+' + this.formatNumber(rates.energy) + '/s' : this.formatNumber(rates.energy) + '/s',
                    capacity: capacities.energy,
                    formattedCapacity: this.formatNumber(capacities.energy),
                    percentage: Math.min(100, (resources.energy / capacities.energy) * 100),
                    description: 'Powers all facilities and operations',
                    icon: 'M7,2V13H10V22L17,10H13L17,2H7Z',
                    color: 'var(--energy-color)'
                },
                minerals: {
                    name: 'Minerals',
                    value: resources.minerals,
                    formatted: this.formatNumber(resources.minerals),
                    rate: rates.minerals,
                    formattedRate: rates.minerals > 0 ? '+' + this.formatNumber(rates.minerals) + '/s' : this.formatNumber(rates.minerals) + '/s',
                    capacity: capacities.minerals,
                    formattedCapacity: this.formatNumber(capacities.minerals),
                    percentage: Math.min(100, (resources.minerals / capacities.minerals) * 100),
                    description: 'Used for construction and manufacturing',
                    icon: 'M12,20L3,11H8V4H16V11H21L12,20Z',
                    color: 'var(--minerals-color)'
                },
                knowledge: {
                    name: 'Knowledge',
                    value: resources.knowledge,
                    formatted: this.formatNumber(resources.knowledge),
                    rate: rates.knowledge,
                    formattedRate: rates.knowledge > 0 ? '+' + this.formatNumber(rates.knowledge) + '/s' : this.formatNumber(rates.knowledge) + '/s',
                    capacity: capacities.knowledge,
                    formattedCapacity: this.formatNumber(capacities.knowledge),
                    percentage: Math.min(100, (resources.knowledge / capacities.knowledge) * 100),
                    description: 'Required for research and technological advancement',
                    icon: 'M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z',
                    color: 'var(--knowledge-color)'
                },
                population: {
                    name: 'Population',
                    value: resources.population,
                    formatted: this.formatNumber(resources.population),
                    rate: rates.population,
                    formattedRate: rates.population > 0 ? '+' + this.formatNumber(rates.population) + '/s' : this.formatNumber(rates.population) + '/s',
                    capacity: capacities.population,
                    formattedCapacity: this.formatNumber(capacities.population),
                    percentage: Math.min(100, (resources.population / capacities.population) * 100),
                    description: 'Citizens of your civilization',
                    icon: 'M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z',
                    color: 'var(--population-color)'
                }
            };
        },
        colonies() {
            return this.gameState.colonies || [];
        },
        facilities() {
            return this.gameState.facilities || [];
        }
    },
    template: `
        <div class="resource-panel">
            <div class="panel-section">
                <h3>Resources</h3>
                <div class="resource-cards">
                    <div v-for="(resource, key) in resourceInfo" :key="key" class="resource-card">
                        <div class="resource-card-header">
                            <div class="resource-icon" :style="{ color: resource.color }">
                                <svg viewBox="0 0 24 24" width="24" height="24">
                                    <path :fill="resource.color" :d="resource.icon"/>
                                </svg>
                            </div>
                            <div class="resource-name">{{ resource.name }}</div>
                        </div>
                        
                        <div class="resource-details">
                            <div class="resource-value">{{ resource.formatted }}</div>
                            <div class="resource-rate" :class="{ 'negative': resource.rate < 0 }">
                                {{ resource.formattedRate }}
                            </div>
                        </div>
                        
                        <div class="resource-capacity">
                            <div class="progress-bar">
                                <div class="progress-fill" :style="{ width: resource.percentage + '%', backgroundColor: resource.color }"></div>
                            </div>
                            <div class="capacity-text">{{ resource.formattedCapacity }} max</div>
                        </div>
                        
                        <div class="resource-description">{{ resource.description }}</div>
                    </div>
                </div>
            </div>
            
            <div class="panel-section">
                <h3>Colonies</h3>
                <div v-if="colonies.length === 0" class="empty-state">
                    No colonies established yet. Explore to find habitable worlds.
                </div>
                <div v-else class="colony-list">
                    <div v-for="colony in colonies" :key="colony.id" class="colony-item">
                        <div class="colony-header">
                            <div class="colony-name">{{ colony.name }}</div>
                            <div class="colony-type">{{ colony.type }}</div>
                        </div>
                        <div class="colony-details">
                            <div class="colony-stat">
                                <span class="stat-label">Population:</span>
                                <span class="stat-value">{{ formatNumber(colony.population) }}</span>
                            </div>
                            <div class="colony-stat">
                                <span class="stat-label">Production:</span>
                                <span class="stat-value" :style="{ color: colony.specialization === 'energy' ? 'var(--energy-color)' : 
                                                                 colony.specialization === 'minerals' ? 'var(--minerals-color)' :
                                                                 colony.specialization === 'knowledge' ? 'var(--knowledge-color)' : 'var(--primary-text)' }">
                                    {{ colony.specialization.charAt(0).toUpperCase() + colony.specialization.slice(1) }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="panel-section">
                <h3>Facilities</h3>
                <div v-if="facilities.length === 0" class="empty-state">
                    No facilities built yet. Construct facilities to increase resource production.
                </div>
                <div v-else class="facility-list">
                    <div v-for="facility in facilities" :key="facility.id" class="facility-item">
                        <div class="facility-header">
                            <div class="facility-name">{{ facility.name }}</div>
                            <div class="facility-status" :class="facility.status.toLowerCase()">{{ facility.status }}</div>
                        </div>
                        <div class="facility-location">{{ facility.location }}</div>
                        <div class="facility-description">{{ facility.description }}</div>
                        <div class="facility-production">
                            <div v-for="(rate, resource) in facility.production" :key="resource" class="facility-production-item"
                                 v-if="rate !== 0">
                                <span :style="{ color: resourceInfo[resource]?.color || 'var(--primary-text)' }">
                                    {{ rate > 0 ? '+' : '' }}{{ rate }}/s {{ resource }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: `
        <style>
            .resource-panel {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-lg);
            }
            
            .panel-section {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }
            
            .panel-section h3 {
                font-family: 'Orbitron', sans-serif;
                color: var(--primary-text);
                font-size: var(--font-md);
                border-bottom: 1px solid var(--border-color);
                padding-bottom: var(--spacing-xs);
            }
            
            .resource-cards {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--spacing-md);
            }
            
            .resource-card {
                background-color: var(--terminal-bg);
                border-radius: var(--radius-md);
                padding: var(--spacing-md);
                border: 1px solid var(--border-color);
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm);
            }
            
            .resource-card-header {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }
            
            .resource-name {
                font-weight: bold;
                font-size: var(--font-md);
            }
            
            .resource-details {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
            }
            
            .resource-value {
                font-size: var(--font-lg);
                font-weight: bold;
            }
            
            .resource-rate {
                color: var(--success-color);
            }
            
            .resource-rate.negative {
                color: var(--warning-color);
            }
            
            .resource-capacity {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
            }
            
            .progress-bar {
                width: 100%;
                height: 6px;
                background-color: var(--border-color);
                border-radius: 3px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                transition: width 0.3s ease;
            }
            
            .capacity-text {
                font-size: var(--font-xs);
                color: var(--secondary-text);
                text-align: right;
            }
            
            .resource-description {
                font-size: var(--font-sm);
                color: var(--secondary-text);
            }
            
            .empty-state {
                text-align: center;
                padding: var(--spacing-lg);
                background-color: var(--terminal-bg);
                border-radius: var(--radius-md);
                color: var(--secondary-text);
                font-style: italic;
            }
            
            .colony-list, .facility-list {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }
            
            .colony-item, .facility-item {
                background-color: var(--terminal-bg);
                border-radius: var(--radius-md);
                padding: var(--spacing-md);
                border: 1px solid var(--border-color);
            }
            
            .colony-header, .facility-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: var(--spacing-sm);
            }
            
            .colony-name, .facility-name {
                font-weight: bold;
                font-size: var(--font-md);
            }
            
            .colony-type, .facility-status {
                font-size: var(--font-xs);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--radius-sm);
                background-color: var(--border-color);
            }
            
            .facility-status.operational {
                background-color: rgba(101, 221, 155, 0.2);
                color: var(--success-color);
            }
            
            .facility-status.building {
                background-color: rgba(255, 203, 69, 0.2);
                color: var(--energy-color);
            }
            
            .facility-status.damaged {
                background-color: rgba(255, 92, 92, 0.2);
                color: var(--warning-color);
            }
            
            .colony-details {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-md);
                margin-top: var(--spacing-sm);
            }
            
            .colony-stat {
                display: flex;
                flex-direction: column;
            }
            
            .stat-label {
                font-size: var(--font-xs);
                color: var(--secondary-text);
            }
            
            .stat-value {
                font-size: var(--font-sm);
                font-weight: bold;
            }
            
            .facility-location {
                font-size: var(--font-sm);
                color: var(--secondary-text);
                margin-bottom: var(--spacing-sm);
            }
            
            .facility-description {
                font-size: var(--font-sm);
                margin-bottom: var(--spacing-sm);
            }
            
            .facility-production {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-sm);
            }
            
            .facility-production-item {
                font-size: var(--font-xs);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--radius-sm);
                background-color: var(--secondary-bg);
            }
        </style>
    `
};

