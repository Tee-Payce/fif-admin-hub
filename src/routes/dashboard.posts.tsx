import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, Trash2, Image as ImageIcon, Video, Music, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import type { Post } from "@/data/mock";

export const Route = createFileRoute("/dashboard/posts")({
  head: () => ({ meta: [{ title: "Apostles Update — FIF Admin" }] }),
  component: PostsPage,
});

function timeLeft(createdAt: number) {
  const ms = 24 * 60 * 60 * 1000 - (Date.now() - createdAt);
  if (ms <= 0) return "Expired";
  const h = Math.floor(ms / (60 * 60 * 1000));
  const m = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
  return `${h}h ${m}m left`;
}

function PostsPage() {
  const { posts, addPost, deletePost } = useData();
  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [mediaType, setMediaType] = useState<Post["mediaType"]>("image");
  const [, setTick] = useState(0);

  // re-render every minute for countdowns
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(i);
  }, []);

  const live = posts.filter((p) => Date.now() - p.createdAt < 24 * 60 * 60 * 1000);

  const submit = () => {
    if (!caption.trim()) return;
    addPost({ caption, mediaType, mediaUrl: "" });
    setCaption("");
    setMediaType("image");
    setOpen(false);
  };

  const Icon = { image: ImageIcon, video: Video, audio: Music };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Apostles Update</h1>
          <p className="text-muted-foreground">24-hour story-style posts.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" style={{ background: "var(--gradient-primary)" }}>
              <Plus className="h-4 w-4" /> New Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Apostles Update</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Media type</Label>
                <Select value={mediaType} onValueChange={(v) => setMediaType(v as Post["mediaType"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Upload media</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground hover:border-primary/50 transition cursor-pointer">
                  Drop file here or click to browse
                  <Input type="file" className="hidden" />
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
              <Button onClick={submit} style={{ background: "var(--gradient-primary)" }}>
                Publish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {live.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">No active updates. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {live.map((p) => {
            const MIcon = Icon[p.mediaType];
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
                    {p.mediaType}
                  </span>
                  <span className="px-2 py-1 rounded-full bg-gold text-gold-foreground text-xs font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {timeLeft(p.createdAt)}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm font-medium line-clamp-2">{p.caption}</p>
                </div>
                <button
                  onClick={() => deletePost(p.id)}
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
