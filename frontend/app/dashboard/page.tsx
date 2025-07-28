"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserPlus,
  Settings,
  BarChart3,
  Clock,
  UserCheck,
  HandHelping,
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import axios from "axios";
import { Progress } from "@/components/ui/progress";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface Employee {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  department: string;
  employmentStatus: string;
  joiningDate: string;
  isActive: boolean;
  createdAt: string;
}

interface DashboardStats {
  totalEmployees: number;
  newHires: number;
  departments: number;
}

export default function Dashboard() {
  const [admin, setAdmin] = useState<Admin>();
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    newHires: 0,
    departments: 0,
  });
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const fetchEmployeeStats = async () => {
    const token = localStorage.getItem("token");
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!token || !baseUrl) return;

    try {
      const res = await axios.get(`${baseUrl}/api/employee`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // API returns either { employees: [...] } or [...] directly
      const employees: Employee[] = res.data.employees || res.data;

      // Total number of employees regardless of isActive or status
      const totalEmployees = employees.length;

      // New hires this month (based on joiningDate only)
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const newHires = employees.filter((emp) => {
        if (!emp.joiningDate) return false;
        const joiningDate = new Date(emp.joiningDate);
        return (
          joiningDate.getMonth() === currentMonth &&
          joiningDate.getFullYear() === currentYear
        );
      }).length;

      // Unique departments (ignoring empty or null)
      const uniqueDepartments = [
        ...new Set(employees.map((emp) => emp.department).filter(Boolean)),
      ].length;

      setStats({
        totalEmployees,
        newHires,
        departments: uniqueDepartments,
      });

      // Optionally, update recent employees here if needed
    } catch (error) {
      console.error("Failed to fetch employee stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!token || !baseUrl) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${baseUrl}/api/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAdmin(res.data.admin);
      } catch (error) {
        console.error("Admin fetching failed:", error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
    fetchEmployeeStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <p className="mb-2 text-sm text-muted-foreground">
          Loading dashboard...
        </p>
        <Progress value={60} className="w-full max-w-sm" />
      </div>
    );
  }

  const dashboardStats = [
    {
      title: "Total Employees",
      value: statsLoading ? "..." : stats.totalEmployees.toString(),
      description: "Active employees",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "New Hires",
      value: statsLoading ? "..." : stats.newHires.toString(),
      description: "This month",
      icon: UserPlus,
      color: "text-green-600",
    },
    {
      title: "Departments",
      value: statsLoading ? "..." : stats.departments.toString(),
      description: "Active departments",
      icon: BarChart3,
      color: "text-purple-600",
    },
  ];

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back, {admin?.name}</p>
        </div>

        {statsLoading && (
          <div className="mb-4">
            <Progress value={40} className="w-full max-w-sm" />
            <p className="text-sm text-muted-foreground mt-1">
              Loading statistics...
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/employees/add">
                <Button className="w-full justify-start" variant="outline">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add New Employee
                </Button>
              </Link>
              <Link href="/employees">
                <Button className="w-full justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  View All Employees
                </Button>
              </Link>
              {admin?.role !== "hr" && (
                <Link href="/users">
                  <Button className="w-full justify-start" variant="outline">
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Users
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest employee updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statsLoading ? (
                  <div className="text-sm text-muted-foreground">
                    Loading recent activity...
                  </div>
                ) : recentEmployees.length > 0 ? (
                  recentEmployees.map((employee) => (
                    <div
                      key={employee._id}
                      className="flex items-center space-x-4"
                    >
                      <UserCheck className="h-4 w-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {employee.firstName} {employee.lastName} joined
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatTimeAgo(employee.createdAt)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No recent activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
