import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { announcements, auditlogs, dashboard ,events,performance,requests,roles,users} from '@/routes';
import { dashboard, users as usersRoute } from '@/routes';
import events from '@/routes/events';

import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Roles',
        href: 'roles',
        icon: LayoutGrid,
    },
     {
        title: 'Users',
        href: usersRoute().url,
        icon: LayoutGrid,
    },
    {
        title: 'Auditlogs',
        href: 'auditlogs',
        icon: LayoutGrid,
    },
    {
        title: 'Events',
        href: events.index().url,
        icon: LayoutGrid,
    },
    {
        title: 'Requests',
        href: 'requests',
        icon: LayoutGrid,
    },
    {
        title: 'Announcements',
        href: 'announcements',
        icon: LayoutGrid,
    },
    {
        title: 'performance',
        href: 'performance',
        icon: LayoutGrid,
    },
    
    
    
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
