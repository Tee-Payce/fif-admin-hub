import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Pencil, Trash2, Upload, Link2 } from "lucide-react";
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
import type { Tier, Book, Sermon } from "@/data/mock";

export const Route = createFileRoute("/dashboard/library")({
  head: () => ({ meta: [{ title: "Library — FIF Admin" }] }),
  component: LibraryPage,
});

const TIER_COLORS: Record<Tier, string> = {
  Standard: "bg-muted text-foreground",
  Premium: "bg-primary/10 text-primary",
  VVIP: "bg-gold/20 text-foreground border border-gold/40",
};

function LibraryPage() {
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
  const { books, addBook, updateBook, deleteBook } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "Standard" as Tier,
    price: 0,
    pages: 0,
  });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", author: "", category: "Standard", price: 0, pages: 0 });
    setOpen(true);
  };
  const openEdit = (b: Book) => {
    setEditing(b);
    setForm({ title: b.title, author: b.author, category: b.category, price: b.price, pages: b.pages });
    setOpen(true);
  };
  const submit = () => {
    if (!form.title) return;
    if (editing) updateBook(editing.id, form);
    else addBook(form);
    setOpen(false);
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
            {books.map((b) => (
              <TableRow key={b.id}>
                <TableCell className="font-medium">{b.title}</TableCell>
                <TableCell className="text-muted-foreground">{b.author}</TableCell>
                <TableCell>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${TIER_COLORS[b.category]}`}>
                    {b.category}
                  </span>
                </TableCell>
                <TableCell>{b.price === 0 ? "Free" : `$${b.price.toFixed(2)}`}</TableCell>
                <TableCell>{b.pages}</TableCell>
                <TableCell className="text-right">
                  <Button size="icon" variant="ghost" onClick={() => openEdit(b)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteBook(b.id)}>
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
            <DialogTitle>{editing ? "Edit Book" : "Upload Book"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-6 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" /> Upload PDF (drag & drop)
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
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v as Tier })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Premium">Premium</SelectItem>
                    <SelectItem value="VVIP">VVIP</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Price ($)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Pages</Label>
                <Input type="number" value={form.pages} onChange={(e) => setForm({ ...form, pages: Number(e.target.value) })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} style={{ background: "var(--gradient-primary)" }}>
              {editing ? "Save" : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SermonsTab() {
  const { sermons, addSermon, updateSermon, deleteSermon } = useData();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Sermon | null>(null);
  const [form, setForm] = useState({ title: "", description: "", duration: "", url: "" });

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", description: "", duration: "", url: "" });
    setOpen(true);
  };
  const openEdit = (s: Sermon) => {
    setEditing(s);
    setForm({ title: s.title, description: s.description, duration: s.duration, url: s.url });
    setOpen(true);
  };
  const submit = () => {
    if (!form.title) return;
    if (editing) updateSermon(editing.id, form);
    else addSermon(form);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={openNew} className="gap-2" style={{ background: "var(--gradient-primary)" }}>
          <Plus className="h-4 w-4" /> Add Sermon
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sermons.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border bg-card overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
            <div className="aspect-video flex items-center justify-center" style={{ background: "var(--gradient-hero)" }}>
              <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <div className="w-0 h-0 border-l-[14px] border-l-white border-y-[10px] border-y-transparent ml-1" />
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold leading-tight">{s.title}</h3>
                <Badge variant="outline" className="shrink-0">{s.duration}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Link2 className="h-3 w-3" /> {s.uploadedAt}
                </span>
                <div>
                  <Button size="icon" variant="ghost" onClick={() => openEdit(s)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteSermon(s.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Sermon" : "Add Sermon"}</DialogTitle>
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
                <Input placeholder="https://…" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit} style={{ background: "var(--gradient-primary)" }}>
              {editing ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
