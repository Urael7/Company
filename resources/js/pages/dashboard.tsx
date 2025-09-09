import AppLayout from '@/layouts/app-layout';
import { dashboard, users } from '@/routes';
import announcements from '@/routes/announcements';
import events from '@/routes/events';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Calendar, FileText, Shield, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({ stats = {}, can = {}, isAdmin = false }: any) {
    const page = usePage();
    const name = (page.props as any).auth?.user?.name ?? '';
    const cards = [
        can.manage_users && {
            title: 'Users',
            value: stats.users,
            href: users().url,
            icon: Users,
        },
        can.view_events && {
            title: 'Events',
            value: stats.events,
            href: events.index().url,
            icon: Calendar,
        },
        can.view_announcements && {
            title: 'Announcements',
            value: stats.announcements,
            href: announcements.index().url,
            icon: FileText,
        },
        can.view_audit && {
            title: 'Audit Logs',
            value: (stats.recent_logs ?? []).length,
            href: '/auditlogs',
            icon: Shield,
        },
    ].filter(Boolean) as any[];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="rounded-xl border border-sidebar-border/70 p-6 dark:border-sidebar-border">
                    <h2 className="text-lg font-semibold">Welcome back, {name}!</h2>
                    <p className="text-sm text-muted-foreground">Here's what's happening across your workspace.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card) => (
                        <Link key={card.title} href={card.href} className="group rounded-xl border border-sidebar-border/70 p-6 h-32 transition-transform hover:scale-[1.01] hover:shadow-md dark:border-sidebar-border">
                            <div className="flex items-center justify-between h-full">
                                <div>
                                    <div className="text-base text-muted-foreground">{card.title}</div>
                                    <div className="text-3xl font-semibold">{card.value ?? '-'}</div>
                                </div>
                                <card.icon className="size-8 opacity-60 transition-opacity group-hover:opacity-100" />
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                        <div className="mb-2 text-sm font-medium">Pending Leaves</div>
                        <div className="text-3xl font-semibold">{stats.leave_pending ?? '-'}</div>
                    </div>

                    {isAdmin && (
                        <div className="rounded-xl border border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <div className="mb-2 text-sm font-medium">Recent Activity</div>
                            <div className="space-y-2">
                                {(stats.recent_logs ?? []).map((l: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm dark:border-sidebar-border">
                                        <span className="truncate">{l.action}</span>
                                        <span className="text-muted-foreground">{l.occurred_at ?? ''}</span>
                                    </div>
                                ))}
                                {!(stats.recent_logs ?? []).length && (
                                    <div className="text-sm text-muted-foreground">No recent logs.</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
