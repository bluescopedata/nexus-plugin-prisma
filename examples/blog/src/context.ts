import { PrismaClient } from '@~internal/prisma-myschema/client'

const prisma = new PrismaClient()

export type Context = {
  prisma: PrismaClient
}

export const createContext = (): Context => ({
  prisma,
})
