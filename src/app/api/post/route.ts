import { z } from "zod";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
const FormSchema = z.object({
  title: z.string(),
  content: z.string(),
  image: z.string(),
});
import { cloudinaryUpload } from "@/utils/cloudinaryUpload";
import prisma from "@/lib/prisma";

interface UpdatedDataType {
  title: string;
  content: string;
  image?: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Please upload image!" },
        { status: 500 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const { url } = await cloudinaryUpload(buffer);

    const validatedData = FormSchema.parse({
      title,
      content,
      image: url,
    });

    if (!validatedData.title.trim() || !validatedData.content.trim()) {
      return NextResponse.json(
        { message: "The fields cannot be empty!", isCreated: false },
        { status: 500 }
      );
    }

    const userData = await prisma.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { message: "cannot find the user in db", isCreated: false },
        { status: 500 }
      );
    }
    const { id } = userData;

    const newPost = await prisma.post.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        image: validatedData.image,
        userId: id,
      },
    });

    if (!newPost) {
      return NextResponse.json(
        { message: "failed to create post!", isCreated: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Post created successfully", newPost, isCreated: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create post", error, isCreated: false },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userData = await prisma.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (!userData) {
      return NextResponse.json(
        { message: "cannot find the user in db" },
        { status: 500 }
      );
    }

    const { id } = userData;

    const postList = await prisma.post.findMany({
      where: {
        userId: id,
      },
    });
    if (!postList) {
      return NextResponse.json(
        { message: "failed to fetch post list!" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Post fetch successful", postList },
      { status: 200 }
    );
  } catch (error) {
    console.error("error on fetching post list", error);
    return NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "no article found!", isUpdated: false },
        { status: 400 }
      );
    }
    const formData = await req.formData();

    let imgUrl = "";

    if (formData.get("image")) {
      const file = formData.get("image") as File;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const { url } = await cloudinaryUpload(buffer);
      if (url) imgUrl = url;
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    const validatedData = FormSchema.parse({
      title,
      content,
      image: imgUrl,
    });

    if (!validatedData.title.trim() || !validatedData.content.trim()) {
      return NextResponse.json(
        { message: "The fields cannot be empty!", isUpdated: false },
        { status: 500 }
      );
    }

    const updateData: UpdatedDataType = {
      title: validatedData.title,
      content: validatedData.content,
    };

    if (validatedData.image !== "") {
      updateData.image = validatedData.image;
    }

    const postId = Number(id);

    const post = await prisma.post.update({
      where: { id: postId },
      data: updateData,
    });

    if (!post) {
      return NextResponse.json(
        { message: "failed to update post!", isUpdated: false },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Post updated successfully", post, isUpdated: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create post", error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "No article found!", isDeleted: false },
        { status: 400 }
      );
    }

    const postId = Number(id);
    const deletePost = await prisma.post.delete({
      where: { id: postId },
    });

    if (!deletePost) {
      return NextResponse.json(
        { message: "Failed to delete post!", isDeleted: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Post deleted successfully", deletePost, isDeleted: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("error while deleting post", error);
    NextResponse.json(
      { message: "Internal server error", error },
      { status: 500 }
    );
  }
}
