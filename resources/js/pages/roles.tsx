import { ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// @ts-ignore
declare function route(name: string, params?: any): string;

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Roles',
    href: 'roles.index',
  },
];

type Role = {
  permissions_count: ReactNode;
  id: number;
  name: string;
  permissions: { id: number; name: string }[];
};

type Permissions = {
  id: number;
  name: string;
};

interface RolesProps {
  roles: Role[];
  permissions: Permissions[];
}

export default function roles({ roles, permissions }: RolesProps) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    permissions: [] as number[],
  });

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editRoleId, setEditRoleId] = useState<number | null>(null);

  const handleCheckboxChange = (id: number, checked: boolean) => {
    if (checked) {
      setData('permissions', [...data.permissions, id]);
    } else {
      setData(
        'permissions',
        data.permissions.filter((permId) => permId !== id)
      );
    }
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    router.delete(route('roles.destroy', id), {
      onSuccess: () => console.log("Role deleted successfully"),
      onError: (err) => console.error("Error deleting role:", err),
    });
  };

  const handleEdit = (role: Role) => {
    setEditRoleId(role.id);
    setData({
      name: role.name,
      permissions: role.permissions?.map(p => p.id) || [],
    });
    setOpenEdit(true);
  };

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('roles.store'), {
      onSuccess: () => {
        reset();
        setOpenCreate(false);
      },
      onError: (err) => console.error("Create error:", err),
    });
  };

  const submitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRoleId) return;

    router.put(route('roles.update', editRoleId), data, {
      onSuccess: () => {
        reset();
        setOpenEdit(false);
        setEditRoleId(null);
      },
      onError: (err) => console.error("Update error:", err),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Roles" />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between px-2 pt-2 mb-2">
          <h2 className="text-xl font-bold">Roles</h2>

          {/* Create Role Modal */}
          <Dialog open={openCreate} onOpenChange={setOpenCreate}>
            <DialogTrigger asChild>
              <Button>Create Role</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Role</DialogTitle>
              </DialogHeader>
              <form onSubmit={submitCreate} className="flex flex-col gap-4">
                <div>
                  <Label className="block text-sm font-medium mb-1">Role Name</Label>
                  <Input
                    placeholder="Enter role name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="w-full"
                  />
                  {errors.name && <span className="text-sm text-red-500 break-words">{errors.name}</span>}
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">Assign Permissions</Label>
                  <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {permissions.map((permission) => (
                      <Label key={permission.id} className="flex items-start gap-2">
                        <Checkbox
                          checked={data.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handleCheckboxChange(permission.id, checked as boolean)}
                          className="mt-0.5"
                        />
                        <span className="text-sm break-words whitespace-normal">{permission.name}</span>
                      </Label>
                    ))}
                  </div>
                  {errors.permissions && <span className="text-sm text-red-500 break-words">{errors.permissions}</span>}
                </div>

                <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Create Role'}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Roles List */}
        <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border p-4 bg-background">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Permissions</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {roles.map((role, index) => (
                  <tr key={role.id} className="border-b last:border-b-0 hover:bg-accent/30 transition-colors">
                    <td className="py-2 pr-4">{index + 1}</td>
                    <td className="py-2 pr-4">{role.name}</td>
                    <td className="py-2 pr-4">{role.permissions_count}</td>
                    <td className="py-2 pr-4 flex gap-2">
                      <Button size="sm" onClick={() => handleEdit(role)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(role.id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Role Modal */}
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
            </DialogHeader>
            <form onSubmit={submitEdit} className="flex flex-col gap-4">
              <div>
                <Label className="block text-sm font-medium mb-1">Role Name</Label>
                <Input
                  placeholder="Enter role name"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full"
                />
                {errors.name && <span className="text-sm text-red-500 break-words">{errors.name}</span>}
              </div>

              <div>
                <Label className="block text-sm font-medium mb-2">Assign Permissions</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {permissions.map((permission) => (
                    <Label key={permission.id} className="flex items-center gap-2">
                      <Checkbox
                        checked={data.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => handleCheckboxChange(permission.id, checked as boolean)}
                      />
                      <span className="text-sm break-words whitespace-normal">{permission.name}</span>
                    </Label>
                  ))}
                </div>
                {errors.permissions && <span className="text-sm text-red-500 break-words">{errors.permissions}</span>}
              </div>

              <Button type="submit" disabled={processing}>{processing ? 'Saving...' : 'Update Role'}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
