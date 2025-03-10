import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export async function getAllPosts() {
    try {
        const posts = await prisma.post.findMany()
        if(!posts){
            console.warn('No post found');
            return []
        }
        return posts
    } catch (error) {
        console.error('error fetching posts:',error);
        throw error
    }
}