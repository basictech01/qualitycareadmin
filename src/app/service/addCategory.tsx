import { useEffect, useState } from "react";
import { get } from "@/utils/network";

interface Category {
  id: number;
  type: string;
  name_en: string;
  name_ar: string;
  image_url: string;
}

interface Props {
  editData?: Category;
}

const AddCategory = ({ editData }: Props) => {
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    type: "",
    image_url: "",
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        name_en: editData.name_en,
        name_ar: editData.name_ar,
        type: editData.type,
        image_url: editData.image_url,
      });
    }
  }, [editData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting category:", formData);
  };

  return (
    <div className="card">
      <div className="card-header">
        <h6 className="card-title mb-0">{editData ? "Edit Category" : "Add Category"}</h6>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
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
                {formData.image_url ? (
                  <img src={formData.image_url} className="img-preview" alt="Preview" />
                ) : (
                  <input type="file" accept="image/*" onChange={handleFileChange} />
                )}
              </div>
            </div>

            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                {editData ? "Update Category" : "Add Category"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;