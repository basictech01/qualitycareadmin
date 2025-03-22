import { useEffect, useState } from "react";
import { get, post, put, uploadImage } from "@/utils/network";
import { ERRORS } from "@/utils/errors";
import { Category } from "@/utils/types";

interface Props {
  editData: Category | null | undefined;
}

const UpdateCategory = ({ editData }: Props) => {
  const [formData, setFormData] = useState<Category>({
    name_en: "",
    name_ar: "",
    type: "",
    image_en: "",
    image_ar: "",
  });

  useEffect(() => {
    if (!editData) return;
    setFormData({
      name_en: editData.name_en,
      name_ar: editData.name_ar,
      type: editData.type,
      image_en: editData.image_en,
      image_ar: editData.image_ar,
    });
  }, [editData]);

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
      if(!editData) {
        return
      }
      let data: any = {}
      if (formData.name_en && formData.name_en != editData.name_en) {
        data.name_en = formData.name_en
      }
      if (formData.name_ar && formData.name_ar != editData.name_ar) {
        data.name_ar = formData.name_ar
      }
      if (formData.type && formData.type != editData.type) {
        data.type = formData.type
      }
      if (formData.image_en && formData.image_en != editData.image_en) {
        const imageURL = await uploadImage(formData.image_en)
        data.image_en = imageURL
      }
      if (formData.image_ar && formData.image_ar != editData.image_ar) {
        const imageURL = await uploadImage(formData.image_ar)
        data.image_ar = imageURL
      }
      if (Object.keys(data).length === 0) {
        throw ERRORS.NO_CHANGES
      }
      await put(`/service/category/${editData.id}`, data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  return (
    <div className="card">
      <div className="card-header">
        <h6 className="card-title mb-0">{editData ? "Edit Category" : "Add Category"}</h6>
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
                  <img src={formData.image_en} className="img-preview" alt="Preview" />
                ) : (
                  <input type="file" accept="image/*" onChange={handleENFileChange} />
                )}
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Category Image</label>
              <div className="upload-image-wrapper">
                {formData.image_ar ? (
                  <img src={formData.image_ar} className="img-preview" alt="Preview" />
                ) : (
                  <input type="file" accept="image/*" onChange={handleARFileChange} />
                )}
              </div>
            </div>

            <div className="col-12">
              <button onClick={handleSubmit} className="btn btn-primary">
                {editData ? "Update Category" : "Add Category"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCategory;