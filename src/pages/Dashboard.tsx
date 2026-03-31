import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { type ApplicationStatus } from '../types';
import StatusBadge from '../components/StatusBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Dashboard() {
  const { applications } = useApp();

  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter(
      (a) => !['rejected', 'withdrawn', 'accepted'].includes(a.currentStatus)
    ).length;
    const offers = applications.filter((a) => ['offer', 'accepted'].includes(a.currentStatus)).length;
    const rejected = applications.filter((a) => a.currentStatus === 'rejected').length;
    return { total, active, offers, rejected };
  }, [applications]);

  const statusGroups = useMemo(() => {
    const groups: Partial<Record<ApplicationStatus, number>> = {};
    applications.forEach((app) => {
      groups[app.currentStatus] = (groups[app.currentStatus] || 0) + 1;
    });
    return Object.entries(groups).sort(([, a], [, b]) => b - a);
  }, [applications]);

  const recentApps = applications.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 mt-1">Visao geral das suas candidaturas</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total de Candidaturas', value: stats.total, icon: Briefcase, color: 'text-primary-600 bg-primary-50' },
          { label: 'Em Andamento', value: stats.active, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Propostas/Aceitas', value: stats.offers, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
          { label: 'Rejeitadas', value: stats.rejected, icon: XCircle, color: 'text-red-600 bg-red-50' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {statusGroups.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Distribuicao por Status
          </h3>
          <div className="space-y-3">
            {statusGroups.map(([status, count]) => {
              const pct = Math.round((count / applications.length) * 100);
              return (
                <div key={status} className="flex items-center gap-3">
                  <div className="w-40">
                    <StatusBadge status={status as ApplicationStatus} />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full bg-primary-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-600 w-16 text-right">
                    {count} ({pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {recentApps.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Candidaturas Recentes</h3>
            <Link to="/applications" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Ver todas
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {recentApps.map((app) => (
              <Link
                key={app.id}
                to={`/applications/${app.id}`}
                className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors"
              >
                <div>
                  <p className="font-medium text-gray-900">{app.position}</p>
                  <p className="text-sm text-gray-500">{app.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={app.currentStatus} />
                  <span className="text-xs text-gray-400">
                    {format(new Date(app.updatedAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma candidatura ainda</h3>
          <p className="text-gray-500 mb-4">Comece adicionando sua primeira candidatura</p>
          <Link
            to="/applications"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            Ir para Candidaturas
          </Link>
        </div>
      )}
    </div>
  );
}
