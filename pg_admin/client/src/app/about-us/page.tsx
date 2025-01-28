"use client";
import { useState } from "react";

const About = () => {
  const [activePage, setActivePage] = useState<"About Us" | "CSR">("About Us"); // Toggle between "About Us" and "CSR"
  const [formData, setFormData] = useState({
    "About Us": { title: "", description: "", image: "" },
    CSR: { title: "", description: "", image: "" },
  });

  const handleInputChange = (
    page: "About Us" | "CSR",
    field: keyof typeof formData["About Us"],
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [page]: {
        ...prev[page],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (page: "About Us" | "CSR") => {
    console.log(`Submitting data for ${page}:`, formData[page]);
    alert(`${page} submitted successfully!`);
  };

  const handleUpdate = (page: "About Us" | "CSR") => {
    console.log(`Updating data for ${page}:`, formData[page]);
    alert(`${page} updated successfully!`);
  };

  const handleDelete = (page: "About Us" | "CSR") => {
    setFormData((prev) => ({
      ...prev,
      [page]: { title: "", description: "", image: "" },
    }));
    alert(`${page} data deleted successfully!`);
  };

  return (
    <div className="ml-64 p-6 bg-gray-50 min-h-screen">
      {/* Tabs for switching between pages */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activePage === "About Us" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActivePage("About Us")}
        >
          About Us
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activePage === "CSR" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActivePage("CSR")}
        >
          CSR
        </button>
      </div>

      {/* Form Content */}
      <div>
        <h1 className="text-2xl font-bold mb-4">
          {activePage} 
        </h1>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Title</label>
          <input
            type="text"
            value={formData[activePage].title}
            onChange={(e) =>
              handleInputChange(activePage, "title", e.target.value)
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            value={formData[activePage].description}
            onChange={(e) =>
              handleInputChange(activePage, "description", e.target.value)
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-2">Image URL</label>
          <input
            type="text"
            value={formData[activePage].image}
            onChange={(e) =>
              handleInputChange(activePage, "image", e.target.value)
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => handleSubmit(activePage)}
          >
            Submit
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded"
            onClick={() => handleUpdate(activePage)}
          >
            Update
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={() => handleDelete(activePage)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
