import React, { useState, useEffect, useMemo } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Swal from 'sweetalert2';
import './App.css';

import { useApp } from './context/AppContext';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import FilterBar from './components/FilterBar';
import EmployeeTable from './components/EmployeeTable';
import EmployeeGrid from './components/EmployeeGrid';
import AnalyticsView from './components/AnalyticsView';
import EmployeeFormModal from './components/EmployeeFormModal';
import EmployeeDetailsModal from './components/EmployeeDetailsModal';
import ExportModal from './components/ExportModal';

const API_URL = import.meta.env.VITE_API_URL;
if (API_URL) {
  Axios.defaults.baseURL = API_URL;
}

function App() {
  const { t, theme } = useApp();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('directory'); // 'directory' | 'analytics'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedExperience, setSelectedExperience] = useState('all');
  const [sortBy, setSortBy] = useState('id-desc');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedEmployeeForForm, setSelectedEmployeeForForm] = useState(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState(null);

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Fetch employees
  const fetchEmployees = () => {
    setLoading(true);
    Axios.get("/employees")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setEmployees(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Filter & Sort options
  const countryOptions = useMemo(() => {
    const set = new Set(employees.map(e => e.country).filter(Boolean));
    return Array.from(set).sort();
  }, [employees]);

  const departmentOptions = useMemo(() => {
    const set = new Set(employees.map(e => e.department).filter(Boolean));
    return Array.from(set).sort();
  }, [employees]);

  // Filtered & Sorted Employees
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => {
        // Search match
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          const matchName = (emp.name || '').toLowerCase().includes(term);
          const matchPosition = (emp.workPosition || '').toLowerCase().includes(term);
          const matchCountry = (emp.country || '').toLowerCase().includes(term);
          const matchDept = (emp.department || '').toLowerCase().includes(term);
          const matchEmail = (emp.email || '').toLowerCase().includes(term);
          if (!matchName && !matchPosition && !matchCountry && !matchDept && !matchEmail) {
            return false;
          }
        }

        // Country filter
        if (selectedCountry !== 'all' && emp.country !== selectedCountry) {
          return false;
        }

        // Department filter
        if (selectedDepartment !== 'all' && emp.department !== selectedDepartment) {
          return false;
        }

        // Experience filter
        if (selectedExperience !== 'all') {
          const exp = Number(emp.yearsWork) || 0;
          if (selectedExperience === 'junior' && (exp < 1 || exp > 2)) return false;
          if (selectedExperience === 'mid' && (exp < 3 || exp > 5)) return false;
          if (selectedExperience === 'senior' && exp < 6) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (sortBy === 'exp-desc') {
          return (Number(b.yearsWork) || 0) - (Number(a.yearsWork) || 0);
        }
        if (sortBy === 'age-asc') {
          return (Number(a.age) || 0) - (Number(b.age) || 0);
        }
        // default id-desc
        return (Number(b.id) || 0) - (Number(a.id) || 0);
      });
  }, [employees, searchTerm, selectedCountry, selectedDepartment, selectedExperience, sortBy]);

  // Create / Update Handler
  const handleSaveEmployee = (formData) => {
    const swalCustomClass = theme === 'dark' ? { popup: 'swal2-dark-mode' } : {};

    if (isEditMode && formData.id) {
      Axios.put("/update", formData)
        .then(() => {
          fetchEmployees();
          setIsFormModalOpen(false);
          Swal.fire({
            title: `<strong>${t('swalUpdateTitle')}</strong>`,
            html: `<i>${t('swalUpdateMsg', { name: formData.name })}</i>`,
            icon: 'success',
            timer: 2500,
            showConfirmButton: false,
            customClass: swalCustomClass
          });
        })
        .catch((error) => {
          const msg = error.response?.data?.error || t('swalErrorTitle');
          Swal.fire({
            icon: 'error',
            title: t('swalErrorTitle'),
            text: msg,
            customClass: swalCustomClass
          });
        });
    } else {
      Axios.post("/create", formData)
        .then(() => {
          fetchEmployees();
          setIsFormModalOpen(false);
          Swal.fire({
            title: `<strong>${t('swalSuccessTitle')}</strong>`,
            html: `<i>${t('swalSuccessMsg', { name: formData.name })}</i>`,
            icon: 'success',
            timer: 2500,
            showConfirmButton: false,
            customClass: swalCustomClass
          });
        })
        .catch((error) => {
          const msg = error.response?.data?.error || t('swalErrorTitle');
          Swal.fire({
            icon: 'error',
            title: t('swalErrorTitle'),
            text: msg,
            customClass: swalCustomClass
          });
        });
    }
  };

  // Delete Handler
  const handleDeleteEmployee = (emp) => {
    const swalCustomClass = theme === 'dark' ? { popup: 'swal2-dark-mode' } : {};

    Swal.fire({
      title: t('swalDeleteTitle'),
      html: t('swalDeleteMsg', { name: emp.name }),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: t('swalDeleteConfirm'),
      cancelButtonText: t('btnCancel'),
      customClass: swalCustomClass
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`/delete/${emp.id}`)
          .then(() => {
            fetchEmployees();
            Swal.fire({
              icon: 'success',
              title: t('swalDeleteSuccess'),
              text: t('swalDeleteSuccessMsg', { name: emp.name }),
              timer: 2000,
              showConfirmButton: false,
              customClass: swalCustomClass
            });
          })
          .catch(() => {
            Swal.fire({
              icon: 'error',
              title: t('swalErrorTitle'),
              text: t('swalNetworkError'),
              customClass: swalCustomClass
            });
          });
      }
    });
  };

  // Reset sample data handler
  const handleResetData = () => {
    const swalCustomClass = theme === 'dark' ? { popup: 'swal2-dark-mode' } : {};

    Swal.fire({
      title: t('swalResetTitle'),
      text: t('swalResetMsg'),
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      confirmButtonText: t('swalResetConfirm'),
      cancelButtonText: t('btnCancel'),
      customClass: swalCustomClass
    }).then((result) => {
      if (result.isConfirmed) {
        Axios.post("/api/reset")
          .then(() => {
            fetchEmployees();
            Swal.fire({
              icon: 'success',
              title: t('swalResetSuccess'),
              timer: 1500,
              showConfirmButton: false,
              customClass: swalCustomClass
            });
          })
          .catch(() => {
            fetchEmployees();
          });
      }
    });
  };

  const openCreateModal = () => {
    setIsEditMode(false);
    setSelectedEmployeeForForm(null);
    setIsFormModalOpen(true);
  };

  const openEditModal = (emp) => {
    setIsEditMode(true);
    setSelectedEmployeeForForm(emp);
    setIsFormModalOpen(true);
  };

  const openDetailsModal = (emp) => {
    setSelectedEmployeeForDetails(emp);
    setIsDetailsModalOpen(true);
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* 3-Zone Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenCreateModal={openCreateModal}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onResetData={handleResetData}
        employeeCount={employees.length}
      />

      {/* Main Content Area */}
      <main className="container-fluid py-4 px-3 px-md-4 flex-grow-1" style={{ maxWidth: '1440px' }}>
        {/* Metric Summary Bar */}
        <StatsBar employees={employees} />

        {/* Tab Navigation Content */}
        {currentTab === 'directory' ? (
          <div>
            {/* Filter and Search Bar */}
            <FilterBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedDepartment={selectedDepartment}
              setSelectedDepartment={setSelectedDepartment}
              selectedExperience={selectedExperience}
              setSelectedExperience={setSelectedExperience}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewMode={viewMode}
              setViewMode={setViewMode}
              countryOptions={countryOptions}
              departmentOptions={departmentOptions}
              totalResults={filteredEmployees.length}
            />

            {/* List / Table / Grid Views */}
            {viewMode === 'table' ? (
              <EmployeeTable
                employees={filteredEmployees}
                onEdit={openEditModal}
                onDelete={handleDeleteEmployee}
                onView={openDetailsModal}
                onOpenCreate={openCreateModal}
              />
            ) : (
              <EmployeeGrid
                employees={filteredEmployees}
                onEdit={openEditModal}
                onDelete={handleDeleteEmployee}
                onView={openDetailsModal}
                onOpenCreate={openCreateModal}
              />
            )}
          </div>
        ) : (
          <AnalyticsView employees={employees} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-3 px-4 text-center text-secondary small">
        <div className="container-fluid d-flex flex-wrap justify-content-between align-items-center gap-2">
          <span className="fw-semibold text-dark">{t('footerCopyright')}</span>
          <span className="text-muted">{t('footerSub')}</span>
        </div>
      </footer>

      {/* Modals */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveEmployee}
        initialData={selectedEmployeeForForm}
        isEdit={isEditMode}
      />

      <EmployeeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        employee={selectedEmployeeForDetails}
        onEdit={openEditModal}
        onDelete={handleDeleteEmployee}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        employees={employees}
      />
    </div>
  );
}

export default App;
