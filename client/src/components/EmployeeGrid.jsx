import React from 'react';
import { Edit2, Trash2, Eye, MapPin, Briefcase, Calendar, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVATAR_MAP, getLocalizedCountryName, getInitials, getAvatarColor } from '../utils/avatars';
import CountryFlag from './CountryFlag';

export default function EmployeeGrid({ 
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
    <div className="row g-3">
      {employees.map((emp) => {
        const avatarImg = AVATAR_MAP[emp.id];
        const avatarColor = getAvatarColor(emp.name);
        const localizedCountry = getLocalizedCountryName(emp.country, language);

        return (
          <div key={emp.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
            <div className="card h-100 border shadow-xs employee-card bg-white position-relative">
              <div className="card-body p-3 d-flex flex-column">
                {/* Header with Avatar and ID */}
                <div className="d-flex align-items-start justify-content-between mb-3">
                  <div className="position-relative">
                    {avatarImg ? (
                      <img
                        src={avatarImg}
                        alt={emp.name}
                        className="rounded-circle object-fit-cover shadow-xs"
                        style={{ width: '52px', height: '52px' }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-xs"
                        style={{
                          width: '52px',
                          height: '52px',
                          backgroundColor: avatarColor.bg,
                          color: avatarColor.text,
                          fontSize: '1.1rem'
                        }}
                      >
                        {getInitials(emp.name)}
                      </div>
                    )}
                  </div>
                  <span className="badge bg-light text-secondary border tabular-nums" style={{ fontSize: '0.72rem' }}>
                    ID #{emp.id}
                  </span>
                </div>

                {/* Name & Position */}
                <div className="mb-2">
                  <h6 className="fw-bold text-dark mb-0 text-truncate" title={emp.name} style={{ fontSize: '1rem' }}>
                    {emp.name}
                  </h6>
                  <div className="text-primary fw-medium small text-truncate" title={emp.workPosition} style={{ fontSize: '0.82rem' }}>
                    {emp.workPosition}
                  </div>
                  <div className="text-muted small text-truncate" style={{ fontSize: '0.75rem' }}>
                    {emp.email || `${emp.name.toLowerCase().replace(/\s+/g, '.')}@staffmatrix.io`}
                  </div>
                </div>

                {/* Info Items */}
                <div className="mt-2 pt-2 border-top flex-grow-1">
                  <div className="d-flex align-items-center justify-content-between text-secondary py-1" style={{ fontSize: '0.8rem' }}>
                    <span className="d-flex align-items-center gap-1">
                      <MapPin size={13} className="text-muted" />
                      <span>{t('thCountry')}</span>
                    </span>
                    <span className="fw-medium text-dark d-flex align-items-center gap-1.5">
                      <CountryFlag country={emp.country} size="sm" />
                      <span className="text-truncate">{localizedCountry}</span>
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between text-secondary py-1" style={{ fontSize: '0.8rem' }}>
                    <span className="d-flex align-items-center gap-1">
                      <Calendar size={13} className="text-muted" />
                      <span>{t('thAge')}</span>
                    </span>
                    <span className="fw-medium text-dark tabular-nums">
                      {emp.age} {t('years')}
                    </span>
                  </div>

                  <div className="d-flex align-items-center justify-content-between text-secondary py-1" style={{ fontSize: '0.8rem' }}>
                    <span className="d-flex align-items-center gap-1">
                      <Briefcase size={13} className="text-muted" />
                      <span>{t('thExperience')}</span>
                    </span>
                    <span className="fw-medium text-dark tabular-nums">
                      {emp.yearsWork} {Number(emp.yearsWork) === 1 ? t('year') : t('years')}
                    </span>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="pt-3 mt-2 border-top d-flex align-items-center justify-content-between gap-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-secondary flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                    onClick={() => onView(emp)}
                    style={{ fontSize: '0.78rem' }}
                  >
                    <Eye size={13} />
                    <span>{t('btnView')}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary flex-grow-1 d-flex align-items-center justify-content-center gap-1"
                    onClick={() => onEdit(emp)}
                    style={{ fontSize: '0.78rem' }}
                  >
                    <Edit2 size={13} />
                    <span>{t('btnEdit')}</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger px-2"
                    onClick={() => onDelete(emp)}
                    title={t('btnDelete')}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
