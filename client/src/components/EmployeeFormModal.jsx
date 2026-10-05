import React, { useState, useEffect } from 'react';
import { X, User, Briefcase, Globe, Calendar, Clock, Mail, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { COMMON_COUNTRY_LIST, getLocalizedCountryName, getInitials, getAvatarColor } from '../utils/avatars';
import CountryFlag from './CountryFlag';
import CountrySelect from './CountrySelect';

const COMMON_POSITIONS = [
  "Senior Full Stack Engineer",
  "Frontend React Specialist",
  "Backend Node.js Developer",
  "Lead Product Designer",
  "Cloud & DevOps Architect",
  "QA Automation Engineer",
  "Data Science Analyst",
  "Scrum Master / Agile Coach",
  "HR & Talent Specialist",
  "Mobile Flutter / React Native Developer"
];

const DEPARTMENTS = [
  "Engineering",
  "Product & UX",
  "Infrastructure",
  "Quality Assurance",
  "Analytics",
  "People & HR",
  "Growth & Marketing"
];

export default function EmployeeFormModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  isEdit 
}) {
  const { t, language } = useApp();

  const [name, setName] = useState("");
  const [age, setAge] = useState(28);
  const [country, setCountry] = useState("República Dominicana");
  const [workPosition, setWorkPosition] = useState("");
  const [yearsWork, setYearsWork] = useState(3);
  const [department, setDepartment] = useState("Engineering");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setAge(initialData.age || 28);
      setCountry(initialData.country || "República Dominicana");
      setWorkPosition(initialData.workPosition || "");
      setYearsWork(initialData.yearsWork !== undefined ? initialData.yearsWork : 3);
      setDepartment(initialData.department || "Engineering");
      setEmail(initialData.email || "");
    } else {
      setName("");
      setAge(28);
      setCountry("República Dominicana");
      setWorkPosition("");
      setYearsWork(3);
      setDepartment("Engineering");
      setEmail("");
    }
    setErrorMsg("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg(t('errNameReq'));
      return;
    }
    if (!workPosition.trim()) {
      setErrorMsg(t('errPositionReq'));
      return;
    }

    onSave({
      ...(initialData?.id ? { id: initialData.id } : {}),
      name: name.trim(),
      age: Number(age) || 25,
      country: country.trim(),
      workPosition: workPosition.trim(),
      yearsWork: Number(yearsWork) || 0,
      department: department,
      email: email.trim() || `${name.trim().toLowerCase().replace(/\s+/g, '.')}@staffmatrix.io`
    });
  };

  const avatarColor = getAvatarColor(name || "Nuevo Empleado");
  const localizedCountry = getLocalizedCountryName(country, language);

  return (
    <div className="modal-backdrop-custom d-flex align-items-center justify-content-center p-3">
      <div className="modal-card bg-white rounded-3 shadow-lg border w-100 overflow-hidden" style={{ maxWidth: '780px', maxHeight: '92vh' }}>
        {/* Modal Header */}
        <div className="d-flex align-items-center justify-content-between p-3 px-4 border-bottom bg-light">
          <div>
            <h5 className="modal-title fw-bold text-dark mb-0">
              {isEdit ? t('modalEditTitle') : t('modalCreateTitle')}
            </h5>
            <p className="text-muted small mb-0">
              {isEdit ? t('modalEditSub', { id: initialData?.id }) : t('modalCreateSub')}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-light rounded-circle p-1 text-secondary"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body p-4 overflow-y-auto" style={{ maxHeight: 'calc(92vh - 130px)' }}>
          {errorMsg && (
            <div className="alert alert-danger py-2 px-3 small mb-3">
              {errorMsg}
            </div>
          )}

          <div className="row g-4">
            {/* Form Fields */}
            <div className="col-12 col-md-7">
              <form onSubmit={handleSubmit} id="employeeForm">
                {/* Name */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark mb-1">
                    {t('fieldName')} <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white text-muted">
                      <User size={14} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t('namePlaceholder')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Work Position */}
                <div className="mb-3">
                  <label className="form-label small fw-semibold text-dark mb-1">
                    {t('fieldPosition')} <span className="text-danger">*</span>
                  </label>
                  <div className="input-group input-group-sm mb-1">
                    <span className="input-group-text bg-white text-muted">
                      <Briefcase size={14} />
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder={t('positionPlaceholder')}
                      value={workPosition}
                      onChange={(e) => setWorkPosition(e.target.value)}
                      required
                    />
                  </div>
                  {/* Quick suggestions */}
                  <div className="d-flex flex-wrap gap-1 mt-1">
                    {COMMON_POSITIONS.slice(0, 4).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        className="btn btn-sm btn-light border py-0 px-2 text-secondary"
                        style={{ fontSize: '0.68rem' }}
                        onClick={() => setWorkPosition(pos)}
                      >
                        + {pos.split(' ')[0]} {pos.split(' ')[1]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Department & Country */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-dark mb-1">
                      {t('fieldDepartment')}
                    </label>
                    <select
                      className="form-select form-select-sm"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-dark mb-1">
                      {t('fieldCountry')}
                    </label>
                    <CountrySelect
                      value={country}
                      onChange={(newCountry) => setCountry(newCountry)}
                    />
                  </div>
                </div>

                {/* Age & Experience */}
                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-dark mb-1 d-flex justify-content-between">
                      <span>{t('fieldAge')}</span>
                      <span className="text-primary fw-bold tabular-nums">{age} {t('years')}</span>
                    </label>
                    <input
                      type="number"
                      min="18"
                      max="75"
                      className="form-control form-control-sm"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <label className="form-label small fw-semibold text-dark mb-1 d-flex justify-content-between">
                      <span>{t('fieldExperience')}</span>
                      <span className="text-success fw-bold tabular-nums">
                        {yearsWork} {Number(yearsWork) === 1 ? t('year') : t('years')}
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="40"
                      className="form-control form-control-sm"
                      value={yearsWork}
                      onChange={(e) => setYearsWork(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-2">
                  <label className="form-label small fw-semibold text-dark mb-1">
                    {t('fieldEmail')}
                  </label>
                  <div className="input-group input-group-sm">
                    <span className="input-group-text bg-white text-muted">
                      <Mail size={14} />
                    </span>
                    <input
                      type="email"
                      className="form-control"
                      placeholder={t('emailPlaceholder')}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form-text text-muted" style={{ fontSize: '0.72rem' }}>
                    {t('emailHelp')}
                  </div>
                </div>
              </form>
            </div>

            {/* Live Card Preview */}
            <div className="col-12 col-md-5">
              <div className="bg-light p-3 rounded-3 border h-100 d-flex flex-column justify-content-between">
                <div>
                  <span className="text-secondary text-uppercase fw-semibold d-block mb-2" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>
                    {t('previewTitle')}
                  </span>

                  <div className="card border shadow-xs bg-white p-3 text-center">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold mx-auto mb-2 shadow-xs"
                      style={{
                        width: '54px',
                        height: '54px',
                        backgroundColor: avatarColor.bg,
                        color: avatarColor.text,
                        fontSize: '1.2rem'
                      }}
                    >
                      {getInitials(name || "Empleado")}
                    </div>
                    <h6 className="fw-bold text-dark mb-0 text-truncate">
                      {name || (language === 'en' ? "Employee Name" : "Nombre del Empleado")}
                    </h6>
                    <div className="text-primary small fw-medium text-truncate">
                      {workPosition || (language === 'en' ? "Job Title" : "Cargo Laboral")}
                    </div>
                    <div className="text-muted small mb-2 text-truncate" style={{ fontSize: '0.75rem' }}>
                      {email || `${(name || "empleado").toLowerCase().replace(/\s+/g, '.')}@staffmatrix.io`}
                    </div>

                    <div className="border-top pt-2 text-start small">
                      <div className="d-flex justify-content-between align-items-center py-1 text-secondary">
                        <span>{t('thCountry')}:</span>
                        <span className="fw-medium text-dark d-flex align-items-center gap-1.5">
                          <CountryFlag country={country} size="sm" />
                          <span>{localizedCountry}</span>
                        </span>
                      </div>
                      <div className="d-flex justify-content-between py-1 text-secondary">
                        <span>{t('fieldDepartment')}:</span>
                        <span className="fw-medium text-dark">{department}</span>
                      </div>
                      <div className="d-flex justify-content-between py-1 text-secondary">
                        <span>{t('thAge')}:</span>
                        <span className="fw-medium text-dark tabular-nums">{age} {t('years')}</span>
                      </div>
                      <div className="d-flex justify-content-between py-1 text-secondary">
                        <span>{t('thExperience')}:</span>
                        <span className="fw-medium text-dark tabular-nums">{yearsWork} {Number(yearsWork) === 1 ? t('year') : t('years')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-muted text-center small mt-3" style={{ fontSize: '0.75rem' }}>
                  <CheckCircle size={14} className="text-success me-1 inline" />
                  {t('previewSync')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer p-3 px-4 bg-light border-top d-flex justify-content-between">
          <button type="button" className="btn btn-sm btn-outline-secondary px-3" onClick={onClose}>
            {t('btnCancel')}
          </button>
          <button type="submit" form="employeeForm" className="btn btn-sm btn-primary px-4 fw-semibold shadow-sm">
            {isEdit ? t('btnSaveEdit') : t('btnSaveCreate')}
          </button>
        </div>
      </div>
    </div>
  );
}
