import { motion } from "framer-motion";
import { usePrograms } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronRight, Plus, X, Copy, ArrowLeft, Users, Calendar } from "lucide-react";

const ProgramsPage = () => {
  const { user } = useAuth();
  const { programs, allPrograms, createProgram, deleteProgram, joinProgram, joinByCode } = usePrograms();
  const [tab, setTab] = useState<"my" | "joined" | "explore">("my");
  const [showCreate, setShowCreate] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [viewingProgram, setViewingProgram] = useState<string | null>(null);
  const [createData, setCreateData] = useState({ name: "", customName: "", description: "", startDate: "", endDate: "", visibility: "public" as "public" | "invite-only" });

  const uid = user?.id || "";
  const myPrograms = programs.filter(p => p.ownerId === uid);
  const joinedPrograms = programs.filter(p => p.participants.includes(uid) && p.ownerId !== uid);
  const explorePrograms = allPrograms.filter(p => p.visibility === "public" && !p.participants.includes(uid));

  const presetNames = ["21-Day Prayer Challenge", "40-Day Fasting Program", "Bible in One Year", "7-Day Revival Prayer", "Other"];
  const inputClass = "mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10";

  const getDaysRemaining = (endDate: string) => Math.max(0, Math.ceil((new Date(endDate).getTime() - Date.now()) / 86400000));
  const getProgress = (startDate: string, endDate: string) => {
    const total = new Date(endDate).getTime() - new Date(startDate).getTime();
    const elapsed = Date.now() - new Date(startDate).getTime();
    return Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
  };

  const handleCreate = async () => {
    const name = createData.name === "Other" ? createData.customName : createData.name;
    if (!name) { toast.error("Enter a program name"); return; }
    if (!createData.startDate || !createData.endDate) { toast.error("Select dates"); return; }
    await createProgram({ name, description: createData.description, startDate: createData.startDate, endDate: createData.endDate, visibility: createData.visibility });
    toast.success("Program created!");
    setShowCreate(false);
    setCreateData({ name: "", customName: "", description: "", startDate: "", endDate: "", visibility: "public" });
  };

  const handleJoinByCode = async () => {
    if (!joinCode) return;
    const result = await joinByCode(joinCode);
    if (result) { toast.success("Joined program!"); setJoinCode(""); } else { toast.error("Invalid program code"); }
  };

  // Program detail view
  const viewedProgram = viewingProgram ? allPrograms.find(p => p.id === viewingProgram) || programs.find(p => p.id === viewingProgram) : null;
  if (viewedProgram) {
    const progress = getProgress(viewedProgram.startDate, viewedProgram.endDate);
    const daysLeft = getDaysRemaining(viewedProgram.endDate);
    const isJoined = viewedProgram.participants.includes(uid);
    return (
      <div className="min-h-screen">
        <div className="px-5 pt-14 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setViewingProgram(null)} className="rounded-full border border-border bg-card p-2 hover:bg-secondary transition-colors">
              <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={1.7} />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Program Details</h1>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h2 className="text-lg font-bold">{viewedProgram.name}</h2>
              {viewedProgram.description && <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{viewedProgram.description}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-border bg-card p-3.5">
                <Calendar className="h-4 w-4 text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Start Date</p>
                <p className="text-sm font-medium">{viewedProgram.startDate || "Not set"}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-3.5">
                <Calendar className="h-4 w-4 text-primary mb-1" />
                <p className="text-xs text-muted-foreground">End Date</p>
                <p className="text-sm font-medium">{viewedProgram.endDate || "Not set"}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <Users className="h-4 w-4 text-primary" />
                <p className="text-sm font-medium">{viewedProgram.participants.length} Participants</p>
              </div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold text-primary">{progress}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary">
                <div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">{daysLeft} days remaining</p>
            </div>
            {viewedProgram.inviteCode && viewedProgram.ownerId === uid && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-xs text-muted-foreground mb-1">Invite Code</p>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-primary">{viewedProgram.inviteCode}</span>
                  <button onClick={() => { navigator.clipboard.writeText(viewedProgram.inviteCode); toast.success("Copied!"); }}>
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            )}
            {!isJoined && (
              <button onClick={async () => { await joinProgram(viewedProgram.id); toast.success("Joined!"); setViewingProgram(null); }}
                className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                Join Program
              </button>
            )}
            {isJoined && <p className="text-center text-sm text-primary font-medium">✓ You've joined this program</p>}
          </div>
        </div>
      </div>
    );
  }

  if (showCreate) {
    return (
      <div className="min-h-screen">
        <div className="px-5 pt-14 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setShowCreate(false)} className="rounded-full border border-border bg-card p-2 hover:bg-secondary transition-colors"><X className="h-[18px] w-[18px]" strokeWidth={1.7} /></button>
            <h1 className="text-xl font-bold tracking-tight">Create Program</h1>
          </div>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Program Name</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {presetNames.map(n => (
                  <button key={n} onClick={() => setCreateData({ ...createData, name: n })}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${createData.name === n ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>{n}</button>
                ))}
              </div>
              {createData.name === "Other" && <input type="text" value={createData.customName} onChange={e => setCreateData({ ...createData, customName: e.target.value })} placeholder="Enter name" className={inputClass} />}
            </div>
            <div><label className="text-sm font-medium text-muted-foreground">Description</label><textarea value={createData.description} onChange={e => setCreateData({ ...createData, description: e.target.value })} placeholder="Describe this program..." rows={3} className={`${inputClass} resize-none`} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-muted-foreground">Start Date</label><input type="date" value={createData.startDate} onChange={e => setCreateData({ ...createData, startDate: e.target.value })} className={inputClass} /></div>
              <div><label className="text-sm font-medium text-muted-foreground">End Date</label><input type="date" value={createData.endDate} onChange={e => setCreateData({ ...createData, endDate: e.target.value })} className={inputClass} /></div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Visibility</label>
              <div className="mt-2 flex gap-2">
                {(["public", "invite-only"] as const).map(v => (
                  <button key={v} onClick={() => setCreateData({ ...createData, visibility: v })}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-medium transition-all ${createData.visibility === v ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>
                    {v === "public" ? "🌐 Public" : "🔒 Invite Only"}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleCreate} className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">Create Program</button>
          </div>
        </div>
      </div>
    );
  }

  const renderProgramCard = (program: typeof programs[0], i: number, showDelete = false) => {
    const progress = getProgress(program.startDate, program.endDate);
    const daysLeft = getDaysRemaining(program.endDate);
    return (
      <motion.div key={program.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.04, duration: 0.3 }} className="rounded-2xl border border-border bg-card p-4">
        <button onClick={() => setViewingProgram(program.id)} className="w-full text-left">
          <h3 className="text-sm font-semibold">{program.name}</h3>
          {program.description && <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">{program.description}</p>}
          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span>{program.participants.length} participants</span>
            <span>{daysLeft} days left</span>
          </div>
          <div className="mt-3"><div className="flex items-center justify-between text-xs mb-1.5"><span className="text-muted-foreground">Progress</span><span className="font-semibold text-primary">{progress}%</span></div>
            <div className="h-1.5 w-full rounded-full bg-secondary"><div className="h-1.5 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} /></div></div>
        </button>
        {showDelete && (
          <button onClick={() => { deleteProgram(program.id); toast.success("Deleted"); }}
            className="mt-3 w-full rounded-lg border border-destructive/15 py-2 text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors">Delete Program</button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen">
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold tracking-tight">Programs</h1><p className="text-sm text-muted-foreground mt-0.5">Spiritual campaigns & challenges</p></div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />Create
          </button>
        </div>

        <div className="mt-5 flex rounded-xl bg-secondary p-1">
          {(["my", "joined", "explore"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "my" ? "My Programs" : t === "joined" ? "Joined" : "Explore"}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Join by code</p>
          <div className="flex gap-2">
            <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="PRG-XXXX"
              className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-primary/30" />
            <button onClick={handleJoinByCode} className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">Join</button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {tab === "my" && (myPrograms.length > 0 ? myPrograms.map((p, i) => renderProgramCard(p, i, true)) : <p className="text-sm text-muted-foreground text-center py-12">No programs created yet</p>)}
          {tab === "joined" && (joinedPrograms.length > 0 ? joinedPrograms.map((p, i) => renderProgramCard(p, i)) : <p className="text-sm text-muted-foreground text-center py-12">No programs joined yet</p>)}
          {tab === "explore" && (explorePrograms.length > 0 ? explorePrograms.map((p, i) => renderProgramCard(p, i)) : <p className="text-sm text-muted-foreground text-center py-12">No public programs available</p>)}
        </div>
      </div>
    </div>
  );
};

export default ProgramsPage;
