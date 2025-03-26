'use client';

import React, { useEffect, useState } from 'react';
import { get } from '@/utils/network';
import Image from 'next/image';
import { Icon } from '@iconify/react/dist/iconify.js';
import Modal from 'react-bootstrap/Modal';
import AddCategory from './addCategory';
import Link from 'next/link';
import UpdateCategory from './updateCategory';
import { Category } from '@/utils/types';



const CategoryPage = () => {
const [showCreateCategoryModel, setShowCreateCategoryModel] = useState(false);
 const [showEditCategoryModel, setShowEditCategoryModel] = useState(false); 
const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  
  const onSuccessCreate = (category: Category) => {
    setCategories((state) => [...state, category]);
    setShowCreateCategoryModel(false);
  }

  const onUpdatedCategory = (category: Category) => {
    setCategories((state) => state.map((c) => c.id === category.id ? category : c));
    setShowEditCategoryModel(false);
  }

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await get('/service/category'); // Replace with your actual API endpoint
        setCategories(Array.isArray(data) ? data : []);
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
      setSelectedCategory(categoryToEdit);
      setShowEditCategoryModel(true); 
    }
    
  return (
    <div className="card h-100 p-0 radius-12">
    <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
      <div className="d-flex align-items-center flex-wrap gap-3">
      <h1 className="text-xl font-bold mb-4">Available Categories</h1>
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
          <AddCategory onSuccess={onSuccessCreate} />
        </Modal.Body>
      </Modal>

      {/* Edit Category Modal */}
      <Modal show={showEditCategoryModel} size="lg" onHide={() => setShowEditCategoryModel(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UpdateCategory onSuccess={onUpdatedCategory} editData={selectedCategory}/>
        </Modal.Body>
      </Modal>



      <div className="row gy-4 p-24 card-body  mb-5">
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
<div className="col-xxl-3  col-lg-4 user-grid-card col-md-4 col-sm-6">
  <div className="card h-100  shadow-sm radius-12 overflow-hidden transition-all hover:shadow-md">
  <img
            src={category.image_en}
            alt={category.name_en}
            style={{ height: "150px" }} 
            className="w-100 object-fit-cover"
          />
    <div className="card-body d-flex flex-column align-items-center">
      {/* Category Image with Border and Shadow */}
    
       
          
       
      
      
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
