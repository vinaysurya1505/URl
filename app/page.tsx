'use client';

import { getAllEntries } from '@/lib/entries';
import { getAllUploads, downloadFile, deleteUpload, UploadedFile } from '@/lib/uploads';
import { useEffect, useState } from 'react';

interface Entry {
  number: number;
  topic: string;
  url: string;
}

export default function HomePage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [fileTitle, setFileTitle] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const [entriesData, uploadsData] = await Promise.all([
        getAllEntries(),
        getAllUploads(),
      ]);
      setEntries(entriesData);
      setUploads(uploadsData);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleCopyUrl = (entryUrl: string, entryNumber: number) => {
    navigator.clipboard.writeText(entryUrl).then(() => {
      setCopiedId(entryNumber);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!fileTitle.trim()) {
      setUploadStatus('Please enter a title for the file');
      setTimeout(() => setUploadStatus(null), 3000);
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', fileTitle);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Add new upload to list
      const newUpload: UploadedFile = {
        id: data.uploadId,
        title: data.title,
        fileName: data.fileName,
        size: data.size,
        path: data.path,
        uploadedAt: new Date(),
        type: 'upload',
      };
      setUploads([newUpload, ...uploads]);

      setUploadStatus(`✓ File "${data.title}" uploaded successfully!`);
      setFileTitle('');
      setShowUploadForm(false);
      setTimeout(() => setUploadStatus(null), 3000);

      // Reset file input
      e.target.value = '';
    } catch (error) {
      setUploadStatus(`Error: ${error instanceof Error ? error.message : 'Upload failed'}`);
      console.error('Upload error:', error);
      setTimeout(() => setUploadStatus(null), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = async (upload: UploadedFile) => {
    try {
      await downloadFile(upload.path, upload.fileName);
    } catch (error) {
      alert('Failed to download file');
      console.error('Download error:', error);
    }
  };

  const handleDelete = async (uploadId: string, filePath: string) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    setDeleting(uploadId);
    try {
      await deleteUpload(uploadId, filePath);
      setUploads(uploads.filter(u => u.id !== uploadId));
      setUploadStatus('✓ File deleted successfully');
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (error) {
      setUploadStatus('Error deleting file');
      console.error('Delete error:', error);
      setTimeout(() => setUploadStatus(null), 3000);
    } finally {
      setDeleting(null);
    }
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
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              📤 Upload Files
            </button>
            <a
              href="/admin"
              className="text-sm text-blue-600 hover:text-blue-500 font-medium"
            >
              Add Entry →
            </a>
          </div>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="bg-blue-50 border-t border-blue-200 px-4 py-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter file title (required)"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                disabled={uploading}
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
              />
              <label className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded text-sm font-medium cursor-pointer hover:bg-blue-700 disabled:opacity-50">
                {uploading ? '⏳ Uploading...' : '📁 Select File'}
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploading || !fileTitle.trim()}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {uploadStatus && (
          <div className="bg-blue-50 border-t border-blue-200 px-4 py-2">
            <p className="text-sm text-blue-700 text-center">{uploadStatus}</p>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {entries.length === 0 && uploads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-500">No entries or files yet.</p>
            <p className="text-sm text-gray-400 mt-2">
              Be the first to add an entry or upload a file!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Entries Section */}
            {entries.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Web Entries</h2>
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
              </div>
            )}

            {/* Uploads Section */}
            {uploads.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Uploaded Files</h2>
                <div className="bg-white rounded-lg shadow-md divide-y divide-gray-100">
                  {uploads.map((upload) => (
                    <div key={upload.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">📦 {upload.title}</div>
                          <div className="mt-1 text-sm text-gray-600">
                            <span>{upload.fileName}</span>
                            <span className="mx-2">•</span>
                            <span>{(upload.size / 1024 / 1024).toFixed(2)} MB</span>
                            <span className="mx-2">•</span>
                            <span>{new Date(upload.uploadedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button
                            onClick={() => handleDownload(upload)}
                            className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors whitespace-nowrap"
                            title="Download file"
                          >
                            ⬇️ Download
                          </button>
                          <button
                            onClick={() => handleDelete(upload.id, upload.path)}
                            disabled={deleting === upload.id}
                            className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors whitespace-nowrap disabled:opacity-50"
                            title="Delete file"
                          >
                            {deleting === upload.id ? '🔄 Deleting...' : '🗑️ Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Statistics */}
        {(entries.length > 0 || uploads.length > 0) && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Total: {entries.length} {entries.length === 1 ? 'entry' : 'entries'} • {uploads.length} {uploads.length === 1 ? 'file' : 'files'}
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
