import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Audit Logs',
        // href: auditlogs().url,
        href: '/auditlogs',
    },
];

type LogItem = {
    id: number;
    user?: { id: string; name: string } | null;
    user_id?: string | null;
    action?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
    route_name?: string | null;
    http_method?: string | null;
    url?: string | null;
    target_type?: string | null;
    target_id?: string | null;
    status_code?: number | null;
    message?: string | null;
    occurred_at?: string | null;
};

export default function AuditLogs() {
    const { auth } = usePage().props as any;
    const [data, setData] = useState<LogItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [action, setAction] = useState('');
    const [userId, setUserId] = useState('');
    const timer = useRef<number | null>(null);

    const fetchLogs = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (action) params.set('action', action);
        if (userId) params.set('user_id', userId);
        const res = await fetch(`/api/auditlogs?${params.toString()}`, { headers: { 'Accept': 'application/json' } });
        const json = await res.json();
        setData(json.data.data ?? json.data);
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs();
        timer.current = window.setInterval(fetchLogs, 5000);
        return () => {
            if (timer.current) window.clearInterval(timer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const rows = useMemo(() => data, [data]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Audit Logs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <div className="flex items-center justify-between px-2 pt-2 mb-2">
                    <h2 className="text-xl font-bold">Auditlogs</h2>
                </div>
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <input className="rounded-md border bg-background px-3 py-2 text-sm" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetchLogs()} />
                    <input className="rounded-md border bg-background px-3 py-2 text-sm" placeholder="Action (login, post, delete)" value={action} onChange={(e) => setAction(e.target.value)} />
                    <input className="rounded-md border bg-background px-3 py-2 text-sm" placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
                    <button onClick={fetchLogs} className="rounded-md border px-3 py-2 text-sm hover:bg-accent">{loading ? 'Loading…' : 'Filter'}</button>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/40">
                                <tr>
                                    <th className="px-3 py-2 text-left">Time</th>
                                    <th className="px-3 py-2 text-left">User</th>
                                    <th className="px-3 py-2 text-left">Action</th>
                                    <th className="px-3 py-2 text-left">Method</th>
                                    <th className="px-3 py-2 text-left">Route</th>
                                    <th className="px-3 py-2 text-left">Status</th>
                                    <th className="px-3 py-2 text-left">IP</th>
                                    <th className="px-3 py-2 text-left">URL</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((log) => (
                                    <tr key={log.id} className="border-b last:border-0 hover:bg-muted/20 transition-colors">
                                        <td className="px-3 py-2">{log.occurred_at ?? ''}</td>
                                        <td className="px-3 py-2">{log.user?.name ?? log.user_id ?? 'Guest'}</td>
                                        <td className="px-3 py-2">{log.action}</td>
                                        <td className="px-3 py-2">{log.http_method}</td>
                                        <td className="px-3 py-2">{log.route_name}</td>
                                        <td className="px-3 py-2">{log.status_code}</td>
                                        <td className="px-3 py-2">{log.ip_address}</td>
                                        <td className="px-3 py-2 max-w-[320px] truncate" title={log.url ?? ''}>{log.url}</td>
                                    </tr>
                                ))}
                                {!rows.length && (
                                    <tr>
                                        <td className="px-3 py-6 text-center text-muted-foreground" colSpan={8}>No logs found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
