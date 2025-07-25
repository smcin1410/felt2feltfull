"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BulkUploadForm } from "@/components/admin/BulkUploadForm";
import { bulkAddDestinations } from "@/lib/actions/destination.actions";
import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { logAdminAction } from "@/lib/actions/auditlog.actions";
import DestinationCard, { Destination } from "../DestinationCard";

const destinationJsonFormat = `{
  "pokerDestinations": [
    {
      "casinoName": "Borgata Hotel Casino & Spa",
      "location": {
        "address": "1 Borgata Way",
        "city": "Atlantic City",
        "state": "NJ",
        "region": "Marina District"
      },
      "website": "https://borgata.mgmresorts.com/en/casino/poker.html",
      "pokerRoomInfo": {
        "overview": "The premier poker destination on the East Coast and the undisputed market leader in Atlantic City. The massive 52-table room is known for its professional environment and attracts a wide range of players, from casual enthusiasts to top-tier professionals. It is the epicenter of poker action in the region.",
        "numberOfTables": 52,
        "operatingHours": "24/7",
        "gamesOffered": [
          "No-Limit Hold'em (Stakes from $1/$2 up to $10/$25+)",
          "Pot-Limit Omaha (various stakes)",
          "Limit Hold'em",
          "Seven-Card Stud",
          "High-Stakes Mixed Games"
        ],
        "tournaments": {
          "schedule": "Hosts multiple tournaments daily with guaranteed prize pools.",
          "majorSeries": "Flagship destination for the World Poker Tour (WPT), hosting major events like the Borgata Poker Open."
        },
        "promotions": "Focuses more on game selection and tournament prestige than daily cash game promotions.",
        "amenities": [
          "Non-smoking environment",
          "Automatic card shufflers",
          "USB charging ports at tables",
          "Dedicated food, beverage, and massage services"
        ]
      },
      "travelerInformation": "This is the must-visit destination for any serious poker player visiting Atlantic City. It offers the best game selection, the highest stakes, and the most prestigious tournaments. If you are traveling for poker, this is your primary stop. The sheer volume of players ensures games are always running."
    },
    {
      "casinoName": "Harrah's Resort Atlantic City",
      "location": {
        "address": "777 Harrah's Blvd",
        "city": "Atlantic City",
        "state": "NJ",
        "region": "Marina District"
      },
      "website": "https://www.caesars.com/harrahs-ac",
      "pokerRoomInfo": {
        "overview": "The main alternative to Borgata in the Marina District, Harrah's has carved out a niche by targeting regular, low-to-mid-stakes cash game players. The 28-table room is quieter and more focused on value through its robust promotional structure.",
        "numberOfTables": 28,
        "operatingHours": "Closes in the early morning on weekdays; 24/7 on weekends.",
        "gamesOffered": [
          "No-Limit Hold'em ($1/$2, $2/$5)",
          "Scheduled Mixed Games (Omaha 8/b, Stud)"
        ],
        "tournaments": {
          "schedule": "None; cash game focused.",
          "majorSeries": "None."
        },
        "promotions": "Key differentiator. Features daily high-hand bonuses (e.g., hundreds of dollars every 20-30 minutes), a progressive Bad Beat Jackpot, and monthly rakeback rewards based on hours played.",
        "amenities": [
          "Secluded area off the main casino floor",
          "Leverages the Caesars Rewards loyalty program"
        ]
      }
    }
  ]
}`;

async function fetchDestinations() {
  const res = await fetch("/api/destinations");
  if (!res.ok) throw new Error("Failed to fetch destinations");
  return res.json();
}

export function DestinationAdminTab() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchDestinations()
      .then(setDestinations)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      const res = await fetch(`/api/destinations/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setDestinations((prev) => prev.filter((d) => d.id !== id));
      toast("Destination deleted");
      if (session?.user && (session.user as any).id) {
        await logAdminAction({
          userId: (session.user as any).id,
          action: "delete",
          entity: "Destination",
          entityId: id,
        });
      }
    } catch (e: any) {
      toast("Error deleting destination", { description: e.message });
    }
  };

  const startEdit = (d: any) => {
    setEditingId(d.id);
    setEditData({
      city: d.city,
      state: d.state,
      country: d.country,
      addressLine1: d.addressLine1,
      addressLine2: d.addressLine2,
      postalCode: d.postalCode,
      description: d.description,
      imageKey: d.imageKey,
      tags: d.tags,
    });
    setTimeout(() => editInputRef.current?.focus(), 100);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/destinations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });
      if (!res.ok) throw new Error("Failed to update");
      setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, ...editData } : d)));
      toast("Destination updated");
      if (session?.user && (session.user as any).id) {
        await logAdminAction({
          userId: (session.user as any).id,
          action: "edit",
          entity: "Destination",
          entityId: id,
          details: JSON.stringify(editData),
        });
      }
      cancelEdit();
    } catch (e: any) {
      toast("Error updating destination", { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Destinations</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <h3 className="text-2xl font-semibold border-b pb-2 mb-4">Add Single Destination</h3>
          {/* Form for single entry will go here */}
          <p className="text-muted-foreground">Single entry form coming soon.</p>
        </section>

        <section>
          <h3 className="text-2xl font-semibold border-b pb-2 mb-4">Bulk Upload Destinations</h3>
          <BulkUploadForm 
            uploadAction={bulkAddDestinations}
            requiredFormat={destinationJsonFormat}
          />
        </section>

        <section>
          <h3 className="text-2xl font-semibold border-b pb-2 mb-4">All Destinations</h3>
          {loading ? (
            <p>Loading destinations...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <table className="w-full text-sm text-left text-gray-300">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 px-2">Casino Name</th>
                  <th className="py-2 px-2">City</th>
                  <th className="py-2 px-2">State</th>
                  <th className="py-2 px-2">Country</th>
                  <th className="py-2 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {destinations.map((d: any) => (
                  <tr key={d.id} className="border-b border-gray-800 hover:bg-gray-800/40">
                    {editingId === d.id ? (
                      <>
                        <td className="py-2 px-2 font-semibold">
                          <input
                            name="casinoName"
                            value={editData.casinoName || ""}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1 bg-black text-white w-full"
                            disabled={saving}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            name="city"
                            value={editData.city || ""}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1 bg-black text-white w-full"
                            disabled={saving}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            name="state"
                            value={editData.state || ""}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1 bg-black text-white w-full"
                            disabled={saving}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <input
                            name="country"
                            value={editData.country || ""}
                            onChange={handleEditChange}
                            className="border rounded px-2 py-1 bg-black text-white w-full"
                            disabled={saving}
                          />
                        </td>
                        <td className="py-2 px-2">
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveEdit(d.id)} disabled={saving}>
                              {saving ? "Saving..." : "Save"}
                            </Button>
                            <Button size="sm" variant="secondary" onClick={cancelEdit} disabled={saving}>
                              Cancel
                            </Button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-2 font-semibold">{d.casinoName}</td>
                        <td className="py-2 px-2">{d.city}</td>
                        <td className="py-2 px-2">{d.state || ""}</td>
                        <td className="py-2 px-2">{d.country}</td>
                        <td className="py-2 px-2">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => startEdit(d)}>Edit</Button>
                            <Button variant="destructive" onClick={() => handleDelete(d.id)} size="sm">Delete</Button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </CardContent>
    </Card>
  );
} 