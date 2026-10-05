import React from 'react';
import { Users, TrendingUp, Globe, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getLocalizedCountryName } from '../utils/avatars';
import CountryFlag from './CountryFlag';

export default function AnalyticsView({ employees }) {
  const { t, language } = useApp();
  const total = employees.length;

  // Department counts
  const departmentCounts = {};
  employees.forEach(e => {
    const dep = e.department || "Engineering";
    departmentCounts[dep] = (departmentCounts[dep] || 0) + 1;
  });

  // Country counts
  const countryCounts = {};
  employees.forEach(e => {
    const c = e.country || "Otro";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });

  // Seniority levels
  const juniors = employees.filter(e => Number(e.yearsWork) <= 2).length;
  const mids = employees.filter(e => Number(e.yearsWork) >= 3 && Number(e.yearsWork) <= 5).length;
  const seniors = employees.filter(e => Number(e.yearsWork) >= 6).length;

  // Top experienced employees
  const topExperienced = [...employees].sort((a, b) => Number(b.yearsWork) - Number(a.yearsWork)).slice(0, 5);

  return (
    <div className="analytics-container">
      <div className="row g-4">
        {/* Department Breakdown */}
        <div className="col-12 col-lg-6">
          <div className="card border shadow-xs bg-white h-100 p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                {t('analyticsDeptTitle')}
              </h6>
              <span className="badge bg-light text-secondary border">
                {Object.keys(departmentCounts).length} {t('departments')}
              </span>
            </div>

            <div className="d-grid gap-3 mt-3">
              {Object.entries(departmentCounts).map(([dep, count]) => {
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={dep}>
                    <div className="d-flex justify-content-between text-dark small mb-1">
                      <span className="fw-medium">{dep}</span>
                      <span className="text-muted tabular-nums">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div
                        className="progress-bar bg-primary"
                        role="progressbar"
                        style={{ width: `${percentage}%` }}
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Experience / Seniority Distribution */}
        <div className="col-12 col-lg-6">
          <div className="card border shadow-xs bg-white h-100 p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <TrendingUp size={18} className="text-success" />
                {t('analyticsSeniorityTitle')}
              </h6>
              <span className="badge bg-light text-secondary border">
                {total} {t('analyticsColleagues')}
              </span>
            </div>

            <div className="row g-3 my-2 text-center">
              <div className="col-4">
                <div className="p-3 rounded-2 bg-light border">
                  <div className="text-secondary small fw-medium">Junior (1-2 {t('year')[0]})</div>
                  <h4 className="fw-bold text-dark tabular-nums mt-1 mb-0">{juniors}</h4>
                  <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                    {total > 0 ? Math.round((juniors / total) * 100) : 0}% {t('analyticsTeamShare')}
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="p-3 rounded-2 bg-light border">
                  <div className="text-secondary small fw-medium">Mid (3-5 {t('year')[0]})</div>
                  <h4 className="fw-bold text-dark tabular-nums mt-1 mb-0">{mids}</h4>
                  <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                    {total > 0 ? Math.round((mids / total) * 100) : 0}% {t('analyticsTeamShare')}
                  </div>
                </div>
              </div>

              <div className="col-4">
                <div className="p-3 rounded-2 bg-light border">
                  <div className="text-secondary small fw-medium">Senior (6+ {t('year')[0]})</div>
                  <h4 className="fw-bold text-dark tabular-nums mt-1 mb-0">{seniors}</h4>
                  <div className="text-muted small" style={{ fontSize: '0.72rem' }}>
                    {total > 0 ? Math.round((seniors / total) * 100) : 0}% {t('analyticsTeamShare')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-top">
              <span className="text-secondary small fw-semibold d-block mb-2">
                {t('analyticsTopSenior')}
              </span>
              <div className="d-grid gap-2">
                {topExperienced.map((emp, i) => (
                  <div key={emp.id} className="d-flex align-items-center justify-content-between p-2 rounded-2 bg-light small">
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-white text-dark border tabular-nums">{i + 1}</span>
                      <span className="fw-semibold text-dark">{emp.name}</span>
                      <span className="text-muted d-none d-sm-inline">· {emp.workPosition}</span>
                    </div>
                    <span className="fw-bold text-success tabular-nums">
                      {emp.yearsWork} {Number(emp.yearsWork) === 1 ? t('year') : t('years')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Distribution with Flags & Names */}
        <div className="col-12">
          <div className="card border shadow-xs bg-white p-4">
            <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
              <Globe size={18} className="text-info" />
              {t('analyticsGeoTitle')}
            </h6>
            <div className="row g-3">
              {Object.entries(countryCounts).map(([country, count]) => {
                const localizedCountry = getLocalizedCountryName(country, language);
                return (
                  <div key={country} className="col-6 col-sm-4 col-md-3 col-lg-2">
                    <div className="p-3 rounded-2 bg-light border text-center h-100 d-flex flex-column align-items-center justify-content-center">
                      <div className="mb-2">
                        <CountryFlag country={country} size="xl" />
                      </div>
                      <div className="fw-semibold text-dark small text-truncate w-100" title={localizedCountry}>
                        {localizedCountry}
                      </div>
                      <div className="text-primary fw-bold tabular-nums mt-1" style={{ fontSize: '0.85rem' }}>
                        {count} {count === 1 ? t('analyticsEmployeeUnit') : t('analyticsEmployeesUnit')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
