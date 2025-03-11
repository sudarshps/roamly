"use client";

import { useEffect, useState } from "react";
import Navbar from "../ui/navbar";
import useAxiosWithAuth from "@/lib/useAxiosWithAuth";
import { useRouter } from "next/navigation";

interface PostListType{
  id:number;
  title:string;
  content:string;
  image:string;
  userId:number;
}

const Page = () => {
  const axiosInstance = useAxiosWithAuth()
  const router = useRouter()
  const [blogs,setBlogs] = useState<PostListType[]>([])
  useEffect(()=>{
    const fetchBlogList = async() => {
      const list = await axiosInstance.get('/api/post')
      if(list.data){
        setBlogs(list.data.postList)
      }
    }
    fetchBlogList()
  },[])

  const handleDelete = async(id:number) => {
    const res = await axiosInstance.delete('/api/post',{
      params:{
        id
      }
    })
    if(res.data){

    }
  }

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
                        <button className="text-blue-500 hover:underline" onClick={()=>router.push(`/article/${blog.id}`)}>
                            View
                          </button>
                          <button className="text-blue-500 hover:underline" onClick={()=>router.push(`/updateblog/${blog.id}`)}>
                            Edit
                          </button>
                          <button className="text-red-500 hover:underline" onClick={()=>handleDelete(blog.id)}>
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
