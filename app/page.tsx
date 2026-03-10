'use client';

import { getAllEntries } from '@/lib/entries';
import { useEffect, useState } from 'react';

interface Entry {
  number: number;
  topic: string;
  url: string;
}

export default function HomePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntries = async () => {
      const data = await getAllEntries();
      setEntries(data);
      setLoading(false);
    };
    loadEntries();
  }, []);

  const handleCopyUrl = (entryUrl: string, entryNumber: number) => {
    navigator.clipboard.writeText(entryUrl).then(() => {
      setCopiedId(entryNumber);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading entries...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Entries List</h1>
          <a
            href="/admin"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Add Entry →
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {entries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No entries yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Be the first to add an entry!
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-100">
            {entries.map((entry) => (
              <div key={entry.number} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">
                  {entry.number}. {entry.topic}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-gray-500 text-sm whitespace-nowrap">URL: </span>
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 hover:underline text-sm break-all flex-1"
                  >
                    {entry.url}
                  </a>
                  <button
                    onClick={() => handleCopyUrl(entry.url, entry.number)}
                    className={`flex-shrink-0 px-2 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                      copiedId === entry.number
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title="Copy URL"
                  >
                    {copiedId === entry.number ? '✓ Copied' : '📋 Copy'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Entry Count */}
        {entries.length > 0 && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Total: {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
          </p>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-sm text-gray-400">
        <p>Entries are stored in markdown files.</p>
      </footer>
    </div>
  );
}
