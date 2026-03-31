export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'phone_screen'
  | 'technical_interview'
  | 'behavioral_interview'
  | 'take_home'
  | 'final_round'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface StageEntry {
  id: string;
  status: ApplicationStatus;
  date: string;
  notes: string;
}

export interface Resume {
  id: string;
  name: string;
  fileName: string;
  fileData: string; // base64
  uploadedAt: string;
}

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  location: string;
  type: 'remote' | 'hybrid' | 'onsite';
  url: string;
  salary: string;
  currentStatus: ApplicationStatus;
  stages: StageEntry[];
  resumeId: string | null;
  coverLetter: string;
  notes: string;
  contactName: string;
  contactEmail: string;
  createdAt: string;
  updatedAt: string;
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  wishlist: 'Lista de Desejos',
  applied: 'Candidatura Enviada',
  phone_screen: 'Triagem Telefonica',
  technical_interview: 'Entrevista Tecnica',
  behavioral_interview: 'Entrevista Comportamental',
  take_home: 'Teste Tecnico',
  final_round: 'Rodada Final',
  offer: 'Proposta Recebida',
  accepted: 'Aceita',
  rejected: 'Rejeitada',
  withdrawn: 'Desistencia',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  wishlist: 'bg-gray-100 text-gray-700',
  applied: 'bg-blue-100 text-blue-700',
  phone_screen: 'bg-cyan-100 text-cyan-700',
  technical_interview: 'bg-purple-100 text-purple-700',
  behavioral_interview: 'bg-indigo-100 text-indigo-700',
  take_home: 'bg-orange-100 text-orange-700',
  final_round: 'bg-amber-100 text-amber-700',
  offer: 'bg-green-100 text-green-700',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-red-100 text-red-700',
  withdrawn: 'bg-stone-100 text-stone-700',
};
