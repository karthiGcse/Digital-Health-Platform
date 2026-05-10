import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, Activity, Loader2, Phone, Trash2, Clock, Baby, User, Heart, Stethoscope, Hash, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useHospitalDB } from '@/hooks/useHospitalDB';

type PatientType = 'child' | 'adult' | 'pregnant';

const patientTypeConfig: Record<PatientType, { label: string; icon: typeof Baby; description: string; ageRange: string }> = {
  child: { label: 'Child (0-12)', icon: Baby, description: 'Pediatric symptom assessment with child-safe guidelines', ageRange: '0-12' },
  adult: { label: 'Adult (13+)', icon: User, description: 'Standard adult symptom assessment', ageRange: '13+' },
  pregnant: { label: 'Pregnant', icon: Heart, description: 'Pregnancy-safe assessment with OB/GYN guidance', ageRange: '18-45' },
};

const baseSymptomCategories: Record<string, string[]> = {
  'General': ['Fever', 'Fatigue', 'Chills', 'Weight Loss', 'Night Sweats', 'Loss of Appetite', 'Weakness', 'Dehydration', 'Body Ache', 'Swollen Lymph Nodes'],
  'Head & Neuro': ['Headache', 'Dizziness', 'Blurred Vision', 'Confusion', 'Memory Loss', 'Seizures', 'Numbness', 'Tingling', 'Tremors', 'Fainting', 'Migraine', 'Light Sensitivity'],
  'Respiratory': ['Cough', 'Shortness of Breath', 'Wheezing', 'Sore Throat', 'Runny Nose', 'Sneezing', 'Chest Congestion', 'Coughing Blood', 'Difficulty Breathing', 'Hoarseness'],
  'Cardiac': ['Chest Pain', 'Palpitations', 'Rapid Heartbeat', 'Swollen Legs', 'High Blood Pressure', 'Low Blood Pressure', 'Irregular Heartbeat', 'Cold Extremities', 'Chest Tightness'],
  'Digestive': ['Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Abdominal Pain', 'Bloating', 'Heartburn', 'Blood in Stool', 'Loss of Appetite', 'Acid Reflux', 'Difficulty Swallowing Food', 'Stomach Cramps'],
  'Musculoskeletal': ['Joint Pain', 'Back Pain', 'Muscle Ache', 'Stiffness', 'Swelling', 'Cramps', 'Neck Pain', 'Shoulder Pain', 'Knee Pain', 'Hip Pain', 'Muscle Weakness', 'Bone Pain'],
  'Skin': ['Rash', 'Itching', 'Hives', 'Bruising', 'Dry Skin', 'Skin Discoloration', 'Wound Not Healing', 'Acne', 'Blisters', 'Hair Loss', 'Nail Changes', 'Excessive Sweating'],
  'Mental Health': ['Anxiety', 'Depression', 'Insomnia', 'Mood Swings', 'Panic Attacks', 'Stress', 'Brain Fog', 'Irritability', 'Lack of Motivation', 'Suicidal Thoughts', 'Hallucinations'],
  'Urinary': ['Painful Urination', 'Frequent Urination', 'Blood in Urine', 'Incontinence', 'Dark Urine', 'Cloudy Urine', 'Kidney Pain', 'Urinary Retention'],
  'ENT': ['Ear Pain', 'Hearing Loss', 'Tinnitus', 'Nasal Congestion', 'Difficulty Swallowing', 'Nosebleed', 'Jaw Pain', 'Loss of Smell', 'Loss of Taste', 'Sinus Pressure'],
  'Eyes': ['Eye Pain', 'Red Eyes', 'Watery Eyes', 'Dry Eyes', 'Double Vision', 'Eye Floaters', 'Swollen Eyelids', 'Sensitivity to Light'],
  'Hormonal': ['Excessive Thirst', 'Unexplained Weight Gain', 'Hot Flashes', 'Irregular Periods', 'Excessive Hunger', 'Cold Intolerance', 'Heat Intolerance', 'Mood Changes'],
  'Allergies': ['Sneezing Fits', 'Watery Eyes', 'Hives', 'Swollen Face', 'Throat Swelling', 'Anaphylaxis', 'Food Intolerance', 'Drug Reaction'],
  'Dental': ['Toothache', 'Bleeding Gums', 'Bad Breath', 'Jaw Stiffness', 'Tooth Sensitivity', 'Mouth Ulcers', 'Swollen Gums'],
  'Reproductive': ['Pelvic Pain', 'Abnormal Discharge', 'Erectile Dysfunction', 'Painful Intercourse', 'Infertility Concerns', 'Breast Pain', 'Menstrual Cramps', 'Heavy Periods'],
  'Liver & Kidney': ['Jaundice', 'Dark Urine', 'Pale Stools', 'Abdominal Swelling', 'Flank Pain', 'Swollen Ankles', 'Metallic Taste', 'Foamy Urine'],
  'Infectious': ['High Fever', 'Body Rash', 'Swollen Glands', 'Persistent Cough', 'Cold Sores', 'Wound Infection', 'Fungal Infection', 'Parasitic Symptoms'],
  'Blood & Immune': ['Easy Bruising', 'Prolonged Bleeding', 'Frequent Infections', 'Pale Skin', 'Chronic Fatigue', 'Swollen Spleen', 'Blood Clots', 'Autoimmune Flares'],
  'Nutrition': ['Vitamin Deficiency', 'Iron Deficiency', 'Calcium Deficiency', 'Protein Deficiency', 'Electrolyte Imbalance', 'Malnutrition Signs', 'Obesity Concerns'],
  'Sleep': ['Snoring', 'Sleep Apnea', 'Restless Legs', 'Sleepwalking', 'Excessive Daytime Sleepiness', 'Night Terrors', 'Difficulty Falling Asleep', 'Early Waking'],
};

const childOnlyCategories: Record<string, string[]> = {
  'Pediatric': ['Crying Excessively', 'Refusal to Eat', 'Diaper Rash', 'Teething Pain', 'Developmental Delay', 'Growth Concerns', 'Bed Wetting', 'Colic', 'Cradle Cap', 'Thumb Sucking Issues'],
  'Child Growth': ['Slow Weight Gain', 'Short Stature', 'Delayed Milestones', 'Speech Delay', 'Walking Delay', 'Poor Coordination', 'Learning Difficulty'],
  'Child Infections': ['Hand Foot Mouth', 'Chickenpox', 'Measles', 'Mumps', 'Whooping Cough', 'Croup', 'RSV Symptoms', 'Pinworms'],
};

const pregnancyOnlyCategories: Record<string, string[]> = {
  'Pregnancy General': ['Morning Sickness', 'Fatigue', 'Frequent Urination', 'Food Cravings', 'Food Aversions', 'Mood Changes', 'Breast Tenderness', 'Constipation'],
  'Pregnancy Warning': ['Vaginal Bleeding', 'Severe Headache', 'Vision Changes', 'Severe Abdominal Pain', 'Reduced Fetal Movement', 'Leaking Fluid', 'High Blood Pressure', 'Swollen Hands/Face'],
  'Pregnancy Trimester': ['First Trimester Nausea', 'Second Trimester Back Pain', 'Third Trimester Braxton Hicks', 'Pelvic Pressure', 'Swollen Feet', 'Heartburn', 'Shortness of Breath', 'Insomnia'],
  'Labor Signs': ['Regular Contractions', 'Water Breaking', 'Bloody Show', 'Lower Back Pain', 'Nesting Urge', 'Diarrhea Before Labor', 'Cervical Pressure', 'Loss of Mucus Plug'],
  'Postpartum': ['Postpartum Bleeding', 'Breast Engorgement', 'Postpartum Depression', 'Difficulty Breastfeeding', 'Perineal Pain', 'Hair Loss', 'Fatigue', 'Mood Swings'],
};

// Categories to exclude per patient type
const excludedCategories: Record<PatientType, string[]> = {
  child: ['Reproductive', 'Hormonal', 'Sleep'],
  adult: [],
  pregnant: [],
};

const getSymptomCategories = (patientType: PatientType): Record<string, string[]> => {
  const filtered = Object.fromEntries(
    Object.entries(baseSymptomCategories).filter(([key]) => !excludedCategories[patientType].includes(key))
  );

  if (patientType === 'child') return { ...filtered, ...childOnlyCategories };
  if (patientType === 'pregnant') return { ...filtered, ...pregnancyOnlyCategories };
  return { ...filtered, 'Pediatric': ['Crying Excessively', 'Refusal to Eat', 'Diaper Rash', 'Teething Pain', 'Developmental Delay', 'Growth Concerns', 'Bed Wetting'] };
};

const emergencyRules: Record<PatientType, string[]> = {
  child: [
    '⚠️ For children under 3 months with fever above 100.4°F (38°C), seek immediate medical care.',
    '⚠️ Signs of dehydration in children (no tears, dry mouth, no wet diapers for 6+ hrs) require urgent attention.',
    '⚠️ Any seizure in a child requires emergency evaluation.',
    '⚠️ Difficulty breathing, blue lips, or persistent vomiting — call emergency immediately.',
  ],
  adult: [
    '⚠️ Chest pain with shortness of breath may indicate a cardiac emergency — call 112 immediately.',
    '⚠️ Sudden weakness on one side, slurred speech, or vision loss may indicate stroke — act FAST.',
    '⚠️ Severe allergic reactions (anaphylaxis) with throat swelling require epinephrine and emergency care.',
  ],
  pregnant: [
    '⚠️ Vaginal bleeding at any stage of pregnancy requires immediate medical evaluation.',
    '⚠️ Severe headache with vision changes may indicate preeclampsia — seek urgent care.',
    '⚠️ Reduced fetal movement after 28 weeks — contact your OB/GYN immediately.',
    '⚠️ Leaking fluid or regular contractions before 37 weeks may indicate preterm labor.',
    '⚠️ Many medications are unsafe during pregnancy — never self-medicate without doctor advice.',
  ],
};

interface AnalysisResult {
  risk_score: number;
  severity: string;
  detected_symptoms: { name: string; severity: string }[];
  possible_conditions: { name: string; probability: number; description: string }[];
  recommended_actions: string[];
  emergency_flag: boolean;
  follow_up_questions?: string[];
  suggested_department?: string;
}

interface HistoryItem {
  id: string;
  symptoms: string;
  risk_score: number | null;
  severity: string | null;
  created_at: string;
}

const SymptomChecker = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { getDepartments, getDoctors, registerPatient, createToken, addNotificationLog } = useHospitalDB();
  const [bookingToken, setBookingToken] = useState(false);
  const [bookedToken, setBookedToken] = useState<{ number: number; department: string; doctor?: string } | null>(null);
  const [patientType, setPatientType] = useState<PatientType>('adult');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const symptomCategories = getSymptomCategories(patientType);
  const addSymptom = (s: string) => {
    setSymptoms(prev => prev ? `${prev}, ${s}` : s);
  };

  const fetchHistory = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('symptom_logs')
      .select('id, symptoms, risk_score, severity, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setHistory(data);
    setShowHistory(true);
  };

  const deleteHistory = async (id: string) => {
    await supabase.from('symptom_logs').delete().eq('id', id);
    setHistory(prev => prev.filter(h => h.id !== id));
    toast.success('Entry deleted');
  };

  const analyze = async () => {
    if (!symptoms.trim() || !age || !gender || !duration) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    setResult(null);
    setBookedToken(null);
    try {
      const { data, error } = await supabase.functions.invoke('claude-symptom-analysis', {
        body: { symptoms, age: parseInt(age), gender, duration, patientType },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResult(data);

      // Save to DB
      if (user) {
        await supabase.from('symptom_logs').insert({
          user_id: user.id,
          symptoms,
          severity: data.severity,
          risk_score: data.risk_score,
          detected_symptoms: data.detected_symptoms,
          possible_conditions: data.possible_conditions,
          recommended_actions: data.recommended_actions,
        });
      }
    } catch (e: any) {
      toast.error(e.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  const bookDoctor = async () => {
    if (!result || !user) {
      toast.error('Please sign in to book a doctor');
      return;
    }
    setBookingToken(true);
    try {
      // 1. Find or create the patient record for this user
      const { data: existing } = await supabase
        .from('hospital_patients')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const patient = existing
        ? existing
        : await registerPatient({
            name: profile?.name || user.email?.split('@')[0] || 'Patient',
            phone: profile?.phone || '',
            email: user.email || '',
            gender: gender || '',
          });

      // 2. Look up the suggested department
      const departments = await getDepartments();
      const targetName = result.suggested_department || 'General Medicine';
      const dept = departments.find(d => d.name.toLowerCase() === targetName.toLowerCase())
        || departments.find(d => d.name === 'General Medicine')
        || departments[0];
      if (!dept) throw new Error('No departments available');

      // 3. Pick an available doctor in that department
      const doctors = await getDoctors();
      const deptDoctors = doctors.filter(d => d.department_id === dept.id);
      const available = deptDoctors.find(d => d.availability_status === 'available') || deptDoctors[0];

      // 4. Create the token
      const sevMap: Record<string, string> = { mild: 'mild', moderate: 'moderate', severe: 'severe', critical: 'severe' };
      const token = await createToken({
        patient_id: patient.id,
        department_id: dept.id,
        doctor_id: available?.id,
        entry_type: 'online',
        is_emergency: result.emergency_flag,
        severity: sevMap[result.severity] || 'mild',
        symptoms,
        ai_suggested_department: targetName,
      });

      // 5. Notify
      await addNotificationLog({
        token_id: token.id,
        patient_id: patient.id,
        stage: 'token_issued',
        message: `Token #${token.token_number} issued for ${dept.name}${available ? ` with Dr. ${available.name}` : ''}.`,
      });
      await supabase.from('notifications').insert({
        user_id: user.id,
        title: '🎫 Doctor Appointment Booked',
        message: `Token #${token.token_number} for ${dept.name}${available ? ` with Dr. ${available.name}` : ''}. Please arrive on time.`,
        type: 'success',
        link: '/hospital-queue',
      });

      setBookedToken({ number: token.token_number, department: dept.name, doctor: available?.name });
      toast.success(`Token #${token.token_number} assigned to ${dept.name}!`);
    } catch (e: any) {
      console.error('Book doctor error:', e);
      toast.error(e.message || 'Could not book appointment');
    } finally {
      setBookingToken(false);
    }
  };

  const riskColor = (score: number) => {
    if (score >= 80) return 'bg-destructive text-destructive-foreground';
    if (score >= 50) return 'bg-warning text-warning-foreground';
    if (score >= 20) return 'bg-yellow-400 text-black';
    return 'bg-success text-success-foreground';
  };

  const severityColor = (s: string) => {
    if (s === 'severe') return 'bg-destructive/10 text-destructive';
    if (s === 'moderate') return 'bg-warning/10 text-warning';
    return 'bg-success/10 text-success';
  };

  return (
    <div className="space-y-6">
      {/* UGC Banner */}
      <div className="flex items-start gap-3 rounded-2xl bg-warning/10 border border-warning/30 p-4">
        <div className="stat-icon-orange h-9 w-9 shrink-0"><AlertTriangle className="h-4 w-4" /></div>
        <p className="text-sm text-warning pt-1.5">
          This tool provides general information only. Consult a healthcare professional for medical advice.
        </p>
      </div>

      {/* Patient Type Selector */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.entries(patientTypeConfig) as [PatientType, typeof patientTypeConfig[PatientType]][]).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={type}
              onClick={() => { setPatientType(type); setSelectedCategory('General'); }}
              className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                patientType === type
                  ? 'border-primary bg-primary/5 shadow-md'
                  : 'border-border hover:border-primary/30 hover:bg-muted/50'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  patientType === type ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="font-medium text-sm">{config.label}</span>
              </div>
              <p className="text-xs text-muted-foreground">{config.description}</p>
              {patientType === type && (
                <div className="absolute top-2 right-2 h-3 w-3 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Emergency Rules for selected patient type */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="p-4">
          <h4 className="font-heading font-semibold text-sm text-destructive mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Important Rules — {patientTypeConfig[patientType].label}
          </h4>
          <ul className="space-y-1.5">
            {emergencyRules[patientType].map((rule, i) => (
              <li key={i} className="text-xs text-destructive/80">{rule}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="stat-icon-blue h-8 w-8"><Activity className="h-4 w-4" /></div>
                <CardTitle className="text-lg">Describe Your Symptoms</CardTitle>
                <Badge variant="outline" className="ml-auto text-xs">{patientTypeConfig[patientType].label}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Age</label>
                  <Input type="number" placeholder="Age" value={age} onChange={e => setAge(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Gender</label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Duration</label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="less than 24 hours">Less than 24 hours</SelectItem>
                      <SelectItem value="1-3 days">1-3 days</SelectItem>
                      <SelectItem value="3-7 days">3-7 days</SelectItem>
                      <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                      <SelectItem value="more than 2 weeks">More than 2 weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Symptoms</label>
                <Textarea placeholder="Describe your symptoms..." value={symptoms} onChange={e => setSymptoms(e.target.value)} rows={3} />
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Select category:</p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {Object.keys(symptomCategories).map(cat => (
                    <Button key={cat} variant={selectedCategory === cat ? 'default' : 'outline'} size="sm" className="text-xs rounded-full" onClick={() => setSelectedCategory(cat)}>{cat}</Button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {symptomCategories[selectedCategory].map(s => (
                    <Button key={s} variant="outline" size="sm" className="text-xs rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all" onClick={() => addSymptom(s)}>{s}</Button>
                  ))}
                </div>
              </div>

              <Button onClick={analyze} disabled={loading} className="w-full gradient-health text-white border-0 shadow-glow hover:opacity-90 rounded-xl">
                {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing...</> : <><Activity className="h-4 w-4 mr-2" /> Analyze with AI</>}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Emergency Alert */}
                {result.emergency_flag && (
                  <div className="mb-4 rounded-card bg-destructive/10 border-2 border-destructive p-4 animate-pulse-slow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                        <span className="font-heading font-bold text-destructive text-lg">Emergency Detected!</span>
                      </div>
                      <Button variant="destructive" size="sm" onClick={() => window.open('tel:112')}>
                        <Phone className="h-4 w-4 mr-1" /> Call 112
                      </Button>
                    </div>
                    <p className="text-sm text-destructive mt-2">Critical symptoms detected. Please seek immediate medical attention.</p>
                  </div>
                )}

                {/* Risk Score */}
                <Card className="rounded-card shadow-sm mb-4">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-heading font-semibold text-lg">Risk Assessment</h3>
                      <Badge className={riskColor(result.risk_score)}>{result.severity.toUpperCase()}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Risk Score</span>
                        <span className="font-bold">{result.risk_score}/100</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${result.risk_score >= 80 ? 'bg-destructive' : result.risk_score >= 50 ? 'bg-warning' : result.risk_score >= 20 ? 'bg-yellow-400' : 'bg-success'}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${result.risk_score}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Detected Symptoms */}
                <Card className="rounded-card shadow-sm mb-4">
                  <CardHeader className="pb-2"><CardTitle className="text-base">Detected Symptoms</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {result.detected_symptoms.map((s, i) => (
                        <Badge key={i} variant="outline" className={severityColor(s.severity)}>
                          {s.name} <span className="ml-1 opacity-70">({s.severity})</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Possible Conditions */}
                <Card className="rounded-card shadow-sm mb-4">
                  <CardHeader className="pb-2"><CardTitle className="text-base">Possible Conditions</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {result.possible_conditions.map((c, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{c.name}</span>
                            <Badge variant="secondary" className="text-xs">{c.probability}%</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{c.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recommended Actions */}
                <Card className="rounded-card shadow-sm">
                  <CardHeader className="pb-2"><CardTitle className="text-base">Recommended Actions</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {result.recommended_actions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <span className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0 mt-0.5">{i + 1}</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                    {(result.severity === 'severe' || result.severity === 'critical') && (
                      <Button className="w-full mt-4" variant="destructive" onClick={() => window.open('tel:112')}>
                        <Phone className="h-4 w-4 mr-2" /> Consult a Doctor Now
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Symptom-to-Doctor: Auto-book token */}
                <Card className="rounded-card shadow-md mt-4 border-primary/30 bg-gradient-to-br from-primary/5 to-blue-500/5">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-primary" />
                      AI-Routed Doctor Appointment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.suggested_department && (
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Best fit:</span>
                        <Badge className="bg-primary/15 text-primary border-0">{result.suggested_department}</Badge>
                      </div>
                    )}
                    {bookedToken ? (
                      <div className="rounded-lg bg-success/10 border border-success/30 p-4 text-center space-y-1">
                        <Hash className="h-6 w-6 mx-auto text-success" />
                        <p className="text-2xl font-bold text-success">Token #{bookedToken.number}</p>
                        <p className="text-sm">{bookedToken.department}{bookedToken.doctor ? ` — Dr. ${bookedToken.doctor}` : ''}</p>
                        <Button variant="link" size="sm" onClick={() => navigate('/hospital-queue')}>
                          View in Queue →
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={bookDoctor}
                        disabled={bookingToken || !user}
                        className="w-full bg-gradient-to-r from-primary to-blue-600 text-white hover:opacity-90"
                      >
                        {bookingToken ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Booking…</>
                        ) : (
                          <><Stethoscope className="h-4 w-4 mr-2" /> Book Doctor & Get Token</>
                        )}
                      </Button>
                    )}
                    {!user && <p className="text-xs text-muted-foreground text-center">Sign in to book an appointment.</p>}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* History Sidebar */}
        <div>
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Analysis History</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs" onClick={fetchHistory}>
                  <Clock className="h-3.5 w-3.5 mr-1" /> Load
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {history.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {showHistory ? 'No previous analyses.' : 'Click Load to view history.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {history.map(h => (
                    <div key={h.id} className="p-3 rounded-lg bg-muted/50 group">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-muted-foreground">{new Date(h.created_at).toLocaleDateString()}</p>
                          <p className="text-sm truncate mt-0.5">{h.symptoms}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">{h.severity || 'N/A'}</Badge>
                            <span className="text-xs text-muted-foreground">Score: {h.risk_score ?? 'N/A'}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => deleteHistory(h.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SymptomChecker;
