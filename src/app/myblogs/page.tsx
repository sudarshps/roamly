"use client";

import { useEffect, useState } from "react";
import Navbar from "../ui/navbar";
import useAxiosWithAuth from "@/lib/useAxiosWithAuth";
import Swal from "sweetalert2";
import Footer from "../ui/footer";
import { SkeletonDemo } from "../ui/skeletonList";
import Link from "next/link";
import { Pagination } from "../ui/pagination";



interface PostListType {
  id: number;
  title: string;
  content: string;
  image: string;
  createdAt: string;
  userId: number;
}


const Page = () => {
  const axiosInstance = useAxiosWithAuth();
  const [blogs, setBlogs] = useState<PostListType[]>([]);
  const [searchValue,setSearchValue] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true);
  const [pageNumber,setPageNumber] = useState<number>(1)
  const [totalPosts,setTotalPosts] = useState<number|null>(null)
  useEffect(() => {
    const fetchBlogList = async () => {
      const list = await axiosInstance.get("/api/post",{
        params:{val:searchValue,page:pageNumber}
      });
      if (list.data) {
        setBlogs(list.data.postList);
        setTotalPosts(list.data.totalPosts)
        setLoading(false);
      }
    };
    if(searchValue.trim()){
      const debounce = setTimeout(() => {
          fetchBlogList()
      }, 1000);

      return () => clearTimeout(debounce)
    }
    fetchBlogList();
  }, [searchValue,pageNumber]);

  const handleSearch = async(e:React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    
  }

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async(result) => {
      if (result.isConfirmed) {
        const res = await axiosInstance.delete("/api/post", {
          params: {
            id,
          },
        });
        if (!res.data.isDeleted) {
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
        });
        setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      }
    });

  };

  const handleCurrentPage = (pageNum:number) => {
    setPageNumber(pageNum)
  }

  return (
    <>
      <Navbar logoColor={"text-orange-400"} button={"bg-white"} />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto mt-8">
            <div className="border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center p-6 bg-gradient-to-r from-orange-400 to-red-500">
                <h2 className="text-2xl font-bold text-white mb-4 sm:mb-0">
                  My Blog Posts
                </h2>

                <div className="w-full sm:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search blogs..."
                      value={searchValue}
                      onChange={handleSearch}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <svg
                      className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>

                    {searchValue && (
    <button
      type="button"
      onClick={() => setSearchValue("")}
      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
    >
      <svg
        className="h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )}
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Published At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                {loading ? (
                  <div className="p-4">
                    <SkeletonDemo />
                  </div>
                ) : (
                  <tbody className="bg-white divide-y divide-gray-200">
                    {blogs.length?blogs.map((blog, i) => (
                      <tr
                        key={i}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 max-w-[200px] truncate whitespace-nowrap overflow-hidden font-medium text-gray-900">
                          {blog.title}
                        </td>
                        <td className="px-6 py-4 max-w-[200px] truncate whitespace-nowrap overflow-hidden font-medium text-gray-900">
                          {blog.createdAt.split('T')[0]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-4">
                            <Link href={`/article/${blog.id}`}>
                              <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                                View
                              </button>
                            </Link>
                            <Link href={`/updateblog/${blog.id}`}>
                              <button className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
                                <svg
                                  className="w-4 h-4 mr-1"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                  />
                                </svg>
                                Edit
                              </button>
                            </Link>

                            <button
                              className="text-red-600 hover:text-red-800 font-medium flex items-center"
                              onClick={() => handleDelete(blog.id)}
                            >
                              <svg
                                className="w-4 h-4 mr-1"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    )):<td className="px-6 py-4 max-w-[200px] truncate whitespace-nowrap overflow-hidden font-medium text-gray-900">
                    No Posts!
                  </td>}
                  </tbody>
                )}
              </table>
            </div>
            <div>
            <div>
  <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 grid grid-cols-2 items-center">
    
    <div>
      <Pagination totalPosts={totalPosts} currentPgNum={handleCurrentPage}/>
    </div>

    <div className="flex justify-end">
      <Link href={`/createblog`}>
        <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-400 to-red-500 text-white font-medium rounded-lg shadow hover:from-red-500 hover:to-orange-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200">
          <svg
            className="w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Blog Post
        </button>
      </Link>
    </div>
    
  </div>
</div>

</div>

            
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Page;
