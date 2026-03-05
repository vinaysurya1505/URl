import { getAllEntries } from '@/lib/entries';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function HomePage() {
  const entries = getAllEntries();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Entries List</h1>
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Admin Login →
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {entries.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No entries yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Admin can add entries from the dashboard.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md divide-y divide-gray-100">
            {entries.map((entry) => (
              <div key={entry.number} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">
                  {entry.number}. {entry.topic}
                </div>
                <div className="mt-1">
                  <span className="text-gray-500 text-sm">URL: </span>
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 hover:underline text-sm break-all"
                  >
                    {entry.url}
                  </a>
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
