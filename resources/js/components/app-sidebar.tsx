import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
// import { announcements, auditlogs, dashboard ,events,performance,requests,roles,users} from '@/routes';
import { dashboard, users as usersRoute } from '@/routes';
import events from '@/routes/events';

import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, Shield, Users, FileText, Calendar, Inbox, Megaphone, TrendingUp } from 'lucide-react';
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
        icon: Shield,
        permission: 'View_user_list',
    },
     {
        title: 'Users',
        href: usersRoute().url,
        icon: Users,
        permission: 'View_user_list',
    },
    {
        title: 'Auditlogs',
        href: 'auditlogs',
        icon: FileText,
        permission: 'View_auditlog_list',
    },
    {
        title: 'Events',
        href: events.index().url,
        icon: Calendar,
        permission: 'View_event_list',
    },
    {
        title: 'Requests',
        href: 'requests',
        icon: Inbox,
    },
    {
        title: 'Announcements',
        href: 'announcements',
        icon: Megaphone,
        permission: 'View_Announcement_list',
    },
    {
        title: 'Performance',
        href: 'performance',
        icon: TrendingUp,
    },
    
    
    
];

const footerNavItems: NavItem[] = [
   
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard().url} prefetch>
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
