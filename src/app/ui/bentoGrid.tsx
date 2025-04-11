import React from "react";
import { BentoGrid, BentoGridItem } from "../../components/ui/bento-grid";
import { unstable_noStore as noStore } from 'next/cache';
import { getAllPosts } from "@/lib/post/action";
import Image from "next/image";
import Link from "next/link";

export default async function BentoGridDemo() {
  noStore();
  const posts = await getAllPosts();

  return (
    <BentoGrid className="max-w-8xl mx-auto">
      {posts.map((item, i) => {
        let sizeClass = "md:col-span-1 md:row-span-2";
        let titleSize = "text-2xl md:text-3xl";

        if (i === 0 || i === 4) {
          sizeClass = "md:col-span-2 md:row-span-2";
          titleSize = "text-3xl md:text-4xl";
        } else if (i === 2 || i === 5) {
          sizeClass = "md:col-span-1 md:row-span-2";
          titleSize = "text-2xl md:text-3xl";
        }

        return (
          <BentoGridItem
            key={i}
            title={
              <h1 className={`${titleSize}`}>
                <Link href={`/article/${item.id}`}>{item.title}</Link>
              </h1>
            }
            description={
              <p className={`text-md md:text-lg overflow-hidden max-h-16`}>
                {item.content}
              </p>
            }
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
            readContent={
              <div className="text-right">
                <Link href={`/article/${item.id}`}>
                  <button className="text-blue-500 hover:underline text-xs">
                    {`Read more >>`}
                  </button>
                </Link>
              </div>
            }
            className={sizeClass}
          />
        );
      })}
    </BentoGrid>
  );
}
