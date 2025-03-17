"use client";
import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import dynamic from "next/dynamic";
import "highlight.js/styles/github.css";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import Link from "next/link";
import flatpickr from "flatpickr";
import { Icon } from "@iconify/react";

const DatePicker = ({ id, placeholder }) => {
  const datePickerRef = useRef(null);

  useEffect(() => {
    flatpickr(datePickerRef.current, {
      enableTime: true,
      dateFormat: "d/m/Y H:i",
    });
  }, []);

  return (
    <input
      ref={datePickerRef}
      id={id}
      type="text"
      className="form-control radius-8 bg-base"
      placeholder={placeholder}
    />
  );
};

export default function MarketingPage() {
  const [imagePreview, setImagePreview] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const src = URL.createObjectURL(e.target.files[0]);
      setImagePreview(src);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
  };
  const quillRef = useRef(null);
  const [value, setValue] = useState(``);
  // eslint-disable-next-line no-unused-vars
  const [isHighlightReady, setIsHighlightReady] = useState(false);

  useEffect(() => {
    // Load highlight.js configuration and signal when ready
    hljs?.configure({
      languages: [
        "javascript",
        "ruby",
        "python",
        "java",
        "csharp",
        "cpp",
        "go",
        "php",
        "swift",
      ],
    });
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleSave = () => {
    const editorContent = quillRef.current.getEditor().root.innerHTML;
    console.log("Editor content:", editorContent);
  };

  // Quill editor modules with syntax highlighting (only load if highlight.js is ready)
  const modules = isHighlightReady
    ? {
        syntax: {
          highlight: (text) => hljs?.highlightAuto(text).value, // Enable highlight.js in Quill
        },
        toolbar: {
          container: "#toolbar-container", // Custom toolbar container
        },
      }
    : {
        toolbar: {
          container: "#toolbar-container", // Custom toolbar container
        },
      };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "script",
    "header",
    "blockquote",
    "code-block",
    "list",
    "indent",
    "direction",
    "align",
    "link",
    "image",
    "video",
    "formula",
  ];

  return (
    <div className="row gy-4">
      <div className="col-lg-8">
        <div className="card mt-24">
          <div className="card-header border-bottom">
            <h6 className="text-xl mb-0">Add New Banner</h6>
          </div>
          <div className="card-body p-24">
            <form action="#" className="d-flex flex-column gap-20">
              <div>
                <label
                  className="form-label fw-bold text-neutral-900"
                  htmlFor="title"
                >
                  Link:{" "}
                </label>
                <input
                  type="text"
                  className="form-control border border-neutral-200 radius-8"
                  id="title"
                  placeholder="Enter Post Title"
                />
              </div>
							<div className='row'>
              <div className='col-md-6 mb-20'>
									<label
										htmlFor='startDate'
										className='form-label fw-semibold text-primary-light text-sm mb-8'
									>
										Start Date
									</label>
									<div className='position-relative'>
										<DatePicker
											className='form-control radius-8 bg-base'
											id='startDate'
											placeholder='03/12/2024, 10:30 AM'
										/>
										<span className='position-absolute end-0 top-50 translate-middle-y me-12 line-height-1'>
											<Icon
												icon='solar:calendar-linear'
												className='icon text-lg'
											></Icon>
										</span>
									</div>
								</div>
								<div className='col-md-6 mb-20'>
									<label
										htmlFor='endDate'
										className='form-label fw-semibold text-primary-light text-sm mb-8'
									>
										End Date
									</label>
									<div className='position-relative'>
										<DatePicker
											className='form-control radius-8 bg-base'
											id='endDate'
											placeholder='03/12/2024, 2:30 PM'
										/>
										<span className='position-absolute end-0 top-50 translate-middle-y me-12 line-height-1'>
											<Icon
												icon='solar:calendar-linear'
												className='icon text-lg'
											></Icon>
										</span>
									</div>
								</div>
								</div>
              <div>
                <label className="form-label fw-bold text-neutral-900">
                  English Thumbnail
                </label>
                <div className="upload-image-wrapper">
                  {imagePreview ? (
                    <div className="uploaded-img position-relative h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="uploaded-img__remove position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex"
                        aria-label="Remove uploaded image"
                      >
                        <Icon
                          icon="radix-icons:cross-2"
                          className="text-xl text-danger-600"
                        ></Icon>
                      </button>
                      <img
                        id="uploaded-img__preview"
                        className="w-100 h-100 object-fit-cover"
                        src={imagePreview}
                        alt="Uploaded"
                      />
                    </div>
                  ) : (
                    <label
                      className="upload-file h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50 bg-hover-neutral-200 d-flex align-items-center flex-column justify-content-center gap-1"
                      htmlFor="upload-file"
                    >
                      <Icon
                        icon="solar:camera-outline"
                        className="text-xl text-secondary-light"
                      ></Icon>
                      <span className="fw-semibold text-secondary-light">
                        Upload
                      </span>
                      <input
                        id="upload-file"
                        type="file"
                        hidden
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
                <label className="form-label fw-bold text-neutral-900">
                  Arabic Thumbnail
                </label>
                <div className="upload-image-wrapper">
                  {imagePreview ? (
                    <div className="uploaded-img position-relative h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="uploaded-img__remove position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex"
                        aria-label="Remove uploaded image"
                      >
                        <Icon
                          icon="radix-icons:cross-2"
                          className="text-xl text-danger-600"
                        ></Icon>
                      </button>
                      <img
                        id="uploaded-img__preview"
                        className="w-100 h-100 object-fit-cover"
                        src={imagePreview}
                        alt="Uploaded"
                      />
                    </div>
                  ) : (
                    <label
                      className="upload-file h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50 bg-hover-neutral-200 d-flex align-items-center flex-column justify-content-center gap-1"
                      htmlFor="upload-file"
                    >
                      <Icon
                        icon="solar:camera-outline"
                        className="text-xl text-secondary-light"
                      ></Icon>
                      <span className="fw-semibold text-secondary-light">
                        Upload
                      </span>
                      <input
                        id="upload-file"
                        type="file"
                        hidden
                        onChange={handleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>
              <button type="submit" className="btn btn-primary-600 radius-8">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      {/* Sidebar Start */}
    </div>
  );
}
