import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATUS_LABELS, type ApplicationStatus, type StageEntry } from '../types';
import StatusBadge from './StatusBadge';

interface Props {
  applicationId: string;
  stages: StageEntry[];
}

export default function StageTimeline({ applicationId, stages }: Props) {
  const { addStage } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('phone_screen');
  const [newNotes, setNewNotes] = useState('');

  const handleAdd = () => {
    addStage(applicationId, newStatus, newNotes);
    setNewNotes('');
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Historico de Etapas</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700"
        >
          <Plus className="w-3.5 h-3.5" />
          Adicionar Etapa
        </button>
      </div>

      {showForm && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none"
          >
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
          <textarea
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            placeholder="Notas sobre esta etapa..."
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-3 py-1.5 text-sm outline-none resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="px-3 py-1 text-xs font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
            >
              Salvar
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {[...stages].reverse().map((stage, idx) => (
          <div key={stage.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-primary-500' : 'bg-gray-300'}`} />
              {idx < stages.length - 1 && <div className="w-px flex-1 bg-gray-200 mt-1" />}
            </div>
            <div className="pb-3">
              <StatusBadge status={stage.status} />
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(stage.date), "dd 'de' MMM 'de' yyyy, HH:mm", { locale: ptBR })}
              </p>
              {stage.notes && <p className="text-sm text-gray-600 mt-1">{stage.notes}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
