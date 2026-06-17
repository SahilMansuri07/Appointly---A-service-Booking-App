import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiPlus } from 'react-icons/fi';

import Loader from '../../components/common/Loader';
import Pagination from '../../components/common/Pagination';
import AddServiceModal from './AddServiceModal';

import { toast } from 'react-hot-toast';
import { fetchMyService } from '../../redux/slices/ServiceListSlice';
import ServiceList from '../../components/admin/ServiceList';

export default function AdminServiceManagement() {
  const dispatch = useDispatch();

  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editService, setEditService] = useState(null);
  const [search, setSearch] = useState('');

  const { loading, serviceList, pagination } = useSelector(s => s.services);
console.log("Service List: ", serviceList);
  useEffect(() => {
    const params = { page, limit: 5, search };
    dispatch(fetchMyService(params));
  }, [dispatch, page, search]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddSuccess = () => {
    const params = { page, limit: 5, search };
    dispatch(fetchMyService(params));
  };

  const handleEditModel = (service) => {
    setEditService(service);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditService(null);
  };


  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h2 className="fw-bold mb-1">Service Management</h2>
          <p className="text-muted mb-0">Review, update, and manage all your offered services.</p>
        </div>

        <div className="d-flex gap-2 flex-wrap">
          <button className="btn btn-primary d-flex align-items-center gap-2 fw-medium" onClick={() => setShowAddModal(true)}>
            <FiPlus size={18} />
            Add Service
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="text-muted text-uppercase" style={{ fontSize: '0.7rem', background: '#fafafa' }}>
                <th className="px-4 py-3 border-0">Service Name</th>
                <th className="px-4 py-3 border-0">Description</th>
                <th className="px-4 py-3 border-0">Duration</th>
                <th className="px-4 py-3 border-0">Price</th>
                <th className="px-4 py-3 border-0">Working Hours</th>
                <th className="px-4 py-3 border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-5">
                    <Loader fullScreen={false} />
                  </td>
                </tr>
              ) : serviceList?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-muted py-5">
                    No services found.
                  </td>
                </tr>
              ) : (
                serviceList?.map((service) => (
                  <ServiceList
                    key={service.id}
                    service={service}
                    handleEditModel={handleEditModel}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {serviceList?.length > 0 && (
          <div className="d-flex justify-content-between align-items-center px-4 py-3 border-top">
            <span className="text-muted small">
              Showing {serviceList.length} of {pagination?.total || serviceList.length} results
            </span>
            <Pagination
              page={page}
              totalPages={pagination?.totalPages || 1}
              total={pagination?.total || 0}
              label="services"
              onPageChange={handlePageChange}
              align="end"
              hideLabel
            />
          </div>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {showAddModal && (
        <AddServiceModal
          serviceToEdit={editService}
          onClose={handleCloseModal}
          onSuccess={handleAddSuccess}
        />
      )}
    </div>
  );
}