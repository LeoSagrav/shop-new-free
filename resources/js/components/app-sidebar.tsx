import { NavMain } from '@/components/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Package } from 'lucide-react';
import AppLogo from './app-logo';

// mainNavItems should be moved or redefined within AppSidebar to access props

export function AppSidebar() {
    const { tenant } = usePage().props as any;
    const slug = tenant?.slug || '';

    const mainNavItems: NavItem[] = [
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
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={`/${slug}/dashboard`} prefetch>
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
