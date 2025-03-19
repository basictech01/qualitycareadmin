"use client";
import { useEffect, useRef, useState } from "react";
import "highlight.js/styles/github.css";
import flatpickr from "flatpickr";
import { Icon } from "@iconify/react";
import Modal from 'react-bootstrap/Modal';
import { ERRORS } from "@/utils/errors";
import { get, post, upload } from "@/utils/network";

interface DatePickerProps {
  id: string;
  placeholder: string;
  onChange: (date: Date) => void,
};

const DatePicker: React.FC<DatePickerProps> = ({ id, placeholder, onChange }) => {
  const datePickerRef = useRef(null);

  useEffect(() => {
    // @ts-ignore
    flatpickr(datePickerRef.current, {
      enableTime: true,
      dateFormat: "d/m/Y H:i",
      onChange: (e) => {onChange(e[0])},
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


const AddNewBanner = () => {

  const [enImagePreview, setENImagePreview] = useState<string | null >(null);
  const [arImagePreview, setARImagePreview] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [link, setLink] = useState<string>('');

  const handleENFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const src = URL.createObjectURL(e.target.files[0]);
      setENImagePreview(src);
    }
  };

  const handleARFileChange = (e: any) => {
    if (e.target.files && e.target.files.length > 0) {
      const src = URL.createObjectURL(e.target.files[0]);
      setARImagePreview(src);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!startDate) {
        throw ERRORS.START_DATE_REQUIRED;
      }
      if (!endDate) {
        throw ERRORS.END_DATE_REQUIRED;
      }
      if (!enImagePreview) {
        throw ERRORS.EN_IMAGE_REQUIRED;
      }
      if (!arImagePreview) {
        throw ERRORS.AR_IMAGE_REQUIRED;
      }
      if (!link) {
        throw ERRORS.LINK_REQUIRED;
      }
  
      const formDataEN = new FormData();
      let enFile = await fetch(enImagePreview).then(r => r.blob())
      formDataEN.append("photo", enFile);
      const enImage = await upload(formDataEN);

      const formDataAR = new FormData();
      let arFile = await fetch(arImagePreview).then(r => r.blob())
      formDataAR.append("photo", arFile);
      const arImage = await upload(formDataAR);

      const body = {
        link: link,
        start_timestamp: startDate.toISOString(),
        end_timestamp: endDate.toISOString(),
        image_en: enImage,
        image_ar: arImage,
      }
      const result = await post('/banner', body);
      
    } catch (error) {
      console.log(error);
    }
  }

  const handleENRemoveImage = () => {
    setENImagePreview(null);
  };

  const handleARRemoveImage = () => {
    setARImagePreview(null);
  };

  return (
    <>
      <div className="p-24">
        <div className="d-flex flex-column gap-20">
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
              onChange={(e) => setLink(e.target.value)}
              placeholder="Enter link for the banner"
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
                  id='startDate'
                  placeholder='Select Start Date'
                  onChange={(date) => setStartDate(date)}
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
                  id='endDate'
                  placeholder='Select End Date'
                  onChange={(date) => setEndDate(date)}
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
          <div className="row">
            <div className="col-6">
              <label className="form-label fw-bold text-neutral-900">
                English Thumbnail
              </label>
              <div className="upload-image-wrapper">
                {enImagePreview ? (
                  <div className="uploaded-img position-relative h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                    <button
                      type="button"
                      onClick={handleENRemoveImage}
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
                      src={enImagePreview}
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
                      accept="image/*"
                      hidden
                      onChange={handleENFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
            <div className="col-6">
              <label className="form-label fw-bold text-neutral-900">
                Arabic Thumbnail
              </label>
              <div className="upload-image-wrapper">
                {arImagePreview ? (
                  <div className="uploaded-img position-relative h-160-px w-100 border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                    <button
                      type="button"
                      onClick={handleARRemoveImage}
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
                      src={arImagePreview}
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
                      accept="image/*"
                      onChange={handleARFileChange}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>
          <button onClick={handleSubmit} className="btn btn-primary-600 radius-8">
            Submit
          </button>
        </div>
      </div>
    </>
  );
}

const BannerCard: React.FC<Banner> = ({ id, link, start_timestamp, end_timestamp, image_ar, image_en }) => {
  return (
    <div className='col-xxl-4 col-md-6 col-sm-12'>
      <div className='hover-scale-img border radius-16 overflow-hidden'>
        <div className='max-h-266-px overflow-hidden'>
          <img
            src={image_ar}
            alt=''
            className='hover-scale-img__img w-100 h-100 object-fit-cover'
          />
        </div>
        
          <div className="card shadow-sm p-4">
            <p className="mb-3">
              {link}
            </p>
            <p className="mb-1 text-muted small">
              <strong>Start Time:</strong> {start_timestamp}
            </p>
            <p className="mb-0 text-muted small">
              <strong>End Time:</strong> {end_timestamp}
            </p>
          </div>
        <div className='max-h-266-px overflow-hidden'>
          <img
            src={image_en}
            alt=''
            className='hover-scale-img__img w-100 h-100 object-fit-cover'
          />
        </div>
      </div>
    </div>
  )
}

interface Banner {
  id: number;
  link: string;
  start_timestamp: string;
  end_timestamp: string;
  image_en: string;
  image_ar: string;
}
export default function MarketingPage() {
  const [banners, setBanners] = useState<Banner[]>([]);

  const [newBannerModel, setNewBannerModel] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      const banners: Banner[] = await get('/banner/all');
      if (!banners) {
        return;
      }
      setBanners(banners);
    }
    fetchBanners();
  }
  , []);


  return (
    <>
    <Modal size="lg" show={newBannerModel}  onHide={() => setNewBannerModel(false)}>
      <Modal.Header closeButton>
      <h3>Add New Banner</h3>
      </Modal.Header>
      <Modal.Body>
        <AddNewBanner />
      </Modal.Body>
    </Modal>
    <div className='card h-100 p-0 radius-12'>
      <div className='card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between'>
        <div className='d-flex align-items-center flex-wrap gap-3'>
        </div>
        <button
          onClick={() => setNewBannerModel(true)}
          className='btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2'
        >
          <Icon
            icon='ic:baseline-plus'
            className='icon text-xl line-height-1'
          />
          Add New Banner
        </button>
      </div>
      <div className='card-body p-24'>
        <div className='row gy-4'>
        {banners.map((banner) => {
          return (
            <BannerCard key={banner.id} id={banner.id} image_ar={banner.image_ar} image_en={banner.image_en} link={banner.link} start_timestamp={banner.start_timestamp} end_timestamp={banner.start_timestamp}  />
          )
        })}
        </div>
      </div>
    </div>
    </>
  )
  
}
