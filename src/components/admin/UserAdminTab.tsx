"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { logAdminAction } from "@/lib/actions/auditlog.actions";

async function fetchUsers() {
  const res = await fetch("/api/users");
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export function UserAdminTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(true);
    fetchUsers()
      .then(setUsers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) throw new Error("Failed to update role");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      toast(`User role updated to ${newRole}`);
      if (session?.user && (session.user as any).id) {
        await logAdminAction({
          userId: (session.user as any).id,
          action: "role_change",
          entity: "User",
          entityId: id,
          details: `role: ${newRole}`,
        });
      }
    } catch (e: any) {
      toast("Error updating user role", { description: e.message });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast("User deleted");
      if (session?.user && (session.user as any).id) {
        await logAdminAction({
          userId: (session.user as any).id,
          action: "delete",
          entity: "User",
          entityId: id,
        });
      }
    } catch (e: any) {
      toast("Error deleting user", { description: e.message });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Users</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <h3 className="text-2xl font-semibold border-b pb-2 mb-4">All Users</h3>
          {loading ? (
            <p>Loading users...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="divide-y divide-gray-700">
              {users.map((u) => (
                <li key={u.id} className="flex items-center justify-between py-2">
                  <span>{u.name || u.email} <span className="text-xs text-gray-400">({u.role})</span></span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={u.role === "admin" ? "secondary" : "outline"}
                      onClick={() => handleRoleChange(u.id, u.role === "admin" ? "user" : "admin")}
                    >
                      {u.role === "admin" ? "Demote to User" : "Promote to Admin"}
                    </Button>
                    <Button variant="destructive" onClick={() => handleDelete(u.id)} size="sm">Delete</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </CardContent>
    </Card>
  );
} 