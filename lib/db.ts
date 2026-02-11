import { PrismaClient } from '@prisma/client'
import { createClient as createTursoClient } from '@libsql/client'
import { Client as AppwriteClient, Databases } from 'node-appwrite'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const prisma = new PrismaClient()

export const turso = createTursoClient({
  url: process.env.TURSO_DB_URL as string,
  authToken: process.env.TURSO_DB_TOKEN as string,
})

const appwriteClient = new AppwriteClient()
  .setEndpoint(process.env.APPWRITE_ENDPOINT as string)
  .setProject(process.env.APPWRITE_PROJECT_ID as string)
  .setKey(process.env.APPWRITE_API_KEY as string)

export const appwriteDb = new Databases(appwriteClient)

export const supabase = createSupabaseClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
)
