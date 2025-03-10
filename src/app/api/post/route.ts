import { z } from 'zod';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
const FormSchema = z.object({
  title: z.string(),
  content: z.string(),
  image: z.string(),
});
import { cloudinaryUpload } from '@/utils/cloudinaryUpload';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {

    const user = await currentUser()

    if(!user){
      return NextResponse.json({error:'Unauthorized'},{status:401})
    }
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const {url} = await cloudinaryUpload(buffer)


    const validatedData = FormSchema.parse({
      title,
      content,
      image: url, 
    })
    
    const userData = await prisma.user.findUnique({
      where:{
        clerkUserId:user.id
      }
    })

    if(!userData){
      return NextResponse.json({message:'cannot find the user in db'},{status:500})
    }
    const {id} = userData

    const newPost = await prisma.post.create({
      data:{
        title:validatedData.title,
        content:validatedData.content,
        image:validatedData.image,
        userId:id,
      }
    })

    if(!newPost){
      return NextResponse.json({message:'failed to create post!'},{status:500})
    }
    
    return NextResponse.json({ message: 'Post created successfully', newPost }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create post', error }, { status: 500 });
  }
}


export async function GET() {
  try {
    const user = await currentUser()

    if(!user){
      return NextResponse.json({message:'Unauthorized'},{status:401})
    }
    const userData = await prisma.user.findUnique({
      where:{
        clerkUserId:user.id
      }
    })

    if(!userData){
      return NextResponse.json({message:'cannot find the user in db'},{status:500})
    }

    const {id} = userData

    const postList = await prisma.post.findMany({
      where:{
        userId:id
      }
    })
    if(!postList){
      return NextResponse.json({message:'failed to fetch post list!'},{status:500})
    }

    return NextResponse.json({message:'Post fetch successful',postList},{status:200})

  } catch (error) {
    console.error('error on fetching post list',error);
    return NextResponse.json({message:'Internal server error',error},{status:500})
    
  }
}

