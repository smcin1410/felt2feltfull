"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BulkUploadForm } from "@/components/admin/BulkUploadForm";
import { bulkAddTournaments } from "@/lib/actions/tournament.actions";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { logAdminAction } from "@/lib/actions/auditlog.actions";

const tournamentJsonFormat = `[
  {
    "name": "World Series of Poker 2025",
    "location": "Las Vegas, NV",
    "venue": "Rio All-Suite Hotel & Casino",
    "addressLine1": "3700 W Flamingo Rd",
    "addressLine2": null,
    "city": "Las Vegas",
    "state": "NV",
    "postalCode": "89103",
    "country": "USA",
    "startDate": "2025-05-28T12:00:00Z",
    "endDate": "2025-07-17T23:00:00Z",
    "buyIn": 10000,
    "prizePool": 8000000,
    "description": "The world’s largest poker tournament series.",
    "link": "https://www.wsop.com/2025/",
    "events": [
      {
        "name": "WSOP Event #1: Casino Employees No-Limit Hold'em",
        "startDate": "2025-05-28T12:00:00Z",
        "endDate": "2025-05-29T23:00:00Z",
        "buyIn": 500,
        "prizePool": 100000,
        "description": "Open to casino employees only."
      },
      {
        "name": "WSOP Event #2: $100,000 High Roller",
        "startDate": "2025-05-29T14:00:00Z",
        "endDate": "2025-05-31T23:00:00Z",
        "buyIn": 100000,
        "prizePool": 5000000,
        "description": "High-stakes event for elite players."
      }
    ]
  },
  {
    "name": "The Weekend Deepstack",
    "location": "Atlantic City, NJ",
    "venue": "Coastal Resort",
    "addressLine1": "456 Boardwalk",
    "addressLine2": null,
    "city": "Atlantic City",
    "state": "NJ",
    "postalCode": "08401",
    "country": "USA",
    "startDate": "2025-07-25T18:00:00Z",
    "endDate": "2025-07-27T22:00:00Z",
    "buyIn": 300,
    "prizePool": 75000,
    "description": null,
    "link": null,
    "events": []
  }
]`;

async function fetchTournaments() {
  const res = await fetch("/api/tournaments");
  if (!res.ok) throw new Error("Failed to fetch tournaments");
  return res.json();
}

export function TournamentAdminTab() {
  const [tournaments, setTournaments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchTournaments()
      .then(setTournaments)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this tournament?")) return;
    try {
      const res = await fetch(`/api/tournaments/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setTournaments((prev) => prev.filter((t) => t.id !== id));
      toast("Tournament deleted");
      if (session?.user && (session.user as any).id) {
        await logAdminAction({
          userId: (session.user as any).id,
          action: "delete",
          entity: "Tournament",
          entityId: id,
        });
      }
    } catch (e: any) {
      toast("Error deleting tournament", { description: e.message });
    }
  };

  const startEdit = (t: any) => {
    setEditingId(t.id);
    setEditData({
      name: t.name,
      location: t.location,
      venue: t.venue,
      addressLine1: t.addressLine1,
      addressLine2: t.addressLine2,
      city: t.city,
      state: t.state,
      postalCode: t.postalCode,
      country: t.country,
      imageKey: t.imageKey || ""
    });
    setTimeout(() => editInputRef.current?.focus(), 100);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/tournaments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to update");
      setTournaments((prev) => prev.map((t) => (t.id === id ? { ...t, ...editData } : t)));
      toast("Tournament updated");
      if (session?.user && (session.user as any).id) {
        await logAdminAction({
          userId: (session.user as any).id,
          action: "edit",
          entity: "Tournament",
          entityId: id,
          details: JSON.stringify(editData),
        });
      }
      cancelEdit();
    } catch (e: any) {
      toast("Error updating tournament", { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Tournaments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <h3 className="text-2xl font-semibold border-b pb-2 mb-4">Add Single Tournament</h3>
          {/* Form for single entry will go here */}
          <p className="text-muted-foreground">Single entry form coming soon.</p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold border-b pb-2 mb-4">Bulk Upload Tournaments</h3>
          <BulkUploadForm 
            uploadAction={bulkAddTournaments}
            requiredFormat={tournamentJsonFormat}
          />
        </section>

        <section>
          <h3 className="text-2xl font-semibold border-b pb-2 mb-4">All Tournaments</h3>
          {loading ? (
            <p>Loading tournaments...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="divide-y divide-gray-700">
              {tournaments.map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2">
                  {editingId === t.id ? (
                    <>
                      <input
                        ref={editInputRef}
                        name="name"
                        value={editData.name}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                      />
                      <input
                        name="location"
                        value={editData.location}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                      />
                      <input
                        name="venue"
                        value={editData.venue}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                      />
                      <input
                        name="addressLine1"
                        value={editData.addressLine1 || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                        placeholder="Address Line 1"
                      />
                      <input
                        name="addressLine2"
                        value={editData.addressLine2 || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                        placeholder="Address Line 2"
                      />
                      <input
                        name="city"
                        value={editData.city || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                        placeholder="City"
                      />
                      <input
                        name="state"
                        value={editData.state || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                        placeholder="State"
                      />
                      <input
                        name="postalCode"
                        value={editData.postalCode || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                        placeholder="Postal Code"
                      />
                      <input
                        name="country"
                        value={editData.country || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                        placeholder="Country"
                      />
                      <input
                        name="imageKey"
                        value={editData.imageKey || ""}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 mr-2 bg-black text-white"
                        disabled={saving}
                        placeholder="Image Key (e.g. vegas-strip-excalibur.jpeg)"
                      />
                      <Button size="sm" onClick={() => saveEdit(t.id)} disabled={saving}>
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button size="sm" variant="secondary" onClick={cancelEdit} disabled={saving}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span>{t.name} ({t.location})</span>
                      <span className="ml-2 text-xs text-gray-400">{[t.addressLine1, t.addressLine2, t.city, t.state, t.postalCode, t.country].filter(Boolean).join(", ")}</span>
                      {t.imageKey && (
                        <span className="ml-2 text-xs text-pink-400">Image: {t.imageKey}</span>
                      )}
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => startEdit(t)}>
                          Edit
                        </Button>
                        <Button variant="destructive" onClick={() => handleDelete(t.id)} size="sm">Delete</Button>
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