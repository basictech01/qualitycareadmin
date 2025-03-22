'use client';

import React, { useEffect, useState } from 'react';
import { get } from '@/utils/network';
import Image from 'next/image';
import { Icon } from '@iconify/react/dist/iconify.js';
import Modal from 'react-bootstrap/Modal';
import AddCategory from './addCategory';
import Link from 'next/link';



const CategoryPage = () => {
const [showCreateCategoryModel, setShowCreateCategoryModel] = useState(false);
 const [showEditCategoryModel, setShowEditCategoryModel] = useState(false); 
const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
   const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await get('/service/category'); // Replace with your actual API endpoint
        setCategories(Array.isArray(data) ? data : []);
        console.log(setCategories,"ggrgreg")
        console.log(data,"bhbhbh")
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

   const handleEditCategory= async (categoryId: number) => {
     
      const categoryToEdit = categories.find((categories) => categories.id === categoryId);
      console.log(categoryToEdit)
      if (!categoryToEdit) {
        console.error('Service not found in state!');
        return;
      }
      
    console.log('Editing Service:', categoryToEdit); // Debugging log
    setSelectedCategory(categoryToEdit);
    setShowEditCategoryModel(true); 
    }
    
  return (
    <div className="card h-100 p-0 radius-12">
    <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
      <div className="d-flex align-items-center flex-wrap gap-3">
        <span className="text-md fw-medium text-secondary-light mb-0">
          Available Categories
        </span>
      </div>
  <button
          onClick={() => {setShowCreateCategoryModel(true)}}
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
        >
          <Icon icon="ic:baseline-plus" className="icon text-xl line-height-1" />
          Add New Category
        </button>
        </div>


      {/* Create Category Modal */}
      <Modal show={showCreateCategoryModel} size="lg" onHide={() => setShowCreateCategoryModel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register New Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddCategory />
        </Modal.Body>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={showEditCategoryModel} fullscreen onHide={() => setShowEditCategoryModel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddCategory/>
        </Modal.Body>
      </Modal>



      <div className="row gy-4 px-4 mb-5">
        {loading ? (
          <p className="text-center">Loading categories...</p>
        ) : error ? (
          <p className="text-danger text-center">Error: {error}</p>
        ) : categories.length === 0 ? (
          <p className="text-center text-muted">No categories found.</p>
        ) : (
          categories.map((categories: any) => (
            <CategoryCard key={categories.id} category={categories} onEdit={() => handleEditCategory(categories.id)} />
          ))
        )}
      </div>
      
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ category, onEdit }: { category: any; onEdit: () => void  }) => {
  
  return (
<div className="col-xxl-3 col-lg-4 col-md-4 col-sm-6">
  <div className="card h-100 shadow-sm radius-12 overflow-hidden transition-all hover:shadow-md">
    <div className="card-body p-3 d-flex flex-column align-items-center">
      {/* Category Image with Border and Shadow */}
      <div className="position-relative mb-4">
        <div className="rounded-circle p-1 bg-primary-100 shadow-sm mb-2">
          <img
            src={category.image_en}
            alt={category.name_en}
            width={120}
            height={120}
            className="rounded-circle object-fit-cover"
          />
        </div>
      </div>
      
      {/* Category Names */}
      <div className="text-center mb-4">
        <h5 className="fw-bold mb-2">{category.name_en}</h5>
        <p className="text-neutral-500 fs-6">{category.name_ar}</p>
      </div>
      
   
      {/* Edit Button */}
      <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onEdit();
            }}
            className="bg-primary-50 text-primary-600 bg-hover-primary-600 hover-text-white p-10 text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center justify-content-center mt-16 fw-medium gap-2 w-100"
          >
            Edit Profile
          </Link>
    </div>
  </div>
</div>
  );
};

export default CategoryPage;
