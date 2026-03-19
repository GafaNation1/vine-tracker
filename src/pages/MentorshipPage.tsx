import { useState } from "react";
import { useMentorships } from "@/lib/store";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, X, Copy, Send, Trash2, MessageCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

const MentorshipPage = () => {
  const { user } = useAuth();
  const { mentorships, publicMentorships, createMentorship, deleteMentorship, joinByCode } = useMentorships();
  const [tab, setTab] = useState<"my" | "explore">("my");
  const [showCreate, setShowCreate] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [createData, setCreateData] = useState({
    name: "", type: "1-to-1" as "1-to-1" | "small-group" | "cohort",
    description: "", visibility: "invite-only" as "public" | "invite-only",
  });

  const uid = user?.id || "";

  const handleCreate = async () => {
    if (!createData.name) { toast.error("Enter a name"); return; }
    await createMentorship(createData);
    toast.success("Mentorship created!");
    setShowCreate(false);
    setCreateData({ name: "", type: "1-to-1", description: "", visibility: "invite-only" });
  };

  const handleJoinByCode = async () => {
    if (!joinCode) return;
    const result = await joinByCode(joinCode);
    if (result) { toast.success("Joined mentorship!"); setJoinCode(""); } else { toast.error("Invalid code"); }
  };

  const handleJoinPublic = async (mentorship: typeof publicMentorships[0]) => {
    const result = await joinByCode(mentorship.inviteCode);
    if (result) toast.success(`Joined ${mentorship.name}!`);
  };

  const inputClass = "mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10";

  if (showCreate) {
    return (
      <div className="min-h-screen">
        <div className="px-5 pt-14 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setShowCreate(false)} className="rounded-full border border-border bg-card p-2 hover:bg-secondary transition-colors"><X className="h-[18px] w-[18px]" strokeWidth={1.7} /></button>
            <h1 className="text-xl font-bold tracking-tight">Create Mentorship</h1>
          </div>
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Mentorship Name</label>
              <input type="text" value={createData.name} onChange={e => setCreateData({ ...createData, name: e.target.value })} placeholder="e.g., Leadership Mentoring" className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <textarea value={createData.description} onChange={e => setCreateData({ ...createData, description: e.target.value })} placeholder="What is this mentorship about?" rows={3} className={`${inputClass} resize-none`} />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <div className="mt-2 flex gap-2">
                {(["1-to-1", "small-group", "cohort"] as const).map(t => (
                  <button key={t} onClick={() => setCreateData({ ...createData, type: t })}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-medium transition-all ${createData.type === t ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>
                    {t === "1-to-1" ? "1-to-1" : t === "small-group" ? "Small Group" : "Cohort"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Visibility</label>
              <div className="mt-2 flex gap-2">
                {(["invite-only", "public"] as const).map(v => (
                  <button key={v} onClick={() => setCreateData({ ...createData, visibility: v })}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-medium transition-all ${createData.visibility === v ? "bg-primary text-primary-foreground" : "border border-border bg-card"}`}>
                    {v === "public" ? "🌐 Public" : "🔒 Invite Only"}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={handleCreate} className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">Create Mentorship</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold tracking-tight">Mentorship</h1><p className="text-sm text-muted-foreground mt-0.5">Spiritual guidance & growth</p></div>
          <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" />Create
          </button>
        </div>

        <div className="mt-5 flex rounded-xl bg-secondary p-1">
          {(["my", "explore"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}>
              {t === "my" ? "My Mentorships" : "Explore"}
            </button>
          ))}
        </div>

        {/* Join by code */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-4">
          <p className="text-xs font-medium text-muted-foreground mb-2">Join by code</p>
          <div className="flex gap-2">
            <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="MNT-XXXX"
              className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-primary/30" />
            <button onClick={handleJoinByCode} className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">Join</button>
          </div>
        </div>

        {tab === "my" && (
          <div className="mt-4 space-y-2">
            {mentorships.length > 0 ? mentorships.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold">{m.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{m.type} · {m.menteeIds.length} members</p>
                    {m.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{m.description}</p>}
                  </div>
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">
                    {m.mentorId === uid ? "Mentor" : "Mentee"}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-accent px-2.5 py-1 font-medium">Code: {m.inviteCode}</span>
                  <button onClick={() => { navigator.clipboard.writeText(m.inviteCode); toast.success("Copied!"); }}>
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
                {m.mentorId === uid && (
                  <button onClick={() => { deleteMentorship(m.id); toast.success("Deleted"); }}
                    className="mt-3 w-full rounded-lg border border-destructive/15 py-2 text-xs font-medium text-destructive hover:bg-destructive/5 transition-colors">Delete</button>
                )}
              </motion.div>
            )) : (
              <div className="flex flex-col items-center py-16 text-center">
                <MessageCircle className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No mentorships yet</p>
                <p className="text-xs text-muted-foreground mt-1">Create or join a mentorship</p>
              </div>
            )}
          </div>
        )}

        {tab === "explore" && (
          <div className="mt-4 space-y-2">
            {publicMentorships.length > 0 ? publicMentorships.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }} className="rounded-2xl border border-border bg-card p-4">
                <h3 className="text-sm font-semibold">{m.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{m.type} · {m.menteeIds.length} members</p>
                {m.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{m.description}</p>}
                <button onClick={() => handleJoinPublic(m)}
                  className="mt-3 w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
                  Join Mentorship
                </button>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center py-16 text-center">
                <Users className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No public mentorships available</p>
                <p className="text-xs text-muted-foreground mt-1">Check back later or join with a code</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorshipPage;
