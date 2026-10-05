import React from 'react';
import { Edit2, Trash2, Eye, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVATAR_MAP, getLocalizedCountryName, getInitials, getAvatarColor } from '../utils/avatars';
import CountryFlag from './CountryFlag';

export default function EmployeeTable({ 
  employees, 
  onEdit, 
  onDelete, 
  onView,
  onOpenCreate 
}) {
  const { t, language } = useApp();

  if (employees.length === 0) {
    return (
      <div className="card border shadow-xs bg-white text-center py-5">
        <div className="card-body">
          <div className="empty-state-icon bg-light rounded-circle d-inline-flex p-3 mb-3 text-secondary">
            <Award size={32} />
          </div>
          <h5 className="fw-bold text-dark mb-1">{t('emptyTitle')}</h5>
          <p className="text-muted small mb-3">
            {t('emptySub')}
          </p>
          <button onClick={onOpenCreate} className="btn btn-sm btn-primary px-3">
            {t('emptyAction')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card border shadow-xs overflow-hidden">
      <div className="table-responsive">
        <table className="table align-middle mb-0 employee-table">
          <thead className="employee-table-head">
            <tr>
              <th scope="col" className="ps-4" style={{ width: '60px' }}>{t('thId')}</th>
              <th scope="col">{t('thEmployee')}</th>
              <th scope="col">{t('thPosition')}</th>
              <th scope="col">{t('thCountry')}</th>
              <th scope="col" className="text-center" style={{ width: '90px' }}>{t('thAge')}</th>
              <th scope="col">{t('thExperience')}</th>
              <th scope="col" className="pe-4 text-end" style={{ width: '130px' }}>{t('thActions')}</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => {
              const avatarImg = AVATAR_MAP[emp.id];
              const avatarColor = getAvatarColor(emp.name);
              const localizedCountry = getLocalizedCountryName(emp.country, language);

              return (
                <tr key={emp.id} className="employee-row">
                  {/* ID */}
                  <td className="ps-4 text-muted tabular-nums fw-medium" style={{ fontSize: '0.85rem' }}>
                    #{emp.id}
                  </td>

                  {/* Name & Avatar */}
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      {avatarImg ? (
                        <img
                          src={avatarImg}
                          alt={emp.name}
                          className="rounded-circle object-fit-cover shadow-xs flex-shrink-0"
                          style={{ width: '38px', height: '38px' }}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold flex-shrink-0 shadow-xs"
                          style={{
                            width: '38px',
                            height: '38px',
                            backgroundColor: avatarColor.bg,
                            color: avatarColor.text,
                            fontSize: '0.85rem'
                          }}
                        >
                          {getInitials(emp.name)}
                        </div>
                      )}
                      <div className="text-truncate">
                        <div className="fw-semibold text-dark text-truncate" style={{ fontSize: '0.92rem' }}>
                          {emp.name}
                        </div>
                        <div className="text-muted small text-truncate" style={{ fontSize: '0.78rem' }}>
                          {emp.email || `${emp.name.toLowerCase().replace(/\s+/g, '.')}@staffmatrix.io`}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Position & Department */}
                  <td>
                    <div className="fw-medium text-dark text-truncate" style={{ fontSize: '0.88rem' }}>
                      {emp.workPosition}
                    </div>
                    <div className="text-secondary small" style={{ fontSize: '0.75rem' }}>
                      {emp.department || "Engineering"}
                    </div>
                  </td>

                  {/* Country with SVG Flag & Full Name */}
                  <td>
                    <div className="d-inline-flex align-items-center gap-2 text-dark" style={{ fontSize: '0.88rem' }}>
                      <CountryFlag country={emp.country} size="md" />
                      <span className="fw-medium text-truncate">{localizedCountry}</span>
                    </div>
                  </td>

                  {/* Age */}
                  <td className="text-center tabular-nums text-dark" style={{ fontSize: '0.88rem' }}>
                    <span className="fw-semibold">{emp.age}</span> <span className="text-muted small" style={{ fontSize: '0.75rem' }}>{t('year')[0]}</span>
                  </td>

                  {/* Experience */}
                  <td>
                    <div className="d-flex align-items-center gap-2" style={{ maxWidth: '140px' }}>
                      <div className="progress flex-grow-1" style={{ height: '6px' }}>
                        <div
                          className={`progress-bar ${Number(emp.yearsWork) >= 5 ? 'bg-success' : Number(emp.yearsWork) >= 3 ? 'bg-primary' : 'bg-info'}`}
                          role="progressbar"
                          style={{ width: `${Math.min(100, (Number(emp.yearsWork) / 12) * 100)}%` }}
                          aria-valuenow={emp.yearsWork}
                          aria-valuemin="0"
                          aria-valuemax="12"
                        ></div>
                      </div>
                      <span className="tabular-nums fw-semibold text-dark small">
                        {emp.yearsWork} {Number(emp.yearsWork) === 1 ? t('year') : t('years')}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="pe-4 text-end">
                    <div className="btn-group btn-group-sm" role="group" aria-label="Actions">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-icon"
                        onClick={() => onView(emp)}
                        title={t('btnView')}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-icon"
                        onClick={() => onEdit(emp)}
                        title={t('btnEdit')}
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-icon"
                        onClick={() => onDelete(emp)}
                        title={t('btnDelete')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
