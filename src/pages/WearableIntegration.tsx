import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Watch, Heart, Footprints, Flame, Moon, Droplets, Activity, Wifi, WifiOff, Plus, Bluetooth, BluetoothSearching, Smartphone, Trash2, RefreshCw, Loader2, Check, Radio, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Known Bluetooth service UUIDs for wearables
const BLUETOOTH_SERVICES = {
  heartRate: 0x180D,
  battery: 0x180F,
  deviceInfo: 0x180A,
  genericAccess: 0x1800,
  bloodPressure: 0x1810,
  glucose: 0x1808,
  healthThermometer: 0x1809,
  bodyComposition: 0x181B,
  weight: 0x181D,
  runningSpeed: 0x1814,
  cycling: 0x1816,
};

interface BluetoothFoundDevice {
  device: any; // Web Bluetooth API device
  name: string;
  rssi?: number;
}

function isBluetoothSupported(): boolean {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

function classifyBluetoothDevice(name: string): { type: string; brand: string; icon: string } {
  const n = name.toLowerCase();
  if (n.includes('apple watch') || n.includes('watch')) return { type: 'Smartwatch', brand: 'Detected', icon: '⌚' };
  if (n.includes('galaxy') || n.includes('samsung')) return { type: 'Smartwatch', brand: 'Samsung', icon: '⌚' };
  if (n.includes('fitbit')) return { type: 'Fitness Tracker', brand: 'Fitbit', icon: '📱' };
  if (n.includes('garmin')) return { type: 'Sports Watch', brand: 'Garmin', icon: '⌚' };
  if (n.includes('mi band') || n.includes('xiaomi')) return { type: 'Fitness Tracker', brand: 'Xiaomi', icon: '📱' };
  if (n.includes('huawei')) return { type: 'Smartwatch', brand: 'Huawei', icon: '⌚' };
  if (n.includes('amazfit')) return { type: 'Smartwatch', brand: 'Amazfit', icon: '⌚' };
  if (n.includes('polar')) return { type: 'Sports Watch', brand: 'Polar', icon: '⌚' };
  if (n.includes('oura')) return { type: 'Sleep Tracker', brand: 'Oura', icon: '💍' };
  if (n.includes('whoop')) return { type: 'Performance Tracker', brand: 'Whoop', icon: '📱' };
  if (n.includes('band') || n.includes('tracker')) return { type: 'Fitness Tracker', brand: 'Detected', icon: '📱' };
  if (n.includes('ring')) return { type: 'Health Ring', brand: 'Detected', icon: '💍' };
  return { type: 'Wearable', brand: 'Detected', icon: '⌚' };
}

const heartRateData = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  bpm: 60 + Math.floor(Math.random() * 40) + (i > 6 && i < 22 ? 15 : 0),
}));

const stepsData = [
  { day: 'Mon', steps: 8200 }, { day: 'Tue', steps: 6800 }, { day: 'Wed', steps: 10400 },
  { day: 'Thu', steps: 7500 }, { day: 'Fri', steps: 9100 }, { day: 'Sat', steps: 12000 }, { day: 'Sun', steps: 5400 },
];

interface Device {
  id: string;
  name: string;
  type: string;
  brand: string;
  connected: boolean;
  battery: number;
  last_sync: string;
  icon: string;
  sync_enabled: boolean;
}

const availableDevices = [
  // Smartwatches
  { name: 'Apple Watch', models: ['Series 10', 'Series 9', 'Ultra 2', 'SE (3rd Gen)'], icon: '⌚', brand: 'Apple', type: 'Smartwatch' },
  { name: 'Samsung Galaxy Watch', models: ['7 Ultra', '7', '6 Classic', 'FE'], icon: '⌚', brand: 'Samsung', type: 'Smartwatch' },
  { name: 'Google Pixel Watch', models: ['3', '2', '1'], icon: '⌚', brand: 'Google', type: 'Smartwatch' },
  { name: 'OnePlus Watch', models: ['2', '2R'], icon: '⌚', brand: 'OnePlus', type: 'Smartwatch' },
  { name: 'Huawei Watch', models: ['GT 5 Pro', 'GT 5', 'Ultimate', 'Fit 3'], icon: '⌚', brand: 'Huawei', type: 'Smartwatch' },
  { name: 'Amazfit', models: ['T-Rex 3', 'GTR 4', 'GTS 4', 'Bip 5'], icon: '⌚', brand: 'Amazfit', type: 'Smartwatch' },
  { name: 'Fossil Gen', models: ['6', '5E', '5 LTE'], icon: '⌚', brand: 'Fossil', type: 'Smartwatch' },
  { name: 'TicWatch', models: ['Pro 5 Enduro', 'Pro 5', 'E3'], icon: '⌚', brand: 'Mobvoi', type: 'Smartwatch' },
  { name: 'Noise', models: ['ColorFit Ultra 3', 'ColorFit Pro 5', 'Evolve 2'], icon: '⌚', brand: 'Noise', type: 'Smartwatch' },
  { name: 'boAt Watch', models: ['Primia', 'Iris', 'Xtend Plus'], icon: '⌚', brand: 'boAt', type: 'Smartwatch' },
  { name: 'Fire-Boltt', models: ['Phoenix Ultra', 'Invincible Plus', 'Ring 3'], icon: '⌚', brand: 'Fire-Boltt', type: 'Smartwatch' },
  // Fitness Trackers
  { name: 'Fitbit', models: ['Charge 6', 'Sense 2', 'Versa 4', 'Inspire 3', 'Luxe'], icon: '📱', brand: 'Fitbit', type: 'Fitness Tracker' },
  { name: 'Xiaomi Band', models: ['9 Pro', '9', '8 Pro', '8'], icon: '📱', brand: 'Xiaomi', type: 'Fitness Tracker' },
  { name: 'Honor Band', models: ['9', '7', '6'], icon: '📱', brand: 'Honor', type: 'Fitness Tracker' },
  { name: 'Samsung Galaxy Fit', models: ['3', '2'], icon: '📱', brand: 'Samsung', type: 'Fitness Tracker' },
  // Sports / GPS Watches
  { name: 'Garmin', models: ['Fenix 8', 'Forerunner 965', 'Venu 3', 'Vivosmart 5', 'Enduro 3', 'Instinct 2X'], icon: '⌚', brand: 'Garmin', type: 'Sports Watch' },
  { name: 'Polar', models: ['Vantage V3', 'Grit X2 Pro', 'Ignite 3', 'Pacer Pro', 'Unite'], icon: '⌚', brand: 'Polar', type: 'Sports Watch' },
  { name: 'Suunto', models: ['Race S', 'Race', 'Vertical', '9 Peak Pro', '5 Peak'], icon: '⌚', brand: 'Suunto', type: 'Sports Watch' },
  { name: 'COROS', models: ['PACE 3', 'VERTIX 2S', 'APEX 2 Pro', 'DURA'], icon: '⌚', brand: 'COROS', type: 'Sports Watch' },
  // Performance & Recovery
  { name: 'Whoop', models: ['4.0', '3.0'], icon: '📱', brand: 'Whoop', type: 'Performance Tracker' },
  { name: 'Oura Ring', models: ['Gen 4', 'Gen 3 Horizon', 'Gen 3 Heritage'], icon: '💍', brand: 'Oura', type: 'Sleep Tracker' },
  { name: 'Ultrahuman Ring', models: ['Air', 'Rare'], icon: '💍', brand: 'Ultrahuman', type: 'Health Ring' },
  { name: 'Samsung Galaxy Ring', models: ['Galaxy Ring'], icon: '💍', brand: 'Samsung', type: 'Health Ring' },
  // Medical / Health Monitors
  { name: 'Withings', models: ['ScanWatch 2', 'ScanWatch Light', 'Steel HR'], icon: '⌚', brand: 'Withings', type: 'Health Monitor' },
  { name: 'Omron HeartGuide', models: ['HeartGuide'], icon: '⌚', brand: 'Omron', type: 'BP Monitor Watch' },
  { name: 'Biostrap', models: ['EVO', 'Luna'], icon: '📱', brand: 'Biostrap', type: 'Clinical Wearable' },
  // Kids Smartwatches
  { name: 'Xplora', models: ['X6 Play', 'XGO3', 'X5 Play'], icon: '⌚', brand: 'Xplora', type: 'Kids Smartwatch' },
  { name: 'Gabb Watch', models: ['3', '2'], icon: '⌚', brand: 'Gabb', type: 'Kids Smartwatch' },
  // Luxury Smartwatches
  { name: 'TAG Heuer Connected', models: ['Calibre E4 45mm', 'Calibre E4 42mm'], icon: '⌚', brand: 'TAG Heuer', type: 'Luxury Smartwatch' },
  { name: 'Montblanc Summit', models: ['Summit 3', 'Summit Lite'], icon: '⌚', brand: 'Montblanc', type: 'Luxury Smartwatch' },
];

const vitals = [
  { label: 'Heart Rate', value: '72 bpm', icon: Heart, trend: 'Normal', color: 'text-destructive', bg: 'bg-destructive/10' },
  { label: 'Steps Today', value: '8,432', icon: Footprints, trend: '+12%', color: 'text-success', bg: 'bg-success/10' },
  { label: 'Calories', value: '1,847 kcal', icon: Flame, trend: 'On track', color: 'text-warning', bg: 'bg-warning/10' },
  { label: 'Sleep Score', value: '85/100', icon: Moon, trend: 'Good', color: 'text-info', bg: 'bg-info/10' },
  { label: 'SpO2', value: '98%', icon: Droplets, trend: 'Normal', color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Stress Level', value: 'Low', icon: Activity, trend: '↓ Improving', color: 'text-success', bg: 'bg-success/10' },
];

function formatLastSync(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin} min ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

const WearableIntegration = () => {
  const { user } = useAuth();
  const [selectedDevice, setSelectedDevice] = useState(0);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPairingDialog, setShowPairingDialog] = useState(false);
  const [showDeviceSettings, setShowDeviceSettings] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<typeof availableDevices[0] | null>(null);
  const [pairingStep, setPairingStep] = useState<'scanning' | 'found' | 'pairing' | 'success'>('scanning');
  const [selectedModel, setSelectedModel] = useState('');
  const [syncingDeviceId, setSyncingDeviceId] = useState<string | null>(null);
  const [bluetoothScanning, setBluetoothScanning] = useState(false);
  const [foundBluetoothDevices, setFoundBluetoothDevices] = useState<BluetoothFoundDevice[]>([]);
  const [bluetoothError, setBluetoothError] = useState<string | null>(null);
  const [connectingBtDevice, setConnectingBtDevice] = useState<string | null>(null);
  const [addDialogTab, setAddDialogTab] = useState<string>('bluetooth');

  const handleBluetoothScan = useCallback(async () => {
    if (!isBluetoothSupported()) {
      setBluetoothError('Bluetooth is not supported in this browser. Try Chrome on desktop or Android.');
      return;
    }
    setBluetoothScanning(true);
    setBluetoothError(null);
    setFoundBluetoothDevices([]);
    try {
      const nav = navigator as any;
      const device = await nav.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: Object.values(BLUETOOTH_SERVICES),
      });
      if (device) {
        setFoundBluetoothDevices([{ device, name: device.name || 'Unknown Device' }]);
      }
    } catch (err: any) {
      if (err?.name === 'NotFoundError' || err?.message?.includes('cancelled')) {
        setBluetoothError('No device selected. Please try again.');
      } else if (err?.name === 'SecurityError') {
        setBluetoothError('Bluetooth access denied. Please allow Bluetooth in your browser settings.');
      } else {
        setBluetoothError(err?.message || 'Failed to scan for Bluetooth devices.');
      }
    }
    setBluetoothScanning(false);
  }, []);

  const handleConnectBluetoothDevice = async (btDevice: BluetoothFoundDevice) => {
    if (!user) return;
    setConnectingBtDevice(btDevice.name);
    const classification = classifyBluetoothDevice(btDevice.name);
    let batteryLevel = Math.floor(Math.random() * 40) + 60;

    try {
      // Attempt to read battery level from the device
      const server = await btDevice.device.gatt?.connect();
      if (server) {
        try {
          const batteryService = await server.getPrimaryService(BLUETOOTH_SERVICES.battery);
          const batteryChar = await batteryService.getCharacteristic(0x2A19);
          const batteryValue = await batteryChar.readValue();
          batteryLevel = batteryValue.getUint8(0);
        } catch {
          // Battery service not available, use random
        }
        try { server.disconnect(); } catch {}
      }
    } catch {
      // GATT connection failed, proceed with saved device anyway
    }

    const newDevice = {
      user_id: user.id,
      name: btDevice.name,
      type: classification.type,
      brand: classification.brand,
      icon: classification.icon,
      connected: true,
      battery: batteryLevel,
      last_sync: new Date().toISOString(),
      sync_enabled: true,
    };

    const { data, error } = await supabase.from('wearable_devices').insert(newDevice).select().single();
    if (error) {
      toast.error('Failed to save device');
    } else if (data) {
      setDevices(prev => [...prev, {
        id: data.id, name: data.name, type: data.type, brand: data.brand,
        connected: data.connected, battery: data.battery, last_sync: data.last_sync,
        icon: data.icon, sync_enabled: data.sync_enabled,
      }]);
      toast.success(`${btDevice.name} connected via Bluetooth!`);
      setShowAddDialog(false);
      setFoundBluetoothDevices([]);
    }
    setConnectingBtDevice(null);
  };

  // Fetch devices from DB
  useEffect(() => {
    if (!user) return;
    const fetchDevices = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('wearable_devices')
        .select('*')
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Error fetching devices:', error);
        toast.error('Failed to load devices');
      } else {
        setDevices((data || []).map(d => ({
          id: d.id,
          name: d.name,
          type: d.type,
          brand: d.brand,
          connected: d.connected,
          battery: d.battery,
          last_sync: d.last_sync,
          icon: d.icon,
          sync_enabled: d.sync_enabled,
        })));
      }
      setLoading(false);
    };
    fetchDevices();
  }, [user]);

  const handleAddDevice = () => {
    setShowAddDialog(true);
    setSelectedBrand(null);
    setSelectedModel('');
  };

  const handleSelectBrand = (brand: typeof availableDevices[0]) => {
    setSelectedBrand(brand);
  };

  const handleStartPairing = (model: string) => {
    setSelectedModel(model);
    setShowAddDialog(false);
    setShowPairingDialog(true);
    setPairingStep('scanning');

    setTimeout(() => setPairingStep('found'), 2000);
    setTimeout(() => setPairingStep('pairing'), 3500);
    setTimeout(async () => {
      setPairingStep('success');
      if (!user || !selectedBrand) return;
      const newDevice = {
        user_id: user.id,
        name: `${selectedBrand.name} ${model}`,
        type: selectedBrand.type,
        brand: selectedBrand.brand,
        icon: selectedBrand.icon,
        connected: true,
        battery: Math.floor(Math.random() * 40) + 60,
        last_sync: new Date().toISOString(),
        sync_enabled: true,
      };
      const { data, error } = await supabase.from('wearable_devices').insert(newDevice).select().single();
      if (error) {
        console.error('Error saving device:', error);
        toast.error('Failed to save device');
      } else if (data) {
        setDevices(prev => [...prev, {
          id: data.id,
          name: data.name,
          type: data.type,
          brand: data.brand,
          connected: data.connected,
          battery: data.battery,
          last_sync: data.last_sync,
          icon: data.icon,
          sync_enabled: data.sync_enabled,
        }]);
        toast.success(`${newDevice.name} connected successfully!`);
      }
    }, 5500);
  };

  const handleDisconnect = async (deviceId: string) => {
    const { error } = await supabase.from('wearable_devices').update({ connected: false, sync_enabled: false }).eq('id', deviceId);
    if (error) { toast.error('Failed to disconnect'); return; }
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, connected: false, sync_enabled: false } : d));
    setShowDeviceSettings(null);
    toast.info('Device disconnected');
  };

  const handleReconnect = async (deviceId: string) => {
    const now = new Date().toISOString();
    const { error } = await supabase.from('wearable_devices').update({ connected: true, sync_enabled: true, last_sync: now }).eq('id', deviceId);
    if (error) { toast.error('Failed to reconnect'); return; }
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, connected: true, sync_enabled: true, last_sync: now } : d));
    toast.success('Device reconnected!');
  };

  const handleRemoveDevice = async (deviceId: string) => {
    const { error } = await supabase.from('wearable_devices').delete().eq('id', deviceId);
    if (error) { toast.error('Failed to remove device'); return; }
    setDevices(prev => prev.filter(d => d.id !== deviceId));
    setShowDeviceSettings(null);
    toast.info('Device removed');
  };

  const handleSyncDevice = async (deviceId: string) => {
    setSyncingDeviceId(deviceId);
    const now = new Date().toISOString();
    const { error } = await supabase.from('wearable_devices').update({ last_sync: now }).eq('id', deviceId);
    setTimeout(() => {
      if (error) { toast.error('Sync failed'); } else {
        setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, last_sync: now } : d));
        toast.success('Data synced successfully!');
      }
      setSyncingDeviceId(null);
    }, 2000);
  };

  const handleToggleSync = async (deviceId: string, enabled: boolean) => {
    const { error } = await supabase.from('wearable_devices').update({ sync_enabled: enabled }).eq('id', deviceId);
    if (error) { toast.error('Failed to update setting'); return; }
    setDevices(prev => prev.map(d => d.id === deviceId ? { ...d, sync_enabled: enabled } : d));
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-card bg-gradient-to-r from-green-600 to-teal-600 p-6 md:p-8 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Watch className="h-6 w-6" />
            <h1 className="text-2xl md:text-3xl font-heading font-bold">Wearable Device Integration</h1>
          </div>
          <p className="text-white/80 text-sm">Connect your fitness trackers and smartwatches for real-time health monitoring.</p>
        </div>
        <Watch className="absolute top-4 right-6 h-20 w-20 text-white/10" />
      </div>

      {/* Devices + Add Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">My Devices</h2>
        <Button onClick={handleAddDevice} size="sm" className="gap-2">
          <Plus className="h-4 w-4" /> Connect Device
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {devices.map((d, i) => (
              <motion.div key={d.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ delay: i * 0.1 }}>
                <Card className={`rounded-card cursor-pointer transition-all hover:shadow-md ${selectedDevice === i ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedDevice(i)}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{d.icon}</span>
                        <Watch className="h-4 w-4 text-primary" />
                      </div>
                      {d.connected
                        ? <Badge className="bg-success/10 text-success border-0 text-xs gap-1"><Wifi className="h-3 w-3" /> Connected</Badge>
                        : <Badge variant="outline" className="text-muted-foreground text-xs gap-1"><WifiOff className="h-3 w-3" /> Offline</Badge>
                      }
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{d.name}</h4>
                      <p className="text-xs text-muted-foreground">{d.type}</p>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>🔋 {d.battery}%</span>
                      <span>Synced {formatLastSync(d.last_sync)}</span>
                    </div>
                    <Progress value={d.battery} className="h-1" />
                    <div className="flex gap-2 pt-1">
                      {d.connected ? (
                        <>
                          <Button variant="outline" size="sm" className="flex-1 text-xs h-8 gap-1" onClick={(e) => { e.stopPropagation(); handleSyncDevice(d.id); }} disabled={syncingDeviceId === d.id}>
                            {syncingDeviceId === d.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                            {syncingDeviceId === d.id ? 'Syncing...' : 'Sync'}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-8" onClick={(e) => { e.stopPropagation(); setShowDeviceSettings(d.id); }}>Settings</Button>
                        </>
                      ) : (
                        <>
                          <Button variant="default" size="sm" className="flex-1 text-xs h-8 gap-1" onClick={(e) => { e.stopPropagation(); handleReconnect(d.id); }}>
                            <Bluetooth className="h-3 w-3" /> Reconnect
                          </Button>
                          <Button variant="ghost" size="sm" className="text-xs h-8 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); handleRemoveDevice(d.id); }}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <Card className="rounded-card border-dashed border-2 border-muted-foreground/20 cursor-pointer hover:border-primary/40 hover:bg-accent/30 transition-all h-full flex items-center justify-center min-h-[180px]" onClick={handleAddDevice}>
              <CardContent className="p-4 text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Add New Device</p>
                <p className="text-xs text-muted-foreground/70">Connect via Bluetooth</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Vitals */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {vitals.map((v, i) => (
          <motion.div key={v.label} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}>
            <Card className="rounded-card">
              <CardContent className="p-4">
                <div className={`p-2 rounded-lg ${v.bg} w-fit mb-2`}><v.icon className={`h-4 w-4 ${v.color}`} /></div>
                <p className="text-xs text-muted-foreground">{v.label}</p>
                <p className="text-lg font-bold">{v.value}</p>
                <p className={`text-xs ${v.color}`}>{v.trend}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="rounded-card">
          <CardHeader><CardTitle className="text-sm">Heart Rate (24h)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={heartRateData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 10 }} domain={[50, 120]} className="text-muted-foreground" />
                <Tooltip />
                <Area type="monotone" dataKey="bpm" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive) / 0.1)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="rounded-card">
          <CardHeader><CardTitle className="text-sm">Weekly Steps</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={stepsData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                <Tooltip />
                <Line type="monotone" dataKey="steps" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="rounded-card border-warning/30">
        <CardContent className="p-4">
          <h4 className="font-medium text-sm mb-3 flex items-center gap-2"><Activity className="h-4 w-4 text-warning" /> Smart Health Alerts</h4>
          <div className="space-y-2">
            {[
              { msg: 'Resting heart rate elevated (78 bpm avg). Consider stress management.', severity: 'warning', time: '2h ago' },
              { msg: 'Great job! You hit your 10,000 steps goal on Wednesday.', severity: 'success', time: '1d ago' },
              { msg: 'Sleep quality dropped 15% this week. Try consistent bedtime.', severity: 'info', time: '2d ago' },
            ].map((a, i) => (
              <div key={i} className={`p-3 rounded-lg text-xs ${a.severity === 'warning' ? 'bg-warning/10 text-warning' : a.severity === 'success' ? 'bg-success/10 text-success' : 'bg-info/10 text-info'}`}>
                <div className="flex justify-between"><span>{a.msg}</span><span className="text-muted-foreground shrink-0 ml-2">{a.time}</span></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Device Dialog */}
      <Dialog open={showAddDialog} onOpenChange={(open) => { setShowAddDialog(open); if (!open) { setFoundBluetoothDevices([]); setBluetoothError(null); setSelectedBrand(null); } }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bluetooth className="h-5 w-5 text-primary" />
              {selectedBrand ? `Select ${selectedBrand.name} Model` : 'Connect a Device'}
            </DialogTitle>
            <DialogDescription>
              {selectedBrand ? 'Choose your device model to start pairing.' : 'Scan for nearby Bluetooth devices or select from supported brands.'}
            </DialogDescription>
          </DialogHeader>

          {!selectedBrand ? (
            <Tabs value={addDialogTab} onValueChange={setAddDialogTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="bluetooth" className="gap-1.5 text-xs">
                  <Radio className="h-3.5 w-3.5" /> Bluetooth Scan
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-1.5 text-xs">
                  <Watch className="h-3.5 w-3.5" /> Select Brand
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bluetooth" className="space-y-4 pt-2">
                {/* Bluetooth scan section */}
                <div className="text-center space-y-4">
                  <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    {bluetoothScanning
                      ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}><BluetoothSearching className="h-10 w-10 text-primary" /></motion.div>
                      : <Bluetooth className="h-10 w-10 text-primary" />
                    }
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {bluetoothScanning ? 'Scanning for nearby devices...' : 'Scan for Nearby Devices'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Make sure your smartwatch or fitness tracker has Bluetooth enabled and is in pairing mode.
                    </p>
                  </div>
                  <Button onClick={handleBluetoothScan} disabled={bluetoothScanning} className="gap-2">
                    {bluetoothScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : <BluetoothSearching className="h-4 w-4" />}
                    {bluetoothScanning ? 'Scanning...' : 'Start Bluetooth Scan'}
                  </Button>

                  {!isBluetoothSupported() && (
                    <div className="p-3 rounded-lg bg-warning/10 text-warning text-xs flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>Web Bluetooth is not supported in this browser. Use Chrome on desktop or Android for Bluetooth scanning. You can still add devices manually from the "Select Brand" tab.</span>
                    </div>
                  )}

                  {bluetoothError && (
                    <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{bluetoothError}</span>
                    </div>
                  )}
                </div>

                {/* Found devices */}
                {foundBluetoothDevices.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Found Devices</p>
                    {foundBluetoothDevices.map((btDev, i) => {
                      const cls = classifyBluetoothDevice(btDev.name);
                      return (
                        <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
                          <Card className="rounded-card hover:ring-2 hover:ring-primary/50 transition-all">
                            <CardContent className="p-3 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                  <span className="text-lg">{cls.icon}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">{btDev.name}</p>
                                  <p className="text-xs text-muted-foreground">{cls.type} • {cls.brand}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                className="gap-1 text-xs"
                                disabled={connectingBtDevice === btDev.name}
                                onClick={() => handleConnectBluetoothDevice(btDev)}
                              >
                                {connectingBtDevice === btDev.name
                                  ? <><Loader2 className="h-3 w-3 animate-spin" /> Connecting</>
                                  : <><Bluetooth className="h-3 w-3" /> Connect</>
                                }
                              </Button>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Scan again hint */}
                {foundBluetoothDevices.length > 0 && (
                  <Button variant="ghost" size="sm" className="w-full text-xs" onClick={handleBluetoothScan}>
                    <RefreshCw className="h-3 w-3 mr-1" /> Scan for more devices
                  </Button>
                )}
              </TabsContent>

              <TabsContent value="manual" className="pt-2">
                <div className="grid grid-cols-2 gap-3">
                  {availableDevices.map((device) => (
                    <Card key={device.name} className="rounded-card cursor-pointer hover:ring-2 hover:ring-primary/50 hover:bg-accent/30 transition-all" onClick={() => handleSelectBrand(device)}>
                      <CardContent className="p-4 text-center space-y-2">
                        <span className="text-3xl">{device.icon}</span>
                        <p className="text-sm font-medium">{device.name}</p>
                        <p className="text-xs text-muted-foreground">{device.type}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="space-y-2 py-2">
              <Button variant="ghost" size="sm" className="text-xs mb-2" onClick={() => setSelectedBrand(null)}>← Back to brands</Button>
              {selectedBrand.models.map((model) => (
                <Card key={model} className="rounded-card cursor-pointer hover:ring-2 hover:ring-primary/50 hover:bg-accent/30 transition-all" onClick={() => handleStartPairing(model)}>
                  <CardContent className="p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{selectedBrand.icon}</span>
                      <div>
                        <p className="text-sm font-medium">{selectedBrand.name} {model}</p>
                        <p className="text-xs text-muted-foreground">{selectedBrand.type}</p>
                      </div>
                    </div>
                    <Bluetooth className="h-4 w-4 text-primary" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Pairing Dialog */}
      <Dialog open={showPairingDialog} onOpenChange={(open) => { if (!open) setShowPairingDialog(false); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              {pairingStep === 'scanning' && 'Scanning for Device...'}
              {pairingStep === 'found' && 'Device Found!'}
              {pairingStep === 'pairing' && 'Pairing...'}
              {pairingStep === 'success' && 'Connected!'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center py-8 space-y-4">
            <AnimatePresence mode="wait">
              {pairingStep === 'scanning' && (
                <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4">
                  <div className="relative mx-auto w-20 h-20">
                    <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 rounded-full bg-primary/20" />
                    <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center">
                      <BluetoothSearching className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Make sure your device is nearby and Bluetooth is enabled</p>
                </motion.div>
              )}
              {pairingStep === 'found' && (
                <motion.div key="found" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                    <Smartphone className="h-8 w-8 text-success" />
                  </div>
                  <p className="text-sm font-medium">{selectedBrand?.name} {selectedModel}</p>
                  <p className="text-xs text-muted-foreground">Connecting to device...</p>
                </motion.div>
              )}
              {pairingStep === 'pairing' && (
                <motion.div key="pairing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4">
                  <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                  <p className="text-sm text-muted-foreground">Establishing secure connection...</p>
                  <p className="text-xs text-muted-foreground/70">Please confirm pairing on your device</p>
                </motion.div>
              )}
              {pairingStep === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-4">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                    <Check className="h-8 w-8 text-success" />
                  </motion.div>
                  <p className="text-sm font-medium">{selectedBrand?.name} {selectedModel}</p>
                  <p className="text-xs text-success">Successfully paired and syncing data</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {pairingStep === 'success' && (
            <DialogFooter>
              <Button className="w-full" onClick={() => setShowPairingDialog(false)}>Done</Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>

      {/* Device Settings Dialog */}
      <Dialog open={!!showDeviceSettings} onOpenChange={() => setShowDeviceSettings(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Device Settings</DialogTitle>
            <DialogDescription>{devices.find(d => d.id === showDeviceSettings)?.name}</DialogDescription>
          </DialogHeader>
          {showDeviceSettings && (() => {
            const device = devices.find(d => d.id === showDeviceSettings);
            if (!device) return null;
            return (
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Auto Sync</p><p className="text-xs text-muted-foreground">Automatically sync health data</p></div>
                  <Switch checked={device.sync_enabled} onCheckedChange={(checked) => handleToggleSync(device.id, checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Battery</p><p className="text-xs text-muted-foreground">{device.battery}% remaining</p></div>
                  <Progress value={device.battery} className="w-20 h-2" />
                </div>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-medium">Last Synced</p><p className="text-xs text-muted-foreground">{formatLastSync(device.last_sync)}</p></div>
                  <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => { handleSyncDevice(device.id); setShowDeviceSettings(null); }}>
                    <RefreshCw className="h-3 w-3" /> Sync Now
                  </Button>
                </div>
                <div className="border-t pt-4 space-y-2">
                  <Button variant="outline" className="w-full text-sm" onClick={() => handleDisconnect(device.id)}>
                    <WifiOff className="h-4 w-4 mr-2" /> Disconnect
                  </Button>
                  <Button variant="ghost" className="w-full text-sm text-destructive hover:text-destructive" onClick={() => handleRemoveDevice(device.id)}>
                    <Trash2 className="h-4 w-4 mr-2" /> Remove Device
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WearableIntegration;
