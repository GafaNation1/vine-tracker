import { useUserProfile, useStreaks, useGroups, usePrograms, useMentorships } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Book, Calendar, Heart, LogOut, Bell, ChevronRight, Camera, Sun, Moon, BarChart3, Trash2, Plus, Edit, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useRef, useState } from "react";

const deleteReasons = ["I no longer need the app", "I prefer another tool", "Privacy concerns", "Other"];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { signOut, user: authUser } = useAuth();
  const { user, updateUser } = useUserProfile();
  const { streaks, addStreak, updateStreak, deleteStreak, toggleStreak } = useStreaks();
  const { groups } = useGroups();
  const { programs } = usePrograms();
  const { mentorships } = useMentorships();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showCreateStreak, setShowCreateStreak] = useState(false);
  const [editingStreak, setEditingStreak] = useState<string | null>(null);
  const [streakForm, setStreakForm] = useState({ habit: "", icon: "🙏", targetActivity: "Prayer", goal: 1 });

  const uid = authUser?.id || "";
  const hasResources = groups.some(g => g.ownerId === uid) || programs.some(p => p.ownerId === uid) || mentorships.length > 0;
  const displayName = user.fullName || authUser?.user_metadata?.full_name || "User";
  const displayEmail = user.email || authUser?.email || "";

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { updateUser({ avatar: ev.target?.result as string }); toast.success("Photo updated!"); };
    reader.readAsDataURL(file);
  };

  const handleSignOut = async () => { await signOut(); toast.success("Signed out"); navigate("/login"); };
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") { toast.error('Type "DELETE" to confirm'); return; }
    toast.success("Account deleted. God bless you.");
    signOut(); navigate("/login");
  };

  const handleSaveStreak = () => {
    if (!streakForm.habit) { toast.error("Enter a streak name"); return; }
    if (editingStreak) {
      updateStreak(editingStreak, streakForm);
      toast.success("Streak updated!");
    } else {
      addStreak(streakForm);
      toast.success("Streak created!");
    }
    setShowCreateStreak(false);
    setEditingStreak(null);
    setStreakForm({ habit: "", icon: "🙏", targetActivity: "Prayer", goal: 1 });
  };

  const startEditStreak = (s: typeof streaks[0]) => {
    setStreakForm({ habit: s.habit, icon: s.icon, targetActivity: s.targetActivity, goal: s.goal });
    setEditingStreak(s.id);
    setShowCreateStreak(true);
  };

  const streakIcons = ["🙏", "📖", "🍽️", "🎵", "🧘", "📝", "🌍", "💪", "❤️", "⭐"];

  return (
    <div className="min-h-screen pb-24">
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
          <div className="w-full max-w-sm rounded-2xl bg-card border border-border p-6 space-y-4">
            <h2 className="text-lg font-bold text-center">Delete Account</h2>
            <p className="text-sm text-muted-foreground text-center">This action cannot be undone.</p>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Why are you leaving?</label>
              <div className="mt-2 space-y-1.5">
                {deleteReasons.map(r => (
                  <button key={r} onClick={() => setDeleteReason(r)}
                    className={`w-full rounded-xl py-2.5 px-3 text-sm text-left transition-all ${deleteReason === r ? "bg-destructive/10 text-destructive border border-destructive/20" : "border border-border hover:bg-secondary"}`}>{r}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Type "DELETE" to confirm</label>
              <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-destructive/30" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowDeleteDialog(false)} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium hover:bg-secondary transition-colors">Cancel</button>
              <button onClick={handleDeleteAccount} className="flex-1 rounded-xl bg-destructive py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="px-5 pt-14 pb-6 text-center">
        <div className="relative mx-auto w-fit">
          <Avatar className="h-20 w-20 border-2 border-primary/20">
            {user.avatar ? <AvatarImage src={user.avatar} alt={displayName} /> : null}
            <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-bold">
              {displayName.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
            <Camera className="h-3.5 w-3.5" />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
        </div>
        <h1 className="mt-4 text-xl font-bold tracking-tight">{displayName}</h1>
        <p className="text-sm text-muted-foreground">{displayEmail}</p>
        <p className="text-xs text-muted-foreground">{user.church}</p>
        <span className="mt-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">{user.spiritualLevel}</span>
      </div>

      <div className="px-5 space-y-5">
        {/* Streak Management */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Spiritual Streaks</h3>
            <button onClick={() => { setShowCreateStreak(true); setEditingStreak(null); setStreakForm({ habit: "", icon: "🙏", targetActivity: "Prayer", goal: 1 }); }}
              className="rounded-lg p-1.5 hover:bg-secondary"><Plus className="h-4 w-4 text-primary" /></button>
          </div>

          {showCreateStreak && (
            <div className="rounded-xl border border-primary/20 bg-accent p-3 mb-3 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold">{editingStreak ? "Edit Streak" : "New Streak"}</p>
                <button onClick={() => { setShowCreateStreak(false); setEditingStreak(null); }}><X className="h-3.5 w-3.5 text-muted-foreground" /></button>
              </div>
              <input type="text" value={streakForm.habit} onChange={e => setStreakForm({ ...streakForm, habit: e.target.value })}
                placeholder="e.g., Daily Prayer" className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none" />
              <div className="flex gap-1.5 flex-wrap">
                {streakIcons.map(ic => (
                  <button key={ic} onClick={() => setStreakForm({ ...streakForm, icon: ic })}
                    className={`text-lg p-1 rounded-lg ${streakForm.icon === ic ? "bg-primary/20 ring-1 ring-primary" : ""}`}>{ic}</button>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground">Target Activity</label>
                  <select value={streakForm.targetActivity} onChange={e => setStreakForm({ ...streakForm, targetActivity: e.target.value })}
                    className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs outline-none">
                    {["Prayer", "Bible Reading", "Fasting", "Worship", "Meditation", "Journaling"].map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div className="w-20">
                  <label className="text-[10px] text-muted-foreground">Goal (days)</label>
                  <input type="number" min="1" value={streakForm.goal} onChange={e => setStreakForm({ ...streakForm, goal: Number(e.target.value) })}
                    className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs outline-none" />
                </div>
              </div>
              <button onClick={handleSaveStreak} className="w-full rounded-lg bg-primary py-2 text-xs font-semibold text-primary-foreground">
                {editingStreak ? "Save Changes" : "Create Streak"}
              </button>
            </div>
          )}

          <div className="space-y-2">
            {streaks.length > 0 ? streaks.map(s => (
              <div key={s.id} className="flex items-center gap-3">
                <span className="text-lg">{s.icon}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{s.habit}</p>
                  {s.enabled && <p className="text-[10px] text-muted-foreground">{s.currentCount} days · Best: {s.longest} · Goal: {s.goal}</p>}
                </div>
                <button onClick={() => startEditStreak(s)} className="rounded-lg p-1 hover:bg-secondary"><Edit className="h-3 w-3 text-muted-foreground" /></button>
                <button onClick={() => { deleteStreak(s.id); toast.success("Streak deleted"); }} className="rounded-lg p-1 hover:bg-destructive/10"><Trash2 className="h-3 w-3 text-destructive" /></button>
                <button onClick={() => toggleStreak(s.id)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${s.enabled ? "bg-primary" : "bg-secondary"}`}>
                  <span className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${s.enabled ? "translate-x-5" : ""}`} />
                </button>
              </div>
            )) : (
              <p className="text-xs text-muted-foreground text-center py-3">No streaks yet. Create one above!</p>
            )}
          </div>
        </div>

        {/* Theme */}
        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Theme</h3>
          <div className="flex gap-2">
            {[{ value: "light" as const, label: "Light", icon: Sun }, { value: "dark" as const, label: "Dark", icon: Moon }].map(t => (
              <button key={t.value} onClick={() => updateUser({ theme: t.value })}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-medium transition-all ${user.theme === t.value ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                <t.icon className="h-3.5 w-3.5" />{t.label}
              </button>
            ))}
          </div>
        </div>

        {hasResources && (
          <button onClick={() => navigate("/dashboard")} className="flex w-full items-center gap-3 rounded-2xl border border-primary/15 bg-accent p-4 text-left transition-colors hover:bg-accent/80">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div className="flex-1"><p className="text-sm font-semibold">Creator Dashboard</p><p className="text-[10px] text-muted-foreground">Manage groups, programs & analytics</p></div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        )}

        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          {[
            { icon: Calendar, label: "Spiritual Calendar", to: "/calendar" },
            { icon: Heart, label: "Prayer", to: "/prayer" },
            { icon: Book, label: "Bible", to: "/bible" },
            { icon: Bell, label: "Notifications", to: "/notifications" },
          ].map((item, i, arr) => (
            <button key={item.label} onClick={() => navigate(item.to)}
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
              <item.icon className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.7} />
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold mb-3">Account</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Display Name</label>
              <input type="text" value={user.fullName} onChange={e => updateUser({ fullName: e.target.value, name: e.target.value.split(" ")[0] })}
                className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary/30" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input type="email" value={displayEmail} disabled className="mt-1 w-full rounded-xl border border-input bg-muted px-3 py-2 text-sm text-muted-foreground" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Custom Greeting</label>
              <input type="text" value={user.greeting} onChange={e => updateUser({ greeting: e.target.value })}
                placeholder="e.g., Blessed morning" className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary/30" />
            </div>
          </div>
        </div>

        <button onClick={handleSignOut} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-destructive/15 bg-card py-3.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5">
          <LogOut className="h-4 w-4" />Sign Out
        </button>
        <button onClick={() => setShowDeleteDialog(true)} className="flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-xs text-muted-foreground hover:text-destructive transition-colors mb-4">
          <Trash2 className="h-3.5 w-3.5" />Delete Account
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
