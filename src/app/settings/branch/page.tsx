"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { addBranch, deleteBranch, fetchBranch, updateBranch } from "./actions";
import { STATE } from "./state";

export default function BranchSettingsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { branches, loading, error } = useSelector((state: RootState) => state.branch);

    const [formData, setFormData] = useState({
        name_ar: "",
        name_en: "",
        city_en: "",
        city_ar: "",
        latitude: 0,
        longitude: 0,
    });

    const [editId, setEditId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchBranch());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAddOrUpdate = () => {
        if (editId) {
            dispatch(updateBranch({ id: editId, ...formData }));
        } else {
            dispatch(addBranch(formData));
        }

        setFormData({
            name_ar: "",
            name_en: "",
            city_en: "",
            city_ar: "",
            latitude: 0,
            longitude: 0,
        });
        setEditId(null);
    };

    const handleEdit = (branch: any) => {
        setFormData(branch);
        setEditId(branch.id);
    };

    const handleDelete = (branchId: number) => {
        dispatch(deleteBranch(branchId));
    };

    if (loading === STATE.LOADING) {
        return <div>Loading...</div>;
    }

    if (loading === STATE.ERROR) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container py-4">
            {/* Form */}
            <div className="card mb-4">
                <div className="card-header">Branch Settings</div>
                <div className="card-body">
                    <div className="mb-3">
                        <label>Name (AR)</label>
                        <input
                            type="text"
                            name="name_ar"
                            value={formData.name_ar}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Name (EN)</label>
                        <input
                            type="text"
                            name="name_en"
                            value={formData.name_en}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label>City (EN)</label>
                        <input
                            type="text"
                            name="city_en"
                            value={formData.city_en}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label>City (AR)</label>
                        <input
                            type="text"
                            name="city_ar"
                            value={formData.city_ar}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Latitude</label>
                        <input
                            type="number"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label>Longitude</label>
                        <input
                            type="number"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <button onClick={handleAddOrUpdate} className="btn btn-primary">
                        {editId ? "Update Branch" : "Add Branch"}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="card">
                <div className="card-header">Branch List</div>
                <div className="card-body">
                    <table className="table bordered-table sm-table mb-0 bg-base">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name (EN)</th>
                                <th>Name (AR)</th>
                                <th>City (EN)</th>
                                <th>City (AR)</th>
                                <th>Latitude</th>
                                <th>Longitude</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {branches.map((branch) => (
                                <tr key={branch.id}>
                                    <td>{branch.id}</td>
                                    <td>{branch.name_en}</td>
                                    <td>{branch.name_ar}</td>
                                    <td>{branch.city_en}</td>
                                    <td>{branch.city_ar}</td>
                                    <td>{branch.latitude}</td>
                                    <td>{branch.longitude}</td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(branch)}
                                            className="btn btn-warning me-2"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(branch.id)}
                                            className="btn btn-danger"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

