import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import PageHeader from "@/components/PageHeader";

interface Announcement {
  id: number;
  title: string;
  content: string;
  published_at?: string;
  created_at: string;
}

interface Props {
  announcements: Announcement[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Announcements", href: "/announcements" },
];

export default function Announcements({ announcements }: Props) {
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [open, setOpen] = useState(false);

  const { data, setData, post, put, reset } = useForm({
    title: "",
    content: "",
    published_at: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editing) {
      put(`/announcements/${editing.id}`, {
        onSuccess: () => {
          reset();
          setEditing(null);
          setOpen(false);
        },
      });
    } else {
      post("/announcements", {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      router.delete(`/announcements/${id}`);
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditing(announcement);
    setData({
      title: announcement.title,
      content: announcement.content,
      published_at: announcement.published_at || "",
    });
    setOpen(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Announcements" />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between px-2 pt-2 mb-2">
          <h2 className="text-xl font-bold">Announcements</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditing(null);
                  reset();
                }}
              >
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editing ? "Edit Announcement" : "Create Announcement"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    type="text"
                    value={data.title}
                    onChange={(e) => setData("title", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    value={data.content}
                    onChange={(e) => setData("content", e.target.value)}
                    className="w-full rounded-md border border-input bg-transparent p-3 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Publish Date</label>
                  <Input
                    type="date"
                    value={data.published_at || ""}
                    onChange={(e) => setData("published_at", e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editing ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 border rounded-xl shadow-sm bg-background hover:shadow-md transition-shadow"
              >
                <h2 className="font-semibold text-lg">{announcement.title}</h2>
                <p className="text-sm text-gray-600 mt-1 dark:text-[#A1A09A]">
                  {announcement.published_at
                    ? new Date(announcement.published_at).toLocaleDateString()
                    : "Unpublished"}
                </p>
                <p className="mt-2 text-gray-700 dark:text-[#EDEDEC]">
                  {announcement.content}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(announcement)}>
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(announcement.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 dark:text-[#A1A09A]">No announcements available.</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
