"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import useAxiosWithAuth from "@/lib/useAxiosWithAuth";
import Navbar from "@/app/ui/navbar";
import Image from "next/image";
import Footer from "@/app/ui/footer";
import { SkeletonCard } from "@/app/ui/skeletonCard";

interface UserType {
  name: string;
  createdAt: Date | null;
  image_url: string
}

interface PostType {
  title: string;
  content: string;
  image: string;
  user: UserType
}

const ArticlePage = () => {
  const params = useParams();
  const { id } = params;
  const axiosInstance = useAxiosWithAuth();
  const [loading, setLoading] = useState(true)
  const [post, setPost] = useState<PostType>({
    title: "",
    content: "",
    image: "",
    user: { name: '', createdAt: null, image_url: '' }
  });

  useEffect(() => {
    const getPostDetails = async () => {
      try {
        const post = await axiosInstance.get(`/api/postdetails`, {
          params: {
            id,
          },
        });
        setPost(post.data);
      } catch (error) {
        console.error('Failed to fetch post', error);
      } finally {
        setLoading(false)
      }

    };
    getPostDetails();
  }, []);

  return (
    <>
      <Navbar logoColor="text-orange-400" button="bg-orange" />
      <div className="min-h-screen bg-gray-100">
        {loading ? (<div className="min-h-screen flex items-center justify-center">
          <SkeletonCard />
        </div>) : <div className="container mx-auto p-6 space-y-6">
          <div className="flex flex-col items-center justify-center mt-20">
            {post.image ? (
              <Image src={post.image} width={1200} height={400} alt="content" />
            ) : null}
          </div>
          <h1 className="text-4xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-4">
            <img
              src={post.user.image_url || 'avatar.png'}
              alt={post.user.name}
              className="w-12 h-12 rounded-full object-cover"
            />

            {post.user && <div className="space-y-1">
              <h4 className="text-lg">
                By <span className="text-lg font-bold">{post.user.name}</span>
              </h4>
              <h4 className="text-md">
                {post.user.createdAt && new Date(post.user.createdAt).toDateString()}
              </h4>
            </div>}
          </div>

          <div className="text-lg space-y-4">
            {post.content.split("\n").map((paragraph, index) => (
              <p key={index} className="leading-relaxed text-gray-800">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        }
      </div>
      <Footer />
    </>
  );
};

export default ArticlePage;
