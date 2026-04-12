import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Heart, Mail, KeyRound, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

type Step = 'details' | 'otp';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AppRole>('patient');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<Step>('details');
  const [otpCode, setOtpCode] = useState('');
  const { signUp, signInWithOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast({ title: 'Missing fields', description: 'Please fill name and email.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      // First sign up with a random password (user won't need it - OTP only)
      await signUp(email, crypto.randomUUID(), name, role);
      // Then send OTP for login
      await signInWithOtp(email);
      setStep('otp');
      toast({ title: 'OTP Sent! 📧', description: `A 6-digit code has been sent to ${email}` });
    } catch (err: any) {
      // If user already exists, just send OTP
      if (err.message?.includes('already registered')) {
        try {
          await signInWithOtp(email);
          setStep('otp');
          toast({ title: 'OTP Sent! 📧', description: `A 6-digit code has been sent to ${email}` });
        } catch (otpErr: any) {
          toast({ title: 'Failed', description: otpErr.message, variant: 'destructive' });
        }
      } else {
        toast({ title: 'Registration failed', description: err.message, variant: 'destructive' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      toast({ title: 'Invalid OTP', description: 'Please enter the 6-digit code', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp(email, otpCode);
      toast({ title: 'Welcome! 🎉', description: 'Account verified successfully.' });
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Verification Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      await signInWithOtp(email);
      toast({ title: 'OTP Resent! 📧', description: `New code sent to ${email}` });
    } catch (err: any) {
      toast({ title: 'Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground">S47 Health</h1>
          </div>
          <p className="text-muted-foreground">Create your account — No password needed</p>
        </div>

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-xl dark:bg-slate-900/80">
          {step === 'details' ? (
            <>
              <CardHeader>
                <CardTitle className="text-xl">Sign Up</CardTitle>
                <CardDescription>We'll verify your email with a one-time code</CardDescription>
              </CardHeader>
              <form onSubmit={handleSendOtp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Dr. John Smith" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="you@example.com" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={(v) => setRole(v as AppRole)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="patient">Patient</SelectItem>
                        <SelectItem value="pharmacist">Pharmacist</SelectItem>
                        <SelectItem value="doctor">Doctor</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Sending OTP...</> : <><KeyRound className="h-4 w-4 mr-2" />Send Verification OTP</>}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
                  </p>
                </CardFooter>
              </form>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <KeyRound className="h-5 w-5 text-emerald-600" /> Verify OTP
                </CardTitle>
                <CardDescription>Enter the 6-digit code sent to <strong>{email}</strong></CardDescription>
              </CardHeader>
              <form onSubmit={handleVerifyOtp}>
                <CardContent className="space-y-5">
                  <div className="flex justify-center">
                    <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="text-center">
                    <button type="button" onClick={handleResendOtp} disabled={isLoading} className="text-sm text-blue-600 hover:underline disabled:opacity-50">
                      Didn't receive it? Resend OTP
                    </button>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white" disabled={isLoading || otpCode.length !== 6}>
                    {isLoading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Verifying...</> : <><ShieldCheck className="h-4 w-4 mr-2" />Verify & Create Account</>}
                  </Button>
                  <button type="button" onClick={() => { setStep('details'); setOtpCode(''); }} className="text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="h-3 w-3 inline mr-1" /> Change details
                  </button>
                </CardFooter>
              </form>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Register;
