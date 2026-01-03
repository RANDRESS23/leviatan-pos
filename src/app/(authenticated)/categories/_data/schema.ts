import { z } from 'zod'

const roleStatusSchema = z.union([
  z.literal('ACTIVO'),
  z.literal('INACTIVO')
])
export type RoleStatus = z.infer<typeof roleStatusSchema>

export const callTypes = new Map<RoleStatus, string>([
  ['ACTIVO', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['INACTIVO', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/30 dark:border-destructive/80',],
])

const categorySchema = z.object({
  id: z.string(),
  empresaId: z.string(),
  nombre: z.string(),
  activa: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Category = z.infer<typeof categorySchema>

export const categoryListSchema = z.array(categorySchema)
