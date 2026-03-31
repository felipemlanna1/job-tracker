import { useRef } from 'react';
import { Upload, Trash2, FileText, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Resumes() {
  const { resumes, addResume, deleteResume } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const fileData = reader.result as string;
      const name = file.name.replace(/\.[^/.]+$/, '');
      addResume({ name, fileName: file.name, fileData });
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownload = (resume: { fileName: string; fileData: string }) => {
    const link = document.createElement('a');
    link.href = resume.fileData;
    link.download = resume.fileName;
    link.click();
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Excluir o curriculo "${name}"?`)) {
      deleteResume(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Curriculos</h2>
          <p className="text-gray-500 mt-1">Gerencie os curriculos enviados</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
        >
          <Upload className="w-4 h-4" />
          Upload Curriculo
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {resumes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resumes.map((resume) => (
            <div
              key={resume.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-50 rounded-lg">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">{resume.name}</h3>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{resume.fileName}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Enviado em {format(new Date(resume.uploadedAt), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleDownload(resume)}
                  className="flex items-center gap-1 text-xs text-primary-600 hover:text-primary-700 font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={() => handleDelete(resume.id, resume.name)}
                  className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum curriculo salvo</h3>
          <p className="text-gray-500 mb-4">Faca upload dos curriculos que voce enviou para as vagas</p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            <Upload className="w-4 h-4" />
            Upload Curriculo
          </button>
        </div>
      )}
    </div>
  );
}
