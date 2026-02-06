import React, { useState } from 'react';
import Button from '../ui/Button';

const ClientImportModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      onImport(file);
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full">
        <div className="px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">Импорт клиентов</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center">
            <input type="file" accept=".csv,.xlsx" onChange={(e) => setFile(e.target.files[0])} className="hidden" id="file-input" />
            <label htmlFor="file-input" className="cursor-pointer">
              <p className="text-4xl mb-4">📄</p>
              <p className="text-slate-600">Нажмите для выбора файла</p>
              <p className="text-sm text-slate-400 mt-2">CSV или XLSX</p>
            </label>
            {file && <p className="mt-4 text-sm text-green-600">✓ {file.name}</p>}
          </div>
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Отмена</Button>
            <Button type="submit" variant="primary" className="flex-1" disabled={!file}>Импортировать</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientImportModal;
