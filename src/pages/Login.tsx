import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import {
  Heart, Lock, Stethoscope, Pill, User, Mail,
  Loader2, CheckCircle2, ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

type LoginView = 'role-select' | 'role-login';
type SelectedRole = 'doctor' | 'patient' | 'pharmacist';

const Login = () => {
  const [view, setView] = useState<LoginView>('role-select');
  const [selectedRole, setSelectedRole] = useState<SelectedRole>('doctor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(email, password);
      const roleEmoji = selectedRole === 'doctor' ? '🩺' : selectedRole === 'pharmacist' ? '💊' : '👤';
      toast({ title: `Welcome! ${roleEmoji}`, description: 'Login successful.' });
      runPostLogin();
    } catch (err: any) {
      toast({ title: 'Login Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  if (showPostLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
        <Card className="w-full max-w-sm p-8 text-center space-y-4 shadow-2xl border-0 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
          <Stethoscope className="h-12 w-12 mx-auto text-blue-600 animate-pulse" />
          <div className="space-y-3 text-left">
            {[
              { step: 1, text: 'Verifying credentials...' },
              { step: 2, text: 'Loading profile...' },
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

  if (view === 'role-select') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-4">
        <div className="w-full max-w-3xl animate-fade-in">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <Heart className="h-7 w-7 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Smart Hospital Portal</h1>
            <p className="text-muted-foreground text-lg">Select your role to continue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'patient' as SelectedRole, label: 'Patient Login', desc: 'Access your health records', icon: User, color: 'emerald', gradient: 'from-emerald-600 to-teal-600' },
              { role: 'doctor' as SelectedRole, label: 'Doctor Login', desc: 'Full access to hospital system', icon: Stethoscope, color: 'blue', gradient: 'from-blue-600 to-cyan-600' },
              { role: 'pharmacist' as SelectedRole, label: 'Pharmacy Login', desc: 'Manage prescriptions & stock', icon: Pill, color: 'purple', gradient: 'from-purple-600 to-violet-600' },
            ].map((card) => (
              <Card
                key={card.role}
                className="relative overflow-hidden border-2 border-border cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                onClick={() => { setSelectedRole(card.role); setView('role-login'); }}
              >
                <CardContent className="pt-10 pb-8 flex flex-col items-center gap-4">
                  <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                    <card.icon className="h-10 w-10 text-primary" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-foreground">{card.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{card.desc}</p>
                  </div>
                  <Button className={`w-full mt-2 bg-gradient-to-r ${card.gradient} hover:opacity-90 text-white shadow-md`}>
                    Click to Login
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    );
  }

  const roleConfig = {
    doctor: { label: 'Doctor Login', icon: Stethoscope, gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/25' },
    patient: { label: 'Patient Login', icon: User, gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/25' },
    pharmacist: { label: 'Pharmacy Login', icon: Pill, gradient: 'from-purple-500 to-violet-500', shadow: 'shadow-purple-500/25' },
  };
  const currentRole = roleConfig[selectedRole];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <button
          onClick={() => setView('role-select')}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to role selection
        </button>

        <div className="text-center mb-6">
          <div className={`h-12 w-12 mx-auto rounded-2xl bg-gradient-to-br ${currentRole.gradient} flex items-center justify-center shadow-lg ${currentRole.shadow} mb-3`}>
            <currentRole.icon className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">{currentRole.label}</h1>
          <p className="text-muted-foreground">Enter your email and password</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              </div>
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</Link>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              <Button type="submit" className={`w-full bg-gradient-to-r ${currentRole.gradient} hover:opacity-90 text-white`} disabled={isLoading}>
                {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Signing in...</> : 'Sign In'}
              </Button>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary hover:underline font-medium">Sign up</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
