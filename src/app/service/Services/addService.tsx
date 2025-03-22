import { get } from "@/utils/network";
import { useEffect, useState } from "react";
import TimeSlotCreator from "../time-range-selector";
import BranchSelection from "./addBranch";

// Define interfaces
interface Category {
  id: number;
  type: string;
  name_en: string;
  name_ar: string;
}

interface Branch {
  branch_id: number;
  name_en: string;
  name_ar: string;
  city_en: string;
  city_ar: string;
  latitude: string;
  longitude: string;
  maximum_booking_per_slot:number;
}
interface TimeRange {
  startTime: string;
  endTime: string;
}
interface Service {
  id: number;
  name_ar: string;
  name_en: string;
  about_ar: string;
  about_en: string;
  type: string;
  category_en: string;
  category_ar: string;
  actual_price: string;
  discounted_price: string;
  service_image_en_url: string;
  service_image_ar_url: string;
  can_redeem: number;
}

interface Props {
  editData?: Service; // This prop will contain prefilled data when editing
  serviceBranches?: Branch[];
  serviceTimeSlots?: TimeRange[];
}

const AddService = ({ editData, serviceBranches, serviceTimeSlots }: Props) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranches, setSelectedBranches] =  useState<Branch[]>([]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<TimeRange[]>([]);
  // Form data state
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    category_ar:"",
    category_en:"",
    about_en: "",
    about_ar: "",
    actual_price: "",
    discounted_price: "",
    can_redeem: false,
    service_image_en_url: "",
    service_image_ar_url: "",
  });



  // Prefill data when `editData` is available
  useEffect(() => {
      // Set the state
      console.log("Setting formatted branches:", serviceBranches);
      if (serviceBranches && serviceBranches.length > 0) {
        setSelectedBranches(serviceBranches);
      }
    

    if (serviceTimeSlots && serviceTimeSlots.length > 0) {
      setSelectedTimeSlots(serviceTimeSlots);
    }
    if (editData) {
      setFormData({
        name_en: editData.name_en,
        name_ar: editData.name_ar,
        about_en: editData.about_en,
        category_ar: editData.category_ar,
        category_en: editData.category_en,
        about_ar: editData.about_ar,
        actual_price: editData.actual_price,
        discounted_price: editData.discounted_price,
        can_redeem: editData.can_redeem === 1,
        service_image_en_url: editData.service_image_en_url,
        service_image_ar_url: editData.service_image_ar_url,

      });
    }
    fetchCategories();  
  }, [editData, serviceBranches, serviceTimeSlots]);


  // Fetch categories
  const fetchCategories = async () => {
    if (categories.length > 0) return;
    setCategoriesLoading(true);
    try {
      const response = await get("/service/category");
      setCategories(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value === "" ? "" : Number(e.target.value));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", formData);
    setError(null);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h6 className="card-title mb-0">{editData ? "Edit Service" : "Add Service"}</h6>
        </div>
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="row gy-3">
            <div className="col-12">
              <label className="form-label">Category</label>
              {categoriesLoading ? (
                <p>Loading categories...</p>
              ) : (
                <select 
                  className="form-control"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name_en}
                    </option>
                  ))}
                </select>
              )}
            </div>
              <div className="col-12">
                <label className="form-label">Service Name (English)</label>
                <input type="text" name="name_en" className="form-control" value={formData.name_en} onChange={handleChange} required />
              </div>

              <div className="col-12">
                <label className="form-label">Service Name (Arabic)</label>
                <input type="text" name="name_ar" className="form-control" value={formData.name_ar} onChange={handleChange} required />
              </div>

              <div className="col-12">
                <label className="form-label">Actual Price</label>
                <input type="number" name="actual_price" step="0.01" className="form-control" value={formData.actual_price} onChange={handleChange} required />
              </div>

              <div className="col-12">
                <label className="form-label">Discounted Price</label>
                <input type="number" name="discounted_price" step="0.01" className="form-control" value={formData.discounted_price} onChange={handleChange} />
              </div>

              {/* Image Upload */}
              <div className="col-md-6">
                <label className="form-label">Service Image (English)</label>
                <div className="upload-image-wrapper">
                  {formData.service_image_en_url ? (
                    <img src={formData.service_image_en_url} className="img-preview" alt="Preview" />
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => {}} />
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label">Service Image (Arabic)</label>
                <div className="upload-image-wrapper">
                  {formData.service_image_ar_url ? (
                    <img src={formData.service_image_ar_url} className="img-preview" alt="Preview" />
                  ) : (
                    <input type="file" accept="image/*" onChange={(e) => {}} />
                  )}
                </div>
              </div>

              {/* Branch Selection */}
              <BranchSelection  selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches} />

              {/* Time Slot */}
              <TimeSlotCreator title="Time Slot" serviceTimeSlots={serviceTimeSlots} onTimeRangesChange={() => {}} />

              {/* Submit Button */}
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  {editData ? "Update Service" : "Add Service"}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;
