// import { PrismaClient } from '@/generated/prisma/client'
// import { PrismaPg } from '@prisma/adapter-pg'
import { db } from '@/lib/prisma'

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL,
// })

// const prisma = new PrismaClient()

async function main() {
  const tiposDocumento = [
    'Registro civil',
    'Tarjeta de identidad',
    'Cédula de ciudadanía',
    'Tarjeta de extranjería',
    'Cédula de extranjería',
    'NIT',
    'Pasaporte',
    'Documento de identificación extranjero',
    'PEP',
    'NIT otro país',
    'NUIP',
    'PPT (Permiso Protección Temporal)',
  ]

  for (const tipo of tiposDocumento) {
    await db.tipoDocumento.upsert({
      where: { tipoDocumento: tipo },
      update: {},
      create: { tipoDocumento: tipo },
    })
  }

  const estados = [
    { codigo: 'ACTIVO' },
    { codigo: 'INACTIVO' },
  ]

  for (const estado of estados) {
    await db.estado.upsert({
      where: { codigo: estado.codigo },
      update: {},
      create: estado,
    })
  }

  const permisos = [
    { codigo: 'DASHBOARD', descripcion: 'Acceso al panel principal con sus estadísticas' },
    { codigo: 'USUARIOS', descripcion: 'Gestión de usuarios del sistema' },
    { codigo: 'CLIENTES', descripcion: 'Gestión de clientes' },
    { codigo: 'PROVEEDORES', descripcion: 'Gestión de proveedores' },
    { codigo: 'CATEGORIAS', descripcion: 'Gestión de categorías de productos' },
    { codigo: 'PRODUCTOS', descripcion: 'Gestión de productos' },
    { codigo: 'FACTURAS', descripcion: 'Gestión de facturación de productos' },
    { codigo: 'VENTAS_RAPIDAS', descripcion: 'Ventas rápidas de productos' },
    { codigo: 'CIERRE_CAJA', descripcion: 'Apertura y cierre de caja' },
    { codigo: 'COMPRAS', descripcion: 'Registro de compras' },
    { codigo: 'EMPLEADOS', descripcion: 'Gestión de empleados' },
    { codigo: 'NOMINA', descripcion: 'Gestión de nómina' },
    { codigo: 'EGRESOS', descripcion: 'Registro de egresos' },
    { codigo: 'IMPUESTOS', descripcion: 'Gestión de impuestos' },
    { codigo: 'ROLES_PERMISOS', descripcion: 'Administración de roles y permisos' },
  ]

  for (const permiso of permisos) {
    await db.permiso.upsert({
      where: { codigo: permiso.codigo },
      update: {
        descripcion: permiso.descripcion,
      },
      create: permiso,
    })
  }
}
main()
  .catch((e) => {
    console.error('❌ Error en el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })