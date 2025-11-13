import * as fs from 'fs';
import * as path from 'path';

export function logger(type: string, data: any, filePath: string = '/home/perplexica/app/logs/app.log'): void {
    try {
        // Create directory if it doesn't exist
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Format based on type
        let logEntry = '';
        const timestamp = new Date().toISOString();

        if (type.toLowerCase() === 'request') {
            logEntry = `
==============================
🔵 REQUEST Details
------------------------------
⏰ Timestamp: ${timestamp}
${formatData(data)}
==============================
\n`;
        } else if (type.toLowerCase() === 'response') {
            logEntry = `
==============================
🟢 RESPONSE Details
------------------------------
⏰ Timestamp: ${timestamp}
${formatData(data)}
==============================
\n`;
        } else if (type.toLowerCase() === 'search') {
            logEntry = `
==============================
🔍 Searching Query Details
------------------------------
${formatData(data)}
==============================
\n`;
        } else if (type.toLowerCase() === 'error') {
            logEntry = `
==============================
🔴 ERROR Details
------------------------------
⏰ Timestamp: ${timestamp}
${formatData(data)}
==============================
\n`;
        } else {
            logEntry = `
==============================
📝 ${type.toUpperCase()} Details
------------------------------
⏰ Timestamp: ${timestamp}
${formatData(data)}
==============================
\n`;
        }

        fs.appendFileSync(filePath, logEntry, 'utf8');
    } catch (error) {
        console.error('Error logging:', error);
    }
}

// Helper function to format data nicely
function formatData(data: any): string {
    if (typeof data === 'string') {
        return `📌 ${data}`;
    }

    if (typeof data === 'object' && data !== null) {
        const lines: string[] = [];
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'object') {
                lines.push(`🟠 ${key}: ${JSON.stringify(value, null, 2)}`);
            } else {
                lines.push(`🟠 ${key}: ${value}`);
            }
        }
        return lines.join('\n');
    }

    return `📌 ${JSON.stringify(data, null, 2)}`;
}
