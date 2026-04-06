import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BadgeDollarSign, BarChart3, BookOpenCheck, BotMessageSquare, Boxes, LayoutGrid, Package, Store, Wallet, ShieldCheck, Users, Settings } from 'lucide-react';
import AppLogo from './app-logo';

// mainNavItems should be moved or redefined within AppSidebar to access props

export function AppSidebar() {
    const { tenant, auth } = usePage().props as any;
    const slug = tenant?.slug || '';
    const isAdmin = auth?.isAdmin || false;

    const adminNavItems: NavItem[] = [
        {
            title: 'Super Panel',
            url: '/admin/users',
            icon: ShieldCheck,
        },
        {
            title: 'Usuarios y Tiendas',
            url: '/admin/users',
            icon: Users,
        },
        {
            title: 'Todos los Productos',
            url: '/admin/productos',
            icon: Package,
            locked: false,
        },
        {
            title: 'Todos los Pedidos',
            url: '/admin/pedidos',
            icon: BadgeDollarSign,
            locked: false,
        },
        
    ];

    const tenantNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            url: `/${slug}/dashboard`,
            icon: LayoutGrid,
        },
        {
            title: 'Productos',
            url: `/${slug}/productos`,
            icon: Package,
        },
        {
            title: 'Inventarios',
            url: '#',
            icon: Boxes,
            locked: true,
        },
        {
            title: 'Ventas',
            url: '#',
            icon: BadgeDollarSign,
            locked: true,
        },
        {
            title: 'Cuadernos Admin',
            url: '#',
            icon: BookOpenCheck,
            locked: true,
        },
        {
            title: 'Sucursales',
            url: '#',
            icon: Store,
            locked: true,
        },
        {
            title: 'Reportes',
            url: '#',
            icon: BarChart3,
            locked: true,
        },
        {
            title: 'Cajas',
            url: '#',
            icon: Wallet,
            locked: true,
        },
        {
            title: 'WhatsApp Bot',
            url: '#',
            icon: BotMessageSquare,
            locked: true,
        },
    ];

    const mainNavItems = isAdmin ? adminNavItems : tenantNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isAdmin ? '/admin/users' : `/${slug}/dashboard`} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

        </Sidebar>
    );
}
