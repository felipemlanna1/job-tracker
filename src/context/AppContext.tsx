import { createContext, useContext, type ReactNode, useState, useEffect, useCallback } from 'react';
import type { JobApplication, Resume, ApplicationStatus } from '../types';

const API = 'http://localhost:3001/api';

interface AppContextType {
  applications: JobApplication[];
  resumes: Resume[];
  loading: boolean;
  addApplication: (app: Omit<JobApplication, 'id' | 'stages' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateApplication: (id: string, data: Partial<JobApplication>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
  addStage: (applicationId: string, status: ApplicationStatus, notes: string) => Promise<void>;
  addResume: (resume: Omit<Resume, 'id' | 'uploadedAt'>) => Promise<void>;
  deleteResume: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    try {
      const [appsRes, resumesRes] = await Promise.all([
        fetch(`${API}/applications`),
        fetch(`${API}/resumes`),
      ]);
      setApplications(await appsRes.json());
      setResumes(await resumesRes.json());
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const addApplication = async (app: Omit<JobApplication, 'id' | 'stages' | 'createdAt' | 'updatedAt'>) => {
    const res = await fetch(`${API}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    });
    const created = await res.json();
    setApplications((prev) => [created, ...prev]);
  };

  const updateApplication = async (id: string, data: Partial<JobApplication>) => {
    const res = await fetch(`${API}/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const updated = await res.json();
    setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const deleteApplication = async (id: string) => {
    await fetch(`${API}/applications/${id}`, { method: 'DELETE' });
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  const addStage = async (applicationId: string, status: ApplicationStatus, notes: string) => {
    const res = await fetch(`${API}/applications/${applicationId}/stages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes }),
    });
    const updated = await res.json();
    setApplications((prev) => prev.map((a) => (a.id === applicationId ? updated : a)));
  };

  const addResume = async (resume: Omit<Resume, 'id' | 'uploadedAt'>) => {
    const res = await fetch(`${API}/resumes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resume),
    });
    const created = await res.json();
    setResumes((prev) => [created, ...prev]);
  };

  const deleteResume = async (id: string) => {
    await fetch(`${API}/resumes/${id}`, { method: 'DELETE' });
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        resumes,
        loading,
        addApplication,
        updateApplication,
        deleteApplication,
        addStage,
        addResume,
        deleteResume,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
