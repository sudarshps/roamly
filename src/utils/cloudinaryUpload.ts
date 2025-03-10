import {v2 as cloudinary} from 'cloudinary'

interface CloudinaryUploadType{
    url:string | undefined
}

export const cloudinaryUpload = async(buffer:Uint8Array):Promise<CloudinaryUploadType> =>{
    cloudinary.config({
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });

      return await new Promise((res,rej)=>{
        cloudinary.uploader.upload_stream({folder:'roamly'},function(err,result){
          if(err){
            rej(err)
            return
          }
          res({url:result?.secure_url})
        }).end(buffer)
})
}

