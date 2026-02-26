"use client";

import { useState, useEffect, useCallback } from "react";

const API = "/api/checkgpa";

type Folder = { id: string; name: string; sort_order: number; created_at: string };
type Module = { id: string; folder_id: string; name: string; grade: string; credits: number; created_at: string };

function fetchOpts(): RequestInit {
  return { credentials: "include" as RequestCredentials };
}

function computeGpa(modules: { grade: string; credits: number }[]): number | null {
  const GRADE_POINTS: Record<string, number> = {
    DIST: 4.0, A: 4.0, "B+": 3.5, B: 3.0, "C+": 2.5, C: 2.0, "D+": 1.5, D: 1.0, "D-": 0.5, P: 0.5, F: 0, ABS: 0,
  };
  if (modules.length === 0) return null;
  let totalPoints = 0, totalCredits = 0;
  for (const m of modules) {
    const pt = GRADE_POINTS[m.grade.trim().toUpperCase()] ?? 0;
    totalPoints += pt * Number(m.credits);
    totalCredits += Number(m.credits);
  }
  if (totalCredits === 0) return null;
  const raw = totalPoints / totalCredits;
  return Math.round(raw * 100) / 100;
}

export function CheckGpaClient() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [secret, setSecret] = useState("");
  const [secretError, setSecretError] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [newModule, setNewModule] = useState({ name: "", grade: "A", credits: "4" });
  const [loading, setLoading] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", grade: "A", credits: "4" });

  const runSetupThenFetchFolders = useCallback(async () => {
    await fetch(`${API}/setup`, fetchOpts());
    const listRes = await fetch(`${API}/folders`, fetchOpts());
    if (listRes.ok) setFolders(await listRes.json());
  }, []);

  const checkAuth = useCallback(async (urlSecret?: string) => {
    try {
      let r = await fetch(`${API}/folders`, fetchOpts());
      if (r.status === 500) {
        await runSetupThenFetchFolders();
        setAuthed(true);
        return true;
      }
      if (r.ok) {
        const data = await r.json();
        setFolders(Array.isArray(data) ? data : []);
        setAuthed(true);
        return true;
      }
      if (r.status === 401 && urlSecret) {
        const authRes = await fetch(`${API}/auth`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: urlSecret }),
          ...fetchOpts(),
        });
        if (authRes.ok) {
          setAuthed(true);
          await runSetupThenFetchFolders();
          return true;
        }
      }
      setAuthed(false);
      return false;
    } catch {
      setAuthed(false);
      return false;
    }
  }, [runSetupThenFetchFolders]);

  useEffect(() => {
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
    const k = params?.get("k");
    if (k) {
      setSecret(k);
      checkAuth(k).then(() => {
        if (typeof window !== "undefined") window.history.replaceState({}, "", "/checkgpa");
      });
    } else {
      checkAuth();
    }
  }, [checkAuth]);

  const submitSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecretError("");
    const res = await fetch(`${API}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
      ...fetchOpts(),
    });
    if (!res.ok) {
      setSecretError("Invalid secret.");
      return;
    }
    setAuthed(true);
    await runSetupThenFetchFolders();
  };

  const loadModules = useCallback(async (folderId: string) => {
    const r = await fetch(`${API}/folders/${folderId}/modules`, fetchOpts());
    if (r.ok) setModules(await r.json());
    else setModules([]);
  }, []);

  useEffect(() => {
    if (expandedId) loadModules(expandedId);
    else setModules([]);
  }, [expandedId, loadModules]);

  const addFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/folders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newFolderName.trim(), sort_order: folders.length }),
        ...fetchOpts(),
      });
      if (r.ok) {
        const folder = await r.json();
        setFolders((f) => [...f, folder]);
        setNewFolderName("");
      }
    } finally {
      setLoading(false);
    }
  };

  const addModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expandedId || !newModule.name.trim() || !newModule.grade) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/folders/${expandedId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newModule.name.trim(),
          grade: newModule.grade,
          credits: parseFloat(newModule.credits) || 0,
        }),
        ...fetchOpts(),
      });
      if (r.ok) {
        const mod = await r.json();
        setModules((m) => [...m, mod]);
        setNewModule({ name: "", grade: "A", credits: "4" });
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteFolder = async (id: string) => {
    if (!confirm("Delete this folder and all its modules?")) return;
    const r = await fetch(`${API}/folders/${id}`, { method: "DELETE", ...fetchOpts() });
    if (r.ok) {
      setFolders((f) => f.filter((x) => x.id !== id));
      if (expandedId === id) setExpandedId(null);
    }
  };

  const deleteModule = async (id: string) => {
    const r = await fetch(`${API}/modules/${id}`, { method: "DELETE", ...fetchOpts() });
    if (r.ok) {
      setModules((m) => m.filter((x) => x.id !== id));
      if (editingModuleId === id) setEditingModuleId(null);
    }
  };

  const startEdit = (m: Module) => {
    setEditingModuleId(m.id);
    setEditForm({ name: m.name, grade: m.grade, credits: String(m.credits) });
  };

  const cancelEdit = () => {
    setEditingModuleId(null);
  };

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModuleId || !editForm.name.trim()) return;
    setLoading(true);
    try {
      const r = await fetch(`${API}/modules/${editingModuleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editForm.name.trim(),
          grade: editForm.grade,
          credits: parseFloat(editForm.credits) || 0,
        }),
        ...fetchOpts(),
      });
      if (r.ok) {
        const updated = await r.json();
        setModules((list) => list.map((x) => (x.id === editingModuleId ? updated : x)));
        setEditingModuleId(null);
      }
    } finally {
      setLoading(false);
    }
  };

  if (authed === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 text-center text-slate-400">
        Loading…
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-md px-4">
        <div className="rounded-2xl border border-ai-border/70 bg-ai-surface/80 p-6 shadow-ai-soft">
          <h1 className="mb-2 text-lg font-semibold text-slate-50">GPA Calculator</h1>
          <p className="mb-4 text-sm text-slate-400">Enter your secret to continue.</p>
          <form onSubmit={submitSecret} className="space-y-3">
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Secret"
              className="w-full rounded-xl border border-ai-border/60 bg-black/40 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:border-ai-accent-soft/80 focus:outline-none focus:ring-1 focus:ring-ai-accent-soft/50"
              autoFocus
            />
            {secretError && <p className="text-sm text-red-400">{secretError}</p>}
            <button
              type="submit"
              className="w-full rounded-xl bg-ai-accent-soft/90 px-4 py-2 text-sm font-medium text-slate-900"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  const gpa = computeGpa(modules);
  const grades = ["DIST", "A", "B+", "B", "C+", "C", "D+", "D", "D-", "P", "F", "ABS"];

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mb-2 text-xl font-semibold text-slate-50">GPA Calculator</h1>
      <p className="mb-6 text-sm text-slate-400">Folders (e.g. Polytechnic, University) and modules. Only you can see this page.</p>

      <form onSubmit={addFolder} className="mb-6 flex gap-2">
        <input
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
          className="flex-1 rounded-xl border border-ai-border/60 bg-ai-surface/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-ai-accent-soft/80 focus:outline-none focus:ring-1 focus:ring-ai-accent-soft/50"
        />
        <button
          type="submit"
          disabled={loading || !newFolderName.trim()}
          className="rounded-xl bg-ai-accent-soft/80 px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-50"
        >
          Add folder
        </button>
      </form>

      <div className="space-y-3">
        {folders.map((folder) => (
          <div
            key={folder.id}
            className="overflow-hidden rounded-2xl border border-ai-border/70 bg-ai-surface/80 shadow-ai-soft"
          >
            <button
              type="button"
              onClick={() => setExpandedId(expandedId === folder.id ? null : folder.id)}
              className="flex w-full items-center justify-between border-b border-ai-border/50 bg-black/20 px-4 py-3.5 text-left text-slate-100 transition hover:bg-black/30"
            >
              <span className="font-medium">{folder.name}</span>
              <span className="text-slate-400 text-xs">
                {expandedId === folder.id ? "▼ Collapse" : "▶ Open"}
              </span>
            </button>
            {expandedId === folder.id && (
              <div className="p-5">
                {/* GPA block – clear distinction */}
                {modules.length > 0 && (
                  <div className="mb-5 rounded-xl border border-ai-accent-soft/30 bg-ai-accent-soft/10 px-4 py-3">
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Semester GPA</p>
                    <p className="mt-0.5 text-2xl font-semibold tabular-nums text-ai-accent-soft">
                      {gpa != null ? gpa.toFixed(2) : "—"}
                    </p>
                  </div>
                )}

                {/* Module list – table-style: Name | Grade | Credits | Actions */}
                <div className="mb-5">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Modules</p>
                  <div className="overflow-hidden rounded-xl border border-ai-border/50">
                    {/* Header row */}
                    <div className="grid grid-cols-[1fr_5rem_5rem_7rem] gap-3 border-b border-ai-border/50 bg-black/40 px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                      <div>Name</div>
                      <div className="text-right">Grade</div>
                      <div className="text-right">Credits</div>
                      <div className="text-right">Actions</div>
                    </div>
                    <ul className="divide-y divide-ai-border/40">
                      {modules.map((m) => (
                        <li
                          key={m.id}
                          className="bg-black/20 px-4 py-2.5 text-sm transition hover:bg-black/30"
                        >
                          {editingModuleId === m.id ? (
                            <form onSubmit={saveEdit} className="grid grid-cols-[1fr_5rem_5rem_auto] gap-3 items-center">
                              <input
                                value={editForm.name}
                                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                                placeholder="Module name"
                                className="rounded-lg border border-ai-border/60 bg-black/50 px-2.5 py-1.5 text-slate-100 placeholder:text-slate-500 focus:border-ai-accent-soft/60 focus:outline-none"
                              />
                              <select
                                value={editForm.grade}
                                onChange={(e) => setEditForm((f) => ({ ...f, grade: e.target.value }))}
                                className="rounded-lg border border-ai-border/60 bg-black/50 px-2 py-1.5 text-slate-100"
                              >
                                {grades.map((g) => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                              <input
                                type="number"
                                min="0"
                                step="0.5"
                                value={editForm.credits}
                                onChange={(e) => setEditForm((f) => ({ ...f, credits: e.target.value }))}
                                className="rounded-lg border border-ai-border/60 bg-black/50 px-2 py-1.5 text-slate-100 text-right w-full"
                              />
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="submit"
                                  disabled={loading || !editForm.name.trim()}
                                  className="rounded-lg bg-ai-accent-soft/80 px-2.5 py-1.5 text-xs font-medium text-slate-900 disabled:opacity-50"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={cancelEdit}
                                  className="rounded-lg border border-ai-border/60 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/5"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="grid grid-cols-[1fr_5rem_5rem_7rem] gap-3 items-center">
                              <span className="font-medium text-slate-100 truncate">{m.name}</span>
                              <span className="text-right tabular-nums text-slate-300">{m.grade}</span>
                              <span className="text-right tabular-nums text-slate-400">{Number(m.credits)}</span>
                              <div className="flex gap-2 justify-end">
                                <button
                                  type="button"
                                  onClick={() => startEdit(m)}
                                  className="text-xs font-medium text-ai-accent-soft hover:underline"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteModule(m.id)}
                                  className="text-xs font-medium text-red-400/90 hover:underline"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Add module – distinct panel */}
                <div className="rounded-xl border border-dashed border-ai-border/60 bg-black/20 p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">Add module</p>
                  <form onSubmit={addModule} className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[140px]">
                      <label className="mb-1 block text-xs text-slate-500">Name</label>
                      <input
                        value={newModule.name}
                        onChange={(e) => setNewModule((n) => ({ ...n, name: e.target.value }))}
                        placeholder="e.g. DBS, SC"
                        className="w-full rounded-lg border border-ai-border/60 bg-black/40 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-ai-accent-soft/60 focus:outline-none"
                      />
                    </div>
                    <div className="w-20">
                      <label className="mb-1 block text-xs text-slate-500">Grade</label>
                      <select
                        value={newModule.grade}
                        onChange={(e) => setNewModule((n) => ({ ...n, grade: e.target.value }))}
                        className="w-full rounded-lg border border-ai-border/60 bg-black/40 px-2 py-2 text-sm text-slate-100"
                      >
                        {grades.map((g) => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-20">
                      <label className="mb-1 block text-xs text-slate-500">Credits</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={newModule.credits}
                        onChange={(e) => setNewModule((n) => ({ ...n, credits: e.target.value }))}
                        className="w-full rounded-lg border border-ai-border/60 bg-black/40 px-2 py-2 text-sm text-slate-100"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading || !newModule.name.trim()}
                      className="rounded-lg bg-ai-accent-soft/90 px-4 py-2 text-sm font-medium text-slate-900 disabled:opacity-50 hover:bg-ai-accent-soft"
                    >
                      Add module
                    </button>
                  </form>
                </div>

                {/* Delete folder – separated, subtle */}
                <div className="mt-5 pt-4 border-t border-ai-border/50">
                  <button
                    type="button"
                    onClick={() => deleteFolder(folder.id)}
                    className="text-xs text-red-400/90 hover:text-red-400 hover:underline"
                  >
                    Delete folder and all modules
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
