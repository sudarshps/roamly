"use client";

import React, { useState } from "react";
import Navbar from "../ui/navbar";
import Image from "next/image";
import { FaPlus } from "react-icons/fa";
import useAxiosWithAuth from "@/lib/useAxiosWithAuth";

const Page = () => {
  const axiosInstance = useAxiosWithAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    image: File | null;
  }>({
    title: "",
    content: "",
    image: null,
  });
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreview(reader.result);

          const imgElement = new window.Image();
          imgElement.src = reader.result;
          imgElement.onload = () => {
            setImageDimensions({
              width: imgElement.width,
              height: imgElement.height,
            });
          };
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formsData = new FormData();

    formsData.append("title", formData.title);
    formsData.append("content", formData.content);

    if (formData.image) {
      formsData.append("image", formData.image);
    }

    try {
      const res = await axiosInstance.post("/api/post", formsData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      console.error("error in submitting form", error);
    }
  };
  return (
    <>
      <Navbar logoColor={"text-orange-400"} button={"bg-white"} />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8 mt-20">
            <h2 className="text-xl font-semibold mb-4">Add New Blog</h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium mb-1"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="content"
                  className="block text-sm font-medium mb-1"
                >
                  Content
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className="w-full p-2 border rounded"
                ></textarea>
              </div>

              <div className="mb-4 flex flex-col items-center justify-center">
                {/* Image Upload Section */}
                <div className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                  />
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Uploaded"
                      width={imageDimensions?.width || 128}
                      height={imageDimensions?.height || 128}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <FaPlus className="text-gray-400 text-3xl" />
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Blog
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
