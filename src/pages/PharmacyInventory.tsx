import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Package, Search, AlertTriangle, CheckCircle2, XCircle, ArrowRightLeft, RefreshCw, Pill, TrendingDown, TrendingUp, Activity, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  medicine_name: string;
  generic_name: string;
  category: string;
  brand: string;
  strength: string;
  stock_quantity: number;
  unit: string;
  price: number;
  mrp: number;
  expiry_date: string | null;
  batch_number: string;
  supplier: string;
  rack_location: string;
  is_prescription_required: boolean;
  alternative_group: string;
  status: string;
  last_restocked_at: string;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  in_stock: { label: 'In Stock', color: 'bg-success/10 text-success border-0', icon: CheckCircle2 },
  low_stock: { label: 'Low Stock', color: 'bg-warning/10 text-warning border-0', icon: AlertTriangle },
  out_of_stock: { label: 'Out of Stock', color: 'bg-destructive/10 text-destructive border-0', icon: XCircle },
};

const categories = ['All', 'Diabetes', 'Cardiac', 'Cholesterol', 'Gastro', 'Pain Relief', 'Antibiotic', 'Allergy', 'Supplements'];

const PharmacyInventory = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [alternatives, setAlternatives] = useState<InventoryItem[]>([]);
  const [showAlternatives, setShowAlternatives] = useState(false);
  const [realtimeActive, setRealtimeActive] = useState(false);

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from('pharmacy_inventory')
      .select('*')
      .order('medicine_name');
    if (error) {
      toast.error('Failed to load inventory');
      return;
    }
    setInventory(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();

    const channel = supabase
      .channel('pharmacy-inventory-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pharmacy_inventory' }, (payload) => {
        setRealtimeActive(true);
        setTimeout(() => setRealtimeActive(false), 2000);

        if (payload.eventType === 'INSERT') {
          setInventory(prev => [...prev, payload.new as InventoryItem].sort((a, b) => a.medicine_name.localeCompare(b.medicine_name)));
          toast.success(`New medicine added: ${(payload.new as InventoryItem).medicine_name}`);
        } else if (payload.eventType === 'UPDATE') {
          const updated = payload.new as InventoryItem;
          const old = payload.old as Partial<InventoryItem>;
          setInventory(prev => prev.map(item => item.id === updated.id ? updated : item));
          
          if (old.stock_quantity !== undefined && updated.stock_quantity !== old.stock_quantity) {
            if (updated.stock_quantity === 0) {
              toast.error(`${updated.medicine_name} is now OUT OF STOCK!`, { duration: 5000 });
            } else if (updated.stock_quantity <= 10) {
              toast.warning(`${updated.medicine_name} stock is low: ${updated.stock_quantity} ${updated.unit} remaining`);
            } else if (old.stock_quantity === 0 && updated.stock_quantity > 0) {
              toast.success(`${updated.medicine_name} is back in stock! (${updated.stock_quantity} ${updated.unit})`);
            } else {
              toast.info(`${updated.medicine_name} stock updated: ${updated.stock_quantity} ${updated.unit}`);
            }
          }
        } else if (payload.eventType === 'DELETE') {
          setInventory(prev => prev.filter(item => item.id !== (payload.old as Partial<InventoryItem>).id));
          toast.info('Medicine removed from inventory');
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = inventory.filter(item => {
    const matchesSearch = item.medicine_name.toLowerCase().includes(search.toLowerCase()) ||
      item.generic_name.toLowerCase().includes(search.toLowerCase()) ||
      item.brand.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || item.category === category;
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const findAlternatives = (item: InventoryItem) => {
    const alts = inventory.filter(i => 
      i.alternative_group === item.alternative_group && 
      i.id !== item.id && 
      i.stock_quantity > 0
    );
    setSelectedItem(item);
    setAlternatives(alts);
    setShowAlternatives(true);
  };

  const totalItems = inventory.length;
  const inStock = inventory.filter(i => i.status === 'in_stock').length;
  const lowStock = inventory.filter(i => i.status === 'low_stock').length;
  const outOfStock = inventory.filter(i => i.status === 'out_of_stock').length;
  const totalValue = inventory.reduce((s, i) => s + (i.price * i.stock_quantity), 0);

  const stats = [
    { label: 'Total Medicines', value: totalItems, icon: Package, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'In Stock', value: inStock, icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Low Stock', value: lowStock, icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Out of Stock', value: outOfStock, icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10' },
    { label: 'Inventory Value', value: `₹${totalValue.toLocaleString()}`, icon: TrendingUp, color: 'text-accent', bg: 'bg-accent/10' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-card bg-gradient-to-br from-primary via-primary/90 to-accent p-6 md:p-8 text-primary-foreground">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-primary-foreground/5 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent/20 blur-2xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary-foreground/10">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-heading font-bold">Pharmacy Inventory</h1>
                <p className="text-primary-foreground/70 text-sm">Real-time stock monitoring & alternative suggestions</p>
              </div>
            </div>
            <motion.div
              animate={{ scale: realtimeActive ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-xs"
            >
              <Wifi className={`h-3.5 w-3.5 ${realtimeActive ? 'text-success' : 'text-primary-foreground/50'}`} />
              <span className={realtimeActive ? 'text-success' : 'text-primary-foreground/50'}>
                {realtimeActive ? 'Updating...' : 'Live'}
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="rounded-card border-0 shadow-sm">
              <CardContent className="p-4 text-center">
                <div className={`inline-flex p-2 rounded-lg ${s.bg} mb-2`}>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <Card className="rounded-card">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search medicine, brand, generic name..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="rounded-card overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Medicine</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Stock</TableHead>
                <TableHead className="font-semibold">Price</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filtered.map((item) => {
                  const config = statusConfig[item.status] || statusConfig.in_stock;
                  const StatusIcon = config.icon;
                  const stockPercent = Math.min((item.stock_quantity / 500) * 100, 100);

                  return (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`border-b transition-colors hover:bg-muted/50 ${item.status === 'out_of_stock' ? 'bg-destructive/3' : ''}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${item.status === 'out_of_stock' ? 'bg-destructive/10' : item.status === 'low_stock' ? 'bg-warning/10' : 'bg-primary/10'}`}>
                            <Pill className={`h-4 w-4 ${item.status === 'out_of_stock' ? 'text-destructive' : item.status === 'low_stock' ? 'text-warning' : 'text-primary'}`} />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{item.medicine_name} {item.strength}</p>
                            <p className="text-xs text-muted-foreground">{item.brand} • {item.generic_name}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 min-w-[100px]">
                          <div className="flex items-center justify-between">
                            <span className={`text-sm font-semibold ${item.stock_quantity === 0 ? 'text-destructive' : item.stock_quantity <= 10 ? 'text-warning' : ''}`}>
                              {item.stock_quantity}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{item.unit}</span>
                          </div>
                          <Progress value={stockPercent} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-semibold">₹{item.price}</p>
                          <p className="text-[10px] text-muted-foreground line-through">₹{item.mrp}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`${config.color} text-[10px] gap-1`}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {(item.status === 'out_of_stock' || item.status === 'low_stock') && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs gap-1.5 border-primary/20 text-primary hover:bg-primary/5"
                            onClick={() => findAlternatives(item)}
                          >
                            <ArrowRightLeft className="h-3.5 w-3.5" />
                            Alternatives
                          </Button>
                        )}
                      </TableCell>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </TableBody>
          </Table>

          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-muted-foreground text-sm">No medicines found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alternatives Dialog */}
      <Dialog open={showAlternatives} onOpenChange={setShowAlternatives}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <ArrowRightLeft className="h-5 w-5 text-primary" />
              Alternative Medicines
            </DialogTitle>
            <DialogDescription>
              {selectedItem && (
                <span>
                  <span className="font-medium text-foreground">{selectedItem.medicine_name} {selectedItem.strength}</span>
                  {' '}is {selectedItem.status === 'out_of_stock' ? 'currently out of stock' : 'running low'}. 
                  Here are available alternatives:
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Selected medicine info */}
          {selectedItem && (
            <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/10">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <XCircle className="h-4 w-4 text-destructive" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{selectedItem.medicine_name} {selectedItem.strength}</p>
                  <p className="text-xs text-muted-foreground">{selectedItem.brand} • {selectedItem.generic_name}</p>
                </div>
                <Badge className={statusConfig[selectedItem.status]?.color || ''}>
                  {selectedItem.stock_quantity} {selectedItem.unit}
                </Badge>
              </div>
            </div>
          )}

          {/* Alternatives list */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {alternatives.length > 0 ? alternatives.map((alt, i) => (
              <motion.div
                key={alt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="rounded-card border-success/20 hover:border-success/40 transition-colors cursor-pointer">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success/10">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{alt.medicine_name} {alt.strength}</p>
                          {i === 0 && <Badge className="bg-success/10 text-success border-0 text-[9px]">Recommended</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{alt.brand} • {alt.generic_name}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm font-bold text-primary">₹{alt.price}</span>
                          <span className="text-xs text-success">{alt.stock_quantity} {alt.unit} available</span>
                          {alt.rack_location && <span className="text-[10px] text-muted-foreground">📍 {alt.rack_location}</span>}
                        </div>
                      </div>
                      <TrendingDown className="h-4 w-4 text-success" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )) : (
              <div className="py-8 text-center">
                <AlertTriangle className="h-10 w-10 mx-auto text-warning/40 mb-3" />
                <p className="text-sm font-medium">No alternatives available</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Consider contacting the supplier or checking nearby pharmacies
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PharmacyInventory;
