import React from 'react';
import { X, Edit2, Trash2, MapPin, Calendar, Briefcase, Mail, Building, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AVATAR_MAP, getLocalizedCountryName, getInitials, getAvatarColor } from '../utils/avatars';
import CountryFlag from './CountryFlag';

export default function EmployeeDetailsModal({ 
  employee, 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete 
}) {
  const { t, language } = useApp();

  if (!isOpen || !employee) return null;

  const avatarImg = AVATAR_MAP[employee.id];
  const avatarColor = getAvatarColor(employee.name);
  const localizedCountry = getLocalizedCountryName(employee.country, language);

  return (
    <div className="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div className="modal-card bg-white rounded-3 shadow-lg border w-100 overflow-hidden" style={{ maxWidth: '580px' }}>
        {/* Header Cover */}
        <div className="p-4 bg-dark text-white position-relative" style={{ minHeight: '120px' }}>
          <button
            type="button"
            className="btn btn-sm btn-dark position-absolute top-0 end-0 m-3 text-white border-0"
            onClick={onClose}
          >
            <X size={18} />
          </button>
          <div className="d-flex align-items-center gap-3 mt-2">
            {avatarImg ? (
              <img
                src={avatarImg}
                alt={employee.name}
                className="rounded-circle border border-3 border-white shadow object-fit-cover flex-shrink-0"
                style={{ width: '70px', height: '70px' }}
                referrerPolicy="no-referrer"
              />
            ) : (
              <div
                className="rounded-circle border border-3 border-white shadow d-flex align-items-center justify-content-center fw-bold flex-shrink-0"
                style={{
                  width: '70px',
                  height: '70px',
                  backgroundColor: avatarColor.bg,
                  color: avatarColor.text,
                  fontSize: '1.5rem'
                }}
              >
                {getInitials(employee.name)}
              </div>
            )}
            <div>
              <h5 className="fw-bold mb-0 text-white">{employee.name}</h5>
              <div className="text-light opacity-75 small">{employee.workPosition}</div>
              <span className="badge bg-success-subtle text-success border border-success-subtle mt-1" style={{ fontSize: '0.7rem' }}>
                <CheckCircle2 size={10} className="me-1 inline" /> {t('statusActive')}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Info Details */}
        <div className="p-4">
          <div className="row g-3">
            <div className="col-6">
              <div className="p-3 bg-light rounded-2 border">
                <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                  <Building size={14} />
                  <span>{t('fieldDepartment')}</span>
                </div>
                <div className="fw-bold text-dark">{employee.department || "Engineering"}</div>
              </div>
            </div>

            <div className="col-6">
              <div className="p-3 bg-light rounded-2 border">
                <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                  <MapPin size={14} />
                  <span>{t('labelLocation')}</span>
                </div>
                <div className="fw-bold text-dark d-flex align-items-center gap-2">
                  <CountryFlag country={employee.country} size="md" />
                  <span className="text-truncate">{localizedCountry}</span>
                </div>
              </div>
            </div>

            <div className="col-6">
              <div className="p-3 bg-light rounded-2 border">
                <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                  <Calendar size={14} />
                  <span>{t('thAge')}</span>
                </div>
                <div className="fw-bold text-dark tabular-nums">{employee.age} {t('years')}</div>
              </div>
            </div>

            <div className="col-6">
              <div className="p-3 bg-light rounded-2 border">
                <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                  <Briefcase size={14} />
                  <span>{t('labelCareer')}</span>
                </div>
                <div className="fw-bold text-dark tabular-nums">{employee.yearsWork} {Number(employee.yearsWork) === 1 ? t('year') : t('years')} {t('yearsOfExp')}</div>
              </div>
            </div>

            <div className="col-12">
              <div className="p-3 bg-light rounded-2 border">
                <div className="text-secondary small d-flex align-items-center gap-1 mb-1">
                  <Mail size={14} />
                  <span>{t('fieldEmail')}</span>
                </div>
                <div className="fw-medium text-dark">
                  {employee.email || `${employee.name.toLowerCase().replace(/\s+/g, '.')}@staffmatrix.io`}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="p-3 px-4 bg-light border-top d-flex align-items-center justify-content-between">
          <button
            type="button"
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 px-3"
            onClick={() => {
              onClose();
              onDelete(employee);
            }}
          >
            <Trash2 size={14} />
            <span>{t('btnDelete')}</span>
          </button>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary px-3"
              onClick={onClose}
            >
              {t('btnClose')}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-primary d-flex align-items-center gap-1 px-3"
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
            >
              <Edit2 size={14} />
              <span>{t('btnEditProfile')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
