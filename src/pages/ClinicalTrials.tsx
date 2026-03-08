import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Microscope, MapPin, CheckCircle2, Clock, ExternalLink, Filter, Search, Heart, Calendar, Users, Building, FileText, Star, Bookmark, BookmarkCheck, Navigation, MapIcon, Phone, Mail, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface Trial {
  id: string;
  title: string;
  sponsor: string;
  location: string;
  address: string;
  lat: number;
  lng: number;
  distance?: string;
  phase: string;
  status: string;
  match: number;
  condition: string;
  description: string;
  eligibility: string[];
  duration: string;
  compensation: string;
  startDate: string;
  endDate: string;
  participants: number;
  contactEmail: string;
  contactPhone: string;
  website: string;
  openingHours: { day: string; open: string; close: string }[];
}

const allTrials: Trial[] = [
  { 
    id: '1',
    title: 'Phase III Diabetes Management Trial', 
    sponsor: 'HealthCorp Pharma', 
    location: 'Mumbai, India', 
    address: 'Kokilaben Dhirubhai Ambani Hospital, Andheri West, Mumbai 400053',
    lat: 19.1334,
    lng: 72.8262,
    phase: 'Phase III', 
    status: 'Recruiting', 
    match: 95, 
    condition: 'Type 2 Diabetes',
    description: 'A randomized, double-blind study evaluating the efficacy of a novel GLP-1 receptor agonist in managing Type 2 Diabetes with improved cardiovascular outcomes.',
    eligibility: ['Age 35-70', 'Diagnosed with Type 2 Diabetes for 2+ years', 'HbA1c between 7.5-10%', 'No history of pancreatitis'],
    duration: '52 weeks',
    compensation: '₹15,000 per visit',
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    participants: 500,
    contactEmail: 'diabetes-trial@healthcorp.com',
    contactPhone: '+91 22 3069 6969',
    website: 'https://healthcorp-trials.com',
    openingHours: [
      { day: 'Monday', open: '09:00', close: '18:00' },
      { day: 'Tuesday', open: '09:00', close: '18:00' },
      { day: 'Wednesday', open: '09:00', close: '18:00' },
      { day: 'Thursday', open: '09:00', close: '18:00' },
      { day: 'Friday', open: '09:00', close: '17:00' },
      { day: 'Saturday', open: '10:00', close: '14:00' },
      { day: 'Sunday', open: 'Closed', close: 'Closed' },
    ]
  },
  { 
    id: '2',
    title: 'Cardiovascular Risk Reduction Study', 
    sponsor: 'CardioResearch Ltd', 
    location: 'Chennai, India', 
    address: 'Apollo Hospitals, Greams Road, Chennai 600006',
    lat: 13.0569,
    lng: 80.2425,
    phase: 'Phase II', 
    status: 'Recruiting', 
    match: 82, 
    condition: 'Hypertension',
    description: 'Investigating a new ACE inhibitor combination therapy for patients with resistant hypertension and elevated cardiovascular risk factors.',
    eligibility: ['Age 40-75', 'Blood pressure >140/90 mmHg', 'On at least 2 antihypertensive medications', 'No recent stroke or MI'],
    duration: '24 weeks',
    compensation: '₹12,000 per visit',
    startDate: '2024-04-15',
    endDate: '2024-10-15',
    participants: 300,
    contactEmail: 'cardio-study@cardioresearch.com',
    contactPhone: '+91 44 2829 3333',
    website: 'https://cardioresearch-trials.com',
    openingHours: [
      { day: 'Monday', open: '08:00', close: '20:00' },
      { day: 'Tuesday', open: '08:00', close: '20:00' },
      { day: 'Wednesday', open: '08:00', close: '20:00' },
      { day: 'Thursday', open: '08:00', close: '20:00' },
      { day: 'Friday', open: '08:00', close: '18:00' },
      { day: 'Saturday', open: '09:00', close: '13:00' },
      { day: 'Sunday', open: 'Closed', close: 'Closed' },
    ]
  },
  { 
    id: '3',
    title: 'Novel Antibiotic Efficacy Trial', 
    sponsor: 'BioMed Sciences', 
    location: 'Bangalore, India', 
    address: 'Manipal Hospital, HAL Airport Road, Bangalore 560017',
    lat: 12.9592,
    lng: 77.6480,
    phase: 'Phase I', 
    status: 'Enrolling', 
    match: 68, 
    condition: 'Bacterial Infection',
    description: 'First-in-human study of a new broad-spectrum antibiotic targeting multi-drug resistant gram-negative bacteria.',
    eligibility: ['Age 18-55', 'Good general health', 'No antibiotic use in past 30 days', 'BMI 18-30'],
    duration: '8 weeks',
    compensation: '₹25,000 total',
    startDate: '2024-05-01',
    endDate: '2024-07-01',
    participants: 60,
    contactEmail: 'antibiotic-trial@biomed.com',
    contactPhone: '+91 80 2502 4444',
    website: 'https://biomed-sciences.com',
    openingHours: [
      { day: 'Monday', open: '09:00', close: '17:00' },
      { day: 'Tuesday', open: '09:00', close: '17:00' },
      { day: 'Wednesday', open: '09:00', close: '17:00' },
      { day: 'Thursday', open: '09:00', close: '17:00' },
      { day: 'Friday', open: '09:00', close: '17:00' },
      { day: 'Saturday', open: 'Closed', close: 'Closed' },
      { day: 'Sunday', open: 'Closed', close: 'Closed' },
    ]
  },
  { 
    id: '4',
    title: 'Mental Health CBT Digital Therapy', 
    sponsor: 'MindWell Inc', 
    location: 'Remote / Online', 
    address: 'Virtual - No physical location required',
    lat: 0,
    lng: 0,
    phase: 'Phase II', 
    status: 'Recruiting', 
    match: 91, 
    condition: 'Anxiety & Depression',
    description: 'Evaluating the effectiveness of an AI-powered CBT app combined with teletherapy sessions for treating moderate anxiety and depression.',
    eligibility: ['Age 18-65', 'PHQ-9 score 10-19', 'Access to smartphone', 'English or Hindi speaking'],
    duration: '12 weeks',
    compensation: 'Free therapy + ₹5,000',
    startDate: '2024-02-01',
    endDate: '2024-05-01',
    participants: 1000,
    contactEmail: 'cbt-study@mindwell.com',
    contactPhone: '+91 1800 123 4567',
    website: 'https://mindwell-therapy.com',
    openingHours: [
      { day: 'Monday', open: '00:00', close: '23:59' },
      { day: 'Tuesday', open: '00:00', close: '23:59' },
      { day: 'Wednesday', open: '00:00', close: '23:59' },
      { day: 'Thursday', open: '00:00', close: '23:59' },
      { day: 'Friday', open: '00:00', close: '23:59' },
      { day: 'Saturday', open: '00:00', close: '23:59' },
      { day: 'Sunday', open: '00:00', close: '23:59' },
    ]
  },
  { 
    id: '5',
    title: 'Oncology Immunotherapy Trial', 
    sponsor: 'OncoGen Therapeutics', 
    location: 'Delhi, India', 
    address: 'AIIMS, Ansari Nagar, New Delhi 110029',
    lat: 28.5672,
    lng: 77.2100,
    phase: 'Phase III', 
    status: 'Active', 
    match: 72, 
    condition: 'Lung Cancer',
    description: 'Comparing a novel PD-L1 inhibitor combination with standard chemotherapy in advanced non-small cell lung cancer patients.',
    eligibility: ['Age 18+', 'Stage IIIB/IV NSCLC', 'ECOG status 0-1', 'No prior immunotherapy'],
    duration: '2 years',
    compensation: 'Free treatment + travel allowance',
    startDate: '2023-06-01',
    endDate: '2025-06-01',
    participants: 800,
    contactEmail: 'lung-trial@oncogen.com',
    contactPhone: '+91 11 2658 8500',
    website: 'https://oncogen-therapeutics.com',
    openingHours: [
      { day: 'Monday', open: '08:00', close: '16:00' },
      { day: 'Tuesday', open: '08:00', close: '16:00' },
      { day: 'Wednesday', open: '08:00', close: '16:00' },
      { day: 'Thursday', open: '08:00', close: '16:00' },
      { day: 'Friday', open: '08:00', close: '16:00' },
      { day: 'Saturday', open: 'Closed', close: 'Closed' },
      { day: 'Sunday', open: 'Closed', close: 'Closed' },
    ]
  },
  { 
    id: '6',
    title: 'Pediatric Asthma Inhaler Study', 
    sponsor: 'RespiCare Pharma', 
    location: 'Pune, India', 
    address: 'Jehangir Hospital, Sassoon Road, Pune 411001',
    lat: 18.5314,
    lng: 73.8446,
    phase: 'Phase II', 
    status: 'Recruiting', 
    match: 58, 
    condition: 'Asthma',
    description: 'Testing a new smart inhaler with real-time monitoring for improved asthma management in children.',
    eligibility: ['Age 6-17', 'Diagnosed asthma for 1+ year', 'Using rescue inhaler 2+ times/week', 'Parent/guardian consent'],
    duration: '16 weeks',
    compensation: 'Free smart inhaler + ₹3,000',
    startDate: '2024-03-15',
    endDate: '2024-07-15',
    participants: 200,
    contactEmail: 'asthma-kids@respircare.com',
    contactPhone: '+91 20 6681 9999',
    website: 'https://respircare-pharma.com',
    openingHours: [
      { day: 'Monday', open: '09:00', close: '18:00' },
      { day: 'Tuesday', open: '09:00', close: '18:00' },
      { day: 'Wednesday', open: '09:00', close: '18:00' },
      { day: 'Thursday', open: '09:00', close: '18:00' },
      { day: 'Friday', open: '09:00', close: '17:00' },
      { day: 'Saturday', open: '10:00', close: '14:00' },
      { day: 'Sunday', open: 'Closed', close: 'Closed' },
    ]
  },
];

// Helper functions
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const isOpenNow = (hours: { day: string; open: string; close: string }[]): { isOpen: boolean; nextChange: string } => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const now = new Date();
  const currentDay = days[now.getDay()];
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const todayHours = hours.find(h => h.day === currentDay);
  if (!todayHours || todayHours.open === 'Closed') {
    return { isOpen: false, nextChange: 'Opens tomorrow' };
  }
  
  const [openH, openM] = todayHours.open.split(':').map(Number);
  const [closeH, closeM] = todayHours.close.split(':').map(Number);
  const openTime = openH * 60 + openM;
  const closeTime = closeH * 60 + closeM;
  
  if (currentTime >= openTime && currentTime < closeTime) {
    return { isOpen: true, nextChange: `Closes at ${todayHours.close}` };
  } else if (currentTime < openTime) {
    return { isOpen: false, nextChange: `Opens at ${todayHours.open}` };
  } else {
    return { isOpen: false, nextChange: 'Opens tomorrow' };
  }
};

const ClinicalTrials = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [conditionFilter, setConditionFilter] = useState('all');
  const [selectedTrial, setSelectedTrial] = useState<Trial | null>(null);
  const [savedTrials, setSavedTrials] = useState<string[]>([]);
  const [appliedTrials, setAppliedTrials] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [trialsWithDistance, setTrialsWithDistance] = useState<Trial[]>(allTrials);
  const [distanceFilter, setDistanceFilter] = useState('all');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCitySelector, setShowCitySelector] = useState(false);

  // Predefined city locations
  const cities = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Delhi', lat: 28.6139, lng: 77.2090 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Lucknow', lat: 26.8467, lng: 80.9462 },
  ];

  const updateDistancesFromLocation = useCallback((lat: number, lng: number) => {
    const updatedTrials = allTrials.map(trial => {
      if (trial.lat === 0 && trial.lng === 0) {
        return { ...trial, distance: 'Remote' };
      }
      const dist = calculateDistance(lat, lng, trial.lat, trial.lng);
      return { ...trial, distance: dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km` };
    });
    setTrialsWithDistance(updatedTrials);
  }, []);

  const selectCity = (cityName: string) => {
    const city = cities.find(c => c.name === cityName);
    if (city) {
      setSelectedCity(cityName);
      setUserLocation({ lat: city.lat, lng: city.lng });
      updateDistancesFromLocation(city.lat, city.lng);
      setShowCitySelector(false);
      toast.success(`Location set to ${cityName}. Distances updated.`);
    }
  };

  // Get user's real-time location
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.info('Geolocation not supported. Please select your city manually.');
      setShowCitySelector(true);
      return;
    }
    
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setSelectedCity('Current Location');
        updateDistancesFromLocation(latitude, longitude);
        setLocationLoading(false);
        toast.success('Location updated! Distances calculated based on your position.');
      },
      (error) => {
        setLocationLoading(false);
        setShowCitySelector(true);
        toast.info('Location access denied. Please select your city below.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [updateDistancesFromLocation]);

  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  const openInMaps = (trial: Trial) => {
    if (trial.lat === 0 && trial.lng === 0) {
      toast.info('This is a remote trial with no physical location');
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${trial.lat},${trial.lng}`;
    window.open(url, '_blank');
  };

  const getDirections = (trial: Trial) => {
    if (trial.lat === 0 && trial.lng === 0) {
      toast.info('This is a remote trial with no physical location');
      return;
    }
    const url = userLocation 
      ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${trial.lat},${trial.lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${trial.lat},${trial.lng}`;
    window.open(url, '_blank');
  };

  const conditions = useMemo(() => [...new Set(trialsWithDistance.map(t => t.condition))], [trialsWithDistance]);

  const filteredTrials = useMemo(() => {
    return trialsWithDistance.filter(trial => {
      const matchesSearch = trial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trial.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           trial.sponsor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPhase = phaseFilter === 'all' || trial.phase === phaseFilter;
      const matchesStatus = statusFilter === 'all' || trial.status === statusFilter;
      const matchesCondition = conditionFilter === 'all' || trial.condition === conditionFilter;
      
      // Distance filter
      let matchesDistance = true;
      if (distanceFilter !== 'all' && userLocation) {
        if (distanceFilter === 'remote') {
          matchesDistance = trial.lat === 0 && trial.lng === 0;
        } else {
          const maxDistance = parseInt(distanceFilter);
          if (trial.lat === 0 && trial.lng === 0) {
            matchesDistance = false; // Exclude remote for distance filters
          } else {
            const dist = calculateDistance(userLocation.lat, userLocation.lng, trial.lat, trial.lng);
            matchesDistance = dist <= maxDistance;
          }
        }
      }
      
      return matchesSearch && matchesPhase && matchesStatus && matchesCondition && matchesDistance;
    }).sort((a, b) => b.match - a.match);
  }, [searchQuery, phaseFilter, statusFilter, conditionFilter, distanceFilter, trialsWithDistance, userLocation]);

  const savedTrialsList = useMemo(() => trialsWithDistance.filter(t => savedTrials.includes(t.id)), [savedTrials, trialsWithDistance]);

  const toggleSaveTrial = (trialId: string) => {
    setSavedTrials(prev => {
      if (prev.includes(trialId)) {
        toast.success('Trial removed from saved list');
        return prev.filter(id => id !== trialId);
      } else {
        toast.success('Trial saved for later');
        return [...prev, trialId];
      }
    });
  };

  const applyToTrial = (trial: Trial) => {
    if (appliedTrials.includes(trial.id)) {
      toast.info('You have already applied to this trial');
      return;
    }
    setAppliedTrials(prev => [...prev, trial.id]);
    toast.success(`Application submitted for "${trial.title}"`, {
      description: 'The research team will contact you within 5-7 business days.',
    });
    setSelectedTrial(null);
  };

  const recruitingCount = trialsWithDistance.filter(t => t.status === 'Recruiting').length;
  const bestMatch = Math.max(...trialsWithDistance.map(t => t.match));

  return (
    <div className="space-y-6">
      <div className="page-header gradient-cool animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Microscope className="h-5 w-5 text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Clinical Trials</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Clinical Trial Matcher</h1>
          <p className="mt-1 text-white/75 text-sm">Find and apply to relevant clinical trials based on your health profile.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="stat-icon-blue"><Microscope className="h-5 w-5" /></div>
            <div><p className="text-2xl font-heading font-bold">{allTrials.length}</p><p className="text-xs text-muted-foreground">Available Trials</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="stat-icon-green"><CheckCircle2 className="h-5 w-5" /></div>
            <div><p className="text-2xl font-heading font-bold">{bestMatch}%</p><p className="text-xs text-muted-foreground">Best Match</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="stat-icon-purple"><Clock className="h-5 w-5" /></div>
            <div><p className="text-2xl font-heading font-bold">{recruitingCount}</p><p className="text-xs text-muted-foreground">Recruiting Now</p></div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="stat-icon-orange"><FileText className="h-5 w-5" /></div>
            <div><p className="text-2xl font-heading font-bold">{appliedTrials.length}</p><p className="text-xs text-muted-foreground">Applications</p></div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 md:w-auto md:inline-grid">
          <TabsTrigger value="browse" className="gap-2"><Search className="h-4 w-4" />Browse Trials</TabsTrigger>
          <TabsTrigger value="saved" className="gap-2"><Bookmark className="h-4 w-4" />Saved ({savedTrials.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4 mt-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by condition, trial name, or sponsor..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={conditionFilter} onValueChange={setConditionFilter}>
                  <SelectTrigger className="w-full md:w-40"><SelectValue placeholder="Condition" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    {conditions.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={phaseFilter} onValueChange={setPhaseFilter}>
                  <SelectTrigger className="w-full md:w-32"><SelectValue placeholder="Phase" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Phases</SelectItem>
                    <SelectItem value="Phase I">Phase I</SelectItem>
                    <SelectItem value="Phase II">Phase II</SelectItem>
                    <SelectItem value="Phase III">Phase III</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Recruiting">Recruiting</SelectItem>
                    <SelectItem value="Enrolling">Enrolling</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={distanceFilter} onValueChange={setDistanceFilter}>
                  <SelectTrigger className="w-full md:w-36"><SelectValue placeholder="Distance" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Distance</SelectItem>
                    <SelectItem value="10">Within 10 km</SelectItem>
                    <SelectItem value="25">Within 25 km</SelectItem>
                    <SelectItem value="50">Within 50 km</SelectItem>
                    <SelectItem value="100">Within 100 km</SelectItem>
                    <SelectItem value="500">Within 500 km</SelectItem>
                    <SelectItem value="remote">Remote Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Select value={selectedCity} onValueChange={selectCity}>
                  <SelectTrigger className="w-full md:w-40">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map(city => (
                      <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={getUserLocation}
                  disabled={locationLoading}
                  className="gap-2"
                >
                  <Navigation className={`h-4 w-4 ${locationLoading ? 'animate-pulse' : ''}`} />
                  {locationLoading ? 'Locating...' : 'Use GPS'}
                </Button>
                {selectedCity && (
                  <Badge variant="secondary" className="gap-1">
                    <MapPin className="h-3 w-3" /> {selectedCity}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><Filter className="h-4 w-4" /> Matched Clinical Trials ({filteredTrials.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTrials.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Microscope className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No trials match your search criteria</p>
                  </div>
                ) : filteredTrials.map((t) => {
                  const openStatus = isOpenNow(t.openingHours);
                  return (
                    <div key={t.id} className="p-4 rounded-xl border hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{t.title}</h4>
                          <p className="text-xs text-muted-foreground">{t.sponsor}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => toggleSaveTrial(t.id)}
                          >
                            {savedTrials.includes(t.id) ? (
                              <BookmarkCheck className="h-4 w-4 text-primary" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                          <Badge className={t.match >= 90 ? 'bg-success/10 text-success' : t.match >= 80 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}>{t.match}% Match</Badge>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">{t.phase}</Badge>
                        <Badge variant="outline">{t.condition}</Badge>
                        <Badge className={openStatus.isOpen ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>
                          <Clock className="h-3 w-3 mr-1" />
                          {openStatus.isOpen ? 'Open' : 'Closed'} · {openStatus.nextChange}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{t.address}</span>
                        <span className="shrink-0 font-medium text-foreground">({t.distance})</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={t.status === 'Recruiting' ? 'default' : 'secondary'}>{t.status}</Badge>
                          {appliedTrials.includes(t.id) && (
                            <Badge className="bg-success/10 text-success">Applied</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {t.lat !== 0 && (
                            <Button size="sm" variant="ghost" onClick={() => openInMaps(t)}>
                              <MapIcon className="h-3 w-3" />
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={() => setSelectedTrial(t)}>
                            <ExternalLink className="h-3 w-3 mr-1" /> Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><BookmarkCheck className="h-4 w-4" /> Saved Trials</CardTitle></CardHeader>
            <CardContent>
              {savedTrialsList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bookmark className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No saved trials yet</p>
                  <p className="text-sm mt-1">Save trials while browsing to review them later</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedTrialsList.map((t) => (
                    <div key={t.id} className="p-4 rounded-xl border hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-sm">{t.title}</h4>
                          <p className="text-xs text-muted-foreground">{t.sponsor}</p>
                        </div>
                        <Badge className={t.match >= 90 ? 'bg-success/10 text-success' : t.match >= 80 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}>{t.match}% Match</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary">{t.phase}</Badge>
                        <Badge variant="outline">{t.condition}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedTrial(t)}>
                          <ExternalLink className="h-3 w-3 mr-1" /> View Details
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toggleSaveTrial(t.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedTrial} onOpenChange={() => setSelectedTrial(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedTrial && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedTrial.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <Building className="h-4 w-4" /> {selectedTrial.sponsor}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-5 mt-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{selectedTrial.phase}</Badge>
                  <Badge variant={selectedTrial.status === 'Recruiting' ? 'default' : 'secondary'}>{selectedTrial.status}</Badge>
                  <Badge className={selectedTrial.match >= 90 ? 'bg-success/10 text-success' : selectedTrial.match >= 80 ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}>{selectedTrial.match}% Match</Badge>
                  {(() => {
                    const openStatus = isOpenNow(selectedTrial.openingHours);
                    return (
                      <Badge className={openStatus.isOpen ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}>
                        {openStatus.isOpen ? 'Open Now' : 'Closed'} · {openStatus.nextChange}
                      </Badge>
                    );
                  })()}
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedTrial.description}</p>
                </div>

                {/* Location & Map Section */}
                <div className="p-4 rounded-xl bg-muted/30 border space-y-3">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Location & Directions
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedTrial.address}</p>
                  <p className="text-xs text-muted-foreground">Distance: <span className="font-medium text-foreground">{selectedTrial.distance}</span></p>
                  {selectedTrial.lat !== 0 && (
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => openInMaps(selectedTrial)} className="gap-2">
                        <MapIcon className="h-4 w-4" /> View on Map
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => getDirections(selectedTrial)} className="gap-2">
                        <Navigation className="h-4 w-4" /> Get Directions
                      </Button>
                    </div>
                  )}
                </div>

                {/* Opening Hours */}
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Opening Hours
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedTrial.openingHours.map((h, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1 px-2 rounded bg-muted/30">
                        <span className="font-medium">{h.day}</span>
                        <span className="text-muted-foreground">
                          {h.open === 'Closed' ? 'Closed' : h.open === '00:00' && h.close === '23:59' ? '24 Hours' : `${h.open} - ${h.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <Calendar className="h-4 w-4 text-primary" /> Duration
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTrial.duration}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <Users className="h-4 w-4 text-primary" /> Participants
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTrial.participants} needed</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <Star className="h-4 w-4 text-primary" /> Compensation
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTrial.compensation}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2 text-sm font-medium mb-1">
                      <Calendar className="h-4 w-4 text-primary" /> Trial Period
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedTrial.startDate} to {selectedTrial.endDate}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="font-semibold text-sm mb-2">Contact Information</h4>
                  <div className="space-y-2">
                    <a href={`tel:${selectedTrial.contactPhone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Phone className="h-4 w-4 text-primary" /> {selectedTrial.contactPhone}
                    </a>
                    <a href={`mailto:${selectedTrial.contactEmail}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Mail className="h-4 w-4 text-primary" /> {selectedTrial.contactEmail}
                    </a>
                    <a href={selectedTrial.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <Globe className="h-4 w-4 text-primary" /> {selectedTrial.website}
                    </a>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Eligibility Criteria</h4>
                  <ul className="space-y-1">
                    {selectedTrial.eligibility.map((criterion, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                        {criterion}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 pt-2">
                  {appliedTrials.includes(selectedTrial.id) ? (
                    <Button disabled className="flex-1 gap-2">
                      <CheckCircle2 className="h-4 w-4" /> Application Submitted
                    </Button>
                  ) : (
                    <Button className="flex-1 gap-2" onClick={() => applyToTrial(selectedTrial)}>
                      <FileText className="h-4 w-4" /> Apply to Trial
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => toggleSaveTrial(selectedTrial.id)}>
                    {savedTrials.includes(selectedTrial.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClinicalTrials;
