"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../ui/navbar";
import Image from "next/image";
import useAxiosWithAuth from "@/lib/useAxiosWithAuth";
import { useParams } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import Footer from "@/app/ui/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { AxiosError } from "axios";

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const axiosInstance = useAxiosWithAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(false);
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

  useEffect(() => {
    const getPostDetails = async () => {
      const post = await axiosInstance.get(`/api/postdetails`, {
        params: {
          id,
        },
      });
      if (post.data) {
        const postDetails = post.data;
        setFormData({
          title: postDetails.title,
          content: postDetails.content,
          image: null,
        });
        setPreview(postDetails.image);
        setLoading(false);
        setReload(false)
      }
    };
    getPostDetails();
  }, [id,reload]);

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
      const res = await axiosInstance.put("/api/post", formsData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          id,
        },
      });
      if (!res.data.isUpdated) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: res.data.message,
        });
        return;
      }
      Swal.fire({
        title: "Done!",
        text: res.data.message,
        icon: "success",
      }).then(() => {
        router.push("/");
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("error in submitting form", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: error.response?.data.message,
        }).then(() => {
          setReload(true);
        });
      }
    }
  };  
  useEffect(() => {
    if (reload && id) {  
      router.push(`/updateblog/${id}`)
      setLoading(true)
    }
  }, [reload,id,router]);

  return (
    <>
      <Navbar logoColor={"text-orange-400"} button={"bg-white"} />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mt-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-orange-400 to-red-500 py-6 px-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <FaEdit className="text-white" />
                Update Blog Post
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Blog Title
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {loading ? (
                    <Skeleton className="h-4 w-[250px]" />
                  ) : (
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter an attention-grabbing title"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    />
                  )}
                </div>

                <div>
                  <label
                    htmlFor="content"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Blog Content
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {loading ? (
                    <Skeleton className="h-4 w-[250px]" />
                  ) : (
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={8}
                      placeholder="Write your blog post content here..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                    ></textarea>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  {loading ? (
                    <Skeleton className="h-4 w-[250px]" />
                  ) : (
                    <div className="relative w-full h-64 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden group hover:border-blue-400 transition duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={handleImageChange}
                      />
                      {preview ? (
                        <Image
                          src={preview}
                          alt="Blog featured image"
                          width={imageDimensions?.width || 800}
                          height={imageDimensions?.height || 600}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : null}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end">
                  {loading ? (
                    <Skeleton className="h-10 w-[200px] rounded-xl" />
                  ) : (
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-400 to-red-500 text-white font-medium rounded-lg shadow hover:from-red-500 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                    >
                      Publish Blog Post
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
