import { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'react-hot-toast';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Type definitions
type Event = {
  id: number;
  title: string;
  description?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  image_url?: string;
};

type EventsPageProps = {
  events: Event[];
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Events', href: '/events' },
];

export default function Events() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const { events } = usePage<EventsPageProps>().props;
  const [localEvents, setLocalEvents] = useState<Event[]>(events);

  // Form state for posting/editing
  const { data, setData, post, put, delete: destroy, processing, errors, reset, transform } = useForm({
    id: '',
    title: '',
    location: '',
    start_date: '',
    end_date: '',
    description: '',
    image: null as File | null,
  });

  // Create event submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Normalize optional dates to null for Laravel 'nullable|date'
    transform((current) => ({
      ...current,
      start_date: current.start_date ? current.start_date : null,
      end_date: current.end_date ? current.end_date : null,
    }));
    post('/events', {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: (page) => {
        reset();
        setOpen(false);
        // get latest events from props after inertia response
        if ((page as any).props?.events) {
          setLocalEvents((page as any).props.events);
        }
        toast.success('Event created successfully!');
      },
      onError: () => {
        toast.error('Failed to create event.');
      },
    });
  };

  // Edit event submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    // Ensure dates are null when empty and spoof method to PUT
    transform((current) => ({
      ...current,
      _method: 'put',
      start_date: current.start_date ? current.start_date : null,
      end_date: current.end_date ? current.end_date : null,
    }));
    // Use POST with method spoofing so files are reliably sent as FormData
    post(`/events/${editingEvent.id}`, {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: (page) => {
        reset();
        setEditOpen(false);
        setEditingEvent(null);
        if ((page as any).props?.events) {
          setLocalEvents((page as any).props.events);
        }
        toast.success('Event updated successfully!');
      },
      onError: () => {
        toast.error('Failed to update event.');
      },
    });
  };

  // Delete event
  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      destroy(`/events/${id}`, {
        preserveScroll: true,
        onSuccess: (page) => {
          if ((page as any).props?.events) {
            setLocalEvents((page as any).props.events);
          } else {
            setLocalEvents((prev) => prev.filter((ev) => ev.id !== id));
          }
          toast.success('Event deleted successfully!');
        },
        onError: () => {
          toast.error('Failed to delete event.');
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Events" />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 shadow-md">
        {/* Header + Create Button */}
        <div className="flex items-center justify-between px-2 pt-2 mb-2">
          <h2 className="text-xl font-bold">Events</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                Post Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                  placeholder="Event Title"
                  value={data.title}
                  onChange={(e) => setData('title', e.target.value)}
                />
                {errors.title && <span className="text-red-500">{errors.title}</span>}

                <Input
                  placeholder="Location"
                  value={data.location}
                  onChange={(e) => setData('location', e.target.value)}
                />

                <label className="text-sm font-medium">Start Date</label>
                <Input
                  type="date"
                  value={data.start_date}
                  onChange={(e) => setData('start_date', e.target.value)}
                />

                <label className="text-sm font-medium">End Date</label>
                <Input
                  type="date"
                  value={data.end_date}
                  onChange={(e) => setData('end_date', e.target.value)}
                />

                <textarea
                  className="border rounded px-3 py-2"
                  placeholder="Description"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                />
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
                />
                <Button type="submit" disabled={processing}>
                  {processing ? 'Posting...' : 'Submit'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Grid of top 3 events */}
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {localEvents.slice(0, 3).map((event) => (
            <div
              key={event.id}
              className="relative aspect-video overflow-hidden rounded-xl border group cursor-pointer hover:shadow-md transition-shadow"
            >
              <img src={event.image_url || '/images/default.jpg'} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-white p-2">
                <h3 className="text-lg font-semibold">{event.title}</h3>
                <p>{event.location}</p>
                <p>{event.start_date} - {event.end_date}</p>
                <p className="text-sm mt-1">{event.description}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setEditingEvent(event);
                      setData({
                        id: String(event.id),
                        title: event.title,
                        location: event.location || '',
                        start_date: event.start_date || '',
                        end_date: event.end_date || '',
                        description: event.description || '',
                        image: null,
                      });
                      setEditOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(event.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Swiper slider for bottom events */}
        <div className="mt-6 relative min-h-[50vh] rounded-xl border overflow-hidden bg-background">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            className="w-full h-full"
          >
            {localEvents.map((event) => (
              <SwiperSlide key={event.id}>
                <div className="relative w-full h-[400px]">
                  <img src={event.image_url || '/images/default.jpg'} alt={event.title} className="w-full h-full object-cover rounded-xl" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-4">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p>{event.location} - {event.start_date} to {event.end_date}</p>
                    <p className="text-sm">{event.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingEvent(event);
                          setData({
                            id: String(event.id),
                            title: event.title,
                            location: event.location || '',
                            start_date: event.start_date || '',
                            end_date: event.end_date || '',
                            description: event.description || '',
                            image: null,
                          });
                          setEditOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(event.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
              <Input
                placeholder="Event Title"
                value={data.title}
                onChange={(e) => setData('title', e.target.value)}
              />
              <Input
                placeholder="Location"
                value={data.location}
                onChange={(e) => setData('location', e.target.value)}
              />
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={data.start_date}
                onChange={(e) => setData('start_date', e.target.value)}
              />
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={data.end_date}
                onChange={(e) => setData('end_date', e.target.value)}
              />
              <textarea
                className="border rounded px-3 py-2"
                placeholder="Description"
                value={data.description}
                onChange={(e) => setData('description', e.target.value)}
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setData('image', e.target.files ? e.target.files[0] : null)}
              />
              <Button type="submit" disabled={processing}>
                {processing ? 'Updating...' : 'Update'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
