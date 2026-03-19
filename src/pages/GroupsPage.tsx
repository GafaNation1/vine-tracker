import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Search, ChevronRight, Copy, RefreshCw, Trash2, Users, Shield, X } from "lucide-react";
import { useGroups } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";

const groupTypes = ["Fellowship", "Discipleship", "Prayer", "Ministry", "Bible Study"];
const defaultActivityTypes = ["Prayer", "Bible Reading", "Fasting", "Worship", "Meditation", "Journaling", "Evangelism"];

const GroupsPage = () => {
  const navigate = useNavigate();
  const { groups, createGroup, deleteGroup, regenerateInviteCode, joinGroupByCode, removeMember, promoteMember } = useGroups();
  const [tab, setTab] = useState<"my" | "join">("my");
  const [searchQuery, setSearchQuery] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [managingGroup, setManagingGroup] = useState<string | null>(null);
  const [createData, setCreateData] = useState({
    name: "",
    type: "Fellowship",
    customType: "",
    description: "",
    visibility: "public" as "public" | "invite-only",
    activityTypes: ["Prayer", "Bible Reading"] as string[],
    customActivity: "",
    duration: "",
  });

  const myGroups = groups.filter((g) => g.members.some((m) => m.userId === "user-1" && m.status === "active"));
  const publicGroups = groups.filter(
    (g) => g.visibility === "public" && !g.members.some((m) => m.userId === "user-1" && m.status === "active")
  );
  const searchResults = searchQuery
    ? publicGroups.filter((g) => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleCreate = () => {
    if (!createData.name) { toast.error("Enter a group name"); return; }
    createGroup({
      name: createData.name,
      type: createData.customType || createData.type,
      description: createData.description,
      visibility: createData.visibility,
      activityTypes: createData.activityTypes,
      duration: createData.duration,
    });
    toast.success("Group created!");
    setShowCreate(false);
    setCreateData({ name: "", type: "Fellowship", customType: "", description: "", visibility: "public", activityTypes: ["Prayer", "Bible Reading"], customActivity: "", duration: "" });
  };

  const handleJoinByCode = () => {
    if (!joinCode) return;
    const found = groups.find((g) => g.inviteCode === joinCode);
    if (!found) { toast.error("Invalid invite code"); return; }
    joinGroupByCode(joinCode);
    toast.success(`Joined ${found.name}!`);
    setJoinCode("");
    setTab("my");
  };

  const handleJoinPublic = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return;
    joinGroupByCode(group.inviteCode);
    toast.success(`Joined ${group.name}!`);
  };

  const managedGroup = managingGroup ? groups.find((g) => g.id === managingGroup) : null;
  const isAdmin = managedGroup?.members.some((m) => m.userId === "user-1" && (m.role === "admin" || m.role === "co-leader"));

  // Manage panel
  if (managedGroup && isAdmin) {
    const activeMembers = managedGroup.members.filter((m) => m.status === "active");
    const leftMembers = managedGroup.members.filter((m) => m.status === "left");

    return (
      <div className="min-h-screen">
        <div className="px-5 pt-14 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setManagingGroup(null)} className="rounded-full border border-border bg-card p-2 transition-colors hover:bg-secondary">
              <X className="h-[18px] w-[18px]" strokeWidth={1.7} />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{managedGroup.name}</h1>
              <p className="text-xs text-muted-foreground">{managedGroup.type} · {managedGroup.visibility}</p>
            </div>
          </div>

          {/* Invite Code */}
          <div className="rounded-2xl border border-border bg-card p-4 mb-4">
            <p className="text-xs font-medium text-muted-foreground mb-2">Invite Code</p>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-primary flex-1">{managedGroup.inviteCode}</span>
              <button onClick={() => { navigator.clipboard.writeText(managedGroup.inviteCode); toast.success("Copied!"); }} className="rounded-lg p-2 hover:bg-secondary">
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
              <button onClick={() => { regenerateInviteCode(managedGroup.id); toast.success("Code regenerated!"); }} className="rounded-lg p-2 hover:bg-secondary">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Active Members */}
          <h3 className="text-sm font-semibold mb-2">Members ({activeMembers.length})</h3>
          <div className="space-y-2 mb-6">
            {activeMembers.map((m) => (
              <div key={m.userId} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                  {m.username[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.username}</p>
                  <p className="text-[10px] text-muted-foreground">Joined {new Date(m.joinedAt).toLocaleDateString()}</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  m.role === "admin" ? "bg-primary/10 text-primary" : m.role === "co-leader" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
                }`}>
                  {m.role}
                </span>
                {m.userId !== "user-1" && (
                  <div className="flex gap-1">
                    <button
                      onClick={() => { promoteMember(managedGroup.id, m.userId, m.role === "co-leader" ? "member" : "co-leader"); toast.success("Role updated"); }}
                      className="rounded-lg p-1.5 hover:bg-secondary"
                    >
                      <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => { removeMember(managedGroup.id, m.userId); toast.success("Member removed"); }}
                      className="rounded-lg p-1.5 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {leftMembers.length > 0 && (
            <>
              <h3 className="text-sm font-semibold mb-2 text-muted-foreground">Left Members</h3>
              <div className="space-y-2 mb-6">
                {leftMembers.map((m) => (
                  <div key={m.userId + "left"} className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3 opacity-60">
                    <p className="text-sm">{m.username}</p>
                    <span className="text-[10px] text-muted-foreground ml-auto">Left {m.leftAt ? new Date(m.leftAt).toLocaleDateString() : ""}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          <button
            onClick={() => { deleteGroup(managedGroup.id); setManagingGroup(null); toast.success("Group deleted"); }}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-destructive/15 bg-card py-3 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete Group
          </button>
        </div>
      </div>
    );
  }

  // Create group panel
  if (showCreate) {
    return (
      <div className="min-h-screen">
        <div className="px-5 pt-14 pb-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setShowCreate(false)} className="rounded-full border border-border bg-card p-2 transition-colors hover:bg-secondary">
              <X className="h-[18px] w-[18px]" strokeWidth={1.7} />
            </button>
            <h1 className="text-xl font-bold tracking-tight">Create Group</h1>
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Group Name</label>
              <input
                type="text"
                value={createData.name}
                onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                placeholder="e.g., Youth Fellowship"
                className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Group Type</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[...groupTypes, "Other"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setCreateData({ ...createData, type: t })}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                      createData.type === t ? "bg-primary text-primary-foreground" : "border border-border bg-card"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {createData.type === "Other" && (
                <input
                  type="text"
                  value={createData.customType}
                  onChange={(e) => setCreateData({ ...createData, customType: e.target.value })}
                  placeholder="Enter custom type"
                  className="mt-2 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <textarea
                value={createData.description}
                onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                placeholder="Describe your group..."
                rows={3}
                className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none resize-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Visibility</label>
              <div className="mt-2 flex gap-2">
                {(["public", "invite-only"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setCreateData({ ...createData, visibility: v })}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-medium transition-all ${
                      createData.visibility === v ? "bg-primary text-primary-foreground" : "border border-border bg-card"
                    }`}
                  >
                    {v === "public" ? "🌐 Public" : "🔒 Invite Only"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Activity Types</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {[...defaultActivityTypes, "Other"].map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      if (t === "Other") return;
                      setCreateData((prev) => ({
                        ...prev,
                        activityTypes: prev.activityTypes.includes(t)
                          ? prev.activityTypes.filter((a) => a !== t)
                          : [...prev.activityTypes, t],
                      }));
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      t === "Other"
                        ? "border border-dashed border-border bg-card"
                        : createData.activityTypes.includes(t)
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card"
                    }`}
                  >
                    {t === "Other" ? "+ Other" : t}
                  </button>
                ))}
              </div>
              {createData.activityTypes.includes("Other") || (
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={createData.customActivity}
                    onChange={(e) => setCreateData({ ...createData, customActivity: e.target.value })}
                    placeholder="Add custom activity type"
                    className="flex-1 rounded-xl border border-input bg-card px-4 py-2.5 text-sm outline-none focus:border-primary/30"
                  />
                  <button
                    onClick={() => {
                      if (createData.customActivity) {
                        setCreateData((prev) => ({
                          ...prev,
                          activityTypes: [...prev.activityTypes, prev.customActivity],
                          customActivity: "",
                        }));
                      }
                    }}
                    className="rounded-xl bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Duration (Optional)</label>
              <input
                type="text"
                value={createData.duration}
                onChange={(e) => setCreateData({ ...createData, duration: e.target.value })}
                placeholder="e.g., 30 days, 6 months, 1 year"
                className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-3 text-sm outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            <button onClick={handleCreate} className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors">
              Create Group
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Groups</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your spiritual communities</p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create
          </button>
        </div>

        <div className="mt-5 flex rounded-xl bg-secondary p-1">
          {(["my", "join"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                tab === t ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {t === "my" ? "My Groups" : "Join Group"}
            </button>
          ))}
        </div>

        {tab === "my" && (
          <div className="mt-4 space-y-2">
            {myGroups.length > 0 ? (
              myGroups.map((group, i) => {
                const myRole = group.members.find((m) => m.userId === "user-1")?.role;
                const activeCount = group.members.filter((m) => m.status === "active").length;
                return (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-sm font-bold text-accent-foreground">
                        {group.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{group.name}</p>
                        <p className="text-xs text-muted-foreground">{group.type} · {activeCount} members</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        myRole === "admin" ? "bg-primary/10 text-primary" : myRole === "co-leader" ? "bg-accent text-accent-foreground" : "bg-secondary text-secondary-foreground"
                      }`}>
                        {myRole}
                      </span>
                    </div>
                    {(myRole === "admin" || myRole === "co-leader") && (
                      <button
                        onClick={() => setManagingGroup(group.id)}
                        className="mt-3 w-full rounded-lg bg-secondary py-2 text-xs font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                      >
                        Manage Group
                      </button>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <Users className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">No groups yet</p>
                <p className="text-xs text-muted-foreground mt-1">Create or join a group to get started</p>
              </div>
            )}
          </div>
        )}

        {tab === "join" && (
          <div className="mt-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search public groups..."
                className="w-full rounded-xl border border-input bg-card py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
              />
            </div>

            {/* Join by code */}
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-medium text-muted-foreground mb-2">Have an invite code?</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="GRP-XXXX"
                  className="flex-1 rounded-xl border border-input bg-background px-4 py-2.5 text-sm font-mono outline-none focus:border-primary/30"
                />
                <button onClick={handleJoinByCode} className="rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground">
                  Join
                </button>
              </div>
            </div>

            {/* Search results */}
            {searchQuery && searchResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">{searchResults.length} results</p>
                {searchResults.map((g) => (
                  <div key={g.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-xs font-bold text-accent-foreground">
                        {g.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{g.name}</p>
                        <p className="text-xs text-muted-foreground">{g.type} · {g.members.filter((m) => m.status === "active").length} members</p>
                      </div>
                    </div>
                    {g.description && (
                      <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{g.description}</p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-muted-foreground">
                      <span>Admin: {g.members.find((m) => m.role === "admin")?.username || "Unknown"}</span>
                      <span>Created: {new Date(g.createdAt).toLocaleDateString()}</span>
                      {g.duration && <span>Duration: {g.duration}</span>}
                    </div>
                    <button
                      onClick={() => handleJoinPublic(g.id)}
                      className="mt-3 w-full rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground"
                    >
                      Join Group
                    </button>
                  </div>
                ))}
              </div>
            )}

            {searchQuery && searchResults.length === 0 && (
              <div className="flex flex-col items-center py-8 text-center">
                <p className="text-sm text-muted-foreground">No groups found for "{searchQuery}"</p>
              </div>
            )}

            {!searchQuery && (
              <div className="flex flex-col items-center py-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">Find your community</p>
                <p className="mt-1 text-xs text-muted-foreground max-w-[240px]">
                  Search for public groups by name or enter an invite code
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;
