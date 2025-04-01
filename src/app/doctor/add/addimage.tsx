// ImageUploader.jsx
import { Icon } from "@iconify/react/dist/iconify.js";
import {ImageUploaderProps} from "@/utils/types";

const ImageUploader: React.FC<ImageUploaderProps> = ({ imagePreviewUrl, onImageChange }) => {
  return (
    <div className="mb-24 mt-16">
      <div className="avatar-upload">
        <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
          <input
            type="file"
            id="imageUpload"
            accept=".png, .jpg, .jpeg"
            hidden
            onChange={onImageChange}
          />
          <label
            htmlFor="imageUpload"
            className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
          >
            <Icon icon="solar:camera-outline" className="icon" />
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
  );
};

export default ImageUploader;
