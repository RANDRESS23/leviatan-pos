import { z } from 'zod'

const companyStatusSchema = z.union([
  z.literal('ACTIVO'),
  z.literal('INACTIVO')
])
export type CompanyStatus = z.infer<typeof companyStatusSchema>

export const callTypes = new Map<CompanyStatus, string>([
  ['ACTIVO', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['INACTIVO', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/30 dark:border-destructive/80',]
])

const companySchema = z.object({
  id: z.string(),
  nombre: z.string(),
  emailContacto: z.string().nullable().optional(),
  telefono: z.string().nullable().optional(),
  moduloRestaurante: z.boolean(),
  estadoId: z.string(),
  estado: z.object({
    codigo: z.string(),
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Company = z.infer<typeof companySchema>

export const companyListSchema = z.array(companySchema)
