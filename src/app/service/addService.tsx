import { get } from "@/utils/network";
import { useEffect, useState } from "react";
import TimeSlotCreator from "./time-range-selector";

// Define interfaces for your data types
interface Category {
  id: number;
  type: string;
  name_en: string;
  name_ar: string;
}

interface Branch {
  id: number;
  name_en: string;
  name_ar: string;
  city_en: string;
  city_ar: string;
  latitude: string;
  longitude: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

const AddService = () => {
  // Local state with correct TypeScript types
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | "">("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "">("");
  const [branchLoading, setBranchLoading] = useState<boolean>(false);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const [name_en, setNameEn] = useState('');
  const [name_ar, setNameAr] = useState('');
  const [about_en, setAboutEn] = useState('');
  const [about_ar, setAboutAr] = useState('');
  const [actual_price, setActualPrice] = useState('');
  const [discounted_price, setDiscountedPrice] = useState('');
  const [can_redeem, setCanRedeem] = useState(false);
// Image state
const [enImagePreview, setEnImagePreview] = useState(null);
const [arImagePreview, setArImagePreview] = useState(null);

// Image handlers for English image
const handleENFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setEnImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
    // Here you would also handle the actual file upload to your server
    // and set service_image_en_url once the upload is complete
  }
};

const handleENRemoveImage = () => {
  setEnImagePreview(null);
  // Reset the service_image_en_url state as well
};

// Image handlers for Arabic image
const handleARFileChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setArImagePreview(event.target.result);
    };
    reader.readAsDataURL(file);
    // Here you would also handle the actual file upload to your server
    // and set service_image_ar_url once the upload is complete
  }
};

const handleARRemoveImage = () => {
  setArImagePreview(null);
  // Reset the service_image_ar_url state as well
};

  // Function to fetch branch data
  const fetchBranchData = async () => {
    if (branches.length > 0) return; // Prevent redundant calls
    setBranchLoading(true);
    try {
      const response = await get("/branch");
      setBranches(Array.isArray(response) ? response : [])
      
    } catch (error) {
      console.error("Error fetching branch data:", error);
      setError("Failed to load branch data");
    } finally {
      setBranchLoading(false);
    }
  };

  // Function to fetch service categories
  const fetchCategories = async () => {
    if (categories.length > 0) return; // Prevent redundant calls
    setCategoriesLoading(true);
    try {
      const response = await get("/service/category");
      console.log(response)
    //   const result: ApiResponse<Category[]> = await response;
    setCategories(Array.isArray(response) ? response : []);
      
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load categories");
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchBranchData();
    fetchCategories();
  }, []);

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBranch(e.target.value === "" ? "" : Number(e.target.value));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value === "" ? "" : Number(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (selectedBranch === "" || selectedCategory === "") {
      setError("Please select both branch and category");
      return;
    }
    
    // Here you would add your submit logic
    console.log("Submitting:", { branchId: selectedBranch, categoryId: selectedCategory });
    
    // Reset error if submission is successful
    setError(null);
  };

  return (
    <div>
    <div className="card">
      <div className="card-header">
        <h6 className="card-title mb-0">Add Service</h6>
      </div>
      <div className="card-body">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="row gy-3">
            <div className="col-12">
              <label className="form-label">Branch</label>
              {branchLoading ? (
                <p>Loading branches...</p>
              ) : (
                <select 
                  className="form-control"
                  value={selectedBranch}
                  onChange={handleBranchChange}
                >
                  <option value="">Select a branch</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name_en} ({branch.city_en})
                    </option>
                  ))}
                </select>
              )}
            </div>
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
              <input 
                type="text" 
                className="form-control" 
                value={name_en}
                onChange={(e) => setNameEn(e.target.value)}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">Service Name (Arabic)</label>
              <input 
                type="text" 
                className="form-control" 
                value={name_ar}
                onChange={(e) => setNameAr(e.target.value)}
                required
              />
            </div>
            <div className="col-12">
              <label className="form-label">About (English)</label>
              <textarea 
                className="form-control" 
                value={about_en}
                onChange={(e) => setAboutEn(e.target.value)}
              ></textarea>
            </div>
            <div className="col-12">
              <label className="form-label">About (Arabic)</label>
              <textarea 
                className="form-control" 
                value={about_ar}
                onChange={(e) => setAboutAr(e.target.value)}
              ></textarea>
            </div>
            <div className="col-md-6">
              <label className="form-label">Actual Price</label>
              <input 
                type="number" 
                step="0.01" 
                className="form-control" 
                value={actual_price}
                onChange={(e) => setActualPrice(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Discounted Price</label>
              <input 
                type="number" 
                step="0.01" 
                className="form-control" 
                value={discounted_price}
                onChange={(e) => setDiscountedPrice(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Service Image (English)</label>
              <div className="upload-image-wrapper">
                {enImagePreview ? (
                  <div className="uploaded-img position-relative h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                    <button
                      type="button"
                      onClick={handleENRemoveImage}
                      className="uploaded-img__remove position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex"
                      aria-label="Remove uploaded image"
                    >
                      
                    </button>
                    <img
                      id="uploaded-img__preview"
                      className="w-100 h-100 object-fit-cover"
                      src={enImagePreview}
                      alt="Uploaded"
                    />
                  </div>
                ) : (
                  <label
                    className="upload-file h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50 bg-hover-neutral-200 d-flex align-items-center flex-column justify-content-center gap-1"
                    htmlFor="upload-file-en"
                  >
                  
                    <span className="fw-semibold text-secondary-light">
                      Upload
                    </span>
                    <input
                      id="upload-file-en"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleENFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Service Image (Arabic)</label>
              <div className="upload-image-wrapper">
                {arImagePreview ? (
                  <div className="uploaded-img position-relative h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                    <button
                      type="button"
                      onClick={handleARRemoveImage}
                      className="uploaded-img__remove position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex"
                      aria-label="Remove uploaded image"
                    >
                      
                    </button>
                    <img
                      id="uploaded-img__preview"
                      className="w-100 h-100 object-fit-cover"
                      src={arImagePreview}
                      alt="Uploaded"
                    />
                  </div>
                ) : (
                  <label
                    className="upload-file h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50 bg-hover-neutral-200 d-flex align-items-center flex-column justify-content-center gap-1"
                    htmlFor="upload-file-ar"
                  >
                   
                    <span className="fw-semibold text-secondary-light">
                      Upload
                    </span>
                    <input
                      id="upload-file-ar"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleARFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="col-12">
              <div className="form-check">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  id="canRedeem"
                  checked={can_redeem}
                  onChange={(e) => setCanRedeem(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="canRedeem">Can Redeem</label>
              </div>
            </div>
            <TimeSlotCreator title={"Time Slot"} onTimeRangesChange={()=>{}} ></TimeSlotCreator>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">Submit</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default AddService;