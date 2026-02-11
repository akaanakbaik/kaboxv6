import { v2 as cloudinary } from 'cloudinary'
import ImageKit from 'imagekit'
import B2 from 'b2-cloud-storage'
import { Client, Storage } from 'node-appwrite'

cloudinary.config({
  secure: true
})

export const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "dummy_public_key",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "dummy_private_key",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/dummy"
})

export const b2 = new B2({
  applicationKeyId: process.env.B2_KEY_ID || "dummy_key_id",
  applicationKey: process.env.B2_APPLICATION_KEY || "dummy_app_key"
})

const appwriteClient = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1")
  .setProject(process.env.APPWRITE_PROJECT_ID || "dummy_project")
  .setKey(process.env.APPWRITE_API_KEY || "dummy_api_key")

export const appwriteStorage = new Storage(appwriteClient)
