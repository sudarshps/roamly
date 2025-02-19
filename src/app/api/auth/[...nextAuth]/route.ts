import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'


const prisma = new PrismaClient()

const authOptions = {
  providers:[
    GoogleProvider({
      clientId:process.env.AUTH_GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET,
      async profile(profile) {
        const user = await prisma.user.findUnique({
          where:{
            email:profile.email
          }
        })

        if(!user){
          const password = await bcrypt.hash('123456',10)
          const newUser = await prisma.user.create({
            data:{
              name:profile.name,
              email:profile.email,
              password:password
            }
          })
          return {id:newUser.id,name:newUser.name,email:newUser.email}
        }
        return {id:user.id,name:user.name,email:user.email}
      }
    }),
    CredentialsProvider({
      name:'Credentials',
      credentials:{
        email:{label:'Email',type:'text'},
        password:{label:'Password',type:'password'}
      },
      async authorize(credentials){

        const email = credentials?.email as string
        const password = credentials?.password as string

        if(!email || !password)return null

        const user = await prisma.user.findUnique({where:{email}})

        if(!user || !user.password)return null

        const isValid = await bcrypt.compare(password,user.password)

        if(!isValid)return null

        return {id:user.id,name:user.name,email:user.email}
      }
    })
  ],
  secret: process.env.JWT_SECRET,
  callbacks:{
    async jwt({token,user}){
      if(user){        
        token.id = user.id
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    async session({session,token}){
      session.user.id = token.id as string
      session.user.name = token.name as string
      session.user.email = token.email as string
      return session
    }
  }
}

export const GET = NextAuth(authOptions).handlers.GET
export const POST = NextAuth(authOptions).handlers.POST