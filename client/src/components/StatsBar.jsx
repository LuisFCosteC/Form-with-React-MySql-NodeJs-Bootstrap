import React from 'react';
import { Users, Briefcase, Calendar, Globe, Sparkles, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function StatsBar({ employees }) {
  const { t } = useApp();
  const total = employees.length;

  const avgExperience = total > 0
    ? (employees.reduce((acc, curr) => acc + (Number(curr.yearsWork) || 0), 0) / total).toFixed(1)
    : "0.0";

  const avgAge = total > 0
    ? Math.round(employees.reduce((acc, curr) => acc + (Number(curr.age) || 0), 0) / total)
    : 0;

  const countries = new Set(employees.map(e => e.country).filter(Boolean));
  const departments = new Set(employees.map(e => e.department).filter(Boolean));

  return (
    <div className="row g-3 mb-4">
      {/* Stat 1: Total Employees */}
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card h-100 border shadow-xs stat-card position-relative overflow-hidden">
          <div className="card-body p-3.5 d-flex align-items-center justify-content-between">
            <div>
              <p className="text-secondary text-uppercase fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.6px' }}>
                {t('statTotal')}
              </p>
              <h3 className="fw-bold mb-0 text-dark tabular-nums fs-2">{total}</h3>
              <div className="text-muted mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                <span className="badge rounded-pill bg-primary-subtle text-primary fw-medium px-2 py-0.5">100%</span>
                <span>{t('statTotalSub')}</span>
              </div>
            </div>
            <div className="stat-icon-wrapper rounded-3 shadow-xs bg-primary-subtle text-primary border border-primary-subtle">
              <Users size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Stat 2: Avg Experience */}
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card h-100 border shadow-xs stat-card position-relative overflow-hidden">
          <div className="card-body p-3.5 d-flex align-items-center justify-content-between">
            <div>
              <p className="text-secondary text-uppercase fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.6px' }}>
                {t('statExperience')}
              </p>
              <h3 className="fw-bold mb-0 text-dark tabular-nums fs-2">
                {avgExperience} <span className="fs-6 fw-normal text-muted">{t('years')}</span>
              </h3>
              <div className="text-muted mt-1 d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                <TrendingUp size={12} className="text-success" />
                <span>{t('statExperienceSub')}</span>
              </div>
            </div>
            <div className="stat-icon-wrapper rounded-3 shadow-xs bg-success-subtle text-success border border-success-subtle">
              <Briefcase size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Stat 3: Avg Age */}
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card h-100 border shadow-xs stat-card position-relative overflow-hidden">
          <div className="card-body p-3.5 d-flex align-items-center justify-content-between">
            <div>
              <p className="text-secondary text-uppercase fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.6px' }}>
                {t('statAge')}
              </p>
              <h3 className="fw-bold mb-0 text-dark tabular-nums fs-2">
                {avgAge} <span className="fs-6 fw-normal text-muted">{t('years')}</span>
              </h3>
              <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                <span>{t('statAgeSub')}</span>
              </div>
            </div>
            <div className="stat-icon-wrapper rounded-3 shadow-xs bg-info-subtle text-info border border-info-subtle">
              <Calendar size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Stat 4: Global Reach / Departments */}
      <div className="col-12 col-sm-6 col-lg-3">
        <div className="card h-100 border shadow-xs stat-card position-relative overflow-hidden">
          <div className="card-body p-3.5 d-flex align-items-center justify-content-between">
            <div>
              <p className="text-secondary text-uppercase fw-bold mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.6px' }}>
                {t('statReach')}
              </p>
              <h3 className="fw-bold mb-0 text-dark tabular-nums fs-2">
                {countries.size} <span className="fs-6 fw-normal text-muted">{t('countries')}</span>
              </h3>
              <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                <span>{t('statReachSub', { count: departments.size })}</span>
              </div>
            </div>
            <div className="stat-icon-wrapper rounded-3 shadow-xs bg-warning-subtle text-warning border border-warning-subtle">
              <Globe size={22} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
