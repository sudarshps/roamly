import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';


export async function GET(request:NextRequest){
    try {
      const {searchParams} = new URL(request.url)
      const id = searchParams.get("id")
      if(!id){
        return NextResponse.json({message:'no article found!'},{status:400})
      }
      const postId = Number(id)
      const post = await prisma.post.findUnique({
        where:{
          id:postId
        },
        include:{
          user:true
        }
      })
      if(!post){
        return NextResponse.json({message:'No post found!'},{status:400})
      }
  
      return NextResponse.json(post)
    } catch (error) {
      console.error('error while fetching post details:',error);
      return NextResponse.json({message:'internal server error'},{status:500})
      
    }
  }