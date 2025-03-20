'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Modal from 'react-bootstrap/Modal';
import AddUserLayer from '../doctor/add/page';
import { Icon } from '@iconify/react/dist/iconify.js';
import TimeSlotCreator from './time-range-selector';
import AddService from './addService';

const ServicePage: React.FC = () => {
    const [showCreateServiceModel, setShowCreateServiceModel ] = useState(false);
    const [showEditServiceModel, setShowEditServiceModel ] = useState(false);

    return (
      <div className='card h-100 p-0 radius-12'>
        <div className='card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between'>
          <div className='d-flex align-items-center flex-wrap gap-3'>
            <span className='text-md fw-medium text-secondary-light mb-0'>
            </span>
          </div>
          <button
            onClick={() => setShowCreateServiceModel(true)}
            className='btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2'
          >
            <Icon
              icon='ic:baseline-plus'
              className='icon text-xl line-height-1'
            />
            Add New Service
          </button>
        </div>
          <div className='row gy-4'>
            <Modal show={showCreateServiceModel} size='lg' onHide={() => setShowCreateServiceModel(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Register New Service </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddService />
            </Modal.Body>
          </Modal>

          <Modal show={showEditServiceModel} fullscreen onHide={() => setShowEditServiceModel(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Doctor </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <AddUserLayer />
            </Modal.Body>
          </Modal>
          <Service />
          <Service />
          <Service />
          <Service />
          <Service />
          <Service />
          <Service />
          </div>
        </div>
      );
};

const Service = () => {
  return (
    <div className='col-xxl-3 col-lg-4 col-sm-6'>
        <div className='card h-100 p-0 radius-12 overflow-hidden'>
          <div className='card-body p-24'>
            <h6 className='mb-16'>
                Cavity Filling
            </h6>
            <div className='d-flex align-items-center gap-6 justify-content-between flex-wrap mb-16'>
              <div className='px-20 py-6 bg-neutral-100 rounded-pill bg-hover-neutral-300 text-neutral-600 fw-medium'>
                DENTIST
              </div>
              <div className='d-flex align-items-center gap-8 text-neutral-500 fw-medium'>
                GENERAL DENTISTRY
              </div>
            </div>
            <Link
              href='/blog-details'
              className='w-100 max-h-194-px radius-8 overflow-hidden'
            >
              <img
                src='assets/images/blog/blog1.png'
                alt=''
                className='w-100 h-100 object-fit-cover'
              />
            </Link>
            <div className='mt-20'>
              <p className='text-line-3 text-neutral-500'>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
                dolores explicabo corrupti, fuga necessitatibus fugiat adipisci
                quidem eveniet enim minus.
              </p>
              <span className='d-block border-bottom border-neutral-300 border-dashed my-20' />
              <div className='d-flex align-items-center justify-content-between flex-wrap gap-6'>
                <div className='d-flex align-items-center gap-8'>
                  <div className='d-flex flex-column'>
                    <h4 className='text-m mb-0'>23 $</h4>
                  </div>
                </div>
                <button
                  onClick={() => {}}
                  className='btn btn-sm btn-primary-600 d-flex align-items-center gap-1 text-xs px-8 py-6'
                >
                  Edit Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default ServicePage;