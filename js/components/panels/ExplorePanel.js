export default {
    props: {
        gameState: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            activeTab: 'systems'
        };
    },
    computed: {
        starSystems() {
            return this.gameState.starSystems || [];
        },
        planets() {
            return this.gameState.planets || [];
        },
        discoveries() {
            return this.gameState.discoveries || [];
        },
        explorationMissions() {
            return this.gameState.explorationMissions || [];
        },
        colonizablePlanets() {
            return this.planets.filter(planet => planet.colonizable && !planet.colonized);
        },
        currentSystem() {
            return this.starSystems.find(system => system.id === this.gameState.currentSystemId) || null;
        }
    },
    methods: {
        setTab(tab) {
            this.activeTab = tab;
        },
        getSystemTypeColor(type) {
            switch(type) {
                case 'yellow_dwarf': return '#ffcc44';
                case 'red_dwarf': return '#ff6644';
                case 'blue_giant': return '#4488ff';
                case 'white_dwarf': return '#ddddff';
                case 'neutron_star': return '#aaccff';
                case 'black_hole': return '#550055';
                default: return '#ffffff';
            }
        },
        getPlanetTypeColor(type) {
            switch(type) {
                case 'rocky': return '#cc8866';
                case 'gas_giant': return '#bbaa44';
                case 'ice_giant': return '#aaddff';
                case 'terrestrial': return '#66aa77';
                case 'oceanic': return '#4477aa';
                case 'desert': return '#ddbb66';
                case 'volcanic': return '#dd6644';
                default: return '#ffffff';
            }
        },
        formatDate(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        },
        formatDistance(distance) {
            if (distance < 1) {
                return (distance * 150).toFixed(1) + ' million km';
            } else if (distance < 1000) {
                return distance.toFixed(1) + ' AU';
            } else {
                return (distance / 63241.1).toFixed(2) + ' light years';
            }
        }
    },
    template: `
        <div class="explore-panel">
            <div class="explore-tabs">
                <button @click="setTab('systems')" :class="{ active: activeTab === 'systems' }">Star Systems</button>
                <button @click="setTab('planets')" :class="{ active: activeTab === 'planets' }">Planets</button>
                <button @click="setTab('discoveries')" :class="{ active: activeTab === 'discoveries' }">Discoveries</button>
                <button @click="setTab('missions')" :class="{ active: activeTab === 'missions' }">Missions</button>
            </div>
            
            <div class="tab-content">
                <!-- Star Systems Tab -->
                <div v-if="activeTab === 'systems'">
                    <div class="current-location" v-if="currentSystem">
                        <h3>Current Location</h3>
                        <div class="system-card current">
                            <div class="system-icon" :style="{ backgroundColor: getSystemTypeColor(currentSystem.type) }"></div>
                            <div class="system-details">
                                <div class="system-name">{{ currentSystem.name }}</div>
                                <div class="system-type">{{ currentSystem.type.replace('_', ' ') }}</div>
                                <div class="system-stats">
                                    <span>Planets: {{ currentSystem.planetCount }}</span>
                                    <span>Explored: {{ Math.round(currentSystem.explorationPercentage) }}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <h3>Discovered Star Systems</h3>
                    <div v-if="starSystems.length === 0" class="empty-state">
                        No star systems discovered yet. Try exploring to find star systems.
                    </div>
                    <div v-else class="systems-grid">
                        <div v-for="system in starSystems" :key="system.id" class="system-card" 
                             :class="{ current: system.id === gameState.currentSystemId }">
                            <div class="system-icon" :style="{ backgroundColor: getSystemTypeColor(system.type) }"></div>
                            <div class="system-details">
                                <div class="system-name">{{ system.name }}</div>
                                <div class="system-type">{{ system.type.replace('_', ' ') }}</div>
                                <div class="system-stats">
                                    <span>Distance: {{ formatDistance(system.distance) }}</span>
                                    <span>Planets: {{ system.planetCount }}</span>
                                    <span>Explored: {{ Math.round(system.explorationPercentage) }}%</span>
                                </div>
                                <div class="system-description">{{ system.description }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Planets Tab -->
                <div v-if="activeTab === 'planets'">
                    <h3>Colonizable Planets</h3>
                    <div v-if="colonizablePlanets.length === 0" class="empty-state">
                        No colonizable planets discovered yet. Keep exploring.
                    </div>
                    <div v-else class="planets-grid">
                        <div v-for="planet in colonizablePlanets" :key="planet.id" class="planet-card">
                            <div class="planet-header">
                                <div class="planet-icon" :style="{ backgroundColor: getPlanetTypeColor(planet.type) }"></div>
                                <div class="planet-title">
                                    <div class="planet-name">{{ planet.name }}</div>
                                    <div class="planet-system">{{ planet.systemName }}</div>
                                </div>
                                <div class="planet-type">{{ planet.type.replace('_', ' ') }}</div>
                            </div>
                            <div class="planet-stats">
                                <div class="planet-stat">
                                    <span class="stat-label">Size:</span>
                                    <span class="stat-value">{{ planet.size }}</span>
                                </div>
                                <div class="planet-stat">
                                    <span class="stat-label">Temperature:</span>
                                    <span class="stat-value">{{ planet.temperature }}°C</span>
                                </div>
                                <div class="planet-stat">
                                    <span class="stat-label">Atmosphere:</span>
                                    <span class="stat-value">{{ planet.atmosphere }}</span>
                                </div>
                                <div class="planet-stat">
                                    <span class="stat-label">Water:</span>
                                    <span class="stat-value">{{ planet.water }}%</span>
                                </div>
                            </div>
                            <div class="planet-resources">
                                <div class="resource-header">Resources:</div>
                                <div class="resource-list">
                                    <span v-for="(value, resource) in planet.resources" :key="resource"
                                          :class="['resource-tag', { high: value === 'high', medium: value === 'medium', low: value === 'low' }]">
                                        {{ resource }}: {{ value }}
                                    </span>
                                </div>
                            </div>
                            <div class="planet-description">{{ planet.description }}</div>
                        </div>
                    </div>
                    
                    <h3>All Discovered Planets</h3>
                    <div v-if="planets.length === 0" class="empty-state">
                        No planets discovered yet. Try exploring to find planets.
                    </div>
                    <div v-else class="planets-list">
                        <div v-for="planet in planets" :key="planet.id" class="planet-item">
                            <div class="planet-icon" :style="{ backgroundColor: getPlanetTypeColor(planet.type) }"></div>
                            <div class="planet-basic-info">
                                <div class="planet-name">{{ planet.name }}</div>
                                <div class="planet-system">{{ planet.systemName }}</div>
                            </div>
                            <div class="planet-status">
                                <span v-if="planet.colonized" class="colonized">Colonized</span>
                                <span v-else-if="planet.colonizable" class="colonizable">Colonizable</span>
                                <span v-else class="uncolonizable">Not Habitable</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Discoveries Tab -->
                <div v-if="activeTab === 'discoveries'">
                    <h3>Scientific Discoveries</h3>
                    <div v-if="discoveries.length === 0" class="empty-state">
                        No scientific discoveries yet. Explore more or research technologies.
                    </div>
                    <div v-else class="discoveries-list">
                        <div v-for="discovery in discoveries" :key="discovery.id" class="discovery-card">
                            <div class="discovery-header">
                                <div class="discovery-title">{{ discovery.name }}</div>
                                <div class="discovery-date">{{ formatDate(discovery.timestamp) }}</div>
                            </div>
                            <div class="discovery-location" v-if="discovery.location">
                                Location: {{ discovery.location }}
                            </div>
                            <div class="discovery-description">{{ discovery.description }}</div>
                            <div class="discovery-effects" v-if="discovery.effects && discovery.effects.length > 0">
                                <div class="effects-header">Effects:</div>
                                <ul>
                                    <li v-for="(effect, index) in discovery.effects" :key="index">{{ effect }}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Missions Tab -->
                <div v-if="activeTab === 'missions'">
                    <h3>Active Exploration Missions</h3>
                    <div v-if="explorationMissions.length === 0" class="empty-state">
                        No active exploration missions. Start one by entering a command.
                    </div>
                    <div v-else class="missions-list">
                        <div v-for="mission in explorationMissions" :key="mission.id" class="mission-card">
                            <div class="mission-header">
                                <div class="mission-title">{{ mission.name }}</div>
                                <div class="mission-status" :class="mission.status.toLowerCase()">{{ mission.status }}</div>
                            </div>
                            <div class="mission-location">
                                <span>Target: {{ mission.target }}</span>
                            </div>
                            <div class="mission-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" :style="{ width: (mission.progress / mission.duration * 100) + '%' }"></div>
                                </div>
                                <div class="progress-text">
                                    {{ Math.round(mission.progress / mission.duration * 100) }}% complete
                                </div>
                            </div>
                            <div class="mission-eta">
                                <span>Estimated completion: {{ formatDate(mission.completionTimestamp) }}</span>
                            </div>
                            <div class="mission-description">{{ mission.description }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: `
        <style>
            .explore-panel {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-lg);
            }
            
            .explore-tabs {
                display: flex;
                gap: var(--spacing-xs);
                border-bottom: 1px solid var(--border-color);
            }
            
            .explore-tabs button {
                background: none;
                border: none;
                color: var(--secondary-text);
                cursor: pointer;
                padding: var(--spacing-sm) var(--spacing-md);
                font-family: 'Space Mono', monospace;
                font-size: var(--font-sm);
                transition: all var(--transition-fast);
                border-bottom: 2px solid transparent;
            }
            
            .explore-tabs button:hover {
                color: var(--primary-text);
            }
            
            .explore-tabs button.active {
                color: var(--accent-color);
                border-bottom-color: var(--accent-color);
            }
            
            .tab-content {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-lg);
            }
            
            h3 {
                font-family: 'Orbitron', sans-serif;
                color: var(--primary-text);
                font-size: var(--font-md);
                border-bottom: 1px solid var(--border-color);
                padding-bottom: var(--spacing-xs);
                margin-bottom: var(--spacing-md);
            }
            
            .empty-state {
                text-align: center;
                padding: var(--spacing-lg);
                background-color: var(--terminal-bg);
                border-radius: var(--radius-md);
                color: var(--secondary-text);
                font-style: italic;
            }
            
            .systems-grid, .planets-grid {
                display: grid;
                grid-template-columns: 1fr;
                gap: var(--spacing-md);
            }
            
            .system-card, .planet-card, .discovery-card, .mission-card {
                background-color: var(--terminal-bg);
                border-radius: var(--radius-md);
                padding: var(--spacing-md);
                border: 1px solid var(--border-color);
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm);
            }
            
            .system-card.current {
                border-color: var(--accent-color);
                background-color: rgba(93, 245, 255, 0.1);
            }
            
            .system-icon, .planet-icon {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin-right: var(--spacing-sm);
            }
            
            .system-details {
                flex: 1;
            }
            
            .system-name, .planet-name, .discovery-title, .mission-title {
                font-weight: bold;
                font-size: var(--font-md);
            }
            
            .system-type, .planet-type, .discovery-date, .mission-status {
                font-size: var(--font-xs);
                color: var(--secondary-text);
                margin-bottom: var(--spacing-xs);
            }
            
            .mission-status.active {
                color: var(--success-color);
            }
            
            .mission-status.pending {
                color: var(--energy-color);
            }
            
            .system-stats, .planet-stats, .mission-location, .discovery-location {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-md);
                margin: var(--spacing-xs) 0;
                font-size: var(--font-sm);
            }
            
            .system-description, .planet-description, .discovery-description, .mission-description {
                margin-top: var(--spacing-sm);
                font-size: var(--font-sm);
                color: var(--secondary-text);
            }
            
            .planet-header {
                display: flex;
                align-items: center;
            }
            
            .planet-title {
                flex: 1;
            }
            
            .planet-system {
                font-size: var(--font-xs);
                color: var(--secondary-text);
            }
            
            .planet-stat {
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
            
            .planet-resources, .discovery-effects {
                margin-top: var(--spacing-sm);
            }
            
            .resource-header, .effects-header {
                font-size: var(--font-sm);
                font-weight: bold;
                margin-bottom: var(--spacing-xs);
            }
            
            .resource-list {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-xs);
            }
            
            .resource-tag {
                font-size: var(--font-xs);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--radius-sm);
                background-color: var(--secondary-bg);
            }
            
            .resource-tag.high {
                background-color: rgba(101, 221, 155, 0.2);
                color: var(--success-color);
            }
            
            .resource-tag.medium {
                background-color: rgba(255, 203, 69, 0.2);
                color: var(--energy-color);
            }
            
            .resource-tag.low {
                background-color: rgba(255, 92, 92, 0.2);
                color: var(--warning-color);
            }
            
            .planets-list, .discoveries-list, .missions-list {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm);
            }
            
            .planet-item {
                display: flex;
                align-items: center;
                padding: var(--spacing-sm);
                background-color: var(--terminal-bg);
                border-radius: var(--radius-md);
                border: 1px solid var(--border-color);
            }
            
            .planet-basic-info {
                flex: 1;
                margin-left: var(--spacing-sm);
            }
            
            .planet-status span {
                font-size: var(--font-xs);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--radius-sm);
            }
            
            .colonized {
                background-color: rgba(101, 221, 155, 0.2);
                color: var(--success-color);
            }
            
            .colonizable {
                background-color: rgba(255, 203, 69, 0.2);
                color: var(--energy-color);
            }
            
            .uncolonizable {
                background-color: rgba(255, 92, 92, 0.2);
                color: var(--warning-color);
            }
            
            .discovery-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .discovery-effects ul {
                margin: var(--spacing-xs) 0 0 var(--spacing-md);
            }
            
            .discovery-effects li {
                margin-bottom: var(--spacing-xs);
            }
            
            .mission-progress {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
                margin: var(--spacing-sm) 0;
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
                background-color: var(--accent-color);
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: var(--font-xs);
                color: var(--secondary-text);
                text-align: right;
            }
            
            .mission-eta {
                font-size: var(--font-sm);
                color: var(--energy-color);
            }
        </style>
    `
};

