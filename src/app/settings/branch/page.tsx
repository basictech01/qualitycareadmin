"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { addBranch, deleteBranch, fetchBranch, updateBranch } from "./actions";

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

    return (
        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Branch Settings</h2>

            {/* Input Form */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                    type="text"
                    name="name_ar"
                    value={formData.name_ar}
                    onChange={handleChange}
                    placeholder="Branch Name (Arabic)"
                    className="p-2 bg-gray-700 border border-gray-600 rounded"
                />
                <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleChange}
                    placeholder="Branch Name (English)"
                    className="p-2 bg-gray-700 border border-gray-600 rounded"
                />
                <input
                    type="text"
                    name="city_ar"
                    value={formData.city_ar}
                    onChange={handleChange}
                    placeholder="City (Arabic)"
                    className="p-2 bg-gray-700 border border-gray-600 rounded"
                />
                <input
                    type="text"
                    name="city_en"
                    value={formData.city_en}
                    onChange={handleChange}
                    placeholder="City (English)"
                    className="p-2 bg-gray-700 border border-gray-600 rounded"
                />
                <input
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Latitude"
                    min="-90"
                    max="90"
                    className="p-2 bg-gray-700 border border-gray-600 rounded"
                />
                <input
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Longitude"
                    min="-180"
                    max="180"
                    className="p-2 bg-gray-700 border border-gray-600 rounded"
                />
            </div>

            <button
                onClick={handleAddOrUpdate}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
            >
                {editId ? "Update" : "Add"} Branch
            </button>

            {/* List of Branches */}
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <ul>
                    {branches.map((branch) => (
                        <li key={branch.id} className="flex justify-between p-2 bg-gray-700 mb-2 rounded">
                            <span>{branch.name_en} - {branch.city_en}</span>
                            <div>
                                <button
                                    onClick={() => handleEdit(branch)}
                                    className="mr-2 text-yellow-400"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(branch.id)}
                                    className="text-red-400"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

