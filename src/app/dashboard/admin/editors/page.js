"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function AdminEditorsPage() {
  const [editors, setEditors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/editors")
      .then((r) => r.json())
      .then((j) => { setEditors(j.editors || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function approve(editorId) {
    await fetch("/api/admin/approve-editor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editorId }),
    });
    setEditors((prev) =>
      prev.map((e) => e.id === editorId ? { ...e, verification_status: "approved" } : e)
    );
  }

  async function reject(editorId) {
    await fetch("/api/admin/reject-editor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ editorId }),
    });
    setEditors((prev) =>
      prev.map((e) => e.id === editorId ? { ...e, verification_status: "rejected" } : e)
    );
  }

  async function regenerateAll() {
    setRegenerating(true);
    setMessage("Fetching editor list...");
    const res = await fetch("/api/matching/regenerate-all", { method: "POST" });
    const { editorIds = [] } = await res.json();
    setMessage(`Regenerating embeddings for ${editorIds.length} editors...`);
    let done = 0;
    for (const editorId of editorIds) {
      await fetch("/api/matching/generate-editor-embedding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ editorId }),
      });
      done++;
      setMessage(`Regenerated ${done} / ${editorIds.length} editor embeddings...`);
    }
    setMessage(`✓ Done — ${editorIds.length} editors indexed.`);
    setRegenerating(false);
  }

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Editor approvals</h1>
          <p className="mt-1 text-sm text-slate-500">Approve editors and regenerate AI search embeddings.</p>
        </div>
        <Button onClick={regenerateAll} disabled={regenerating} variant="outline" size="sm">
          {regenerating ? "Indexing..." : "↻ Regenerate all embeddings"}
        </Button>
      </div>

      {message && (
        <p className="mt-3 rounded-xl bg-blue-50 px-4 py-2 text-sm text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {message}
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900">
            <tr>
              <th className="p-3 text-left">Editor</th>
              <th className="p-3 text-left">Headline</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="p-4 text-center text-slate-500">Loading...</td></tr>
            ) : editors.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-slate-500">No editors found.</td></tr>
            ) : (
              editors.map((e) => (
                <tr key={e.id} className="border-t border-slate-200 dark:border-slate-800">
                  <td className="p-3 font-medium">{e.profiles?.full_name || "—"}</td>
                  <td className="p-3 text-slate-500">{e.headline || "—"}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      e.verification_status === "approved"
                        ? "bg-green-100 text-green-700"
                        : e.verification_status === "rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {e.verification_status || "pending"}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => approve(e.id)}>Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => reject(e.id)}>Reject</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}