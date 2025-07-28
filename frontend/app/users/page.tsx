"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Shield, Eye, EyeOff } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { ConfirmDialog } from "@/components/ConfirmDialog";

// Move PasswordInput outside to prevent re-creation on every render
const PasswordInput = ({ 
  value, 
  onChange, 
  placeholder = "Password", 
  showPassword, 
  onToggleVisibility,
  disabled = false
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  disabled?: boolean;
}) => (
  <div className="relative">
    <Input
      type={showPassword ? "text" : "password"}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`pr-10 ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      onClick={onToggleVisibility}
      disabled={disabled}
    >
      {showPassword ? (
        <EyeOff className={`h-4 w-4 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
      ) : (
        <Eye className={`h-4 w-4 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
      )}
    </Button>
  </div>
);

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  isRoot: boolean;
  password?: string; // Added for editing
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "hr",
    password: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editUserData, setEditUserData] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null); // Store current logged-in user info
  
  // Password visibility states
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }
      const res = await axios.get<User[]>(`${baseUrl}/api/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const res = await axios.get(`${baseUrl}/api/admin/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data.admin);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.name.toLowerCase().includes(term) ||
            u.email.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, users]);

  const handleAddUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add users");
        router.push("/");
        return;
      }

      await axios.post(`${baseUrl}/api/admin/register`, newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAddDialogOpen(false);
      setNewUser({ name: "", email: "", role: "hr", password: "" });
      setShowNewPassword(false); // Reset password visibility
      fetchUsers();
    } catch (err) {
      console.error("Add user failed:", err);
      alert("Failed to add user");
    }
  };

  const handleUpdateUser = async () => {
    if (!editUserData) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to edit users");
        router.push("/");
        return;
      }

      // Only include password in update if it's not empty
      const updateData: any = {
        name: editUserData.name,
        email: editUserData.email,
        role: editUserData.role,
      };

      if (editUserData.password && editUserData.password.trim() !== "") {
        updateData.password = editUserData.password;
      }

      await axios.patch(
        `${baseUrl}/api/admin/${editUserData._id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsEditDialogOpen(false);
      setEditUserData(null);
      setShowEditPassword(false); // Reset password visibility
      fetchUsers();
    } catch (err: any) {
      console.error("Update user failed:", err.response?.data || err.message);
      alert("Failed to update user");
    }
  };

  const handleDeleteUser = async (_id: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to delete users");
        router.push("/");
        return;
      }

      await axios.delete(`${baseUrl}/api/admin/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      console.error("Delete user failed:", err);
      alert("Failed to delete user");
    }
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: "bg-red-100 text-red-800",
      hr: "bg-blue-100 text-blue-800",
    };
    return styles[role] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              User Management
            </h1>
            <p className="text-gray-600 mt-2">Manage admin and HR users</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>Create a new user account</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={newUser.role}
                    onValueChange={(value) =>
                      setNewUser({ ...newUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Password</Label>
                  <PasswordInput
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    showPassword={showNewPassword}
                    onToggleVisibility={() => setShowNewPassword(!showNewPassword)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setShowNewPassword(false);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Add</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
            <CardDescription>Filter by name or email</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {user._id === "root" && (
                            <Shield className="h-4 w-4 text-red-600" />
                          )}
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadge(user.role)}>
                          {user.role.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (user.isRoot)
                                return alert("Cannot edit root admin.");
                              setEditUserData({ ...user, password: "" }); // Initialize with empty password
                              setIsEditDialogOpen(true);
                            }}
                            disabled={user.isRoot}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <ConfirmDialog
                            triggerLabel={
                              <Trash2 className="h-4 w-4 text-red-600" />
                            }
                            disabled={user.isRoot}
                            title="Delete user?"
                            description="This action cannot be undone."
                            actionLabel="Delete"
                            variant="outline"
                            onConfirm={() => handleDeleteUser(user._id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>Modify user details</DialogDescription>
            </DialogHeader>
            {editUserData && (
              <div className="space-y-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={editUserData.name}
                    onChange={(e) =>
                      setEditUserData({ ...editUserData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={editUserData.email}
                    onChange={(e) =>
                      setEditUserData({ ...editUserData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Password</Label>
                  <p className="text-sm text-gray-500 mb-2">
                    {currentUser?.isRoot 
                      ? "Leave empty to keep current password" 
                      : "Only root admin can change passwords"}
                  </p>
                  <PasswordInput
                    value={editUserData.password || ""}
                    onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                    placeholder={currentUser?.isRoot ? "New password (optional)" : "Password change not allowed"}
                    showPassword={showEditPassword}
                    onToggleVisibility={() => setShowEditPassword(!showEditPassword)}
                    disabled={!currentUser?.isRoot}
                  />
                </div>
                <div>
                  <Label>Role</Label>
                  <Select
                    value={editUserData.role}
                    onValueChange={(value) =>
                      setEditUserData({ ...editUserData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setShowEditPassword(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateUser}>Update</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}