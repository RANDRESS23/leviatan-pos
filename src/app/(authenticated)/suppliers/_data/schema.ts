import { z } from 'zod'

const supplierStatusSchema = z.union([
  z.literal('ACTIVO'),
  z.literal('INACTIVO'),
  z.literal('Natural'),
  z.literal('Empresa')
])
export type SupplierStatus = z.infer<typeof supplierStatusSchema>

export const callTypes = new Map<SupplierStatus, string>([
  ['ACTIVO', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['INACTIVO', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/30 dark:border-destructive/80',],
  ['Natural', 'bg-fuchsia-100/30 text-fuchsia-900 dark:text-fuchsia-200 border-fuchsia-200'],
  ['Empresa', 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200']
])

const supplierSchema = z.object({
  id: z.string(),
  empresaId: z.string(),
  nit: z.string().nullable().optional(),
  nombre: z.string(),
  telefono: z.string(),
  direccion: z.string(),
  tipoProveedor: z.string(),
  descripcion: z.string().nullable().optional(),
  activo: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Supplier = z.infer<typeof supplierSchema>

export const supplierListSchema = z.array(supplierSchema)
