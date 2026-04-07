import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Heart, Lock, Stethoscope, Pill, User, Mail, Eye, EyeOff,
  ScanFace, Fingerprint, IdCard, Camera, CheckCircle2, XCircle,
  Loader2, ShieldCheck, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

type LoginView = 'role-select' | 'role-login';
type SelectedRole = 'doctor' | 'patient' | 'pharmacist';

const Login = () => {
  const [view, setView] = useState<LoginView>('role-select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [doctorId, setDoctorId] = useState('');
  const [accessPin, setAccessPin] = useState('');

  // Biometric states
  const [faceStatus, setFaceStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [fingerStatus, setFingerStatus] = useState<'idle' | 'scanning' | 'success' | 'error'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  // Post-login loading
  const [postLoginStep, setPostLoginStep] = useState(0);
  const [showPostLogin, setShowPostLogin] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const runPostLogin = () => {
    setShowPostLogin(true);
    setPostLoginStep(1);
    setTimeout(() => setPostLoginStep(2), 800);
    setTimeout(() => setPostLoginStep(3), 1600);
    setTimeout(() => navigate('/dashboard'), 2400);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      toast({ title: 'Welcome back, Doctor! 🩺', description: 'Login successful.' });
      runPostLogin();
    } catch (err: any) {
      toast({ title: 'Login failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceScan = () => {
    setFaceStatus('scanning');
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Simulate success/fail
          const success = Math.random() > 0.3;
          setFaceStatus(success ? 'success' : 'error');
          if (success) {
            toast({ title: 'Face Verified ✓', description: 'Redirecting to dashboard...' });
            setTimeout(() => runPostLogin(), 1000);
          } else {
            toast({ title: 'Face not recognized', description: 'Please try again.', variant: 'destructive' });
          }
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  const handleFingerScan = () => {
    setFingerStatus('scanning');
    setScanProgress(0);
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const success = Math.random() > 0.3;
          setFingerStatus(success ? 'success' : 'error');
          if (success) {
            toast({ title: 'Fingerprint Verified ✓', description: 'Redirecting...' });
            setTimeout(() => runPostLogin(), 1000);
          } else {
            toast({ title: 'Fingerprint not recognized', description: 'Try again.', variant: 'destructive' });
          }
          return 100;
        }
        return prev + 4;
      });
    }, 60);
  };

  const handleDoctorIdLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^DOC-\d{4}-\d{4}$/.test(doctorId)) {
      toast({ title: 'Invalid Doctor ID', description: 'Format: DOC-YYYY-XXXX', variant: 'destructive' });
      return;
    }
    if (accessPin.length < 4 || accessPin.length > 6) {
      toast({ title: 'Invalid PIN', description: '4-6 digit PIN required.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    // Simulate ID login
    setTimeout(() => {
      setIsLoading(false);
      toast({ title: 'Doctor ID Verified ✓' });
      runPostLogin();
    }, 1500);
  };

  // Post-login overlay
  if (showPostLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
        <Card className="w-full max-w-sm p-8 text-center space-y-4 shadow-2xl border-0 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
          <Stethoscope className="h-12 w-12 mx-auto text-blue-600 animate-pulse" />
          <div className="space-y-3 text-left">
            {[
              { step: 1, text: 'Verifying credentials...' },
              { step: 2, text: 'Loading doctor profile...' },
              { step: 3, text: 'Redirecting to dashboard...' },
            ].map(({ step, text }) => (
              <div key={step} className={cn(
                'flex items-center gap-3 transition-all duration-500',
                postLoginStep >= step ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              )}>
                {postLoginStep > step ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : postLoginStep === step ? (
                  <Loader2 className="h-5 w-5 text-blue-500 animate-spin shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted shrink-0" />
                )}
                <span className="text-sm text-foreground">{text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // Role selection view
  if (view === 'role-select') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-4">
        <div className="w-full max-w-3xl animate-fade-in">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Heart className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Smart Hospital Portal</h1>
            <p className="text-muted-foreground text-lg">Select your role to continue</p>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Patient - Coming Soon */}
            <Card className="relative overflow-hidden border-2 border-dashed border-muted opacity-60 cursor-not-allowed">
              <div className="absolute top-3 right-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted text-muted-foreground">Coming Soon</span>
              </div>
              <CardContent className="pt-10 pb-8 flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                  <User className="h-10 w-10 text-emerald-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-muted-foreground">Patient Login</h3>
                  <p className="text-sm text-muted-foreground mt-1">Access your health records</p>
                </div>
                <Button disabled className="w-full mt-2" variant="outline">Coming Soon</Button>
              </CardContent>
            </Card>

            {/* Doctor - Active */}
            <Card
              className="relative overflow-hidden border-2 border-blue-400 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-950/30 dark:to-slate-900 cursor-pointer hover:shadow-xl hover:shadow-blue-500/15 transition-all duration-300 hover:-translate-y-1 group"
              onClick={() => setView('doctor-login')}
            >
              <div className="absolute top-3 right-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">Active</span>
              </div>
              <CardContent className="pt-10 pb-8 flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-blue-100 dark:bg-blue-950 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Stethoscope className="h-10 w-10 text-blue-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">Doctor Login</h3>
                  <p className="text-sm text-muted-foreground mt-1">Full access to hospital system</p>
                </div>
                <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md">
                  Click to Login
                </Button>
              </CardContent>
            </Card>

            {/* Pharmacy - Coming Soon */}
            <Card className="relative overflow-hidden border-2 border-dashed border-muted opacity-60 cursor-not-allowed">
              <div className="absolute top-3 right-3">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-muted text-muted-foreground">Coming Soon</span>
              </div>
              <CardContent className="pt-10 pb-8 flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
                  <Pill className="h-10 w-10 text-purple-400" />
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-muted-foreground">Pharmacy Login</h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage prescriptions & stock</p>
                </div>
                <Button disabled className="w-full mt-2" variant="outline">Coming Soon</Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Need help? Contact <span className="text-blue-600 font-medium">IT Support</span>
          </p>
        </div>
      </div>
    );
  }

  // Doctor Login View
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-4">
      <div className="w-full max-w-lg animate-fade-in">
        {/* Back button */}
        <button
          onClick={() => setView('role-select')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to role selection
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
              <Stethoscope className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Doctor Login</h1>
          <p className="text-muted-foreground">Choose your authentication method</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
          <Tabs defaultValue="email" className="w-full">
            <CardHeader className="pb-2">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="email" className="text-xs gap-1"><Mail className="h-3.5 w-3.5" /><span className="hidden sm:inline">Email</span></TabsTrigger>
                <TabsTrigger value="face" className="text-xs gap-1"><ScanFace className="h-3.5 w-3.5" /><span className="hidden sm:inline">Face ID</span></TabsTrigger>
                <TabsTrigger value="finger" className="text-xs gap-1"><Fingerprint className="h-3.5 w-3.5" /><span className="hidden sm:inline">Fingerprint</span></TabsTrigger>
                <TabsTrigger value="docid" className="text-xs gap-1"><IdCard className="h-3.5 w-3.5" /><span className="hidden sm:inline">Doctor ID</span></TabsTrigger>
              </TabsList>
            </CardHeader>

            {/* TAB 1: Email/Password */}
            <TabsContent value="email">
              <form onSubmit={handleEmailLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email" type="email" placeholder="doctor@hospital.com"
                        className="pl-10" value={email} onChange={e => setEmail(e.target.value)} required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••"
                        className="pl-10 pr-10" value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox id="remember" checked={rememberMe} onCheckedChange={v => setRememberMe(!!v)} />
                      <Label htmlFor="remember" className="text-sm cursor-pointer">Remember Me</Label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Signing in...</> : <><ShieldCheck className="h-4 w-4 mr-2" />Login</>}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            {/* TAB 2: Face ID */}
            <TabsContent value="face">
              <CardContent className="flex flex-col items-center gap-5 py-6">
                <div className={cn(
                  'h-40 w-40 rounded-full border-4 flex items-center justify-center transition-all duration-500 relative overflow-hidden',
                  faceStatus === 'idle' && 'border-dashed border-muted-foreground/30 bg-muted/30',
                  faceStatus === 'scanning' && 'border-blue-500 bg-blue-50 dark:bg-blue-950',
                  faceStatus === 'success' && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950',
                  faceStatus === 'error' && 'border-red-500 bg-red-50 dark:bg-red-950'
                )}>
                  {faceStatus === 'scanning' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-blue-400/20 to-transparent animate-pulse" />
                  )}
                  {faceStatus === 'idle' && <Camera className="h-14 w-14 text-muted-foreground/50" />}
                  {faceStatus === 'scanning' && <ScanFace className="h-14 w-14 text-blue-500 animate-pulse" />}
                  {faceStatus === 'success' && <CheckCircle2 className="h-14 w-14 text-emerald-500" />}
                  {faceStatus === 'error' && <XCircle className="h-14 w-14 text-red-500" />}
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {faceStatus === 'idle' && 'Position your face in front of the camera'}
                  {faceStatus === 'scanning' && 'Scanning face...'}
                  {faceStatus === 'success' && 'Face Verified ✓'}
                  {faceStatus === 'error' && 'Face not recognized. Try again.'}
                </p>
                {faceStatus === 'scanning' && <Progress value={scanProgress} className="w-full max-w-xs" />}
                <Button
                  onClick={() => { setFaceStatus('idle'); handleFaceScan(); }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                  disabled={faceStatus === 'scanning'}
                >
                  <ScanFace className="h-4 w-4 mr-2" />
                  {faceStatus === 'error' ? 'Retry Face Scan' : 'Verify with Face ID'}
                </Button>
              </CardContent>
            </TabsContent>

            {/* TAB 3: Fingerprint */}
            <TabsContent value="finger">
              <CardContent className="flex flex-col items-center gap-5 py-6">
                <div className={cn(
                  'h-32 w-32 rounded-2xl border-4 flex items-center justify-center transition-all duration-500',
                  fingerStatus === 'idle' && 'border-dashed border-muted-foreground/30 bg-muted/30',
                  fingerStatus === 'scanning' && 'border-blue-500 bg-blue-50 dark:bg-blue-950 animate-pulse',
                  fingerStatus === 'success' && 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950',
                  fingerStatus === 'error' && 'border-red-500 bg-red-50 dark:bg-red-950'
                )}>
                  {fingerStatus === 'idle' && <Fingerprint className="h-16 w-16 text-muted-foreground/40" />}
                  {fingerStatus === 'scanning' && <Fingerprint className="h-16 w-16 text-blue-500 animate-bounce" />}
                  {fingerStatus === 'success' && <CheckCircle2 className="h-16 w-16 text-emerald-500" />}
                  {fingerStatus === 'error' && <XCircle className="h-16 w-16 text-red-500" />}
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  {fingerStatus === 'idle' && 'Place your finger on the scanner to verify'}
                  {fingerStatus === 'scanning' && 'Scanning fingerprint...'}
                  {fingerStatus === 'success' && 'Fingerprint Verified ✓'}
                  {fingerStatus === 'error' && 'Fingerprint not recognized. Try again.'}
                </p>
                {fingerStatus === 'scanning' && <Progress value={scanProgress} className="w-full max-w-xs" />}
                <Button
                  onClick={() => { setFingerStatus('idle'); handleFingerScan(); }}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                  disabled={fingerStatus === 'scanning'}
                >
                  <Fingerprint className="h-4 w-4 mr-2" />
                  {fingerStatus === 'error' ? 'Retry Scan' : 'Scan Fingerprint'}
                </Button>
              </CardContent>
            </TabsContent>

            {/* TAB 4: Doctor ID */}
            <TabsContent value="docid">
              <form onSubmit={handleDoctorIdLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="docid">Doctor ID</Label>
                    <div className="relative">
                      <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="docid" placeholder="DOC-2025-XXXX"
                        className="pl-10" value={doctorId} onChange={e => setDoctorId(e.target.value)} required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Format: DOC-YYYY-XXXX</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pin">Access PIN</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="pin" type="password" placeholder="••••" maxLength={6}
                        className="pl-10" value={accessPin} onChange={e => setAccessPin(e.target.value.replace(/\D/g, ''))} required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">4-6 digit PIN</p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying...</> : <><ShieldCheck className="h-4 w-4 mr-2" />Login with ID</>}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>

          <div className="px-6 pb-6 pt-2 border-t border-border/50 space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account? <Link to="/register" className="text-blue-600 hover:underline font-medium">Register as Doctor</Link>
            </p>
            <p className="text-xs text-muted-foreground">
              Need help? <span className="text-blue-600 cursor-pointer hover:underline">Contact IT Support</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
