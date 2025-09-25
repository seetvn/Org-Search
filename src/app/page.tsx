'use client';

import { useEffect, useState } from 'react';

type Org = {
  id: number;
  organisation: string;
  location: string | null;
  type: string | null;
  route: string | null;
  rank?: number;
};

export default function Home() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Org[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchExecuted, setSearchExecuted] = useState(false);

  async function runSearch(term: string) {
    setLoading(true);
    setSuggestions([]);
    const r = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
    const data = await r.json();
    setResults(data.results || []);
    setLoading(false);
    setSearchExecuted(true);

    if (!data.results || data.results.length === 0) {
      const s = await fetch(`/api/suggest?q=${encodeURIComponent(term)}`);
      const sd = await s.json();
      setSuggestions(sd.suggestions || []);
    }
  }

  useEffect(() => {
    // optional: initial search
  }, []);

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Organisation Search</h1>
        <h2 className="text-0.5xl mb-4">Search for the company to see if they offer sponsorships.</h2>

        <div className="flex gap-2 mb-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch(q)}
            placeholder="Search by organisation / location / type / route"
            className="flex-1 rounded-lg border px-4 py-2"
          />
          <button
            onClick={() => runSearch(q)}
            className="rounded-lg px-4 py-2 bg-black text-white"
          >
            Search
          </button>
        </div>

        {loading && <p className="text-sm text-gray-600">Searching…</p>}

        {searchExecuted && <p className="text-sm text-gray-600">Found {results.length} result(s)</p>}

        {!loading && results.length > 0 && (
          <ul className="space-y-2">
            {results.map(r => (
              <li key={r.id} className="bg-white rounded-xl p-4 shadow">
                <div className="font-semibold">{r.organisation}</div>
                <div className="text-sm text-gray-600">
                  {r.location || '—'} · {r.type || '—'} · {r.route || '—'}
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && results.length === 0 && suggestions.length > 0 && (
          <div className="mt-6">
            <div className="text-gray-700 mb-2">Did you mean:</div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => { setQ(s); runSearch(s); }}
                  className="rounded-full px-3 py-1 bg-white border shadow text-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
