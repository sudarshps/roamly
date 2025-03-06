import { z } from 'zod';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const FormSchema = z.object({
  title: z.string(),
  content: z.string(),
  image: z.string(),
});

export async function POST(request: NextRequest) {
  try {

    console.log('lalallala');
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    // const url = await saveImage(file)

    const validatedData = FormSchema.parse({
      title,
      content,
      image: file.name, 
    })

    
    return NextResponse.json({ message: 'Post created successfully', data: validatedData }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to create post', error }, { status: 500 });
  }
}