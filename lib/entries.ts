import fs from 'fs';
import path from 'path';

export interface Entry {
  number: number;
  topic: string;
  url: string;
}

// Get the entries file path reliably
function getEntriesFilePath(): string {
  try {
    return path.join(process.cwd(), 'content', 'entries.md');
  } catch (error) {
    // Fallback for edge cases
    return path.join(__dirname, '..', '..', 'content', 'entries.md');
  }
}

const ENTRIES_FILE = getEntriesFilePath();
const CONTENT_DIR = path.dirname(ENTRIES_FILE);

// Ensure the content directory and file exist
function ensureContentFile(): void {
  try {
    if (!fs.existsSync(CONTENT_DIR)) {
      fs.mkdirSync(CONTENT_DIR, { recursive: true });
    }
    
    if (!fs.existsSync(ENTRIES_FILE)) {
      fs.writeFileSync(ENTRIES_FILE, '# Entries\n\n', 'utf-8');
    }
  } catch (error) {
    console.error('Failed to ensure content file:', error);
    throw new Error(`Failed to access entries file at ${ENTRIES_FILE}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Read all entries from the markdown file
export function readEntries(): Entry[] {
  ensureContentFile();
  
  const content = fs.readFileSync(ENTRIES_FILE, 'utf-8');
  const entries: Entry[] = [];
  
  // Parse entries using regex
  // Format: 1. Topic: Example Topic\n   URL: https://example.com
  const entryRegex = /(\d+)\.\s*Topic:\s*(.+?)\n\s*URL:\s*(.+?)(?=\n\d+\.|$)/gs;
  
  let match;
  while ((match = entryRegex.exec(content)) !== null) {
    entries.push({
      number: parseInt(match[1], 10),
      topic: match[2].trim(),
      url: match[3].trim(),
    });
  }
  
  return entries;
}

// Get the next entry number
export function getNextEntryNumber(): number {
  const entries = readEntries();
  if (entries.length === 0) {
    return 1;
  }
  return Math.max(...entries.map(e => e.number)) + 1;
}

// Add a new entry to the markdown file
export function addEntry(topic: string, url: string): Entry {
  ensureContentFile();
  
  const nextNumber = getNextEntryNumber();
  
  const entryText = `${nextNumber}. Topic: ${topic}\n   URL: ${url}\n\n`;
  
  fs.appendFileSync(ENTRIES_FILE, entryText, 'utf-8');
  
  return {
    number: nextNumber,
    topic,
    url,
  };
}

// Get all entries for display
export function getAllEntries(): Entry[] {
  return readEntries();
}
