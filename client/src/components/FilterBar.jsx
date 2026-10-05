import React from 'react';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { useApp } from '../context/AppContext';
import CountryFilterSelect from './CountryFilterSelect';

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  selectedCountry,
  setSelectedCountry,
  selectedDepartment,
  setSelectedDepartment,
  selectedExperience,
  setSelectedExperience,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  countryOptions,
  departmentOptions,
  totalResults
}) {
  const { t } = useApp();
  const hasActiveFilters = searchTerm || selectedCountry !== 'all' || selectedDepartment !== 'all' || selectedExperience !== 'all';

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCountry('all');
    setSelectedDepartment('all');
    setSelectedExperience('all');
  };

  return (
    <div className="card border shadow-xs mb-3 p-3 bg-white">
      <div className="row g-2 align-items-center">
        {/* Search Bar */}
        <div className="col-12 col-md-4 col-lg-4">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0 text-muted">
              <Search size={16} />
            </span>
            <input
              type="text"
              className="form-control border-start-0 ps-0"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={() => setSearchTerm('')}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Filter by Department */}
        <div className="col-6 col-sm-4 col-md-2 col-lg-2">
          <select
            className="form-select form-select-sm"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="all">{t('allDepartments')}</option>
            {departmentOptions.map((dep) => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Country with Flags */}
        <div className="col-6 col-sm-4 col-md-2 col-lg-2">
          <CountryFilterSelect
            value={selectedCountry}
            onChange={setSelectedCountry}
            countryOptions={countryOptions}
          />
        </div>

        {/* Filter by Experience */}
        <div className="col-6 col-sm-4 col-md-2 col-lg-2">
          <select
            className="form-select form-select-sm"
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
          >
            <option value="all">{t('allExperience')}</option>
            <option value="junior">{t('expJunior')}</option>
            <option value="mid">{t('expMid')}</option>
            <option value="senior">{t('expSenior')}</option>
          </select>
        </div>

        {/* Sort & View Mode */}
        <div className="col-6 col-md-2 col-lg-2 d-flex justify-content-end align-items-center gap-1">
          <select
            className="form-select form-select-sm w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            title="Ordenar"
          >
            <option value="id-desc">{t('sortRecent')}</option>
            <option value="name-asc">{t('sortName')}</option>
            <option value="exp-desc">{t('sortExp')}</option>
            <option value="age-asc">{t('sortAge')}</option>
          </select>

          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${viewMode === 'table' ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('table')}
              title={t('viewTable')}
            >
              <List size={16} />
            </button>
            <button
              type="button"
              className={`btn ${viewMode === 'grid' ? 'btn-dark' : 'btn-outline-secondary'}`}
              onClick={() => setViewMode('grid')}
              title={t('viewGrid')}
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Summary */}
      {hasActiveFilters && (
        <div className="d-flex align-items-center justify-content-between pt-2 mt-2 border-top text-muted" style={{ fontSize: '0.8rem' }}>
          <span>
            {t('filterShowing')} <strong>{totalResults}</strong> {t('filterResultsWith')}
          </span>
          <button
            onClick={clearAllFilters}
            className="btn btn-link btn-sm p-0 text-decoration-none text-danger fw-medium"
            style={{ fontSize: '0.8rem' }}
          >
            {t('clearFilters')}
          </button>
        </div>
      )}
    </div>
  );
}
