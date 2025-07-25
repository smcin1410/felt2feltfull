"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function fetchAuditLogs() {
  const res = await fetch("/api/auditlog");
  if (!res.ok) throw new Error("Failed to fetch audit logs");
  return res.json();
}

export function AuditLogTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchAuditLogs()
      .then(setLogs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Log</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading audit logs...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul className="divide-y divide-gray-700">
            {logs.map((log) => (
              <li key={log.id} className="py-2">
                <span className="font-mono text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                <br />
                <span className="font-semibold">{log.action}</span> on <span>{log.entity}</span> (<span className="text-xs">{log.entityId}</span>)
                {log.details && <div className="text-xs text-gray-400">{log.details}</div>}
                <div className="text-xs text-gray-500">By user: {log.userId}</div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
} 