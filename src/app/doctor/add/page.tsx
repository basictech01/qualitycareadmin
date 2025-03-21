"use client";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useState, useEffect } from "react";
import BranchSelection from "./addBranch";
import TimeSlotCreator from "./time-range-selector";

interface Doctor {
  id?: number;
  nameEn?: string;
  nameAr?: string;
  attendedPatients?: number;
  sessionFees?: number;
  experience?: number;
  phone?: string;
  aboutEn?: string;
  aboutAr?: string;
  imageUrl?: string;
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
interface AddUserLayerProps {
  doctor?: any; // Doctor data from API (or undefined)
}

const AddUserLayer: React.FC<AddUserLayerProps> = ({ doctor }) => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranches, setSelectedBranches] = useState([]);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [formData, setFormData] = useState<Doctor>({
    id: undefined,
    nameEn: "",
    nameAr: "",
    attendedPatients: 0,
    sessionFees: 0,
    experience: 0,
    phone: "",
    aboutEn: "",
    aboutAr: "",
    imageUrl: "",
  });

  // Prefill form when doctor data is provided
  useEffect(() => {
    if (doctor) {
      setFormData({
        id: doctor.id || undefined,
        nameEn: doctor.name_en || "",
        nameAr: doctor.name_ar || "",
        attendedPatients: doctor.attended_patient || 0,
        sessionFees: doctor.session_fees || 0,
        experience: doctor.total_experience || 0,
        phone: doctor.phone || "",
        aboutEn: doctor.about_en || "",
        aboutAr: doctor.about_ar || "",
        imageUrl: doctor.photo_url || "",
      });

      setImagePreviewUrl(doctor.photo_url || "");
    }
  }, [doctor]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const src = URL.createObjectURL(e.target.files[0]);
      setImagePreviewUrl(src);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div>
      <h6 className="text-md text-primary-light mb-16">Profile Image</h6>

      {/* Upload Image */}
      <div className="mb-24 mt-16">
        <div className="avatar-upload">
          <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
            <input
              type="file"
              id="imageUpload"
              accept=".png, .jpg, .jpeg"
              hidden
              onChange={handleImageChange}
            />
            <label
              htmlFor="imageUpload"
              className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
            >
              <Icon icon="solar:camera-outline" className="icon"></Icon>
            </label>
          </div>
          <div className="avatar-preview">
            <div
              id="imagePreview"
              style={{
                backgroundImage: imagePreviewUrl ? `url(${imagePreviewUrl})` : "",
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form action="#">
        <div className="mb-20">
          <label htmlFor="nameEn" className="form-label fw-semibold text-primary-light text-sm mb-8">
            Full Name (English)
          </label>
          <input
            type="text"
            className="form-control radius-8"
            id="nameEn"
            placeholder="Enter Full Name"
            value={formData.nameEn}
            onChange={handleChange}
          />
        </div>

        <div className="mb-20">
          <label htmlFor="nameAr" className="form-label fw-semibold text-primary-light text-sm mb-8">
            Full Name (Arabic)
          </label>
          <input
            type="text"
            className="form-control radius-8"
            id="nameAr"
            placeholder="Enter Full Name"
            value={formData.nameAr}
            onChange={handleChange}
          />
        </div>

        <div className="mb-20">
          <label htmlFor="attendedPatients" className="form-label fw-semibold text-primary-light text-sm mb-8">
            Attended Patients <span className="text-danger-600">*</span>
          </label>
          <input
            type="number"
            className="form-control radius-8"
            id="attendedPatients"
            placeholder="Enter number of attended patients"
            value={formData.attendedPatients}
            onChange={handleChange}
          />
        </div>

        <div className="mb-20">
          <label htmlFor="sessionFees" className="form-label fw-semibold text-primary-light text-sm mb-8">
            Session Fees <span className="text-danger-600">*</span>
          </label>
          <input
            type="number"
            className="form-control radius-8"
            id="sessionFees"
            placeholder="Enter session fees"
            value={formData.sessionFees}
            onChange={handleChange}
          />
        </div>

        <div className="mb-20">
          <label htmlFor="experience" className="form-label fw-semibold text-primary-light text-sm mb-8">
            Total Experience <span className="text-danger-600">*</span>
          </label>
          <input
            type="number"
            className="form-control radius-8"
            id="experience"
            placeholder="Enter years of experience"
            value={formData.experience}
            onChange={handleChange}
          />
        </div>

        <div className="mb-20">
          <label htmlFor="phone" className="form-label fw-semibold text-primary-light text-sm mb-8">
            Phone
          </label>
          <input
            type="text"
            className="form-control radius-8"
            id="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-20">
          <label htmlFor="aboutEn" className="form-label fw-semibold text-primary-light text-sm mb-8">
            About (English)
          </label>
          <textarea
            className="form-control radius-8"
            id="aboutEn"
            placeholder="Write description..."
            value={formData.aboutEn}
            onChange={handleChange}
          />
        </div>

        <div className="mb-20">
          <label htmlFor="aboutAr" className="form-label fw-semibold text-primary-light text-sm mb-8">
            About (Arabic)
          </label>
          <textarea
            className="form-control radius-8"
            id="aboutAr"
            placeholder="Write description..."
            value={formData.aboutAr}
            onChange={handleChange}
          />
        </div>
            {/* Branch Selection */}
            <BranchSelection branches={branches} selectedBranches={selectedBranches} setSelectedBranches={setSelectedBranches} />

{/* Time Slot */}
<TimeSlotCreator title="Time Slot" onTimeRangesChange={() => {}} />
      </form>
    </div>
  );
};

export default AddUserLayer;
