"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosWithAuth from "@/lib/useAxiosWithAuth";
import Navbar from "@/app/ui/navbar";
import Image from "next/image";

interface PostType{
    title:string;
    content:string;
    image:string
}

const ArticlePage = () => {
  const params = useParams();
  const { id } = params;
  const axiosInstance = useAxiosWithAuth();
  const [post, setPost] = useState<PostType>({
    title:'',
    content:'',
    image:''
  });

  useEffect(() => {
    const getPostDetails = async () => {
      const post = await axiosInstance.get(`/api/postdetails`, {
        params: {
          id,
        },
      });
      setPost(post.data);
    };
    getPostDetails();
  }, []);

  return (
    <>
      <Navbar logoColor="text-orange-400" button="bg-orange"/>
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex flex-col items-center justify-center mt-20">
            <Image src={post.image || ''} width={1200} height={400} alt="content"/>
            </div>
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <p className="text-lg space-y-4">{post.content.split('\n').map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-gray-800">
                {paragraph}
              </p>
            ))}</p>
        </div>
      </div>
    </>
  );
};

export default ArticlePage;
