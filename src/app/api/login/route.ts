import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs";

export async function POST(req:Request){
    const body = await req.json()
    const{email,password} = body    

    if(!email.trim()){
        return NextResponse.json(
            {success:false,message:'Enter email!'},
            {status:400}
        )
    }

    if(!password.trim()){
        return NextResponse.json(
            {success:false,message:'Enter password!'},
            {status:400}
        )
    }
    

    try {
        const user = await prisma.user.findUnique({where:{email}})
        if(!user || !user.password) return NextResponse.json({success:false,message:'Invalid credentials!'},{status:401})

        const isValid = await bcrypt.compare(password,user.password)
        if(!isValid) return NextResponse.json({success:false,message:'invalid credentials'},{status:401})
        
        const token = jwt.sign({userId:user.id},process.env.JWT_SECRET as string,{expiresIn:'1h'})
        
        return NextResponse.json({success:true,token,name:user.name})
    } catch (error) {
        return NextResponse.json({success:false,error:`server error:${error}`})
    }
}