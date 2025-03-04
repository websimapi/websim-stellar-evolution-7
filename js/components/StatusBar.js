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
        resourceStatus() {
            const resources = this.gameState.resources;
            const rates = this.gameState.resourceRates;
            
            return {
                energy: {
                    value: this.formatNumber(resources.energy),
                    rate: rates.energy > 0 ? '+' + this.formatNumber(rates.energy) + '/s' : this.formatNumber(rates.energy) + '/s',
                    isNegative: rates.energy < 0
                },
                minerals: {
                    value: this.formatNumber(resources.minerals),
                    rate: rates.minerals > 0 ? '+' + this.formatNumber(rates.minerals) + '/s' : this.formatNumber(rates.minerals) + '/s',
                    isNegative: rates.minerals < 0
                },
                knowledge: {
                    value: this.formatNumber(resources.knowledge),
                    rate: rates.knowledge > 0 ? '+' + this.formatNumber(rates.knowledge) + '/s' : this.formatNumber(rates.knowledge) + '/s',
                    isNegative: rates.knowledge < 0
                },
                population: {
                    value: this.formatNumber(resources.population),
                    rate: rates.population > 0 ? '+' + this.formatNumber(rates.population) + '/s' : this.formatNumber(rates.population) + '/s',
                    isNegative: rates.population < 0
                }
            };
        },
        notifications() {
            return this.gameState.notifications || [];
        },
        hasWarnings() {
            return this.notifications.some(n => n.severity === 'warning' || n.severity === 'critical');
        }
    },
    template: `
        <div class="status-bar">
            <div class="resources">
                <div class="resource" :class="{ warning: resourceStatus.energy.isNegative }">
                    <svg class="resource-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="var(--energy-color)" d="M7,2V13H10V22L17,10H13L17,2H7Z"/>
                    </svg>
                    <div class="resource-values">
                        <span class="resource-value">{{ resourceStatus.energy.value }}</span>
                        <span class="resource-rate" :class="{ negative: resourceStatus.energy.isNegative }">
                            {{ resourceStatus.energy.rate }}
                        </span>
                    </div>
                </div>
                <div class="resource" :class="{ warning: resourceStatus.minerals.isNegative }">
                    <svg class="resource-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="var(--minerals-color)" d="M12,20L3,11H8V4H16V11H21L12,20Z"/>
                    </svg>
                    <div class="resource-values">
                        <span class="resource-value">{{ resourceStatus.minerals.value }}</span>
                        <span class="resource-rate" :class="{ negative: resourceStatus.minerals.isNegative }">
                            {{ resourceStatus.minerals.rate }}
                        </span>
                    </div>
                </div>
                <div class="resource" :class="{ warning: resourceStatus.knowledge.isNegative }">
                    <svg class="resource-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="var(--knowledge-color)" d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z"/>
                    </svg>
                    <div class="resource-values">
                        <span class="resource-value">{{ resourceStatus.knowledge.value }}</span>
                        <span class="resource-rate" :class="{ negative: resourceStatus.knowledge.isNegative }">
                            {{ resourceStatus.knowledge.rate }}
                        </span>
                    </div>
                </div>
                <div class="resource" :class="{ warning: resourceStatus.population.isNegative }">
                    <svg class="resource-icon" viewBox="0 0 24 24" width="16" height="16">
                        <path fill="var(--population-color)" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                    </svg>
                    <div class="resource-values">
                        <span class="resource-value">{{ resourceStatus.population.value }}</span>
                        <span class="resource-rate" :class="{ negative: resourceStatus.population.isNegative }">
                            {{ resourceStatus.population.rate }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="notifications" v-if="hasWarnings">
                <div class="notification-icon" :class="{ 'alert-pulse': hasWarnings }">
                    <svg viewBox="0 0 24 24" width="24" height="24">
                        <path fill="var(--warning-color)" d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
                    </svg>
                    <span class="notification-count" v-if="notifications.length > 0">{{ notifications.length }}</span>
                </div>
            </div>
        </div>
    `,
    styles: `
        <style>
            .status-bar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
            }
            
            .resources {
                display: flex;
                gap: var(--spacing-md);
            }
            
            .resource {
                display: flex;
                align-items: center;
                gap: var(--spacing-xs);
                padding: var(--spacing-xs) var(--spacing-sm);
                border-radius: var(--radius-sm);
                background-color: var(--terminal-bg);
            }
            
            .resource.warning {
                background-color: rgba(255, 92, 92, 0.2);
            }
            
            .resource-values {
                display: flex;
                flex-direction: column;
                line-height: 1.2;
            }
            
            .resource-value {
                font-weight: bold;
                font-size: var(--font-sm);
            }
            
            .resource-rate {
                font-size: var(--font-xs);
                color: var(--success-color);
            }
            
            .resource-rate.negative {
                color: var(--warning-color);
            }
            
            .notifications {
                position: relative;
            }
            
            .notification-icon {
                cursor: pointer;
            }
            
            .notification-count {
                position: absolute;
                top: -8px;
                right: -8px;
                background-color: var(--warning-color);
                color: var(--primary-bg);
                border-radius: 50%;
                width: 18px;
                height: 18px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }
            
            @media (max-width: 768px) {
                .status-bar {
                    flex-wrap: wrap;
                }
                
                .resources {
                    width: 100%;
                    justify-content: space-between;
                }
                
                .resource {
                    flex: 1;
                }
            }
        </style>
    `
};

