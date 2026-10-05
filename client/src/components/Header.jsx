import React from 'react';
import { Users, Plus, Download, BarChart2, RefreshCw, Sun, Moon, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  onOpenCreateModal, 
  onOpenExportModal,
  onResetData,
  employeeCount 
}) {
  const { language, setLanguage, theme, toggleTheme, t } = useApp();

  return (
    <header className="top-navbar py-2 px-3 px-md-4 shadow-sm sticky-top">
      <div className="container-fluid d-flex flex-wrap align-items-center justify-content-between gap-3">
        {/* Zone 1: Brand title and icon */}
        <div className="d-flex align-items-center gap-2">
          <div className="brand-icon-box bg-primary text-white rounded-3 d-flex align-items-center justify-content-center shadow-xs" style={{ width: '38px', height: '38px' }}>
            <Users size={20} />
          </div>
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="brand-title fs-5 fw-bold text-dark tracking-tight">StaffMatrix</span>
              <span className="badge bg-primary-subtle text-primary border border-primary-subtle fw-semibold" style={{ fontSize: '0.68rem' }}>
                {t('brandSubtitle')}
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Tab Buttons */}
        <nav className="d-none d-md-flex align-items-center gap-1 p-1 bg-light rounded-3 border">
          <button
            onClick={() => setCurrentTab('directory')}
            className={`nav-tab-btn ${currentTab === 'directory' ? 'active' : ''}`}
          >
            {t('navDirectory')} ({employeeCount})
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`nav-tab-btn d-flex align-items-center gap-1.5 ${currentTab === 'analytics' ? 'active' : ''}`}
          >
            <BarChart2 size={14} />
            <span>{t('navAnalytics')}</span>
          </button>
        </nav>

        {/* Zone 3: Actions + Theme & Language Switchers */}
        <div className="d-flex align-items-center gap-2">
          {/* Language Selector */}
          <div className="btn-group btn-group-sm rounded-2 overflow-hidden border" role="group" aria-label="Language">
            <button
              type="button"
              className={`btn btn-sm ${language === 'es' ? 'btn-primary fw-bold' : 'btn-light text-secondary'} border-0 px-2.5`}
              onClick={() => setLanguage('es')}
              title="Español"
            >
              ES
            </button>
            <button
              type="button"
              className={`btn btn-sm ${language === 'en' ? 'btn-primary fw-bold' : 'btn-light text-secondary'} border-0 px-2.5`}
              onClick={() => setLanguage('en')}
              title="English"
            >
              EN
            </button>
          </div>

          {/* Theme Toggle (Dark / Light) */}
          <button
            onClick={toggleTheme}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center p-2 rounded-2"
            title={theme === 'dark' ? t('themeToggleLight') : t('themeToggleDark')}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={16} className="text-warning" /> : <Moon size={16} className="text-dark" />}
          </button>

          {/* Reset sample data button */}
          <button
            onClick={onResetData}
            title={t('btnResetTitle')}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1 px-2.5 d-none d-lg-flex"
          >
            <RefreshCw size={14} />
            <span>{t('btnReset')}</span>
          </button>

          {/* Export Directory button */}
          <button
            onClick={onOpenExportModal}
            className="btn btn-sm btn-outline-secondary d-flex align-items-center gap-1.5 px-3"
          >
            <Download size={14} />
            <span className="d-none d-sm-inline">{t('btnExport')}</span>
          </button>

          {/* New Employee button */}
          <button
            onClick={onOpenCreateModal}
            className="btn btn-sm btn-primary d-flex align-items-center gap-1.5 px-3 shadow-sm fw-semibold"
          >
            <Plus size={16} />
            <span className="d-none d-xs-inline">{t('btnNewEmployee')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
