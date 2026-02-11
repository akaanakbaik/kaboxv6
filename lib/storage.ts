import { v2 as cloudinary } from 'cloudinary'
import ImageKit from 'imagekit'
import B2 from 'b2-cloud-storage'
import { Client, Storage } from 'node-appwrite'

cloudinary.config({
  secure: true
})

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "dummy",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string
})

export const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID || "dummy",
  applicationKey: process.env.B2_APPLICATION_KEY as string
})

const appwriteClient = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
  .setProject(process.env.APPWRITE_PROJECT_ID as string)
  .setKey(process.env.APPWRITE_API_KEY as string)

export const appwriteStorage = new Storage(appwriteClient)
