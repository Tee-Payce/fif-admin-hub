import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Upload, Link2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { TableSkeleton, CardGridSkeleton, EmptyState, PageStatusBadge } from "@/components/StateIndicators";
import { BookOpen, Video as VideoIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/library")({
  head: () => ({ meta: [{ title: "Library — FIF Admin" }] }),
  component: LibraryPage,
});

const TIER_COLORS: Record<string, string> = {
  FREE: "bg-muted text-foreground",
  STANDARD: "bg-primary/10 text-primary",
  PREMIUM: "bg-primary/20 text-primary border border-primary/20",
  VVIP: "bg-gold/20 text-foreground border border-gold/40",
};

function LibraryPage() {
  const { fetchBooks, fetchSermons } = useData();

  useEffect(() => {
    fetchBooks();
    fetchSermons();
  }, [fetchBooks, fetchSermons]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">Library Management</h1>
        <p className="text-muted-foreground">Manage books and video sermons.</p>
      </div>
      <Tabs defaultValue="books">
        <TabsList>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="sermons">Video Sermons</TabsTrigger>
        </TabsList>
        <TabsContent value="books" className="mt-6">
          <BooksTab />
        </TabsContent>
        <TabsContent value="sermons" className="mt-6">
          <SermonsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function BooksTab() {
  const { books, addNewBook, removeBook, loading } = useData();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "STANDARD",
    price: "0",
    pages: "0",
  });

  const openNew = () => {
    setFile(null);
    setCoverFile(null);
    setForm({ title: "", author: "", category: "STANDARD", price: "0", pages: "0" });
    setOpen(true);
  };

  const submit = async () => {
    if (!form.title || !file) {
      toast.error("Title and file are required");
      return;
    }
    
    const toastId = toast.loading("Uploading book to Backblaze B2...");

    const formData = new FormData();
    formData.append("book", file);
    if (coverFile) {
      formData.append("cover", coverFile);
    }
    formData.append("title", form.title);
    formData.append("author", form.author);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("pages", form.pages);

    try {
      await addNewBook(formData);
      toast.success("Book uploaded and indexed successfully!", { id: toastId });
      setOpen(false);
    } catch (error) {
      toast.error("Failed to upload book. Please try again.", { id: toastId });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await removeBook(id);
        toast.success("Book deleted");
      } catch (error) {
        toast.error("Failed to delete book");
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <PageStatusBadge loading={loading} count={books.length} unit="books" />
        <Button onClick={openNew} className="gap-2" style={{ background: "var(--gradient-primary)" }}>
          <Plus className="h-4 w-4" /> Add Book
        </Button>
      </div>
      {loading && books.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
          <TableSkeleton rows={5} cols={6} />
        </div>
      ) : books.length === 0 ? (
        <EmptyState icon={BookOpen} title="No books yet" description="Upload a book to start building your library." action={
          <Button onClick={openNew} className="gap-2" style={{ background: "var(--gradient-primary)" }}><Plus className="h-4 w-4" /> Add Book</Button>
        } />
      ) : (
      <div className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Pages</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((b: any) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.title}</TableCell>
                <TableCell className="text-muted-foreground">{b.author}</TableCell>
                <TableCell>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${TIER_COLORS[b.category] || "bg-muted"}`}>
                    {b.category}
                  </span>
                </TableCell>
                <TableCell>{b.price === 0 ? "Free" : `$${b.price.toFixed(2)}`}</TableCell>
                <TableCell>{b.pages}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => handleDelete(b.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Book</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div 
                className={`border-2 border-dashed border-border rounded-xl p-4 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition ${file ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => document.getElementById('book-upload')?.click()}
              >
                <Upload className={`h-6 w-6 ${file ? 'text-primary' : ''}`} />
                {file ? (
                  <span className="text-primary font-medium">{file.name}</span>
                ) : (
                  <span>Upload PDF</span>
                )}
                <input 
                  id="book-upload"
                  type="file" 
                  className="hidden" 
                  accept=".pdf" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              <div 
                className={`border-2 border-dashed border-border rounded-xl p-4 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition ${coverFile ? 'border-primary bg-primary/5' : ''}`}
                onClick={() => document.getElementById('cover-upload')?.click()}
              >
                <Upload className={`h-6 w-6 ${coverFile ? 'text-primary' : ''}`} />
                {coverFile ? (
                  <span className="text-primary font-medium">{coverFile.name}</span>
                ) : (
                  <span>Upload Cover (Optional)</span>
                )}
                <input 
                  id="cover-upload"
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2 col-span-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Author</Label>
                <Input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FREE">Free</SelectItem>
                    <SelectItem value="STANDARD">Standard</SelectItem>
                    <SelectItem value="PREMIUM">Premium</SelectItem>
                    <SelectItem value="VVIP">VVIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Pages</Label>
                <Input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={loading} style={{ background: "var(--gradient-primary)" }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Upload Book"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SermonsTab() {
  const { sermons, addNewSermon, loading } = useData();
  const [open, setOpen] = useState(false);
  const [videoSource, setVideoSource] = useState<"upload" | "url">("url");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const [form, setForm] = useState({ 
    title: "", 
    description: "", 
    duration: "", 
    videoUrl: "" 
  });

  const openNew = () => {
    setForm({ title: "", description: "", duration: "", videoUrl: "" });
    setVideoFile(null);
    setThumbFile(null);
    setVideoSource("url");
    setOpen(true);
  };

  const submit = async () => {
    if (!form.title) {
      toast.error("Title is required");
      return;
    }
    if (videoSource === "url" && !form.videoUrl) {
      toast.error("Video URL is required");
      return;
    }
    if (videoSource === "upload" && !videoFile) {
      toast.error("Video file is required");
      return;
    }

    const toastId = toast.loading(videoSource === "upload" ? "Uploading video to Backblaze..." : "Adding sermon...");
    
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("duration", form.duration);
      formData.append("videoType", videoSource);
      
      if (videoSource === "url") {
        formData.append("videoUrl", form.videoUrl);
      } else if (videoFile) {
        formData.append("video", videoFile);
      }

      if (thumbFile) {
        formData.append("thumbnail", thumbFile);
      }

      await addNewSermon(formData);
      toast.success("Sermon added successfully!", { id: toastId });
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add sermon.", { id: toastId });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openNew} className="gap-2" style={{ background: "var(--gradient-primary)" }}>
          <Plus className="h-4 w-4" /> Add Sermon
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sermons.map((s: any) => (
          <div key={s.id} className="rounded-2xl border border-border bg-card overflow-hidden transition hover:shadow-md" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="aspect-video flex items-center justify-center relative group" style={{ background: "var(--gradient-hero)" }}>
              {s.coverUrl || s.thumbnailUrl ? (
                <img src={s.coverUrl || s.thumbnailUrl} className="w-full h-full object-cover" alt={s.title} />
              ) : (
                <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition">
                  <div className="w-0 h-0 border-l-[14px] border-l-white border-y-[10px] border-y-transparent ml-1" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                 <Badge className="bg-black/50 backdrop-blur text-white border-none">{s.duration}</Badge>
              </div>
              <div className="absolute top-2 left-2">
                 <Badge variant="outline" className="bg-white/10 backdrop-blur text-white border-white/20 uppercase text-[10px]">
                   {s.videoType === 'url' ? 'Link' : 'Uploaded'}
                 </Badge>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold leading-tight line-clamp-1">{s.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Link2 className="h-3 w-3" /> {new Date(s.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Video Sermon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Video Source</Label>
              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant={videoSource === "url" ? "default" : "outline"}
                  className="flex-1 gap-2"
                  onClick={() => setVideoSource("url")}
                >
                  <Link2 className="h-4 w-4" /> Video Link
                </Button>
                <Button 
                  type="button"
                  variant={videoSource === "upload" ? "default" : "outline"}
                  className="flex-1 gap-2"
                  onClick={() => setVideoSource("upload")}
                >
                  <Upload className="h-4 w-4" /> Upload File
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Sermon Title" />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Sermon details..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input placeholder="45:00" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              
              {videoSource === "url" && (
                <div className="space-y-2">
                  <Label>Video URL</Label>
                  <Input placeholder="https://youtube.com/..." value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
                </div>
              )}
            </div>

            {videoSource === "upload" && (
              <div className="space-y-2">
                <Label>Video File</Label>
                <div 
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-muted/50 transition ${videoFile ? 'border-primary bg-primary/5' : 'border-border'}`}
                  onClick={() => document.getElementById('video-file')?.click()}
                >
                  <Upload className={`h-6 w-6 mx-auto mb-2 ${videoFile ? 'text-primary' : 'text-muted-foreground'}`} />
                  <p className="text-xs text-muted-foreground">{videoFile ? videoFile.name : "Select video (MP4, MOV)"}</p>
                  <input id="video-file" type="file" className="hidden" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Thumbnail Image (Optional)</Label>
              <div 
                className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-muted/50 transition ${thumbFile ? 'border-primary bg-primary/5' : 'border-border'}`}
                onClick={() => document.getElementById('thumb-file')?.click()}
              >
                <Upload className={`h-6 w-6 mx-auto mb-2 ${thumbFile ? 'text-primary' : 'text-muted-foreground'}`} />
                <p className="text-xs text-muted-foreground">{thumbFile ? thumbFile.name : "Select cover image (JPG, PNG)"}</p>
                <input id="thumb-file" type="file" className="hidden" accept="image/*" onChange={(e) => setThumbFile(e.target.files?.[0] || null)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={loading} style={{ background: "var(--gradient-primary)" }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Sermon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
