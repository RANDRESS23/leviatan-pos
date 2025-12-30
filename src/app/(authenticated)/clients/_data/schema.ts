import { z } from 'zod'

const clientStatusSchema = z.union([
  z.literal('ACTIVO'),
  z.literal('INACTIVO')
])
export type ClientStatus = z.infer<typeof clientStatusSchema>

export const callTypes = new Map<ClientStatus, string>([
  ['ACTIVO', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['INACTIVO', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/30 dark:border-destructive/80',]
])

const clientSchema = z.object({
  id: z.string(),
  empresaId: z.string(),
  tipoDocumentoId: z.string(),
  primer_nombre: z.string(),
  segundo_nombre: z.string().nullable().optional(),
  primer_apellido: z.string(),
  segundo_apellido: z.string().nullable().optional(),
  numeroDocumento: z.string(),
  direccion: z.string(),
  email: z.email(),
  telefono: z.string(),
  activo: z.boolean(),
  tipoDocumento: z.object({
    tipoDocumento: z.string(),
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Client = z.infer<typeof clientSchema>

export const clientListSchema = z.array(clientSchema)

const typeDocumentSchema = z.object({
  id: z.string(),
  tipoDocumento: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type TypeDocument = z.infer<typeof typeDocumentSchema>

export const typeDocumentListSchema = z.array(typeDocumentSchema)
