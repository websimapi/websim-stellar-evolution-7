/**
 * Start game timers for automatic updates and saving
 * @param {object} gameState - The current game state
 * @param {function} saveFunction - Function to call to save the game
 * @returns {object} - Object containing timer references
 */
export function startGameTimers(gameState, saveFunction) {
    // Calculate how often to update resources (in milliseconds)
    const resourceTickInterval = 1000; // Update resources every second
    
    // Calculate auto-save interval
    const autoSaveInterval = (gameState.settings.autoSaveInterval || 60) * 1000; // Convert to milliseconds
    
    // Timer for resource accumulation
    const resourceTick = setInterval(() => {
        updateResources(gameState);
    }, resourceTickInterval);
    
    // Timer for auto-saving
    const autosave = setInterval(() => {
        saveFunction();
    }, autoSaveInterval);
    
    return {
        resourceTick,
        autosave
    };
}

/**
 * Stop all game timers
 * @param {object} timers - Object containing timer references
 */
export function stopGameTimers(timers) {
    if (timers.resourceTick) {
        clearInterval(timers.resourceTick);
    }
    
    if (timers.autosave) {
        clearInterval(timers.autosave);
    }
}

/**
 * Update resources based on production rates
 * @param {object} gameState - The current game state to update
 */
function updateResources(gameState) {
    const resources = gameState.resources;
    const rates = gameState.resourceRates;
    const capacities = gameState.resourceCapacities;
    
    // Update each resource
    Object.keys(rates).forEach(resource => {
        // Apply the rate (per second)
        resources[resource] += rates[resource];
        
        // Cap at capacity
        if (capacities[resource] && resources[resource] > capacities[resource]) {
            resources[resource] = capacities[resource];
        }
        
        // Prevent negative values
        if (resources[resource] < 0) {
            resources[resource] = 0;
            
            // TODO: Handle resource shortages
            // This could trigger events or notifications
        }
    });
    
    // Update any ongoing research
    if (gameState.currentResearch) {
        const research = gameState.currentResearch;
        research.progress += rates.knowledge * 0.5; // Only part of knowledge goes to research
        
        // Check if research is complete
        if (research.progress >= research.cost) {
            completeResearch(gameState, research.id);
        }
    }
    
    // Update exploration missions
    if (gameState.explorationMissions && gameState.explorationMissions.length > 0) {
        gameState.explorationMissions = gameState.explorationMissions.map(mission => {
            if (mission.status === 'ACTIVE') {
                // Progress the mission
                mission.progress += 0.1; // Arbitrary progress rate
                
                // Check if mission is complete
                if (mission.progress >= mission.duration) {
                    completeMission(gameState, mission);
                    return { ...mission, status: 'COMPLETED' };
                }
            }
            return mission;
        });
    }
    
    // Update facilities
    if (gameState.facilities && gameState.facilities.length > 0) {
        gameState.facilities = gameState.facilities.map(facility => {
            if (facility.status === 'BUILDING') {
                // Simulate construction progress
                // In a real game, this would have a proper completion mechanism
                // For demo purposes, we'll just randomly complete some facilities
                if (Math.random() < 0.001) { // Very small chance each tick
                    return { ...facility, status: 'OPERATIONAL' };
                }
            }
            return facility;
        });
    }
}

/**
 * Complete research and update game state
 * @param {object} gameState - The current game state
 * @param {string} techId - ID of the completed technology
 */
function completeResearch(gameState, techId) {
    // Update technology status
    gameState.technologies = gameState.technologies.map(tech => 
        tech.id === techId 
            ? { ...tech, status: 'researched' }
            : tech
    );
    
    // Clear current research
    gameState.currentResearch = null;
    
    // Add a discovery
    const tech = gameState.technologies.find(t => t.id === techId);
    if (tech) {
        const discovery = {
            id: `tech_discovery_${Date.now()}`,
            name: `${tech.name} Breakthrough`,
            timestamp: new Date().toISOString(),
            location: 'Research Laboratories',
            description: `Your scientists have successfully completed research on ${tech.name}, ${tech.description.toLowerCase()}`,
            effects: tech.unlocks || ['New technological capabilities']
        };
        
        gameState.discoveries = [...gameState.discoveries, discovery];
        
        // Potentially add a notification
        // This would be handled by the UI in a real implementation
    }
}

/**
 * Complete an exploration mission
 * @param {object} gameState - The current game state
 * @param {object} mission - The mission that completed
 */
function completeMission(gameState, mission) {
    // This would generate discoveries, update star systems, etc.
    // For the demo, we'll just log it
    console.log(`Mission complete: ${mission.name}`);
    
    // If this was a mission to Proxima Centauri, we might add planets
    if (mission.target === 'Proxima Centauri') {
        // Add a planet to the Proxima Centauri system
        const newPlanet = {
            id: 'proxima_b',
            name: 'Proxima Centauri b',
            systemName: 'Proxima Centauri',
            systemId: 'proxima_centauri',
            type: 'terrestrial',
            size: 'Medium',
            temperature: -40,
            atmosphere: 'Thin, unknown composition',
            water: 0,
            colonized: false,
            colonizable: false,
            resources: {
                energy: 'medium',
                minerals: 'high',
                knowledge: 'medium'
            },
            description: 'A rocky exoplanet orbiting in the habitable zone of Proxima Centauri. Further study is needed to determine its potential for colonization.'
        };
        
        gameState.planets = [...gameState.planets, newPlanet];
        
        // Add a discovery
        const discovery = {
            id: `planet_discovery_${Date.now()}`,
            name: 'Proxima Centauri b',
            timestamp: new Date().toISOString(),
            location: 'Proxima Centauri',
            description: 'Your exploration probe has confirmed the existence of an Earth-sized planet orbiting in the habitable zone of Proxima Centauri, the nearest star to our Sun.',
            effects: [
                'New potential for extraterrestrial research',
                'Possible future colonization target'
            ]
        };
        
        gameState.discoveries = [...gameState.discoveries, discovery];
    }
}

