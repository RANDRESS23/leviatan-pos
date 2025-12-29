import { z } from 'zod'

const roleStatusSchema = z.union([
  z.literal('DASHBOARD'),
  z.literal('USUARIOS'),
  z.literal('CLIENTES'),
  z.literal('PROVEEDORES'),
  z.literal('CATEGORIAS'),
  z.literal('PRODUCTOS'),
  z.literal('FACTURAS'),
  z.literal('VENTAS_RAPIDAS'),
  z.literal('CIERRE_CAJA'),
  z.literal('COMPRAS'),
  z.literal('EMPLEADOS'),
  z.literal('NOMINA'),
  z.literal('EGRESOS'),
  z.literal('IMPUESTOS'),
  z.literal('ROLES_PERMISOS')
])
export type RoleStatus = z.infer<typeof roleStatusSchema>

export const callTypes = new Map<RoleStatus, string>([
  ['DASHBOARD', 'bg-teal-100/30 text-teal-900 dark:text-teal-200 border-teal-200'],
  ['USUARIOS', 'bg-blue-100/30 text-blue-900 dark:text-blue-200 border-blue-200'],
  ['CLIENTES', 'bg-purple-100/30 text-purple-900 dark:text-purple-200 border-purple-200'],
  ['PROVEEDORES', 'bg-green-100/30 text-green-900 dark:text-green-200 border-green-200'],
  ['CATEGORIAS', 'bg-orange-100/30 text-orange-900 dark:text-orange-200 border-orange-200'],
  ['PRODUCTOS', 'bg-amber-100/30 text-amber-900 dark:text-amber-200 border-amber-200'],
  ['FACTURAS', 'bg-rose-100/30 text-rose-900 dark:text-rose-200 border-rose-200'],
  ['VENTAS_RAPIDAS', 'bg-emerald-100/30 text-emerald-900 dark:text-emerald-200 border-emerald-200'],
  ['CIERRE_CAJA', 'bg-cyan-100/30 text-cyan-900 dark:text-cyan-200 border-cyan-200'],
  ['COMPRAS', 'bg-indigo-100/30 text-indigo-900 dark:text-indigo-200 border-indigo-200'],
  ['EMPLEADOS', 'bg-violet-100/30 text-violet-900 dark:text-violet-200 border-violet-200'],
  ['NOMINA', 'bg-fuchsia-100/30 text-fuchsia-900 dark:text-fuchsia-200 border-fuchsia-200'],
  ['EGRESOS', 'bg-pink-100/30 text-pink-900 dark:text-pink-200 border-pink-200'],
  ['IMPUESTOS', 'bg-slate-100/30 text-slate-900 dark:text-slate-200 border-slate-200'],
  ['ROLES_PERMISOS', 'bg-zinc-100/30 text-zinc-900 dark:text-zinc-200 border-zinc-200']
])

const roleSchema = z.object({
  id: z.string(),
  empresaId: z.string(),
  nombre: z.string(),
  descripcion: z.string().nullable().optional(),
  permisos: z.array(z.object({
    rolId: z.string(),
    permisoId: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    permiso: z.object({
      id: z.string(),
      codigo: z.string(),
      descripcion: z.string().nullable().optional(),
    })
  })),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Role = z.infer<typeof roleSchema>

export const roleListSchema = z.array(roleSchema)

const permissionSchema = z.object({
  id: z.string(),
  codigo: z.string(),
  descripcion: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})
export type Permission = z.infer<typeof permissionSchema>

export const permissionListSchema = z.array(permissionSchema)