/**
 * Initial game state structure
 * This defines the starting point for a new game
 */
export function initialGameState() {
    return {
        // Basic game state
        turnNumber: 1,
        lastActiveTimestamp: new Date().toISOString(),
        
        // Resources
        resources: {
            energy: 100,
            minerals: 50,
            knowledge: 0,
            population: 1e9 // 1 billion
        },
        
        // Resource production rates (per second)
        resourceRates: {
            energy: 0.2,
            minerals: 0.1,
            knowledge: 0.05,
            population: 0.001
        },
        
        // Resource storage capacities
        resourceCapacities: {
            energy: 1000,
            minerals: 500,
            knowledge: 1000,
            population: 10e9 // 10 billion
        },
        
        // Star systems
        starSystems: [
            {
                id: 'sol',
                name: 'Sol System',
                type: 'yellow_dwarf',
                distance: 0,
                planetCount: 8,
                explorationPercentage: 50,
                description: 'Your home star system, centered around a yellow dwarf star.'
            }
        ],
        currentSystemId: 'sol',
        
        // Planets
        planets: [
            {
                id: 'earth',
                name: 'Earth',
                systemName: 'Sol System',
                systemId: 'sol',
                type: 'terrestrial',
                size: 'Medium',
                temperature: 15,
                atmosphere: 'Nitrogen-Oxygen',
                water: 71,
                colonized: true,
                colonizable: true,
                resources: {
                    energy: 'medium',
                    minerals: 'medium',
                    knowledge: 'high'
                },
                description: 'Your home planet, a blue-green world teeming with life.'
            },
            {
                id: 'mars',
                name: 'Mars',
                systemName: 'Sol System',
                systemId: 'sol',
                type: 'rocky',
                size: 'Small',
                temperature: -65,
                atmosphere: 'Thin CO2',
                water: 0,
                colonized: false,
                colonizable: true,
                resources: {
                    energy: 'low',
                    minerals: 'high',
                    knowledge: 'medium'
                },
                description: 'A cold, red planet with potential for colonization.'
            }
        ],
        
        // Colonies
        colonies: [
            {
                id: 'earth_colony',
                name: 'Earth',
                planetId: 'earth',
                type: 'Homeworld',
                population: 1e9,
                specialization: 'balanced',
                description: 'Your species\' homeworld and the center of your civilization.'
            }
        ],
        
        // Facilities
        facilities: [
            {
                id: 'solar_array_1',
                name: 'Solar Array Alpha',
                location: 'Earth Orbit',
                type: 'Energy Production',
                status: 'OPERATIONAL',
                description: 'A series of solar panels in Earth orbit collecting energy from the sun.',
                production: {
                    energy: 0.2,
                    minerals: 0,
                    knowledge: 0
                }
            },
            {
                id: 'mineral_extractor_1',
                name: 'Global Mining Network',
                location: 'Earth',
                type: 'Mineral Extraction',
                status: 'OPERATIONAL',
                description: 'A worldwide network of mining operations extracting valuable minerals.',
                production: {
                    energy: -0.05,
                    minerals: 0.1,
                    knowledge: 0
                }
            },
            {
                id: 'research_lab_1',
                name: 'Global Research Initiative',
                location: 'Earth',
                type: 'Research',
                status: 'OPERATIONAL',
                description: 'A coalition of research institutions working to advance your civilization\'s knowledge.',
                production: {
                    energy: -0.05,
                    minerals: -0.01,
                    knowledge: 0.05
                }
            }
        ],
        
        // Technologies
        technologies: [
            {
                id: 'solar_power',
                name: 'Solar Power',
                category: 'energy',
                status: 'researched',
                cost: 100,
                description: 'Harnessing the energy of your home star through photovoltaic cells.',
                unlocks: ['Basic solar arrays', 'Solar-powered satellites']
            },
            {
                id: 'fusion_power',
                name: 'Fusion Power',
                category: 'energy',
                status: 'available',
                cost: 500,
                description: 'Creating energy by fusing hydrogen atoms, mimicking the processes of stars.',
                requirements: ['Advanced Materials', 'Plasma Physics']
            },
            {
                id: 'ion_propulsion',
                name: 'Ion Propulsion',
                category: 'propulsion',
                status: 'available',
                cost: 300,
                description: 'Using electrically charged particles for efficient spacecraft propulsion.',
                requirements: ['Advanced Electronics']
            },
            {
                id: 'quantum_computing',
                name: 'Quantum Computing',
                category: 'computing',
                status: 'locked',
                cost: 1000,
                description: 'Computing using quantum-mechanical phenomena to perform operations on data.',
                requirements: ['Advanced AI', 'Quantum Physics']
            }
        ],
        
        // Current research project
        currentResearch: null,
        
        // Discoveries and special events
        discoveries: [],
        
        // Active exploration missions
        explorationMissions: [],
        
        // Command history
        commandHistory: [],
        lastCommand: '',
        
        // Notifications
        notifications: [],
        
        // Game settings
        settings: {
            enableSounds: true,
            soundVolume: 50,
            enableTTS: true,
            ttsVolume: 70,
            enableImages: true,
            darkMode: true,
            fontSize: 'medium',
            autoSaveInterval: 60 // in seconds
        }
    };
}

