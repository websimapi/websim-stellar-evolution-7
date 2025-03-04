/**
 * Format a number for display
 * @param {number} num - The number to format
 * @returns {string} - Formatted number
 */
export function formatNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return Math.floor(num).toString();
}

/**
 * Format a resource object into a human-readable string
 * @param {object} resources - The resources object to format
 * @returns {string} - Formatted resource string
 */
export function formatResources(resources) {
    const parts = [];
    
    if (resources.energy > 0) {
        parts.push(`${formatNumber(resources.energy)} energy`);
    }
    
    if (resources.minerals > 0) {
        parts.push(`${formatNumber(resources.minerals)} minerals`);
    }
    
    if (resources.knowledge > 0) {
        parts.push(`${formatNumber(resources.knowledge)} knowledge`);
    }
    
    if (resources.population > 0) {
        parts.push(`${formatNumber(resources.population)} population`);
    }
    
    if (parts.length === 0) {
        return "No";
    }
    
    return parts.join(", ");
}

/**
 * Format a timestamp into a readable date and time
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} - Formatted date and time
 */
export function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Format a distance in appropriate astronomical units
 * @param {number} distance - Distance in AU
 * @returns {string} - Formatted distance
 */
export function formatDistance(distance) {
    if (distance < 1) {
        return (distance * 150).toFixed(1) + ' million km';
    } else if (distance < 1000) {
        return distance.toFixed(1) + ' AU';
    } else {
        return (distance / 63241.1).toFixed(2) + ' light years';
    }
}

