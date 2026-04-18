import { useCallback, useEffect, useState } from 'react';
import { apiBaseUrl } from './config.js';

export default function App() {
  const [grades, setGrades] = useState([]);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', subject: '', score: '' });

  const loadGrades = useCallback(async () => {
    setError('');
    const res = await fetch(`${apiBaseUrl}/grades`);
    if (!res.ok) throw new Error('Could not load grades');
    const data = await res.json();
    console.log(data['grades']);
    setGrades(Array.isArray(data['grades']) ? data['grades'] : []);
  }, []);

  useEffect(() => {
    loadGrades().catch(() => {
      setError(
        'Could not reach the API. Start the backend (port 3000) and refresh.',
      );
      setGrades([]);
    });
  }, [loadGrades]);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    const body = {
      name: form.name.trim(),
      subject: form.subject.trim(),
      score: Number(form.score),
    };
    try {
      const res = await fetch(`${apiBaseUrl}/grades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Could not save grade');
      setForm({ name: '', subject: '', score: '' });
      await loadGrades();
    } catch (ex) {
      setError(
        ex.message ||
          'Something went wrong. Is the API running and CORS allowed?',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <h1>Grades</h1>

      <form onSubmit={onSubmit}>
        <label>
          Name
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Student name"
            autoComplete="off"
          />
        </label>
        <label>
          Subject
          <input
            type="text"
            required
            value={form.subject}
            onChange={(e) =>
              setForm((f) => ({ ...f, subject: e.target.value }))
            }
            placeholder="e.g. Math"
            autoComplete="off"
          />
        </label>
        <label>
          Score
          <input
            type="number"
            required
            min={0}
            max={100}
            step="0.1"
            value={form.score}
            onChange={(e) =>
              setForm((f) => ({ ...f, score: e.target.value }))
            }
            placeholder="0–100"
          />
        </label>
        <button type="submit" disabled={submitting}>
          Add grade
        </button>
        {error ? <p className="err">{error}</p> : null}
      </form>

      <h2>All grades</h2>
      {!grades.length ? (
        <p className="empty">No grades yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Subject</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.id}>
                <td>{g.name}</td>
                <td>{g.subject}</td>
                <td>{g.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
