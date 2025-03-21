'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Modal from 'react-bootstrap/Modal';
import { Icon } from '@iconify/react/dist/iconify.js';
import AddService from './addService';
import { get } from '@/utils/network';
import CategoryPage from './Category';

const ServicePage = () => {
  const [showCreateServiceModel, setShowCreateServiceModel] = useState(false);
  const [showEditServiceModel, setShowEditServiceModel] = useState(false);
  const [services, setService] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [serviceTimeSlots, SetServiceTimeSlots] = useState<any>(null);
  const [serviceBarches, setServiceBranches] = useState<any>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await get('/service'); // Replace with your actual API endpoint
       console.log(data)
        setService(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleEditService = async (serviceId: number) => {
    console.log(serviceId)
    const timeSlots = await get(`/service/time_slot?service_id=${serviceId}`);
    console.log(timeSlots)
    const serviceTimeSlots = timeSlots
    // const serviceBarches = 
    const serviceToEdit = services.find((service) => service.id === serviceId);
    console.log(serviceToEdit)
    if (!serviceToEdit) {
      console.error('Service not found in state!');
      return;
    }

    console.log('Editing Service:', serviceToEdit); // Debugging log
    setSelectedService(serviceToEdit);
    setShowEditServiceModel(true); // ✅ Corrected state update
  };

  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <span className="text-md fw-medium text-secondary-light mb-0">
            Available Services
          </span>
        </div>
        <button
          onClick={() => setShowCreateServiceModel(true)}
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add New Service
        </button>
      </div>

      {/* Create Service Modal */}
      <Modal show={showCreateServiceModel} size="lg" onHide={() => setShowCreateServiceModel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register New Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddService />
        </Modal.Body>
      </Modal>

      {/* Edit Service Modal */}
      <Modal show={showEditServiceModel} fullscreen onHide={() => setShowEditServiceModel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Service</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddService editData={selectedService} serviceBranch={serviceBarches} serviceTimeSlots ={serviceTimeSlots} />
        </Modal.Body>
      </Modal>

      {/* Service Cards */}
  
      <div className="row gy-4 px-4 mb-5">
        {loading ? (
          <p className="text-center">Loading services...</p>
        ) : error ? (
          <p className="text-danger text-center">Error: {error}</p>
        ) : services.length === 0 ? (
          <p className="text-center text-muted">No services found.</p>
        ) : (
          services.map((service: any) => (
            <Service key={service.id} service={service} onEdit={() => handleEditService(service.id)} />
          ))
        )}
      </div>

      
      <CategoryPage />
    
    
   
    </div>
  );
};

// Service Card Component
const Service = ({ service, onEdit }: { service: any; onEdit: () => void }) => {
  return (
    <div className="col-xxl-3 col-lg-4 col-sm-6">
    <div className="card h-100 shadow-sm radius-12 overflow-hidden transition-all hover:shadow-md">
      {/* Card Header with Image */}
      <div className="position-relative">
        <img
          src={service.service_image_en_url}
          alt={service.name_en}
          className="w-100 h-56 object-fit-cover"
        />
        <div className="position-absolute top-0 end-0 m-4">
          <span className="badge bg-primary-600 text-white px-4 py-2 fs-6">
            {service.type}
          </span>
        </div>
      </div>
      
      {/* Card Body */}
      <div className="card-body p-3">
        {/* Service Name and Category */}
        <div className="mb-4">
          <h5 className="fw-bold mb-2">{service.name_en}</h5>
          <div className="d-flex align-items-center">
            <span className="text-neutral-500 fs-6">{service.category_en}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-neutral-600 mb-3 line-clamp-1">{service.about_en}</p>
        
        {/* Price Section */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="price-container">
            {service.actual_price && (
              <span className="text-decoration-line-through text-neutral-400 me-2 fs-6">
                ${service.actual_price}
              </span>
            )}
            <span className="fw-bold text-primary-700 fs-4">
              ${service.discounted_price}
            </span>
          </div>
          </div>
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onEdit();
            }}
            className="bg-primary-50 text-primary-600 bg-hover-primary-600 hover-text-white p-8 text-sm btn-sm px-5 py-5 radius-8 d-flex align-items-center justify-content-center mt-16 fw-medium gap-2 w-95"
          >
            Edit Profile
          </Link>
       
      </div>
    </div>
  </div>
  );
};

export default ServicePage;
