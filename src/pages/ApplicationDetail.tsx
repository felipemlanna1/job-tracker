import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, ExternalLink, Mail, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';
import StageTimeline from '../components/StageTimeline';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const TYPE_LABELS = { remote: 'Remoto', hybrid: 'Hibrido', onsite: 'Presencial' };

export default function ApplicationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, resumes, deleteApplication } = useApp();

  const app = applications.find((a) => a.id === id);
  if (!app) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Candidatura nao encontrada.</p>
        <Link to="/applications" className="text-primary-600 hover:underline text-sm mt-2 inline-block">
          Voltar para candidaturas
        </Link>
      </div>
    );
  }

  const resume = resumes.find((r) => r.id === app.resumeId);

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir esta candidatura?')) {
      deleteApplication(app.id);
      navigate('/applications');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/applications')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </button>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
          Excluir
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{app.position}</h2>
            <p className="text-gray-600 mt-1">{app.company}</p>
          </div>
          <StatusBadge status={app.currentStatus} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Localizacao</p>
            <p className="text-sm text-gray-900 mt-0.5">{app.location || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Modalidade</p>
            <p className="text-sm text-gray-900 mt-0.5">{TYPE_LABELS[app.type]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Salario</p>
            <p className="text-sm text-gray-900 mt-0.5">{app.salary || '-'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">Criada em</p>
            <p className="text-sm text-gray-900 mt-0.5">
              {format(new Date(app.createdAt), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>

        {app.url && (
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-4"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Ver vaga original
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <StageTimeline applicationId={app.id} stages={app.stages} />
        </div>

        <div className="space-y-6">
          {(app.contactName || app.contactEmail) && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Contato</h3>
              {app.contactName && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <User className="w-4 h-4" />
                  {app.contactName}
                </div>
              )}
              {app.contactEmail && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${app.contactEmail}`} className="text-primary-600 hover:underline">
                    {app.contactEmail}
                  </a>
                </div>
              )}
            </div>
          )}

          {resume && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Curriculo Enviado</h3>
              <p className="text-sm text-gray-600">{resume.name}</p>
              <p className="text-xs text-gray-400 mt-1">{resume.fileName}</p>
            </div>
          )}

          {app.coverLetter && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Carta de Apresentacao</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{app.coverLetter}</p>
            </div>
          )}

          {app.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Notas</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{app.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
