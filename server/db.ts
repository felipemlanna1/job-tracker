import Database from 'better-sqlite3';
import path from 'path';

const db = new Database(path.join(import.meta.dirname, '..', 'data.db'));

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS resumes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    fileName TEXT NOT NULL,
    fileData TEXT NOT NULL,
    uploadedAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS applications (
    id TEXT PRIMARY KEY,
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    location TEXT DEFAULT '',
    type TEXT DEFAULT 'remote',
    url TEXT DEFAULT '',
    salary TEXT DEFAULT '',
    currentStatus TEXT DEFAULT 'applied',
    resumeId TEXT,
    coverLetter TEXT DEFAULT '',
    notes TEXT DEFAULT '',
    contactName TEXT DEFAULT '',
    contactEmail TEXT DEFAULT '',
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL,
    FOREIGN KEY (resumeId) REFERENCES resumes(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS stages (
    id TEXT PRIMARY KEY,
    applicationId TEXT NOT NULL,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    notes TEXT DEFAULT '',
    FOREIGN KEY (applicationId) REFERENCES applications(id) ON DELETE CASCADE
  );
`);

export default db;
