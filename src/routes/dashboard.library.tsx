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
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "STANDARD",
    price: "0",
    pages: "0",
  });

  const openNew = () => {
    setFile(null);
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
      <div className="flex justify-end">
        <Button onClick={openNew} className="gap-2" style={{ background: "var(--gradient-primary)" }}>
          <Plus className="h-4 w-4" /> Add Book
        </Button>
      </div>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Book</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div 
              className={`border-2 border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition ${file ? 'border-primary bg-primary/5' : ''}`}
              onClick={() => document.getElementById('book-upload')?.click()}
            >
              <Upload className={`h-6 w-6 ${file ? 'text-primary' : ''}`} />
              {file ? (
                <span className="text-primary font-medium">{file.name}</span>
              ) : (
                <span>Upload PDF (click to select)</span>
              )}
              <input 
                id="book-upload"
                type="file" 
                className="hidden" 
                accept=".pdf" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
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
  const [form, setForm] = useState({ title: "", description: "", duration: "", videoUrl: "" });

  const openNew = () => {
    setForm({ title: "", description: "", duration: "", videoUrl: "" });
    setOpen(true);
  };

  const submit = async () => {
    if (!form.title || !form.videoUrl) {
      toast.error("Title and URL are required");
      return;
    }
    const toastId = toast.loading("Adding video sermon to database...");
    try {
      await addNewSermon(form);
      toast.success("Sermon added successfully!", { id: toastId });
      setOpen(false);
    } catch (error) {
      toast.error("Failed to add sermon. Please check the details.", { id: toastId });
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
              <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center group-hover:scale-110 transition">
                <div className="w-0 h-0 border-l-[14px] border-l-white border-y-[10px] border-y-transparent ml-1" />
              </div>
              <div className="absolute top-2 right-2">
                 <Badge className="bg-black/50 backdrop-blur text-white border-none">{s.duration}</Badge>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Sermon</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input placeholder="48:12" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Video URL</Label>
                <Input placeholder="https://…" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} disabled={loading} style={{ background: "var(--gradient-primary)" }}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add Sermon"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
