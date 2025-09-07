import { useState } from 'react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { users as usersRoute } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: usersRoute().url,
    },
];

type Role = { id: number; name: string };
type UserRow = { id: string; name: string; email: string; roles: string[]; role_ids?: number[]; employment_type?: 'employee' | 'intern' | 'manager'; created_at?: string };
type PageProps = { users: UserRow[]; roles: Role[] };

export default function Users() {
    const { props } = usePage<PageProps>();
    const [open, setOpen] = useState(false);
    const { data, setData, post, put, delete: destroy, processing, errors, reset, transform } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        employment_type: 'employee' as 'employee' | 'intern' | 'manager',
        role_ids: [] as number[],
    });
    const [editOpen, setEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserRow | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(usersRoute().url, {
            onSuccess: () => {
                reset();
                setOpen(false);
                toast.success('User created successfully');
            },
            onError: () => toast.error('Failed to create user'),
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 shadow-md">
                <div className="flex items-center justify-between px-2 pt-2 mb-2">
                    <h2 className="text-xl font-bold">Users</h2>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button>Create User</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Create New User</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <Input placeholder="Full name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                {errors.name && <span className="text-red-500">{errors.name}</span>}

                                <Input placeholder="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                {errors.email && <span className="text-red-500">{errors.email}</span>}

                                <Input placeholder="Password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                <Input placeholder="Confirm Password" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                                {errors.password && <span className="text-red-500">{errors.password}</span>}

                                <div>
                                    <label className="text-sm font-medium">Employment type</label>
                                    <select className="border rounded px-3 py-2 w-full" value={data.employment_type} onChange={(e) => setData('employment_type', e.target.value as any)}>
                                        <option value="employee">Employee</option>
                                        <option value="intern">Intern</option>
                                        <option value="manager">Manager</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Assign roles</label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {props.roles?.map((role) => (
                                            <label key={role.id} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={data.role_ids.includes(role.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) setData('role_ids', [...data.role_ids, role.id]);
                                                        else setData('role_ids', data.role_ids.filter((id) => id !== role.id));
                                                    }}
                                                />
                                                <span>{role.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.role_ids && <span className="text-red-500">{errors.role_ids}</span>}
                                </div>

                                <Button type="submit" disabled={processing}>{processing ? 'Creating...' : 'Create'}</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-4 bg-background">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="text-left border-b">
                                    <th className="py-2 pr-4">Name</th>
                                    <th className="py-2 pr-4">Email</th>
                                    <th className="py-2 pr-4">Roles</th>
                                    <th className="py-2 pr-4">Actions</th>
                                    <th className="py-2 pr-4">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.users?.map((u) => (
                                    <tr key={u.id} className="border-b last:border-b-0 hover:bg-accent/30 transition-colors">
                                        <td className="py-2 pr-4">{u.name}</td>
                                        <td className="py-2 pr-4">{u.email}</td>
                                        <td className="py-2 pr-4">{u.roles.join(', ')}</td>
                                        <td className="py-2 pr-4">
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        setEditingUser(u);
                                                        setData({
                                                            name: u.name,
                                                            email: u.email,
                                                            password: '',
                                                            password_confirmation: '',
                                                            employment_type: (u.employment_type ?? 'employee') as any,
                                                            role_ids: u.role_ids ?? [],
                                                        });
                                                        setEditOpen(true);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => {
                                                        if (!confirm('Delete this user?')) return;
                                                        // Use DELETE directly
                                                        destroy(usersRoute().url + '/' + u.id, {
                                                            onSuccess: () => toast.success('User deleted'),
                                                            onError: () => toast.error('Failed to delete user'),
                                                            preserveScroll: true,
                                                        });
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                        <td className="py-2 pr-4">{u.created_at ?? '-'}</td>
                                    </tr>
                                ))}
                                {(!props.users || props.users.length === 0) && (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-muted-foreground">No users yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Edit Dialog */}
                <Dialog open={editOpen} onOpenChange={setEditOpen}>
                    <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                        </DialogHeader>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (!editingUser) return;
                                // Use method spoofing for PUT with form data
                                transform((current) => ({ ...current, _method: 'put' }));
                                post(usersRoute().url + '/' + editingUser.id, {
                                    onSuccess: () => {
                                        reset();
                                        setEditOpen(false);
                                        setEditingUser(null);
                                        toast.success('User updated');
                                    },
                                    onError: () => toast.error('Failed to update user'),
                                    preserveScroll: true,
                                });
                            }}
                            className="flex flex-col gap-4"
                        >
                            <Input placeholder="Full name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            {errors.name && <span className="text-red-500">{errors.name}</span>}

                            <Input placeholder="Email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <span className="text-red-500">{errors.email}</span>}

                            <Input placeholder="New Password (optional)" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            <Input placeholder="Confirm Password" type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                            {errors.password && <span className="text-red-500">{errors.password}</span>}

                            <div>
                                <label className="text-sm font-medium">Employment type</label>
                                <select className="border rounded px-3 py-2 w-full" value={data.employment_type} onChange={(e) => setData('employment_type', e.target.value as any)}>
                                    <option value="employee">Employee</option>
                                    <option value="intern">Intern</option>
                                    <option value="manager">Manager</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium">Assign roles</label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    {props.roles?.map((role) => (
                                        <label key={role.id} className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={data.role_ids.includes(role.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) setData('role_ids', [...data.role_ids, role.id]);
                                                    else setData('role_ids', data.role_ids.filter((id) => id !== role.id));
                                                }}
                                            />
                                            <span>{role.name}</span>
                                        </label>
                                    ))}
                                </div>
                                {errors.role_ids && <span className="text-red-500">{errors.role_ids}</span>}
                            </div>

                            <Button type="submit" disabled={processing}>{processing ? 'Updating...' : 'Update'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
