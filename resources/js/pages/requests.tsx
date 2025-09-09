import { useForm, usePage, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Requests", href: "/requests" },
];

interface LeaveRequest {
  id: number;
  user_id: string;
  name: string;
  position: string;
  type: string;
  reason?: string;
  status: string;
  attachment?: string;
  comment?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Props {
  pendingRequests?: LeaveRequest[];
  allRequests?: LeaveRequest[];
  userRequests?: LeaveRequest[];
  isAdmin: boolean;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function Requests({ pendingRequests = [], allRequests = [], userRequests = [], isAdmin, user }: Props) {
  const { data, setData, post, reset } = useForm({
    name: "",
    position: "",
    type: "",
    reason: "",
    start_date: "",
    end_date: "",
    attachment: null as File | null,
  });

  const { data: updateData, setData: setUpdateData, put } = useForm({
    status: "",
    comment: "",
  });

  const [requestComments, setRequestComments] = useState<{ [key: number]: string }>({});

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    post("/requests", { onSuccess: () => reset() });
  };

  const handleApprove = (requestId: number) => {
    router.post(
      `/requests/${requestId}`,
      {
        _method: "put",
        status: "approved",
        comment: requestComments[requestId] || "",
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setRequestComments((prev) => ({ ...prev, [requestId]: "" }));
          router.reload({ only: ["pendingRequests", "allRequests", "userRequests"] });
        },
      }
    );
  };

  const handleReject = (requestId: number) => {
    router.post(
      `/requests/${requestId}`,
      {
        _method: "put",
        status: "rejected",
        comment: requestComments[requestId] || "",
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setRequestComments((prev) => ({ ...prev, [requestId]: "" }));
          router.reload({ only: ["pendingRequests", "allRequests", "userRequests"] });
        },
      }
    );
  };

  const handleDelete = (requestId: number) => {
    router.delete(`/requests/${requestId}`, {
      preserveScroll: true,
      onSuccess: () => {
        router.reload({ only: ["pendingRequests", "allRequests", "userRequests"] });
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Requests" />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between px-2 pt-2 mb-2">
          <div>
            <h2 className="text-xl font-bold">{isAdmin ? "Request Management" : "Submit Request"}</h2>
            {/* <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isAdmin ? "Review and manage employee requests" : "Submit your leave or service requests"}
            </p> */}
          </div>
          <div />
        </div>

        {isAdmin ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Requests</p>
                    <p className="text-3xl font-bold text-yellow-600">{pendingRequests.length}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
                    <p className="text-3xl font-bold text-blue-600">{allRequests.length}</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-background p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved Today</p>
                    <p className="text-3xl font-bold text-green-600">
                      {allRequests.filter(req => req.status === 'approved').length}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Pending Requests for Review</h2>
              </div>
              <div className="p-6">
                {pendingRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Employee</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Position</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Request Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Reason</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Dates</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Attachment</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pendingRequests.map((request) => (
                          <tr key={request.id} className="border-b hover:bg-accent/30 transition-colors">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{request.name}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{request.user?.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                {request.position}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                {request.type}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                              {request.reason || "No reason provided"}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {request.start_date && request.end_date ? (
                                <div>
                                  <p>From: {new Date(request.start_date).toLocaleDateString()}</p>
                                  <p>To: {new Date(request.end_date).toLocaleDateString()}</p>
                                </div>
                              ) : (
                                "N/A"
                              )}
                            </td>
                            <td className="py-4 px-4">
                              {request.attachment ? (
                                <a
                                  href={`/storage/${request.attachment}`}
                                  target="_blank"
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  View Document
                                </a>
                              ) : (
                                <span className="text-gray-400">No attachment</span>
                              )}
                            </td>
                            <td className="py-4 px-4 align-top">
                              <input
                                type="text"
                                value={requestComments[request.id] ?? ''}
                                onChange={(e) =>
                                  setRequestComments((prev) => ({ ...prev, [request.id]: e.target.value }))
                                }
                                placeholder="Add admin comment"
                                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleApprove(request.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white text-sm px-3 py-1"
                                >
                                  Approve
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleReject(request.id)}
                                  className="text-sm px-3 py-1"
                                >
                                  Reject
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No pending requests</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      All requests have been reviewed.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-background rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Reviewed Requests (History)</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Approved and rejected requests from all employees and interns.
                </p>
              </div>
              <div className="p-6">
                {allRequests.filter((r) => r.status !== 'pending').length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Employee</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Position</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Request Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Admin Comment</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allRequests
                          .filter((r) => r.status !== 'pending')
                          .map((request) => (
                            <tr key={request.id} className="border-b hover:bg-accent/30 transition-colors">
                              <td className="py-4 px-4">
                                <div>
                                  <p className="font-medium text-gray-900 dark:text-white">{request.name}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{request.user?.email}</p>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                  {request.position}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                  {request.type}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                                  {request.status}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                                {request.comment || '—'}
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                                {new Date(request.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reviewed requests yet</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Approved or rejected requests will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-background rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">Submit a Request</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Fill out the form below to submit your request for review.
                </p>
              </div>
              <div className="p-6">
                <form onSubmit={submit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Name</label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Position</label>
                      <select
                        value={data.position}
                        onChange={(e) => setData("position", e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Position</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="intern">Intern</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Request Type</label>
                    <select
                      value={data.type}
                      onChange={(e) => setData("type", e.target.value)}
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Request Type</option>
                      <option value="sick leave">Sick Leave</option>
                      <option value="service request">Service Request</option>
                      <option value="purchase request">Purchase Request</option>
                      <option value="parental leave">Parental Leave</option>
                      <option value="bereavement">Bereavement</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Reason (Optional)</label>
                    <textarea
                      placeholder="Provide additional details about your request"
                      value={data.reason}
                      onChange={(e) => setData("reason", e.target.value)}
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Start Date (Optional)</label>
                      <input
                        type="date"
                        value={data.start_date}
                        onChange={(e) => setData("start_date", e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
                      <input
                        type="date"
                        value={data.end_date}
                        onChange={(e) => setData("end_date", e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Attachment (Optional)</label>
                    <input
                      type="file"
                      onChange={(e) =>
                        setData("attachment", e.target.files ? e.target.files[0] : null)
                      }
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      accept=".jpg,.jpeg,.png,.pdf"
                    />
                    <p className="text-xs text-gray-500 mt-1">Accepted formats: JPG, PNG, PDF (Max 2MB)</p>
                  </div>

                  <Button
                    type="submit"
                  >
                    Submit Request
                  </Button>
                </form>
              </div>
            </div>

            <div className="bg-background rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold">My Requests</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Track the status of your submitted requests.
                </p>
              </div>
              <div className="p-6">
                {userRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Type</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Admin Comment</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">Submitted</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userRequests.map((request) => (
                          <tr key={request.id} className="border-b hover:bg-accent/30 transition-colors">
                            <td className="py-4 px-4">
                              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                {request.type}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                                {request.status}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-gray-600 dark:text-gray-400">
                              {request.comment || "No comment yet"}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                              {new Date(request.created_at).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No requests submitted</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Submit your first request using the form above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
