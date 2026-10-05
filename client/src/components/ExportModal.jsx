import React, { useState } from 'react';
import { X, FileSpreadsheet, FileJson, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ExportModal({ isOpen, onClose, employees }) {
  const { t } = useApp();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const exportCSV = () => {
    const headers = ["ID", "Nombre", "Cargo", "Departamento", "País", "Edad", "Experiencia (años)", "Email"];
    const rows = employees.map(emp => [
      emp.id,
      `"${(emp.name || '').replace(/"/g, '""')}"`,
      `"${(emp.workPosition || '').replace(/"/g, '""')}"`,
      `"${(emp.department || '').replace(/"/g, '""')}"`,
      `"${(emp.country || '').replace(/"/g, '""')}"`,
      emp.age,
      emp.yearsWork,
      `"${(emp.email || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `staffmatrix_directory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(employees, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `staffmatrix_directory_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyToClipboard = () => {
    const text = JSON.stringify(employees, null, 2);
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div className="modal-card bg-white rounded-3 shadow-lg border w-100 overflow-hidden" style={{ maxWidth: '480px' }}>
        <div className="d-flex align-items-center justify-content-between p-3 px-4 border-bottom bg-light">
          <div>
            <h5 className="modal-title fw-bold text-dark mb-0">{t('exportTitle')}</h5>
            <p className="text-muted small mb-0">{t('exportSub')}</p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-light rounded-circle p-1 text-secondary"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4">
          <div className="d-grid gap-3">
            <button
              onClick={exportCSV}
              className="btn btn-outline-dark p-3 text-start d-flex align-items-center justify-content-between border rounded-3"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 bg-success-subtle text-success rounded-2">
                  <FileSpreadsheet size={24} />
                </div>
                <div>
                  <div className="fw-bold text-dark">{t('exportCsvTitle')}</div>
                  <div className="text-muted small">{t('exportCsvDesc')}</div>
                </div>
              </div>
              <span className="badge bg-light text-secondary border">.csv</span>
            </button>

            <button
              onClick={exportJSON}
              className="btn btn-outline-dark p-3 text-start d-flex align-items-center justify-content-between border rounded-3"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 bg-info-subtle text-info rounded-2">
                  <FileJson size={24} />
                </div>
                <div>
                  <div className="fw-bold text-dark">{t('exportJsonTitle')}</div>
                  <div className="text-muted small">{t('exportJsonDesc')}</div>
                </div>
              </div>
              <span className="badge bg-light text-secondary border">.json</span>
            </button>

            <button
              onClick={copyToClipboard}
              className="btn btn-outline-secondary p-3 text-start d-flex align-items-center justify-content-between border rounded-3"
            >
              <div className="d-flex align-items-center gap-3">
                <div className="p-2 bg-light text-dark rounded-2">
                  {copied ? <Check size={24} className="text-success" /> : <Copy size={24} />}
                </div>
                <div>
                  <div className="fw-bold text-dark">{copied ? t('exportCopyCopied') : t('exportCopyTitle')}</div>
                  <div className="text-muted small">{t('exportCopyDesc')}</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div className="p-3 px-4 bg-light border-top text-end">
          <button type="button" className="btn btn-sm btn-secondary px-3" onClick={onClose}>
            {t('btnClose')}
          </button>
        </div>
      </div>
    </div>
  );
}
