import React from "react";
import { BentoGrid, BentoGridItem } from "../../components/ui/bento-grid";
import { getAllPosts } from "@/lib/post/action";
import Image from "next/image";

export default async function BentoGridDemo() {
  const posts = await getAllPosts()

  if(!posts || posts.length ===0 ){
    return <div>No post found!</div>
  }
  return (
    <BentoGrid className="max-w-8xl mx-auto">
      {posts.map((item, i) => {
        // Define different sizes based on the index
        let sizeClass = "";
        let titleSize = "text-xl md:text-2xl"; // Default size

        if (i === 0 || i === 4) {
          sizeClass = "md:col-span-2 md:row-span-2"; // Larger items
          titleSize = "text-3xl md:text-5xl";
        } else if (i === 2 || i === 5) {
          sizeClass = "md:col-span-1 md:row-span-2"; // Taller items
          titleSize = "text-2xl md:text-3xl";
        }

        return (
          <BentoGridItem
            key={i}
            title={<h1 className={`${titleSize} break-words`}>{item.title}</h1>}
            description={<p className="text-lg md:text-xl break-words">{item.content}</p>}
            header={
              <div className="flex flex-1 w-full h-full min-h-[10rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 group-hover/bento:translate-x-2 transition duration-200">
                <Image
                  src={item.image || ''}
                  alt={item.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
            }
            className={sizeClass} 
          />
        );
      })}
    </BentoGrid>
  );
}
