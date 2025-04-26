import prisma from "@/lib/prisma";

export async function GET(req:Request) {
    try {        
        const {searchParams} = new URL(req.url)
        const query = searchParams.get('val')

        if(!query){
            return Response.json({error:'Query is not available'},{status:400})
        }
        const filteredPost = await prisma.post.findMany({
            where:{
                OR:[
                    {
                        title:{
                            contains:query,
                            mode:'insensitive'
                        }
                    },
                ]
            }
        })
        return Response.json({filteredPost})
    } catch (error) {
        console.error('error while filtering post',error);
    }
}