import { v2 as cloudinary } from 'cloudinary'
import ImageKit from 'imagekit'
import B2 from 'b2-cloud-storage'
import { Client, Storage, ID } from 'node-appwrite'

export async function distributeToStorage(buffer: Buffer, filename: string, mimeType: string) {
  const providers = ['backblaze', 'imagekit', 'cloudinary', 'appwrite']
  
  // Acak urutan provider agar beban terbagi rata, tapi tetap mencoba semuanya jika gagal
  const shuffled = providers.sort(() => 0.5 - Math.random())
  
  let lastError: any = null

  for (const provider of shuffled) {
    try {
      if (provider === 'backblaze') {
        if (!process.env.B2_KEY_ID || !process.env.B2_APPLICATION_KEY || !process.env.B2_BUCKET_ID) continue
        
        const b2 = new B2({
          applicationKeyId: process.env.B2_KEY_ID,
          applicationKey: process.env.B2_APPLICATION_KEY
        })
        await b2.authorize()
        const uploadUrlResponse = await b2.getUploadUrl({
          bucketId: process.env.B2_BUCKET_ID
        })
        await b2.uploadFile({
          uploadUrl: uploadUrlResponse.data.uploadUrl,
          uploadAuthToken: uploadUrlResponse.data.authorizationToken,
          fileName: filename,
          data: buffer,
          mimeType: mimeType
        })
        const b2Url = `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${filename}`
        return { provider: 'backblaze', url: b2Url }
      }

      if (provider === 'cloudinary') {
        if (!process.env.CLOUDINARY_URL) continue

        cloudinary.config({ secure: true })
        const url = await new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: 'auto', public_id: filename.split('.')[0] },
            (error, result) => {
              if (error) reject(error)
              else resolve(result?.secure_url as string)
            }
          )
          uploadStream.end(buffer)
        })
        return { provider: 'cloudinary', url }
      }

      if (provider === 'imagekit') {
        if (!process.env.IMAGEKIT_PRIVATE_KEY) continue

        const imagekit = new ImageKit({
          publicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'dummy',
          privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
          urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'dummy'
        })
        const result = await imagekit.upload({
          file: buffer,
          fileName: filename,
          useUniqueFileName: false
        })
        return { provider: 'imagekit', url: result.url }
      }

      if (provider === 'appwrite') {
        if (!process.env.APPWRITE_PROJECT_ID) continue

        const appwriteClient = new Client()
          .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
          .setProject(process.env.APPWRITE_PROJECT_ID)
          .setKey(process.env.APPWRITE_API_KEY || '')
        
        const appwriteStorage = new Storage(appwriteClient)
        const fileForAppwrite = new File([buffer], filename, { type: mimeType })
        
        const result = await appwriteStorage.createFile(
          process.env.APPWRITE_BUCKET_ID || '',
          ID.unique(),
          fileForAppwrite
        )
        const appwriteUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${result.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`
        return { provider: 'appwrite', url: appwriteUrl }
      }

    } catch (error) {
      console.error(`Provider ${provider} failed:`, error)
      lastError = error
      continue
    }
  }

  throw new Error(`All storage providers failed. Last error: ${lastError?.message || JSON.stringify(lastError)}`)
}
