import React, { useState } from "react";
import { PlusCircle, Link, FileUp, Image } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "documents"
  ) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        resources: {
          ...formData.resources,
          [type]: [...formData.resources[type], ...Array.from(e.target.files)],
        },
      });
    }
  };

  const handleAddLink = () => {
    setFormData({
      ...formData,
      resources: {
        ...formData.resources,
        links: [...formData.resources.links, ""],
      },
    });
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.resources.links];
    newLinks[index] = value;
    setFormData({
      ...formData,
      resources: { ...formData.resources, links: newLinks },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Get logged-in user
    const storedUser = localStorage.getItem("user");
    const client = storedUser ? JSON.parse(storedUser) : null;

    if (!client || client.role !== "client") {
      alert("Only newly created accounts can create projects!");
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
      clientId: client.id, // save registered client’s id
    };

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save project");

      const data = await res.json();
      console.log("Saved Project ✅:", data);

      navigate("/client-dashboard"); // redirect after save
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-600">
      {/* Header Section */}
      <div className="bg-[#3c405b] text-white py-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold">Create a New Project</h1>
          <p className="mt-2 text-gray-200">
            Fill in the details below to add a new project, upload resources, and
            set deadlines. Keep everything organized in one place.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
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
          </div>

          {/* Right Column - Resources */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#3c405b] mb-4">Resources</h2>

            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Image className="w-5 h-5 text-[#3c405b]" />
                Upload Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileChange(e, "images")}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                file:bg-[#3c405b] file:text-white hover:file:bg-[#2e3246]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <FileUp className="w-5 h-5 text-[#3c405b]" />
                Upload Documents
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                multiple
                onChange={(e) => handleFileChange(e, "documents")}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 file:text-sm file:font-semibold 
                file:bg-[#3c405b] file:text-white hover:file:bg-[#2e3246]"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 flex items-center gap-2">
                <Link className="w-5 h-5 text-[#3c405b]" />
                Resource Links
              </label>
              {formData.resources.links.map((link, index) => (
                <input
                  key={index}
                  type="url"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 mb-2 shadow-sm focus:ring-2 focus:ring-[#3c405b] outline-none"
                  placeholder="Enter resource link"
                />
              ))}
              <button
                type="button"
                onClick={handleAddLink}
                className="text-sm text-[#3c405b] underline"
              >
                + Add Link
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#3c405b] text-white font-medium py-4 rounded-lg shadow-lg hover:bg-[#2e3246] transition"
            >
              <PlusCircle className="w-6 h-6" />
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
