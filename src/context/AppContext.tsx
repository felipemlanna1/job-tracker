import { createContext, useContext, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { JobApplication, Resume, ApplicationStatus, StageEntry } from '../types';

interface AppContextType {
  applications: JobApplication[];
  resumes: Resume[];
  addApplication: (app: Omit<JobApplication, 'id' | 'stages' | 'createdAt' | 'updatedAt'>) => void;
  updateApplication: (id: string, data: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  addStage: (applicationId: string, status: ApplicationStatus, notes: string) => void;
  addResume: (resume: Omit<Resume, 'id' | 'uploadedAt'>) => void;
  deleteResume: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useLocalStorage<JobApplication[]>('job-tracker-apps', []);
  const [resumes, setResumes] = useLocalStorage<Resume[]>('job-tracker-resumes', []);

  const addApplication = (app: Omit<JobApplication, 'id' | 'stages' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = uuidv4();
    const initialStage: StageEntry = {
      id: uuidv4(),
      status: app.currentStatus,
      date: now,
      notes: '',
    };
    const newApp: JobApplication = {
      ...app,
      id,
      stages: [initialStage],
      createdAt: now,
      updatedAt: now,
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  const updateApplication = (id: string, data: Partial<JobApplication>) => {
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id ? { ...app, ...data, updatedAt: new Date().toISOString() } : app
      )
    );
  };

  const deleteApplication = (id: string) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  const addStage = (applicationId: string, status: ApplicationStatus, notes: string) => {
    const stage: StageEntry = {
      id: uuidv4(),
      status,
      date: new Date().toISOString(),
      notes,
    };
    setApplications((prev) =>
      prev.map((app) =>
        app.id === applicationId
          ? {
              ...app,
              currentStatus: status,
              stages: [...app.stages, stage],
              updatedAt: new Date().toISOString(),
            }
          : app
      )
    );
  };

  const addResume = (resume: Omit<Resume, 'id' | 'uploadedAt'>) => {
    const newResume: Resume = {
      ...resume,
      id: uuidv4(),
      uploadedAt: new Date().toISOString(),
    };
    setResumes((prev) => [newResume, ...prev]);
  };

  const deleteResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        resumes,
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
