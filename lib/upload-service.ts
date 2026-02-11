import { v2 as cloudinary } from 'cloudinary'
import ImageKit from 'imagekit'
import B2 from 'b2-cloud-storage'
import { Client, Storage, ID } from 'node-appwrite'

export async function distributeToStorage(buffer: Buffer, filename: string, mimeType: string) {
  const providers = ['cloudinary', 'imagekit', 'appwrite', 'backblaze']
  const selectedProvider = providers[Math.floor(Math.random() * providers.length)]

  if (selectedProvider === 'backblaze') {
    const b2 = new B2({
      applicationKeyId: process.env.B2_KEY_ID || "dummy_key",
      applicationKey: process.env.B2_APPLICATION_KEY || "dummy_app"
    })
    await b2.authorize()
    const uploadUrlResponse = await b2.getUploadUrl({
      bucketId: process.env.B2_BUCKET_ID || "dummy_bucket"
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
    cloudinary.config({
      secure: true,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dummy_cloud",
      api_key: process.env.CLOUDINARY_API_KEY || "dummy_key",
      api_secret: process.env.CLOUDINARY_API_SECRET || "dummy_secret"
    })
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
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "dummy_pub",
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "dummy_priv",
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/dummy"
    })
    const result = await imagekit.upload({
      file: buffer,
      fileName: filename,
      useUniqueFileName: false
    })
    return { provider: 'imagekit', url: result.url }
  }

  const appwriteClient = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
    .setProject(process.env.APPWRITE_PROJECT_ID || "dummy_proj")
    .setKey(process.env.APPWRITE_API_KEY || "dummy_key")
  
  const appwriteStorage = new Storage(appwriteClient)
  const fileForAppwrite = new File([buffer], filename, { type: mimeType })
  
  const result = await appwriteStorage.createFile(
    process.env.APPWRITE_BUCKET_ID || "dummy_bucket",
    ID.unique(),
    fileForAppwrite
  )
  const appwriteUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${result.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`
  
  return { provider: 'appwrite', url: appwriteUrl }
}
