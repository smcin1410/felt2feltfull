"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BulkUploadForm } from "@/components/admin/BulkUploadForm";
import { bulkAddBlogPosts } from "@/lib/actions/blog.actions";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { logAdminAction } from "@/lib/actions/auditlog.actions";

const blogJsonFormat = `[
  {
    "title": "Welcome to Felt2Felt!",
    "content": "This is the first post on the new poker travel blog.",
    "excerpt": "This is the first post...",
    "imageKey": "vegas-night.jpeg",
    "tags": "Poker,Travel,Launch",
    "published": true,
    "authorId": null
  },
  {
    "title": "Best Poker Rooms in Europe",
    "content": "A guide to the top poker rooms across Europe.",
    "excerpt": "A guide to the top poker rooms...",
    "imageKey": "london.jpeg",
    "tags": "Europe,Poker,Guide",
    "published": false,
    "authorId": null
  }
]`;

async function fetchBlogPosts() {
  const res = await fetch("/api/blog");
  if (!res.ok) throw new Error("Failed to fetch blog posts");
  return res.json();
}

export function BlogAdminTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  useEffect(() => {
    setLoading(true);
    fetchBlogPosts()
      .then(setPosts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      const res = await fetch(`/api/blog/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setPosts((prev) => prev.filter((p) => p.id !== id));
      toast("Blog post deleted");
      if (session?.user && (session.user as any).id) {
        await logAdminAction({
          userId: (session.user as any).id,
          action: "delete",
          entity: "BlogPost",
          entityId: id,
        });
      }
    } catch (e: any) {
      toast("Error deleting blog post", { description: e.message });
    }
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setEditData({ title: p.title, content: p.content, excerpt: p.excerpt, imageKey: p.imageKey, tags: p.tags, published: p.published });
    setTimeout(() => editInputRef.current?.focus(), 100);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setEditData({ ...editData, [name]: type === "checkbox" ? checked : value });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to update");
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...editData } : p)));
      toast("Blog post updated");
      if (session?.user && (session.user as any).id) {
        await logAdminAction({
          userId: (session.user as any).id,
          action: "edit",
          entity: "BlogPost",
          entityId: id,
          details: JSON.stringify(editData),
        });
      }
      cancelEdit();
    } catch (e: any) {
      toast("Error updating blog post", { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Blog Posts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <h3 className="text-2xl font-semibold border-b pb-2 mb-4">Add Single Blog Post</h3>
          {/* Form for single entry will go here */}
          <p className="text-muted-foreground">Single entry form coming soon.</p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold border-b pb-2 mb-4">Bulk Upload Blog Posts</h3>
          <BulkUploadForm 
            uploadAction={bulkAddBlogPosts}
            requiredFormat={blogJsonFormat}
          />
        </section>

        <section>
          <h3 className="text-2xl font-semibold border-b pb-2 mb-4">All Blog Posts</h3>
          {loading ? (
            <p>Loading blog posts...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="divide-y divide-gray-700">
              {posts.map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2">
                  {editingId === p.id ? (
                    <>
                      <input
                        ref={editInputRef}
                        name="title"
                        value={editData.title}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                      />
                      <textarea
                        name="content"
                        value={editData.content}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                      />
                      <input
                        name="excerpt"
                        value={editData.excerpt || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                      />
                      <input
                        name="imageKey"
                        value={editData.imageKey || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                      />
                      <input
                        name="tags"
                        value={editData.tags || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                      />
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          name="published"
                          checked={!!editData.published}
                          onChange={handleEditChange}
                          disabled={saving}
                        />
                        Published
                      </label>
                      <Button size="sm" onClick={() => saveEdit(p.id)} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button size="sm" variant="secondary" onClick={cancelEdit} disabled={saving}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span>{p.title}</span>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(p)}>
                          Edit
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(p.id)} size="sm">Delete</Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </CardContent>
    </Card>
  );
} 