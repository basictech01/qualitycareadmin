import { useEffect, useState } from "react";
import { get, post, uploadImage } from "@/utils/network";
import { ERRORS } from "@/utils/errors";
import { Category } from "@/utils/types";


const AddCategory = () => {
  const [formData, setFormData] = useState<Category>({
    name_en: "",
    name_ar: "",
    type: "",
    image_ar: "",
    image_en: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleENFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files && e.target.files.length > 0) {
        const src = URL.createObjectURL(e.target.files[0]);
        setFormData((prev) => ({ ...prev, image_en: src as string }));
      }
    }
  };

  const handleARFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.files && e.target.files.length > 0) {
        const src = URL.createObjectURL(e.target.files[0]);
        setFormData((prev) => ({ ...prev, image_ar: src as string }));
      }
    }
  };

  const handleSubmit = async () => {
    try  {
      console.log(formData)
      if (!formData.name_en) {
        throw ERRORS.NAME_EN_REQUIRED;
      }
      if (!formData.name_ar) {
        throw ERRORS.NAME_AR_REQUIRED;
      }
      if (!formData.type) {
        throw ERRORS.TYPE_REQUIRED;
      }
      if (!formData.image_en) {
        throw ERRORS.IMAGE_REQUIRED;
      }
      if (!formData.image_ar) {
        throw ERRORS.IMAGE_REQUIRED;
      }
      const image_en = await uploadImage(formData.image_en);
      const image_ar = await uploadImage(formData.image_ar);
      const data =  {
        name_en: formData.name_en,
        name_ar: formData.name_ar,
        type: formData.type,
        image_en: image_en,
        image_ar: image_ar,
      }
      await post('/service/category', data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h6 className="card-title mb-0"> Add Category</h6>
      </div>
      <div className="card-body">
        <div>
          <div className="row gy-3">
            <div className="col-12">
              <label className="form-label">Category Type</label>
              <input type="text" name="type" className="form-control" value={formData.type} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="form-label">Category Name (English)</label>
              <input type="text" name="name_en" className="form-control" value={formData.name_en} onChange={handleChange} required />
            </div>

            <div className="col-12">
              <label className="form-label">Category Name (Arabic)</label>
              <input type="text" name="name_ar" className="form-control" value={formData.name_ar} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Category Image</label>
              <div className="upload-image-wrapper">
                {formData.image_en ? (
                  <img src={formData.image_ar} className="img-preview" alt="Preview" />
                ) : (
                  <input type="file" accept="image/*" onChange={handleENFileChange} />
                )}
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Category Image</label>
              <div className="upload-image-wrapper">
                {formData.image_ar ? (
                  <img src={formData.image_en} className="img-preview" alt="Preview" />
                ) : (
                  <input type="file" accept="image/*" onChange={handleARFileChange} />
                )}
              </div>
            </div>

            <div className="col-12">
              <button onClick={handleSubmit} className="btn btn-primary">
                 Add Category
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;