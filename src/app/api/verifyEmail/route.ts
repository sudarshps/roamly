import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface JwtPayload {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request) {
  const body = await req.json();
  const { token } = body;
  const secret = process.env.JWT_SECRET as string;
  try {
    const decode = jwt.verify(token, secret) as JwtPayload;
    const { name, email, password } = decode;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "Failed to create user",
      });
    }

    const response = NextResponse.json({
      success:true,
      message:"Registration completed!"
    })

    response.cookies.set('token',token,{
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production', 
      maxAge: 60 * 60, 
      path: '/', 
      sameSite: 'strict',
    })
    return response
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "server error",
      error,
    });
  }
}
