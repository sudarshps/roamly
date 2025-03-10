"use client";

import { useEffect, useState } from "react";
import Navbar from "../ui/navbar";
import useAxiosWithAuth from "@/lib/useAxiosWithAuth";

interface PostListType{
  id:number;
  title:string;
  content:string;
  image:string;
  userId:number;
}

const Page = () => {
  const axiosInstance = useAxiosWithAuth()
  const [blogs,setBlogs] = useState<PostListType[]>([])
  useEffect(()=>{
    const fetchBlogList = async() => {
      const list = await axiosInstance.get('/api/post')
      if(list.data){
        console.log(list.data.postList)
        setBlogs(list.data.postList)
      }
    }
    fetchBlogList()
  },[])
  // const blogs = [
  //   {
  //     id: "1",
  //     title: "Getting Started with Next.js",
  //     content: "Next.js is a React framework...",
  //     author: "John Doe",
  //     createdAt: "2025-02-15",
  //   },
  //   {
  //     id: "2",
  //     title: "CSS Tips and Tricks",
  //     content: "Here are some useful CSS techniques...",
  //     author: "Jane Smith",
  //     createdAt: "2025-02-20",
  //   },
  //   {
  //     id: "3",
  //     title: "JavaScript Best Practices",
  //     content: "When writing JavaScript...",
  //     author: "Alex Johnson",
  //     createdAt: "2025-02-25",
  //   },
  // ];

  return (
    <div>
      <Navbar logoColor={"text-orange-400"} button={"bg-white"} />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">

          {/* Blog List */}
          <div className="bg-white p-6 rounded-lg shadow-md mt-20">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Blog Posts</h2>

              <div>
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="p-2 border rounded"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {blogs.map((blog,i) => (
                    <tr key={i}>
                      <td className="px-4 py-2 max-w-[200px] truncate whitespace-nowrap overflow-hidden">{blog.title}</td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:underline">
                            Edit
                          </button>
                          <button className="text-red-500 hover:underline">
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
