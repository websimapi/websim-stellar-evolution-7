/**
 * Process user commands and generate appropriate responses
 * @param {string} command - The user's command text
 * @param {object} gameState - The current game state
 * @returns {Promise<object>} - Response object with narrative and game state changes
 */
export async function processUserCommand(command, gameState) {
    // In a production app, this would be a call to a real LLM API
    // For the demo, we'll simulate some responses based on keywords
    
    // Normalize command to lowercase for easier matching
    const normalizedCommand = command.toLowerCase();
    
    // Wait to simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Prepare a placeholder for the LLM response
    let response = {
        action: {
            type: "UNKNOWN",
            success: true
        },
        gameStateChanges: {},
        narrative: {
            mainText: "I'm not sure how to interpret that command. Could you try rephrasing it?",
            detailText: "Try commands related to exploring, researching technology, or building structures.",
            tone: "neutral"
        },
        uiUpdates: {
            soundEffects: ["command_sent"],
            notifications: []
        }
    };
    
    // Logic to simulate different command types
    
    // EXPLORATION COMMANDS
    if (normalizedCommand.includes("explore") || normalizedCommand.includes("scan") || normalizedCommand.includes("survey")) {
        response = handleExplorationCommand(normalizedCommand, gameState);
    }
    // RESEARCH COMMANDS
    else if (normalizedCommand.includes("research") || normalizedCommand.includes("study") || normalizedCommand.includes("technology")) {
        response = handleResearchCommand(normalizedCommand, gameState);
    }
    // CONSTRUCTION COMMANDS
    else if (normalizedCommand.includes("build") || normalizedCommand.includes("construct") || normalizedCommand.includes("create")) {
        response = handleConstructionCommand(normalizedCommand, gameState);
    }
    // COLONY COMMANDS
    else if (normalizedCommand.includes("colonize") || normalizedCommand.includes("settle") || normalizedCommand.includes("colony")) {
        response = handleColonizationCommand(normalizedCommand, gameState);
    }
    // INFORMATION COMMANDS
    else if (normalizedCommand.includes("status") || normalizedCommand.includes("report") || normalizedCommand.includes("info")) {
        response = handleInformationCommand(normalizedCommand, gameState);
    }
    // HELP COMMAND
    else if (normalizedCommand.includes("help") || normalizedCommand.includes("command") || normalizedCommand.includes("tutorial")) {
        response = handleHelpCommand(normalizedCommand, gameState);
    }
    
    // Add command to history
    response.gameStateChanges.lastCommand = command;
    response.gameStateChanges.commandHistory = [...gameState.commandHistory, command].slice(-50); // Keep last 50 commands
    
    return response;
}

// Handler functions for different command types

function handleExplorationCommand(command, gameState) {
    // Check if exploring current system
    if (command.includes("solar system") || command.includes("sol system") || command.includes("home system")) {
        return {
            action: {
                type: "EXPLORATION",
                subtype: "SYSTEM_SURVEY",
                target: "sol",
                success: true
            },
            gameStateChanges: {
                starSystems: gameState.starSystems.map(system => 
                    system.id === 'sol' 
                        ? {...system, explorationPercentage: Math.min(100, system.explorationPercentage + 10)}
                        : system
                ),
                resources: {
                    ...gameState.resources,
                    energy: gameState.resources.energy - 10,
                    knowledge: gameState.resources.knowledge + 20
                }
            },
            narrative: {
                mainText: "Your survey ships scan the Sol system in greater detail, mapping celestial bodies and gathering valuable scientific data.",
                detailText: "The survey reveals more details about the asteroid belt between Mars and Jupiter, identifying several resource-rich asteroids that could be valuable for mining operations.",
                tone: "positive",
                imagePrompt: "detailed scientific map of the solar system with planets and asteroid belt"
            },
            uiUpdates: {
                soundEffects: ["discovery"],
                notifications: [
                    { type: "EXPLORATION_PROGRESS", severity: "INFO" }
                ]
            }
        };
    }
    
    // Check if exploring Mars
    if (command.includes("mars")) {
        // Simulate discovering a new anomaly on Mars
        const newDiscovery = {
            id: `discovery_${Date.now()}`,
            name: "Ancient Water Channels",
            timestamp: new Date().toISOString(),
            location: "Mars, Valles Marineris",
            description: "Your exploration drones have discovered clear evidence of ancient flowing water on the Martian surface, with extensive channel networks that suggest Mars once had a much wetter climate.",
            effects: [
                "Increased understanding of Mars' geological history",
                "Improved colonization prospects due to potential water ice deposits"
            ]
        };
        
        return {
            action: {
                type: "EXPLORATION",
                subtype: "PLANETARY_SURVEY",
                target: "mars",
                success: true
            },
            gameStateChanges: {
                planets: gameState.planets.map(planet => 
                    planet.id === 'mars' 
                        ? {...planet, colonizable: true}
                        : planet
                ),
                discoveries: [...gameState.discoveries, newDiscovery],
                resources: {
                    ...gameState.resources,
                    energy: gameState.resources.energy - 15,
                    knowledge: gameState.resources.knowledge + 30
                }
            },
            narrative: {
                mainText: "Your exploration drones survey the Martian surface, focusing on Valles Marineris - a vast system of canyons spanning nearly a quarter of the planet's circumference.",
                detailText: "The survey reveals compelling evidence of ancient flowing water on the Martian surface, with channel networks and mineral deposits that could only have formed in the presence of significant liquid water. This discovery enhances our understanding of Mars' history and potential for colonization.",
                tone: "positive",
                imagePrompt: "Mars exploration drone scanning ancient water channels in Valles Marineris canyon"
            },
            uiUpdates: {
                soundEffects: ["discovery"],
                notifications: [
                    { type: "NEW_DISCOVERY", severity: "INFO" }
                ]
            }
        };
    }
    
    // Check if exploring beyond the solar system
    if (command.includes("beyond") || command.includes("interstellar") || command.includes("nearby star") || command.includes("proxima") || command.includes("alpha centauri")) {
        
        // Check if they have the technology for interstellar exploration
        const hasInterstellarTech = gameState.technologies.some(tech => 
            tech.id === 'ion_propulsion' && tech.status === 'researched'
        );
        
        if (!hasInterstellarTech) {
            return {
                action: {
                    type: "EXPLORATION",
                    subtype: "INTERSTELLAR",
                    success: false
                },
                gameStateChanges: {},
                narrative: {
                    mainText: "Your scientific advisors inform you that current propulsion technology is insufficient for interstellar exploration.",
                    detailText: "To explore beyond the solar system, you'll need to research more advanced propulsion technologies like Ion Propulsion.",
                    tone: "warning"
                },
                uiUpdates: {
                    soundEffects: ["error"],
                    notifications: [
                        { type: "TECH_REQUIREMENT", severity: "WARNING" }
                    ]
                }
            };
        }
        
        // Create a new star system discovery
        const proximaCentauri = {
            id: 'proxima_centauri',
            name: 'Proxima Centauri',
            type: 'red_dwarf',
            distance: 4.2 * 63241.1, // in AU (4.2 light years)
            planetCount: 3,
            explorationPercentage: 10,
            description: 'The closest star to the Solar System, a small red dwarf star with at least three planets.'
        };
        
        // Create a new exploration mission
        const newMission = {
            id: `mission_${Date.now()}`,
            name: 'Proxima Centauri Expedition',
            target: 'Proxima Centauri',
            status: 'ACTIVE',
            progress: 0,
            duration: 100, // arbitrary units for the demo
            completionTimestamp: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes from now
            description: 'An unmanned probe expedition to explore the Proxima Centauri system, the closest star to our Sun.'
        };
        
        return {
            action: {
                type: "EXPLORATION",
                subtype: "INTERSTELLAR_MISSION",
                target: "proxima_centauri",
                success: true
            },
            gameStateChanges: {
                starSystems: [...gameState.starSystems, proximaCentauri],
                explorationMissions: [...gameState.explorationMissions, newMission],
                resources: {
                    ...gameState.resources,
                    energy: gameState.resources.energy - 50,
                    minerals: gameState.resources.minerals - 30,
                    knowledge: gameState.resources.knowledge + 10
                }
            },
            narrative: {
                mainText: "You've authorized an unmanned expedition to Proxima Centauri, the nearest star system to Sol at just over 4 light years away.",
                detailText: "The probe will use ion propulsion technology to reach Proxima Centauri and begin preliminary scans of the system. While the probe will take years to physically reach the system, its advanced sensors can begin collecting data much sooner.",
                tone: "positive",
                imagePrompt: "futuristic space probe with ion engines departing Earth's orbit toward Proxima Centauri"
            },
            uiUpdates: {
                soundEffects: ["discovery"],
                notifications: [
                    { type: "NEW_MISSION", severity: "INFO" }
                ]
            }
        };
    }
    
    // Generic exploration response
    return {
        action: {
            type: "EXPLORATION",
            subtype: "GENERIC",
            success: true
        },
        gameStateChanges: {
            resources: {
                ...gameState.resources,
                energy: gameState.resources.energy - 5,
                knowledge: gameState.resources.knowledge + 10
            }
        },
        narrative: {
            mainText: "Your exploration teams deploy automated probes to gather data about nearby celestial bodies.",
            detailText: "While no significant discoveries were made, the data collected contributes to your civilization's growing knowledge of the cosmos.",
            tone: "neutral"
        },
        uiUpdates: {
            soundEffects: ["command_sent"],
            notifications: []
        }
    };
}

function handleResearchCommand(command, gameState) {
    // Check if researching fusion power
    if (command.includes("fusion")) {
        
        // Check if they have enough knowledge
        if (gameState.resources.knowledge < 100) {
            return {
                action: {
                    type: "RESEARCH",
                    subtype: "TECHNOLOGY",
                    target: "fusion_power",
                    success: false
                },
                gameStateChanges: {},
                narrative: {
                    mainText: "Your scientists report that they lack sufficient knowledge to begin meaningful fusion power research.",
                    detailText: "Fusion power requires a deep understanding of plasma physics and advanced materials. Continue building knowledge through exploration and basic research before attempting this project.",
                    tone: "warning"
                },
                uiUpdates: {
                    soundEffects: ["error"],
                    notifications: [
                        { type: "RESOURCE_REQUIREMENT", severity: "WARNING" }
                    ]
                }
            };
        }
        
        // Set up fusion power research
        const fusionResearch = gameState.technologies.find(tech => tech.id === 'fusion_power');
        
        return {
            action: {
                type: "RESEARCH",
                subtype: "TECHNOLOGY",
                target: "fusion_power",
                success: true
            },
            gameStateChanges: {
                currentResearch: {
                    id: 'fusion_power',
                    name: 'Fusion Power',
                    category: 'energy',
                    cost: fusionResearch.cost,
                    progress: 10,
                    description: fusionResearch.description
                },
                technologies: gameState.technologies.map(tech => 
                    tech.id === 'fusion_power' 
                        ? {...tech, status: 'researching'}
                        : tech
                ),
                resources: {
                    ...gameState.resources,
                    energy: gameState.resources.energy - 20,
                    knowledge: gameState.resources.knowledge - 50
                }
            },
            narrative: {
                mainText: "Your scientists begin the monumental task of developing controlled nuclear fusion, the same process that powers the stars.",
                detailText: "Research teams are establishing experimental facilities to contain and control plasma at millions of degrees. If successful, fusion could provide nearly limitless clean energy for your civilization.",
                tone: "positive",
                imagePrompt: "futuristic fusion reactor research facility with scientists working on tokamak containment device"
            },
            uiUpdates: {
                soundEffects: ["research_complete"],
                notifications: [
                    { type: "RESEARCH_STARTED", severity: "INFO" }
                ]
            }
        };
    }
    
    // Check if researching ion propulsion
    if (command.includes("ion") || command.includes("propulsion")) {
        const ionResearch = gameState.technologies.find(tech => tech.id === 'ion_propulsion');
        
        return {
            action: {
                type: "RESEARCH",
                subtype: "TECHNOLOGY",
                target: "ion_propulsion",
                success: true
            },
            gameStateChanges: {
                currentResearch: {
                    id: 'ion_propulsion',
                    name: 'Ion Propulsion',
                    category: 'propulsion',
                    cost: ionResearch.cost,
                    progress: 15,
                    description: ionResearch.description
                },
                technologies: gameState.technologies.map(tech => 
                    tech.id === 'ion_propulsion' 
                        ? {...tech, status: 'researching'}
                        : tech
                ),
                resources: {
                    ...gameState.resources,
                    energy: gameState.resources.energy - 15,
                    knowledge: gameState.resources.knowledge - 30
                }
            },
            narrative: {
                mainText: "Your scientists begin developing ion propulsion technology, which uses electrically charged particles for efficient spacecraft propulsion.",
                detailText: "Unlike chemical rockets, ion engines provide low thrust over long periods, making them ideal for deep space missions. This technology will significantly extend your civilization's reach into the cosmos.",
                tone: "positive",
                imagePrompt: "spacecraft ion engine emitting blue glow in test chamber"
            },
            uiUpdates: {
                soundEffects: ["research_complete"],
                notifications: [
                    { type: "RESEARCH_STARTED", severity: "INFO" }
                ]
            }
        };
    }
    
    // Generic research response
    return {
        action: {
            type: "RESEARCH",
            subtype: "GENERIC",
            success: true
        },
        gameStateChanges: {
            resources: {
                ...gameState.resources,
                energy: gameState.resources.energy - 5,
                knowledge: gameState.resources.knowledge + 15
            }
        },
        narrative: {
            mainText: "Your scientists conduct general research across multiple fields, gradually expanding your civilization's knowledge base.",
            detailText: "While not focused on a specific technology, this broad research improves your understanding of the universe and may lead to unexpected breakthroughs.",
            tone: "neutral"
        },
        uiUpdates: {
            soundEffects: ["command_sent"],
            notifications: []
        }
    };
}

function handleConstructionCommand(command, gameState) {
    // Check if building a mining facility
    if (command.includes("mining") || command.includes("extractor") || command.includes("mine")) {
        
        // Check if they have enough resources
        if (gameState.resources.minerals < 30 || gameState.resources.energy < 40) {
            return {
                action: {
                    type: "CONSTRUCTION",
                    subtype: "MINING_FACILITY",
                    success: false
                },
                gameStateChanges: {},
                narrative: {
                    mainText: "Your engineers report that they lack sufficient resources to construct new mining facilities.",
                    detailText: `Current reserves of ${gameState.resources.minerals} minerals and ${gameState.resources.energy} energy are insufficient. Mining facilities require at least 30 minerals and 40 energy to build.`,
                    tone: "warning"
                },
                uiUpdates: {
                    soundEffects: ["error"],
                    notifications: [
                        { type: "RESOURCE_REQUIREMENT", severity: "WARNING" }
                    ]
                }
            };
        }
        
        // Create a new mining facility
        const newFacility = {
            id: `mineral_extractor_${Date.now()}`,
            name: 'Advanced Mineral Extractor',
            location: 'Earth',
            type: 'Mineral Extraction',
            status: 'BUILDING',
            description: 'An advanced facility using robotic systems to extract and process minerals from the Earth\'s crust.',
            production: {
                energy: -0.1,
                minerals: 0.3,
                knowledge: 0
            }
        };
        
        return {
            action: {
                type: "CONSTRUCTION",
                subtype: "MINING_FACILITY",
                success: true
            },
            gameStateChanges: {
                facilities: [...gameState.facilities, newFacility],
                resources: {
                    ...gameState.resources,
                    energy: gameState.resources.energy - 40,
                    minerals: gameState.resources.minerals - 30
                },
                resourceRates: {
                    ...gameState.resourceRates,
                    energy: gameState.resourceRates.energy - 0.1,
                    minerals: gameState.resourceRates.minerals + 0.3
                }
            },
            narrative: {
                mainText: "Construction begins on a new Advanced Mineral Extractor, using robotic systems to harvest minerals from the Earth's crust.",
                detailText: "Once operational, this facility will significantly increase your mineral production rate, though it will require a steady supply of energy to maintain operations.",
                tone: "positive",
                imagePrompt: "futuristic mining facility with autonomous robots extracting minerals from Earth's crust"
            },
            uiUpdates: {
                soundEffects: ["construction_start"],
                notifications: [
                    { type: "CONSTRUCTION_STARTED", severity: "INFO" }
                ]
            }
        };
    }
    
    // Check if building a research lab
    if (command.includes("research") || command.includes("lab") || command.includes("laboratory")) {
        
        // Create a new research facility
        const newFacility = {
            id: `research_lab_${Date.now()}`,
            name: 'Advanced Research Laboratory',
            location: 'Earth',
            type: 'Research',
            status: 'BUILDING',
            description: 'A cutting-edge research facility equipped with advanced scientific instruments and computing systems.',
            production: {
                energy: -0.15,
                minerals: -0.05,
                knowledge: 0.25
            }
        };
        
        return {
            action: {
                type: "CONSTRUCTION",
                subtype: "RESEARCH_LAB",
                success: true
            },
            gameStateChanges: {
                facilities: [...gameState.facilities, newFacility],
                resources: {
                    ...gameState.resources,
                    energy: gameState.resources.energy - 30,
                    minerals: gameState.resources.minerals - 25
                },
                resourceRates: {
                    ...gameState.resourceRates,
                    energy: gameState.resourceRates.energy - 0.15,
                    minerals: gameState.resourceRates.minerals - 0.05,
                    knowledge: gameState.resourceRates.knowledge + 0.25
                }
            },
            narrative: {
                mainText: "Construction begins on a new Advanced Research Laboratory, equipped with cutting-edge scientific instruments and computing systems.",
                detailText: "This facility will significantly accelerate your knowledge acquisition, enabling faster technological advancement and scientific discoveries.",
                tone: "positive",
                imagePrompt: "futuristic research laboratory with advanced scientific equipment and holographic displays"
            },
            uiUpdates: {
                soundEffects: ["construction_start"],
                notifications: [
                    { type: "CONSTRUCTION_STARTED", severity: "INFO" }
                ]
            }
        };
    }
    
    // Check if building a solar array
    if (command.includes("solar") || command.includes("energy") || command.includes("power")) {
        
        // Create a new energy facility
        const newFacility = {
            id: `solar_array_${Date.now()}`,
            name: 'Orbital Solar Array',
            location: 'Earth Orbit',
            type: 'Energy Production',
            status: 'BUILDING',
            description: 'A large array of solar panels in Earth orbit, collecting energy from the sun with high efficiency.',
            production: {
                energy: 0.4,
                minerals: 0,
                knowledge: 0
            }
        };
        
        return {
            action: {
                type: "CONSTRUCTION",
                subtype: "SOLAR_ARRAY",
                success: true
            },
            gameStateChanges: {
                facilities: [...gameState.facilities, newFacility],
                resources: {
                    ...gameState.resources,
                    energy: gameState.resources.energy - 20,
                    minerals: gameState.resources.minerals - 40
                },
                resourceRates: {
                    ...gameState.resourceRates,
                    energy: gameState.resourceRates.energy + 0.4
                }
            },
            narrative: {
                mainText: "Construction begins on a new Orbital Solar Array, a large network of solar panels in Earth orbit.",
                detailText: "Free from atmospheric interference and weather concerns, this orbital facility will provide a steady and significant source of energy for your growing civilization.",
                tone: "positive",
                imagePrompt: "massive orbital solar array in Earth orbit collecting sunlight above the blue planet"
            },
            uiUpdates: {
                soundEffects: ["construction_start"],
                notifications: [
                    { type: "CONSTRUCTION_STARTED", severity: "INFO" }
                ]
            }
        };
    }
    
    // Generic construction response
    return {
        action: {
            type: "CONSTRUCTION",
            subtype: "GENERIC",
            success: true
        },
        gameStateChanges: {
            resources: {
                ...gameState.resources,
                energy: gameState.resources.energy - 10,
                minerals: gameState.resources.minerals - 10
            }
        },
        narrative: {
            mainText: "Your engineers begin work on improving existing infrastructure and facilities.",
            detailText: "These general improvements will help maintain efficiency across your civilization, though they don't significantly expand your capabilities.",
            tone: "neutral"
        },
        uiUpdates: {
            soundEffects: ["construction_start"],
            notifications: []
        }
    };
}

function handleColonizationCommand(command, gameState) {
    // Check if colonizing Mars
    if (command.includes("mars")) {
        
        // Check if Mars is colonizable and not already colonized
        const mars = gameState.planets.find(planet => planet.id === 'mars');
        
        if (!mars || !mars.colonizable || mars.colonized) {
            return {
                action: {
                    type: "COLONIZATION",
                    subtype: "MARS",
                    success: false
                },
                gameStateChanges: {},
                narrative: {
                    mainText: mars.colonized 
                        ? "Your advisors remind you that Mars is already colonized."
                        : "Your scientists report that Mars is not yet ready for colonization.",
                    detailText: mars.colonized
                        ? "The Martian colony has already been established. Perhaps you'd like to expand its operations instead?"
                        : "More exploration and preparation is needed before a Mars colony can be established. Try exploring Mars in more detail first.",
                    tone: "warning"
                },
                uiUpdates: {
                    soundEffects: ["error"],
                    notifications: [
                        { type: "COLONIZATION_ERROR", severity: "WARNING" }
                    ]
                }
            };
        }
        
        // Check if they have enough resources
        if (gameState.resources.minerals < 100 || gameState.resources.energy < 150) {
            return {
                action: {
                    type: "COLONIZATION",
                    subtype: "MARS",
                    success: false
                },
                gameStateChanges: {},
                narrative: {
                    mainText: "Your colonial administrators report insufficient resources to establish a Mars colony.",
                    detailText: "Colonizing Mars requires at least 100 minerals and 150 energy to transport materials and set up basic habitats.",
                    tone: "warning"
                },
                uiUpdates: {
                    soundEffects: ["error"],
                    notifications: [
                        { type: "RESOURCE_REQUIREMENT", severity: "WARNING" }
                    ]
                }
            };
        }
        
        // Create a new colony
        const newColony = {
            id: `mars_colony_${Date.now()}`,
            name: 'Mars Colony Alpha',
            planetId: 'mars',
            type: 'Mining Colony',
            population: 1e5, // 100,000
            specialization: 'minerals',
            description: 'The first human settlement on Mars, focusing on mineral extraction from the rich Martian regolith.'
        };
        
        return {
            action: {
                type: "COLONIZATION",
                subtype: "MARS",
                success: true
            },
            gameStateChanges: {
                colonies: [...gameState.colonies, newColony],
                planets: gameState.planets.map(planet => 
                    planet.id === 'mars' 
                        ? {...planet, colonized: true}
                        : planet
                ),
                resources: {
                    ...gameState.resources,
                    energy: gameState.resources.energy - 150,
                    minerals: gameState.resources.minerals - 100,
                    population: gameState.resources.population - 1e5
                },
                resourceRates: {
                    ...gameState.resourceRates,
                    minerals: gameState.resourceRates.minerals + 0.2
                }
            },
            narrative: {
                mainText: "The first colonization ships depart for Mars, carrying brave pioneers and the equipment needed to establish humanity's first extraterrestrial colony.",
                detailText: "Mars Colony Alpha will focus on mineral extraction, taking advantage of the planet's rich regolith. The colony represents a historic milestone - humanity's first step toward becoming a multi-planetary species.",
                tone: "positive",
                imagePrompt: "futuristic Mars colony with domed habitats and mining facilities on the red Martian landscape"
            },
            uiUpdates: {
                soundEffects: ["discovery"],
                notifications: [
                    { type: "NEW_COLONY", severity: "INFO" }
                ]
            }
        };
    }
    
    // Generic colonization response
    return {
        action: {
            type: "COLONIZATION",
            subtype: "GENERIC",
            success: false
        },
        gameStateChanges: {},
        narrative: {
            mainText: "Your colonial administrators request more specific instructions about where to establish a colony.",
            detailText: "Please specify a planetary body to colonize, such as 'colonize Mars' or 'establish a lunar colony'.",
            tone: "neutral"
        },
        uiUpdates: {
            soundEffects: ["command_sent"],
            notifications: []
        }
    };
}

function handleInformationCommand(command, gameState) {
    // Check if requesting resource status
    if (command.includes("resource") || command.includes("energy") || command.includes("mineral") || command.includes("population")) {
        return {
            action: {
                type: "INFORMATION",
                subtype: "RESOURCE_REPORT",
                success: true
            },
            gameStateChanges: {},
            narrative: {
                mainText: "Resource Status Report",
                detailText: `Energy: ${gameState.resources.energy.toFixed(0)} units (${gameState.resourceRates.energy > 0 ? '+' : ''}${gameState.resourceRates.energy.toFixed(2)}/s)\nMinerals: ${gameState.resources.minerals.toFixed(0)} units (${gameState.resourceRates.minerals > 0 ? '+' : ''}${gameState.resourceRates.minerals.toFixed(2)}/s)\nKnowledge: ${gameState.resources.knowledge.toFixed(0)} units (${gameState.resourceRates.knowledge > 0 ? '+' : ''}${gameState.resourceRates.knowledge.toFixed(2)}/s)\nPopulation: ${(gameState.resources.population / 1e6).toFixed(1)} million (${gameState.resourceRates.population > 0 ? '+' : ''}${(gameState.resourceRates.population * 3600).toFixed(0)}/hour)`,
                tone: "info"
            },
            uiUpdates: {
                soundEffects: ["command_sent"],
                notifications: []
            }
        };
    }
    
    // Check if requesting colony status
    if (command.includes("colony") || command.includes("colonies") || command.includes("settlement")) {
        if (gameState.colonies.length <= 1) { // Only Earth
            return {
                action: {
                    type: "INFORMATION",
                    subtype: "COLONY_REPORT",
                    success: true
                },
                gameStateChanges: {},
                narrative: {
                    mainText: "Colony Status Report",
                    detailText: "Your civilization is currently limited to Earth, with a population of approximately 1 billion. No extraterrestrial colonies have been established yet.",
                    tone: "info"
                },
                uiUpdates: {
                    soundEffects: ["command_sent"],
                    notifications: []
                }
            };
        } else {
            const colonyCount = gameState.colonies.length;
            const nonEarthPopulation = gameState.colonies
                .filter(colony => colony.planetId !== 'earth')
                .reduce((sum, colony) => sum + colony.population, 0);
            
            return {
                action: {
                    type: "INFORMATION",
                    subtype: "COLONY_REPORT",
                    success: true
                },
                gameStateChanges: {},
                narrative: {
                    mainText: "Colony Status Report",
                    detailText: `Your civilization has established ${colonyCount - 1} extraterrestrial colonies with a total off-Earth population of approximately ${(nonEarthPopulation / 1e6).toFixed(2)} million colonists. Earth remains your primary population center with over 1 billion inhabitants.`,
                    tone: "info"
                },
                uiUpdates: {
                    soundEffects: ["command_sent"],
                    notifications: []
                }
            };
        }
    }
    
    // Check if requesting technology status
    if (command.includes("technology") || command.includes("research") || command.includes("tech")) {
        const researchedCount = gameState.technologies.filter(tech => tech.status === 'researched').length;
        const researchingTech = gameState.currentResearch ? gameState.currentResearch.name : "No current research project";
        
        return {
            action: {
                type: "INFORMATION",
                subtype: "TECHNOLOGY_REPORT",
                success: true
            },
            gameStateChanges: {},
            narrative: {
                mainText: "Technology Status Report",
                detailText: `Researched Technologies: ${researchedCount}\nCurrently Researching: ${researchingTech}\nAvailable Research Options: ${gameState.technologies.filter(tech => tech.status === 'available').length}`,
                tone: "info"
            },
            uiUpdates: {
                soundEffects: ["command_sent"],
                notifications: []
            }
        };
    }
    
    // Generic status response
    return {
        action: {
            type: "INFORMATION",
            subtype: "GENERAL_REPORT",
            success: true
        },
        gameStateChanges: {},
        narrative: {
            mainText: "General Status Report",
            detailText: `Your civilization is progressing steadily. Current turn: ${gameState.turnNumber}. You have ${gameState.facilities.length} operational facilities across ${gameState.colonies.length} settlements. Your scientists have researched ${gameState.technologies.filter(tech => tech.status === 'researched').length} technologies so far.`,
            tone: "info"
        },
        uiUpdates: {
            soundEffects: ["command_sent"],
            notifications: []
        }
    };
}

function handleHelpCommand(command, gameState) {
    return {
        action: {
            type: "HELP",
            success: true
        },
        gameStateChanges: {},
        narrative: {
            mainText: "Command Guide",
            detailText: "Here are some commands you can try:\n\n- Exploration: 'explore Mars', 'survey the asteroid belt', 'send probe to Proxima Centauri'\n\n- Research: 'research fusion power', 'study ion propulsion'\n\n- Construction: 'build mining facility', 'construct research lab', 'create solar array'\n\n- Colonization: 'colonize Mars', 'establish lunar base'\n\n- Information: 'resource status', 'colony report', 'technology status'\n\nTry to be specific in your commands for better results.",
            tone: "info"
        },
        uiUpdates: {
            soundEffects: ["command_sent"],
            notifications: []
        }
    };
}

