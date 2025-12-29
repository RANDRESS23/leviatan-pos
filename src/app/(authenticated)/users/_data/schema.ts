import { CreditCard, Shield, UserCheck, Users } from 'lucide-react'
import { z } from 'zod'

const userStatusSchema = z.union([
  z.literal('ACTIVO'),
  z.literal('INACTIVO')
])
export type UserStatus = z.infer<typeof userStatusSchema>

export const callTypes = new Map<UserStatus, string>([
  ['ACTIVO', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['INACTIVO', 'bg-destructive/10 dark:bg-destructive/50 text-destructive dark:text-primary border-destructive/30 dark:border-destructive/80',]
])

export const roles = [
  {
    label: 'CEO',
    value: 'CEO',
    icon: Shield,
  },
] as const

const userSchema = z.object({
  id: z.string(),
  authId: z.string(),
  empresaId: z.string(),
  rolId: z.string(),
  primer_nombre: z.string(),
  segundo_nombre: z.string().nullable().optional(),
  primer_apellido: z.string(),
  segundo_apellido: z.string().nullable().optional(),
  email: z.email(),
  telefono: z.string(),
  activo: z.boolean(),
  rol: z.object({
    nombre: z.string(),
  }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type User = z.infer<typeof userSchema>

export const userListSchema = z.array(userSchema)
