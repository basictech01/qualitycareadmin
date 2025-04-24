"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Modal from "react-bootstrap/Modal";
import AddUserLayer from "./add/addDoctor";
import { del, get, put } from "@/utils/network";
import { Doctor } from "@/utils/types";

const DoctorDashboard = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDoctorModel, setShowCreateDoctorModel] = useState(false);
  const [showEditUserModel, setShowEditUserModel] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [refresh, setRefresh] = useState<boolean>(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await get("/doctor"); // Replace with your actual API endpoint
        setDoctors(Array.isArray(data) ? data : []);
        console.log(data)
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [refresh]);

  const handleEditDoctor = async (doctorId: Doctor) => {
    const doctorToEdit = doctors.find((doctor) => doctor.id === doctorId);

    if (!doctorToEdit) {
      console.error("Doctor not found in state!");
      return;
    }

    setSelectedDoctor(doctorToEdit);
    setShowEditUserModel(true);
  };

  const handDeleteDoctor = async (doctorId: Doctor) => {
    try {
      await del(`/doctor/${doctorId}`);
      setDoctors((state) => state.filter((doctor) => doctor.id !== doctorId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    console.log("Doctors:", selectedDoctor); // Debugging log
  }, [selectedDoctor]);[]

  const onSuccessDoctorCreate = (doctor: Doctor) => {
   setDoctors((state)=>{return [...state,doctor] })
   setShowCreateDoctorModel(false)
  }

  const onSuccessDoctorEdit = (doctor: Doctor) => {
    setDoctors((state)=>{return state.map((d)=>d.id===doctor.id ? doctor : d)})
    setShowEditUserModel(false)
  }
  const changeActiveStatus = async (doctor: any) => {

    try {
      const updatedDoctor = { ...doctor, is_active: !doctor.is_active };
      console.log(updatedDoctor)
      const data = await put(`/doctor/${doctor?.id}`, updatedDoctor);
      
      // Update the doctors state to reflect the change
      setDoctors((state) => {
        return state.map((d) => (d.id === doctor.id ? updatedDoctor : d));
      });
      
      // Trigger refresh
      setRefresh(prev => !prev);
    } catch (err: any) {
      console.error("Error updating doctor status:", err);
      setError(err.message);
    }
  };
  return (
    <>
      {/* Create Doctor Modal */}
      <Modal
        show={showCreateDoctorModel}
        size="lg"
        onHide={() => setShowCreateDoctorModel(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Register New Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddUserLayer onSuccess={onSuccessDoctorCreate}  />
        </Modal.Body>
      </Modal>

      {/* Edit Doctor Modal */}
      <Modal
        show={showEditUserModel}
        size="lg"
        onHide={() => setShowEditUserModel(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddUserLayer onSuccess={onSuccessDoctorEdit} doctor={selectedDoctor} />
        </Modal.Body>
      </Modal>

      <div className="card h-100 p-0 radius-12">
        <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
          <div className="d-flex align-items-center flex-wrap gap-3">
          <h1 className="text-xl font-bold mb-4">Doctors</h1>
            {/* <form className="navbar-search">
              <input
                type="text"
                className="bg-base h-40-px w-auto"
                name="search"
                placeholder="Search"
              />
              <Icon icon="ion:search-outline" className="icon" />
            </form> */}
          </div>
          <button
            onClick={() => setShowCreateDoctorModel(true)}
            className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          >
            <Icon
              icon="ic:baseline-plus"
              className="icon text-xl line-height-1"
            />
            Add New Doctor
          </button>
        </div>
        <div className="card-body p-24">
          {loading && <p>Loading doctors...</p>}
          {error && <p className="text-danger">{error}</p>}
          <div className="row">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onEdit={() => handleEditDoctor(doctor.id)}
                onDelete={() => handDeleteDoctor(doctor.id)}
                onStatusChange={()=>changeActiveStatus(doctor)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};



const DoctorCard = ({
  doctor,
  onEdit,
  onDelete,
  onStatusChange
}: {
  doctor: any;
  onEdit: () =>void;
  onDelete: () => void;
  onStatusChange: () => void;
}) => {

 
  console.log(doctor)
  return (
    <div className="col-xxl-2 col-md-4 col-sm-6 user-grid-card p-2">
      
      <div className="position-relative border radius-16 overflow-hidden">
          <img
          src={doctor.photo_url || "assets/images/user-grid/user-grid-img1.png"}
          alt={doctor.name_en}
          className="w-100 object-fit-cover"
          style={{ height: "150px" }} 
    />
    <div className="position-absolute top-0 end-0 m-4">
    <span className={`badge text-white px-4 py-4 fs-6 ${doctor.is_active == 1 ? "bg-primary-600" : "bg-danger-600"}`}>
            <button onClick={onStatusChange}>
              {doctor.is_active == 1 ? "Block" : "Unblock"}
            </button>
          </span>
          </div>
        <div className="ps-16 pb-16 pe-16 text-center mt-10">
       
          <h6 className="text-lg mb-0 mt-4">{doctor.name_en}</h6>
          <div style={{ height: "10px", }}></div>
          <div className="center-border position-relative bg-danger-gradient-light radius-8 p-12 d-flex align-items-center gap-4">
            <div className="text-center w-50">
              <h6 className="text-md mb-0">
                {doctor.languages || "Department"}
              </h6>
             
            </div>
            <div className="text-center w-50">
              <h6 className="text-md mb-0">
                {doctor.qualification || "Designation"}
              </h6>
             
            </div>
          </div>
          <div
            onClick={onEdit}
            className="bg-primary-50 text-primary-600 bg-hover-primary-600 hover-text-white p-10 text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center justify-content-center mt-16 fw-medium gap-2 w-100"
          >
            Edit Profile
          </div>
          <div
            onClick={onDelete}
            className="bg-primary-50 text-primary-600 bg-hover-primary-600 hover-text-white p-10 text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center justify-content-center mt-16 fw-medium gap-2 w-100"
          >
            Delete Profile
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
