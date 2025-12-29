import {
  Construction,
  LayoutDashboard,
  Monitor,
  Bug,
  FileX,
  HelpCircle,
  Lock,
  Bell,
  Package,
  Palette,
  ServerOff,
  Settings,
  Wrench,
  UserCog,
  UserX,
  Users,
  ShieldCheck,
  Command,
  GalleryVerticalEnd,
  Building,
  Truck,
  FileText,
  ShoppingCart,
  BanknoteArrowDown,
  UserRoundCog,
  ShoppingBasket,
  Receipt,
  Wallet,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const APP_URLS = {
  DASHBOARD: "/dashboard",
  USUARIOS: "/users",
  CLIENTES: "/clients",
  PROVEEDORES: "/suppliers",
  CATEGORIAS: "/categories",
  PRODUCTOS: "/products",
  FACTURAS: "/invoices",
  VENTAS_RAPIDAS: "/quick-sales",
  CIERRE_CAJA: "/cash-close",
  COMPRAS: "/purchases",
  EMPLEADOS: "/employees",
  NOMINA: "/payroll",
  EGRESOS: "/expenses",
  IMPUESTOS: "/taxes",
  ROLES_PERMISOS: "/roles-and-permissions",
}

export const sidebarData: SidebarData = {
  user: {
    name: 'leviatanpos',
    email: 'leviatanpos@gmail.com',
    avatar: '',
  },
  teams: [
    {
      name: 'Leviatan POS',
      logo: Command,
      plan: 'Leviatan POS',
    }
  ],
  navGroupsSuperAdmin: [
    {
      title: 'General',
      items: [
        {
          title: 'Empresas',
          url: '/companies',
          icon: Building,
        },
        {
          title: 'Usuarios',
          url: APP_URLS.USUARIOS,
          icon: Users,
        }
      ],
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: APP_URLS.DASHBOARD,
          icon: LayoutDashboard,
          permissionCode: "DASHBOARD"
        },
        {
          title: 'Usuarios',
          url: APP_URLS.USUARIOS,
          icon: UserRoundCog,
          permissionCode: "USUARIOS"
        },
        {
          title: 'Clientes',
          url: APP_URLS.CLIENTES,
          icon: Users,
          permissionCode: "CLIENTES"
        },
        {
          title: 'Proveedores',
          url: APP_URLS.PROVEEDORES,
          icon: Truck,
          permissionCode: "PROVEEDORES"
        },
        {
          title: 'Categorías',
          url: APP_URLS.CATEGORIAS,
          icon: GalleryVerticalEnd,
          permissionCode: "CATEGORIAS"
        },
        {
          title: 'Productos',
          url: APP_URLS.PRODUCTOS,
          icon: Package,
          permissionCode: "PRODUCTOS"
        },
        {
          title: 'Facturas',
          url: APP_URLS.FACTURAS,
          icon: FileText,
          permissionCode: "FACTURAS"
        },
        {
          title: 'Ventas Rápidas',
          url: APP_URLS.VENTAS_RAPIDAS,
          icon: ShoppingCart,
          permissionCode: "VENTAS_RAPIDAS"
        },
        {
          title: 'Cierre de Caja',
          url: APP_URLS.CIERRE_CAJA,
          icon: BanknoteArrowDown,
          permissionCode: "CIERRE_CAJA"
        },
        {
          title: 'Compras',
          url: APP_URLS.COMPRAS,
          icon: ShoppingBasket,
          permissionCode: "COMPRAS"
        },
        {
          title: 'Empleados',
          url: APP_URLS.EMPLEADOS,
          icon: Users,
          permissionCode: "EMPLEADOS"
        },
        {
          title: 'Nómina',
          url: APP_URLS.NOMINA,
          icon: Receipt,
          permissionCode: "NOMINA"
        },
        {
          title: 'Egresos',
          url: APP_URLS.EGRESOS,
          icon: Wallet,
          permissionCode: "EGRESOS"
        }
      ],
    },
    {
      title: 'Pages',
      items: [
        {
          title: 'Auth',
          icon: ShieldCheck,
          items: [
            {
              title: 'Sign In',
              url: '/sign-in',
            },
            {
              title: 'Sign In (2 Col)',
              url: '/sign-in-2',
            },
            {
              title: 'Sign Up',
              url: '/sign-up',
            },
            {
              title: 'Forgot Password',
              url: '/forgot-password',
            },
            {
              title: 'OTP',
              url: '/otp',
            },
          ],
        },
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
    {
      title: 'Other',
      items: [
        {
          title: 'Settings',
          icon: Settings,
          items: [
            {
              title: 'Profile',
              url: '/settings',
              icon: UserCog,
            },
            {
              title: 'Account',
              url: '/settings/account',
              icon: Wrench,
            },
            {
              title: 'Appearance',
              url: '/settings/appearance',
              icon: Palette,
            },
            {
              title: 'Notifications',
              url: '/settings/notifications',
              icon: Bell,
            },
            {
              title: 'Display',
              url: '/settings/display',
              icon: Monitor,
            },
          ],
        },
        {
          title: 'Help Center',
          url: '/help-center',
          icon: HelpCircle,
        },
      ],
    },
  ],
}
