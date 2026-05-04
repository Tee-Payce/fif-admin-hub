import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Image as ImageIcon, Video, Music, Clock, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useData } from "@/store";
import { CardGridSkeleton, EmptyState, PageStatusBadge } from "@/components/StateIndicators";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/posts")({
  head: () => ({ meta: [{ title: "Apostles Update — FIF Admin" }] }),
  component: PostsPage,
});

function timeLeft(expiresAt: string) {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return "Expired";
  const h = Math.floor(ms / (60 * 60 * 1000));
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${h}h ${m}m left`;
}

function PostsPage() {
  const { stories, fetchStories, addNewStory, removeStory, loading } = useData();
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState<string>("IMAGE");
  const [file, setFile] = useState<File | null>(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    fetchStories();
    const i = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(i);
  }, [fetchStories]);

  const submit = async () => {
    if (!caption.trim() || !file) {
      toast.error("Caption and media are required");
      return;
    }
    
    const toastId = toast.loading("Publishing your update to Backblaze B2...");
    
    const formData = new FormData();
    formData.append("media", file);
    formData.append("caption", caption);
    formData.append("mediaType", mediaType);

    try {
      await addNewStory(formData);
      toast.success("Update published successfully!", { id: toastId });
      setCaption("");
      setMediaType("IMAGE");
      setFile(null);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to publish update. Please try again.", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this update?")) {
      try {
        await removeStory(id);
        toast.success("Update deleted");
      } catch (error) {
        toast.error("Failed to delete update");
      }
    }
  };

  const IconMap: Record<string, any> = { IMAGE: ImageIcon, VIDEO: Video, AUDIO: Music };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Apostles Update</h1>
          <p className="text-muted-foreground">24-hour story-style posts.</p>
          <div className="mt-2"><PageStatusBadge loading={loading} count={stories.length} unit="active" /></div>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2" style={{ background: "var(--gradient-primary)" }}>
          <Plus className="h-4 w-4" /> New Post
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Apostles Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Media type</Label>
              <Select value={mediaType} onValueChange={setMediaType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IMAGE">Image</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="AUDIO">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Upload media</Label>
              <div 
                className={`border-2 border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground hover:border-primary/50 transition cursor-pointer flex flex-col items-center gap-2 ${file ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => document.getElementById('media-upload')?.click()}
              >
                <Upload className={`h-6 w-6 ${file ? 'text-primary' : ''}`} />
                {file ? (
                  <span className="text-primary font-medium">{file.name}</span>
                ) : (
                  <span>Drop file here or click to browse</span>
                )}
                <input 
                  id="media-upload"
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Caption</Label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Write something inspiring…"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={loading} style={{ background: "var(--gradient-primary)" }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Publish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {loading && stories.length === 0 ? (
        <CardGridSkeleton count={4} />
      ) : stories.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No active updates"
          description="Create a 24-hour update to share inspiration with your community."
          action={
            <Button onClick={() => setOpen(true)} className="gap-2" style={{ background: "var(--gradient-primary)" }}>
              <Plus className="h-4 w-4" /> New Post
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {stories.map((p: any) => {
            const MIcon = IconMap[p.mediaType] || ImageIcon;
            return (
              <div
                key={p.id}
                className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-border"
                style={{ background: "var(--gradient-hero)", boxShadow: "var(--shadow-card)" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <MIcon className="h-12 w-12 text-primary-foreground/40" />
                </div>
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2 py-1 rounded-full bg-black/40 backdrop-blur text-xs text-white capitalize">
                    {p.mediaType.toLowerCase()}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gold text-gold-foreground text-xs font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {timeLeft(p.expiresAt)}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm font-medium line-clamp-2">{p.caption}</p>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
