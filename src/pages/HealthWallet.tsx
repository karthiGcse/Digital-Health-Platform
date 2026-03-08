import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Wallet, CreditCard, FileText, ArrowUpRight, ArrowDownRight, Plus,
  PiggyBank, Receipt, Shield, TrendingUp, Calendar, Download, Send,
  IndianRupee, Target, BarChart3, AlertCircle, CheckCircle2, Sparkles
} from 'lucide-react';

const transactions = [
  { desc: 'Apollo Hospital - Consultation', amount: 500, type: 'debit', date: 'Mar 5', category: 'Consultation' },
  { desc: 'Insurance Claim Received', amount: 2500, type: 'credit', date: 'Mar 3', category: 'Insurance' },
  { desc: 'MedPlus Pharmacy', amount: 1200, type: 'debit', date: 'Mar 1', category: 'Medicine' },
  { desc: 'Lab Test - Blood Work', amount: 800, type: 'debit', date: 'Feb 28', category: 'Lab Test' },
  { desc: 'Vaccine - Flu Shot', amount: 350, type: 'debit', date: 'Feb 25', category: 'Vaccination' },
  { desc: 'HSA Contribution', amount: 5000, type: 'credit', date: 'Feb 20', category: 'Savings' },
  { desc: 'Fortis - Eye Checkup', amount: 600, type: 'debit', date: 'Feb 18', category: 'Consultation' },
  { desc: 'Dental Cleaning', amount: 1500, type: 'debit', date: 'Feb 15', category: 'Dental' },
];

const budgetCategories = [
  { name: 'Medicines', spent: 3200, budget: 5000, icon: '💊' },
  { name: 'Consultations', spent: 2100, budget: 3000, icon: '🩺' },
  { name: 'Lab Tests', spent: 1800, budget: 2000, icon: '🧪' },
  { name: 'Insurance Premium', spent: 2800, budget: 2800, icon: '🛡️' },
  { name: 'Dental & Vision', spent: 1500, budget: 2500, icon: '🦷' },
  { name: 'Wellness & Fitness', spent: 800, budget: 2000, icon: '🧘' },
];

const savingsGoals = [
  { name: 'Emergency Medical Fund', current: 45000, target: 100000, icon: '🏥' },
  { name: 'Eye Surgery (LASIK)', current: 28000, target: 50000, icon: '👁️' },
  { name: 'Dental Implant', current: 15000, target: 40000, icon: '🦷' },
];

const quickActions = [
  { title: 'Add Money', icon: Plus, color: 'stat-icon-green', action: 'add' },
  { title: 'Pay Bills', icon: Send, color: 'stat-icon-blue', action: 'pay' },
  { title: 'File Claim', icon: FileText, color: 'stat-icon-purple', action: 'claim' },
  { title: 'Tax Report', icon: Download, color: 'stat-icon-orange', action: 'tax' },
];

const HealthWallet = () => {
  const [activeTab, setActiveTab] = useState('transactions');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showPayBill, setShowPayBill] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payTo, setPayTo] = useState('');
  const [filter, setFilter] = useState('all');
  const { toast } = useToast();
  const { user } = useAuth();

  const totalSpent = transactions.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0);
  const totalCredit = transactions.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);
  const filteredTx = filter === 'all' ? transactions : transactions.filter(t => t.type === filter);

  const handleQuickAction = (action: string) => {
    if (action === 'add') setShowAddMoney(true);
    else if (action === 'pay') setShowPayBill(true);
    else if (action === 'claim') {
      toast({ title: '📋 Claim Filed', description: 'Your insurance claim form has been initiated. Upload documents to proceed.' });
      notify('📋 Insurance Claim Initiated', 'A new insurance claim has been filed from your Health Wallet.');
    } else if (action === 'tax') {
      toast({ title: '📥 Tax Report', description: 'Your health expense tax report (Section 80D) has been generated and downloaded.' });
      notify('📥 Tax Report Generated', 'Your annual health expense tax report under Section 80D is ready.');
    }
  };

  const notify = async (title: string, message: string) => {
    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id, title, message, type: 'info', link: '/health-wallet',
      });
    }
  };

  const handleAddMoney = () => {
    const amt = Number(addAmount);
    if (!amt || amt <= 0) return;
    toast({ title: '💰 Money Added', description: `₹${amt.toLocaleString()} has been added to your Health Wallet.` });
    notify('💰 Wallet Top-Up', `₹${amt.toLocaleString()} has been added to your Health Wallet.`);
    setAddAmount('');
    setShowAddMoney(false);
  };

  const handlePayBill = () => {
    const amt = Number(payAmount);
    if (!amt || amt <= 0 || !payTo.trim()) return;
    toast({ title: '✅ Payment Sent', description: `₹${amt.toLocaleString()} paid to ${payTo}.` });
    notify('💳 Payment Sent', `₹${amt.toLocaleString()} paid to ${payTo} from Health Wallet.`);
    setPayAmount('');
    setPayTo('');
    setShowPayBill(false);
  };

  return (
    <div className="space-y-6">
      <div className="page-header gradient-health animate-gradient p-6 md:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-5 w-5 text-white/80" />
            <span className="text-white/70 text-xs font-medium uppercase tracking-wider">Health Wallet</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Health Wallet & Payments</h1>
          <p className="mt-1 text-white/75 text-sm">Unified health payments, budgets, savings goals & expense tracking.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Wallet className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">₹12,500</p><p className="text-xs text-muted-foreground">Wallet Balance</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><TrendingUp className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">₹{totalSpent.toLocaleString()}</p><p className="text-xs text-muted-foreground">Total Spent</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-purple"><PiggyBank className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">₹88,000</p><p className="text-xs text-muted-foreground">Total Savings</p></div></CardContent></Card>
        <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-orange"><Shield className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">2</p><p className="text-xs text-muted-foreground">Pending Claims</p></div></CardContent></Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((a, i) => (
          <Card key={i} className="card-hover cursor-pointer" onClick={() => handleQuickAction(a.action)}>
            <CardContent className="p-4 text-center space-y-2">
              <div className={`${a.color} mx-auto`}><a.icon className="h-5 w-5" /></div>
              <p className="font-medium text-sm">{a.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
          <TabsTrigger value="savings">Savings Goals</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <div className="flex gap-2">
            {['all', 'debit', 'credit'].map(f => (
              <Badge key={f} variant={filter === f ? 'default' : 'outline'} className="cursor-pointer capitalize" onClick={() => setFilter(f)}>
                {f === 'all' ? 'All' : f === 'debit' ? '↑ Expenses' : '↓ Income'}
              </Badge>
            ))}
          </div>
          <Card>
            <CardContent className="p-4 space-y-3">
              {filteredTx.map((t, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className={t.type === 'credit' ? 'stat-icon-green' : 'stat-icon-orange'}>
                      {t.type === 'credit' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t.desc}</p>
                      <p className="text-xs text-muted-foreground">{t.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold text-sm ${t.type === 'credit' ? 'text-success' : ''}`}>
                      {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </p>
                    <Badge variant="secondary" className="text-[10px]">{t.category}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Monthly Summary */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Monthly Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <p className="text-xs text-muted-foreground">Expenses</p>
                  <p className="text-lg font-heading font-bold text-destructive">₹{totalSpent.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <p className="text-xs text-muted-foreground">Income</p>
                  <p className="text-lg font-heading font-bold text-success">₹{totalCredit.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <p className="text-xs text-muted-foreground">Net</p>
                  <p className={`text-lg font-heading font-bold ${totalCredit - totalSpent >= 0 ? 'text-success' : 'text-destructive'}`}>
                    ₹{Math.abs(totalCredit - totalSpent).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Budget Tab */}
        <TabsContent value="budget" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />Monthly Health Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {budgetCategories.map((b, i) => {
                const pct = Math.round((b.spent / b.budget) * 100);
                const isOver = pct >= 100;
                const isWarning = pct >= 80 && !isOver;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-2">
                        <span>{b.icon}</span>
                        <span className="font-medium">{b.name}</span>
                      </span>
                      <span className={`font-semibold text-xs ${isOver ? 'text-destructive' : isWarning ? 'text-warning' : 'text-success'}`}>
                        ₹{b.spent.toLocaleString()} / ₹{b.budget.toLocaleString()}
                      </span>
                    </div>
                    <Progress value={Math.min(pct, 100)} className="h-2" />
                    {isOver && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />Budget exceeded!
                      </p>
                    )}
                  </div>
                );
              })}
              <div className="p-3 rounded-xl bg-primary/10 text-center mt-4">
                <p className="text-xs text-muted-foreground">Total Monthly Budget</p>
                <p className="text-2xl font-heading font-bold">
                  ₹{budgetCategories.reduce((s, b) => s + b.spent, 0).toLocaleString()}
                  <span className="text-sm text-muted-foreground font-normal"> / ₹{budgetCategories.reduce((s, b) => s + b.budget, 0).toLocaleString()}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />AI Saving Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { tip: 'Switch to generic medicines', saving: 'Save ₹800/mo', desc: 'Generic alternatives available for 3 of your current prescriptions.' },
                { tip: 'Book lab tests in bundles', saving: 'Save ₹400/mo', desc: 'Combine your monthly blood work into a discounted health package.' },
                { tip: 'Use network hospitals', saving: 'Save ₹1,200/mo', desc: 'Cashless treatment at network hospitals reduces out-of-pocket costs.' },
              ].map((t, i) => (
                <div key={i} className="p-3 rounded-xl bg-muted/50 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{t.tip}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                    <Badge variant="secondary" className="mt-1 text-[10px] text-success">{t.saving}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => toast({ title: `💡 ${t.tip}`, description: t.desc })}>
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Savings Goals Tab */}
        <TabsContent value="savings" className="space-y-4">
          {savingsGoals.map((g, i) => {
            const pct = Math.round((g.current / g.target) * 100);
            return (
              <Card key={i} className="card-hover">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{g.icon}</span>
                      <div>
                        <h4 className="font-heading font-semibold text-sm">{g.name}</h4>
                        <p className="text-xs text-muted-foreground">{pct}% complete</p>
                      </div>
                    </div>
                    <Badge variant={pct >= 80 ? 'default' : 'secondary'}>{pct}%</Badge>
                  </div>
                  <Progress value={pct} className="h-2.5" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>₹{g.current.toLocaleString()} saved</span>
                    <span>Goal: ₹{g.target.toLocaleString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                      toast({ title: `💰 Added ₹1,000 to ${g.name}` });
                      notify(`💰 Savings Updated`, `₹1,000 added to "${g.name}" goal.`);
                    }}>
                      <Plus className="h-3 w-3 mr-1" />Add ₹1,000
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toast({ title: `Remaining: ₹${(g.target - g.current).toLocaleString()}` })}>
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Card className="border-dashed border-2 cursor-pointer card-hover" onClick={() => toast({ title: '🎯 New Goal', description: 'Custom savings goal feature coming soon!' })}>
            <CardContent className="p-6 text-center text-muted-foreground">
              <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">Create New Savings Goal</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Money Dialog */}
      <Dialog open={showAddMoney} onOpenChange={setShowAddMoney}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" />Add Money to Wallet</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              {[500, 1000, 2000, 5000].map(amt => (
                <Button key={amt} variant={addAmount === String(amt) ? 'default' : 'outline'} size="sm" onClick={() => setAddAmount(String(amt))}>
                  ₹{amt.toLocaleString()}
                </Button>
              ))}
            </div>
            <Input type="number" placeholder="Or enter custom amount" value={addAmount} onChange={e => setAddAmount(e.target.value)} />
            <Button className="w-full" onClick={handleAddMoney} disabled={!addAmount || Number(addAmount) <= 0}>
              Add ₹{Number(addAmount || 0).toLocaleString()} to Wallet
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pay Bill Dialog */}
      <Dialog open={showPayBill} onOpenChange={setShowPayBill}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" />Pay Health Bill</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Pay to (Hospital, Pharmacy, Lab...)" value={payTo} onChange={e => setPayTo(e.target.value)} />
            <Input type="number" placeholder="Amount (₹)" value={payAmount} onChange={e => setPayAmount(e.target.value)} />
            <Button className="w-full" onClick={handlePayBill} disabled={!payTo.trim() || !payAmount || Number(payAmount) <= 0}>
              Pay ₹{Number(payAmount || 0).toLocaleString()}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthWallet;
