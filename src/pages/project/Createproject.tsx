import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../config/apiConfig";

const CreateProject: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    topic: "",
    description: "",
    resources: {
      images: [] as File[],
      links: [] as string[],
      documents: [] as File[],
    },
    deadline: "",
    category: "web",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");
    const client = storedUser ? JSON.parse(storedUser) : null;

    if (!client || client.role !== "client") {
      alert("Only clients can create projects!");
      return;
    }

    const payload = {
      topic: formData.topic,
      description: formData.description,
      resources: {
        images: formData.resources.images.map((file) => file.name),
        documents: formData.resources.documents.map((file) => file.name),
        links: formData.resources.links,
      },
      deadline: formData.deadline,
      category: formData.category,
      clientId: client.id,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Failed to save project");
      }

      const data = await res.json();
      console.log("✅ Saved Project:", data);

      // Reset form after success
      setFormData({
        topic: "",
        description: "",
        resources: { images: [], documents: [], links: [] },
        deadline: "",
        category: "web",
      });

      navigate("/client-dashboard");
    } catch (err) {
      console.error("❌ Error saving project:", err);
      alert("Something went wrong while creating the project!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-600">
      {/* Header */}
      <div className="bg-[#3c405b] text-white py-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold">Create a New Project</h1>
          <p className="mt-2 text-gray-200">
            Fill in the details below to add a new project, upload resources, and
            set deadlines.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-6xl mx-auto px-6 py-10 flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl space-y-6"
        >
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="block text-[#3c405b] font-medium mb-2">
                Project Topic
              </label>
              <input
                type="text"
                name="topic"
                value={formData.topic}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-[#3c405b] outline-none"
                placeholder="Enter project topic"
                required
              />
            </div>

            <div>
              <label className="block text-[#3c405b] font-medium mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 h-40 shadow-sm focus:ring-2 focus:ring-[#3c405b] outline-none"
                placeholder="Enter project description"
                required
              />
            </div>

            <div>
              <label className="block text-[#3c405b] font-medium mb-2">
                Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-[#3c405b] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[#3c405b] font-medium mb-2">
                Project Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-[#3c405b] outline-none"
              >
                <option value="web">Web</option>
                <option value="graphic">Graphic</option>
              </select>
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#3c405b] text-white font-medium py-4 rounded-lg shadow-lg hover:bg-[#2e3246] transition"
              >
                <PlusCircle className="w-6 h-6" />
                Create Project
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
