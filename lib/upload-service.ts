import { imagekit, appwriteStorage, b2 } from './storage'
import { v2 as cloudinary } from 'cloudinary'
import { ID } from 'node-appwrite'

export async function distributeToStorage(buffer: Buffer, filename: string, mimeType: string) {
  const providers = ['cloudinary', 'imagekit', 'appwrite', 'backblaze']
  const selectedProvider = providers[Math.floor(Math.random() * providers.length)]

  if (selectedProvider === 'backblaze') {
    await b2.authorize()
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID as string
    })
    const b2Result = await b2.uploadFile({
      uploadUrl: uploadUrlResponse.data.uploadUrl,
      uploadAuthToken: uploadUrlResponse.data.authorizationToken,
      fileName: filename,
      data: buffer,
      mimeType: mimeType
    })
    const b2Url = `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${filename}`
    return { provider: 'backblaze', url: b2Url }
  }

  if (selectedProvider === 'cloudinary') {
    return new Promise<{ provider: string, url: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto', public_id: filename.split('.')[0] },
        (error, result) => {
          if (error) reject(error)
          else resolve({ provider: 'cloudinary', url: result?.secure_url as string })
        }
      )
      uploadStream.end(buffer)
    })
  }

  if (selectedProvider === 'imagekit') {
    const result = await imagekit.upload({
      file: buffer,
      fileName: filename,
      useUniqueFileName: false
    })
    return { provider: 'imagekit', url: result.url }
  }

  const fileForAppwrite = new File([buffer], filename, { type: mimeType })
  const result = await appwriteStorage.createFile(
    process.env.APPWRITE_BUCKET_ID as string,
    ID.unique(),
    fileForAppwrite
  )
  const appwriteUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${result.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`
  
  return { provider: 'appwrite', url: appwriteUrl }
}
