import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import db from './db.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// --- Applications ---

app.get('/api/applications', (_req, res) => {
  const apps = db.prepare('SELECT * FROM applications ORDER BY updatedAt DESC').all() as any[];
  const stagesStmt = db.prepare('SELECT * FROM stages WHERE applicationId = ? ORDER BY date ASC');
  const result = apps.map((a) => ({
    ...a,
    stages: stagesStmt.all(a.id),
  }));
  res.json(result);
});

app.get('/api/applications/:id', (req, res) => {
  const app_ = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id) as any;
  if (!app_) return res.status(404).json({ error: 'Not found' });
  const stages = db.prepare('SELECT * FROM stages WHERE applicationId = ? ORDER BY date ASC').all(app_.id);
  res.json({ ...app_, stages });
});

app.post('/api/applications', (req, res) => {
  const id = randomUUID();
  const now = new Date().toISOString();
  const b = req.body;

  db.prepare(`
    INSERT INTO applications (id, company, position, location, type, url, salaryMarket, salaryRequested, salaryBudget, currentStatus, resumeId, coverLetter, notes, contactName, contactEmail, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, b.company, b.position, b.location || '', b.type || 'remote', b.url || '', b.salaryMarket || '', b.salaryRequested || '', b.salaryBudget || '', b.currentStatus || 'applied', b.resumeId || null, b.coverLetter || '', b.notes || '', b.contactName || '', b.contactEmail || '', now, now);

  const stageId = randomUUID();
  db.prepare('INSERT INTO stages (id, applicationId, status, date, notes) VALUES (?, ?, ?, ?, ?)').run(stageId, id, b.currentStatus || 'applied', now, '');

  const created = db.prepare('SELECT * FROM applications WHERE id = ?').get(id);
  const stages = db.prepare('SELECT * FROM stages WHERE applicationId = ?').all(id);
  res.status(201).json({ ...created, stages });
});

app.put('/api/applications/:id', (req, res) => {
  const b = req.body;
  const now = new Date().toISOString();
  const fields = ['company', 'position', 'location', 'type', 'url', 'salaryMarket', 'salaryRequested', 'salaryBudget', 'currentStatus', 'resumeId', 'coverLetter', 'notes', 'contactName', 'contactEmail'];
  const sets = fields.filter((f) => b[f] !== undefined).map((f) => `${f} = @${f}`);
  if (sets.length === 0) return res.status(400).json({ error: 'No fields' });

  sets.push('updatedAt = @updatedAt');
  b.updatedAt = now;

  db.prepare(`UPDATE applications SET ${sets.join(', ')} WHERE id = @id`).run({ ...b, id: req.params.id });
  const updated = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
  const stages = db.prepare('SELECT * FROM stages WHERE applicationId = ?').all(req.params.id);
  res.json({ ...updated, stages });
});

app.delete('/api/applications/:id', (req, res) => {
  db.prepare('DELETE FROM applications WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

// --- Stages ---

app.post('/api/applications/:id/stages', (req, res) => {
  const stageId = randomUUID();
  const now = new Date().toISOString();
  const { status, notes } = req.body;

  db.prepare('INSERT INTO stages (id, applicationId, status, date, notes) VALUES (?, ?, ?, ?, ?)').run(stageId, req.params.id, status, now, notes || '');
  db.prepare('UPDATE applications SET currentStatus = ?, updatedAt = ? WHERE id = ?').run(status, now, req.params.id);

  const app_ = db.prepare('SELECT * FROM applications WHERE id = ?').get(req.params.id);
  const stages = db.prepare('SELECT * FROM stages WHERE applicationId = ?').all(req.params.id);
  res.status(201).json({ ...app_, stages });
});

// --- Resumes ---

app.get('/api/resumes', (_req, res) => {
  res.json(db.prepare('SELECT * FROM resumes ORDER BY uploadedAt DESC').all());
});

app.post('/api/resumes', (req, res) => {
  const id = randomUUID();
  const now = new Date().toISOString();
  const { name, fileName, fileData } = req.body;
  db.prepare('INSERT INTO resumes (id, name, fileName, fileData, uploadedAt) VALUES (?, ?, ?, ?, ?)').run(id, name, fileName, fileData, now);
  res.status(201).json(db.prepare('SELECT * FROM resumes WHERE id = ?').get(id));
});

app.delete('/api/resumes/:id', (req, res) => {
  db.prepare('DELETE FROM resumes WHERE id = ?').run(req.params.id);
  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
