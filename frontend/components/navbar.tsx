"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Settings, LogOut, Home, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

// Utility function to get token from cookie
const getTokenFromCookie = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};

export function Navbar() {
  const router = useRouter();

  const [admin, setAdmin] = useState<Admin | null>(null);

  const handleLogout = () => {
    // Clear the token cookie by setting it to expire immediately
    document.cookie =
      "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";

    // Clear all localStorage items
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");

    // Clear any other potential storage
    sessionStorage.clear();

    // Redirect to login page
    window.location.href = "/";
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

      if (!token || !baseUrl) return;

      try {
        const res = await axios.get(`${baseUrl}/api/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdmin(res.data.admin);
      } catch (error) {
        console.error("Error fetching admin:", error);
        handleLogout();
      }
    };

    fetchAdmin();
  }, []);
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              EMS
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/employees">
                <Button variant="ghost" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Employees
                </Button>
              </Link>
              {admin?.role === "admin" && (
                <Link href="/users">
                  <Button variant="ghost" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    Users
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/employees/add">
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add Employee
              </Button>
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {admin?.name?.trim()
                        ? admin.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "AD"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {admin?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {admin?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground capitalize">
                      {admin?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
