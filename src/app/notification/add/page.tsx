"use client";

const AddNotificationLayer = () => {
  return (
    <div>
      <form action="#">
        <div className="mb-20">
          <label
            htmlFor="message-en"
            className="form-label fw-semibold text-primary-light text-sm mb-8"
          >
            Message (English)
          </label>
          <input
            type="text"
            className="form-control radius-8"
            id="message-en"
            placeholder="Enter message in English"
          />
        </div>

        <div className="mb-20">
          <label
            htmlFor="message-ar"
            className="form-label fw-semibold text-primary-light text-sm mb-8"
          >
            Message (Arabic)
          </label>
          <input
            type="text"
            className="form-control radius-8"
            id="message-ar"
            placeholder="Enter message in Arabic"
          />
        </div>

        <div className="mb-20">
          <label
            htmlFor="schedule-time"
            className="form-label fw-semibold text-primary-light text-sm mb-8"
          >
            Schedule Time <span className="text-danger-600">*</span>
          </label>
          <input
            type="datetime-local"
            className="form-control radius-8"
            id="schedule-time"
          />
        </div>

        <div className="d-flex align-items-center justify-content-center gap-3">
          <button
            type="button"
            className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNotificationLayer;
