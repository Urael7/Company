import { useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface Review {
  id: number;
  user: { id: number; name: string };
  reviewer?: { id: number; name: string };
  score?: number;
  notes?: string;
  attendance_score?: number;
  efficiency_score?: number;
  quality_score?: number;
  teamwork_score?: number;
  communication_score?: number;
  punctuality_score?: number;
  overall_score?: number;
  review_period?: string;
  review_date?: string;
  goals_achieved?: string[];
  areas_for_improvement?: string[];
  status?: string;
  created_at: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Stats {
  average_score: number;
  total_reviews: number;
  high_performers: number;
  needs_improvement: number;
  score_distribution: {
    excellent: number;
    good: number;
    average: number;
    poor: number;
  };
}

interface Trend {
  month: string;
  average_score: number;
  count: number;
}

interface Props {
  reviews: Review[];
  users: User[];
  stats: Stats;
  trends: Trend[];
  can: {
    manage: boolean;
    view_all: boolean;
  };
}

export default function Performance({ reviews, users, stats, trends, can }: Props) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Review | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>("");


  const { data, setData, post, put, reset } = useForm({
    user_id: "",
    reviewer_id: "",
    score: "",
    notes: "",
    attendance_score: "",
    efficiency_score: "",
    quality_score: "",
    teamwork_score: "",
    communication_score: "",
    punctuality_score: "",
    review_period: "",
    review_date: "",
    goals_achieved: [] as string[],
    areas_for_improvement: [] as string[],
    status: "pending",
  });

  // Chart data preparation
  const scoreDistributionData = [
    { name: "Excellent (90-100)", value: stats.score_distribution.excellent, color: "#10B981" },
    { name: "Good (70-89)", value: stats.score_distribution.good, color: "#3B82F6" },
    { name: "Average (50-69)", value: stats.score_distribution.average, color: "#F59E0B" },
    { name: "Poor (<50)", value: stats.score_distribution.poor, color: "#EF4444" },
  ];

  const performanceMetricsData = reviews.slice(0, 10).map(review => ({
    name: review.user.name,
    attendance: review.attendance_score || 0,
    efficiency: review.efficiency_score || 0,
    quality: review.quality_score || 0,
    teamwork: review.teamwork_score || 0,
    communication: review.communication_score || 0,
    punctuality: review.punctuality_score || 0,
  }));

  const trendData = trends.map(trend => ({
    month: trend.month,
    score: trend.average_score,
    reviews: trend.count,
  }));

  const COLORS = ["#10B981", "#3B82F6", "#F59E0B", "#EF4444"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      put(`/performance/${editing.id}`, {
        onSuccess: () => {
          reset();
          setEditing(null);
          setOpen(false);
        },
      });
    } else {
      post("/performance", {
        onSuccess: () => {
          reset();
          setOpen(false);
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this review?")) {
      router.delete(`/performance/${id}`);
    }
  };

  const handleEdit = (review: Review) => {
    setEditing(review);
    setData({
      user_id: review.user.id.toString(),
      reviewer_id: review.reviewer?.id?.toString() || "",
      score: review.score?.toString() || "",
      notes: review.notes || "",
      attendance_score: review.attendance_score?.toString() || "",
      efficiency_score: review.efficiency_score?.toString() || "",
      quality_score: review.quality_score?.toString() || "",
      teamwork_score: review.teamwork_score?.toString() || "",
      communication_score: review.communication_score?.toString() || "",
      punctuality_score: review.punctuality_score?.toString() || "",
      review_period: review.review_period || "",
      review_date: review.review_date || "",
      goals_achieved: review.goals_achieved || [],
      areas_for_improvement: review.areas_for_improvement || [],
      status: review.status || "pending",
    });
    setOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "needs_improvement": return "bg-red-100 text-red-800";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Performance", href: "/performance" }]}>
      <Head title="Performance Management" />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-6 shadow-md">
        <div className="flex items-center justify-between px-2 pt-2 mb-2">
          <div>
            <h2 className="text-xl font-bold">Performance Management</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {can.view_all ? "Comprehensive performance tracking and analytics" : "Your performance reviews and metrics"}
            </p>
          </div>
          {can.manage && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditing(null);
                    reset();
                  }}
                >
                  Add Performance Review
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    {editing ? "Edit Performance Review" : "Add New Performance Review"}
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Employee</label>
                      <select
                        value={data.user_id}
                        onChange={(e) => setData("user_id", e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Employee</option>
                        {users && users.length > 0 ? (
                          users.map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.name} ({user.email})
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>No users available (Count: {users?.length || 0})</option>
                        )}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Review Period</label>
                      <input
                        type="text"
                        value={data.review_period}
                        onChange={(e) => setData("review_period", e.target.value)}
                        placeholder="e.g., Q1 2024, Monthly Review"
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Review Date</label>
                      <input
                        type="date"
                        value={data.review_date}
                        onChange={(e) => setData("review_date", e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Status</label>
                      <select
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="needs_improvement">Needs Improvement</option>
                      </select>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold mb-4">Performance Metrics (0-100)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Attendance Score</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={data.attendance_score}
                          onChange={(e) => setData("attendance_score", e.target.value)}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Efficiency Score</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={data.efficiency_score}
                          onChange={(e) => setData("efficiency_score", e.target.value)}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Quality Score</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={data.quality_score}
                          onChange={(e) => setData("quality_score", e.target.value)}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Teamwork Score</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={data.teamwork_score}
                          onChange={(e) => setData("teamwork_score", e.target.value)}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Communication Score</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={data.communication_score}
                          onChange={(e) => setData("communication_score", e.target.value)}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Punctuality Score</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={data.punctuality_score}
                          onChange={(e) => setData("punctuality_score", e.target.value)}
                          className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Overall Notes</label>
                    <textarea
                      value={data.notes}
                      onChange={(e) => setData("notes", e.target.value)}
                      className="w-full border rounded-lg p-3 h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional comments and feedback..."
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setOpen(false)}
                      className="px-6"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="px-6">
                      {editing ? "Update Review" : "Create Review"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-background p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Score</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.average_score}%</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-background p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total_reviews}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-background p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">High Performers</p>
                <p className="text-3xl font-bold text-green-600">{stats.high_performers}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-background p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Need Improvement</p>
                <p className="text-3xl font-bold text-red-600">{stats.needs_improvement}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        {can.view_all && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Score Distribution Pie Chart */}
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {scoreDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Trends Line Chart */}
            <div className="bg-background p-6 rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-4">Performance Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={2} name="Average Score" />
                  <Line type="monotone" dataKey="reviews" stroke="#10B981" strokeWidth={2} name="Reviews Count" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Performance Metrics Radar Chart */}
        {can.view_all && performanceMetricsData.length > 0 && (
          <div className="bg-background p-6 rounded-xl shadow-sm border mb-8">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics Comparison</h3>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={performanceMetricsData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Attendance" dataKey="attendance" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                <Radar name="Efficiency" dataKey="efficiency" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                <Radar name="Quality" dataKey="quality" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                <Radar name="Teamwork" dataKey="teamwork" stroke="#ff7300" fill="#ff7300" fillOpacity={0.6} />
                <Radar name="Communication" dataKey="communication" stroke="#8dd1e1" fill="#8dd1e1" fillOpacity={0.6} />
                <Radar name="Punctuality" dataKey="punctuality" stroke="#d084d0" fill="#d084d0" fillOpacity={0.6} />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Performance Reviews List */}
        <div className="bg-background rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">Performance Reviews</h3>
          </div>
          <div className="p-6">
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {review.user.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Reviewed by: {review.reviewer?.name || "N/A"}
                        </p>
                        {review.review_period && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Period: {review.review_period}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        {review.status && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(review.status)}`}>
                            {review.status.replace('_', ' ').toUpperCase()}
                          </span>
                        )}
                        {review.overall_score && (
                          <span className={`text-2xl font-bold ${getScoreColor(review.overall_score)}`}>
                            {review.overall_score}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
                      {review.attendance_score && (
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Attendance</p>
                          <p className="text-lg font-semibold">{review.attendance_score}%</p>
                        </div>
                      )}
                      {review.efficiency_score && (
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Efficiency</p>
                          <p className="text-lg font-semibold">{review.efficiency_score}%</p>
                        </div>
                      )}
                      {review.quality_score && (
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Quality</p>
                          <p className="text-lg font-semibold">{review.quality_score}%</p>
                        </div>
                      )}
                      {review.teamwork_score && (
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Teamwork</p>
                          <p className="text-lg font-semibold">{review.teamwork_score}%</p>
                        </div>
                      )}
                      {review.communication_score && (
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Communication</p>
                          <p className="text-lg font-semibold">{review.communication_score}%</p>
                        </div>
                      )}
                      {review.punctuality_score && (
                        <div className="text-center">
                          <p className="text-sm text-gray-600 dark:text-gray-400">Punctuality</p>
                          <p className="text-lg font-semibold">{review.punctuality_score}%</p>
                        </div>
                      )}
                    </div>

                    {review.notes && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes:</p>
                        <p className="text-gray-600 dark:text-gray-400">{review.notes}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <p className="text-xs text-gray-500">
                        Created: {new Date(review.created_at).toLocaleDateString()}
                      </p>
                      {can.manage && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(review)}>
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(review.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No performance reviews</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {can.manage ? "Get started by creating a new performance review." : "No performance reviews available yet."}
                </p>
                {can.manage && (
                  <div className="mt-6">
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => setOpen(true)}
                    >
                      + Add Performance Review
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
