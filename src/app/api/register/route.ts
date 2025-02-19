import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

export async function POST(req: Request) {

    const body = await req.json();
    const { name, email, password } = body;

    if(!name.trim()){
        return NextResponse.json(
            {message:'Name is required!'},
            {status:400}
        )
    }
    
    if(!email.trim()){
        return NextResponse.json(
            {message:'Email is required!'},
            {status:400}
        )
    }

    if(!password.trim()){
        return NextResponse.json(
            {message:'Password is required!'},
            {status:400}
        )
    }



  try {

    const existingUser = await prisma.user.findUnique({where:{email}})

    if(existingUser){     
        return NextResponse.json({success:false,message:'User already exists!'})
    }

    const secret = process.env.JWT_SECRET as string
    const token = jwt.sign({name,email,password},secret,{expiresIn:'1h'})

    const transporter = nodemailer.createTransport({
        service:'gmail',
        auth:{user:process.env.MAIL_USER,pass:process.env.MAIL_PASS}
    })

    const verifyLink = `${process.env.BASE_URL}/verify?token=${token}`
    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: 'Verify your email',
        html: `<p>Click <a href="${verifyLink}">here</a> to verify your email.</p>`,
      };

      transporter.sendMail(mailOptions, (error) => {
        if (error) {
          return NextResponse.json({ error: 'Failed to send email' });
        }
        return NextResponse.json({ message: 'Verification email sent. Please check your inbox.' });
      });
      return NextResponse.json({ message: 'Verification email sent. Please check your inbox.' });

    
  } catch (error) {
    return NextResponse.json({ success: false, error: `Server error: ${error}` }, { status: 500 });
  }
}
