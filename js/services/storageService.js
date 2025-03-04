/**
 * Save game state to local storage
 * @param {object} gameState - The current game state to save
 */
export function saveGame(gameState) {
    try {
        const serializedState = JSON.stringify(gameState);
        localStorage.setItem('stellar_evolution_save', serializedState);
        console.log('Game saved successfully');
    } catch (error) {
        console.error('Error saving game:', error);
    }
}

/**
 * Load game state from local storage
 * @returns {object|null} - The loaded game state or null if no save exists
 */
export function loadGame() {
    try {
        const serializedState = localStorage.getItem('stellar_evolution_save');
        if (!serializedState) return null;
        
        const gameState = JSON.parse(serializedState);
        console.log('Game loaded successfully');
        return gameState;
    } catch (error) {
        console.error('Error loading game:', error);
        return null;
    }
}

/**
 * Export game save as a file
 * @returns {Promise<string>} - URL to the save file
 */
export function exportSave() {
    return new Promise((resolve, reject) => {
        try {
            const serializedState = localStorage.getItem('stellar_evolution_save');
            if (!serializedState) {
                reject(new Error('No save data found'));
                return;
            }
            
            const blob = new Blob([serializedState], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            resolve(url);
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Import game save from a file
 * @param {File} file - The save file to import
 * @returns {Promise<object>} - The imported game state
 */
export function importSave(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
            try {
                const saveData = event.target.result;
                const gameState = JSON.parse(saveData);
                
                // Validate the save data
                if (!gameState.resources || !gameState.lastActiveTimestamp) {
                    reject(new Error('Invalid save data'));
                    return;
                }
                
                // Save to local storage
                localStorage.setItem('stellar_evolution_save', saveData);
                resolve(gameState);
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => {
            reject(new Error('Error reading file'));
        };
        
        reader.readAsText(file);
    });
}

