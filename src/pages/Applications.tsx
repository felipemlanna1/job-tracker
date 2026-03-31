import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STATUS_LABELS } from '../types';
import StatusBadge from '../components/StatusBadge';
import ApplicationForm from '../components/ApplicationForm';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Applications() {
  const { applications } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !search ||
        app.company.toLowerCase().includes(search.toLowerCase()) ||
        app.position.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = filterStatus === 'all' || app.currentStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, filterStatus]);

  const TYPE_LABELS = { remote: 'Remoto', hybrid: 'Hibrido', onsite: 'Presencial' };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Candidaturas</h2>
          <p className="text-gray-500 mt-1">{applications.length} candidatura(s) registrada(s)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Plus className="w-4 h-4" />
          Nova Candidatura
        </button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por empresa ou vaga..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
          >
            <option value="all">Todos os Status</option>
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Empresa / Vaga</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Localidade</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Modalidade</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Atualizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link to={`/applications/${app.id}`} className="block">
                      <p className="font-medium text-gray-900 hover:text-primary-600">{app.position}</p>
                      <p className="text-sm text-gray-500">{app.company}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{app.location || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{TYPE_LABELS[app.type]}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={app.currentStatus} />
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {format(new Date(app.updatedAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">
            {applications.length === 0
              ? 'Nenhuma candidatura registrada. Clique em "Nova Candidatura" para comecar.'
              : 'Nenhuma candidatura encontrada com os filtros atuais.'}
          </p>
        </div>
      )}

      {showForm && <ApplicationForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
