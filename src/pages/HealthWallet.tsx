import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, FileText, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const transactions = [
  { desc: 'Apollo Hospital - Consultation', amount: '₹500', type: 'debit', date: 'Mar 5', category: 'Consultation' },
  { desc: 'Insurance Claim Received', amount: '₹2,500', type: 'credit', date: 'Mar 3', category: 'Insurance' },
  { desc: 'MedPlus Pharmacy', amount: '₹1,200', type: 'debit', date: 'Mar 1', category: 'Medicine' },
  { desc: 'Lab Test - Blood Work', amount: '₹800', type: 'debit', date: 'Feb 28', category: 'Lab Test' },
];

const HealthWallet = () => (
  <div className="space-y-6">
    <div className="page-header gradient-health animate-gradient p-6 md:p-8">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1"><Wallet className="h-5 w-5 text-white/80" /><span className="text-white/70 text-xs font-medium uppercase tracking-wider">Health Wallet</span></div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Health Wallet & Payments</h1>
        <p className="mt-1 text-white/75 text-sm">Unified health payments, insurance claims, and expense tracking.</p>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-4">
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-green"><Wallet className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">₹12,500</p><p className="text-xs text-muted-foreground">Wallet Balance</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-blue"><CreditCard className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">₹4,200</p><p className="text-xs text-muted-foreground">This Month</p></div></CardContent></Card>
      <Card className="card-hover"><CardContent className="p-4 flex items-center gap-3"><div className="stat-icon-purple"><FileText className="h-5 w-5" /></div><div><p className="text-2xl font-heading font-bold">2</p><p className="text-xs text-muted-foreground">Pending Claims</p></div></CardContent></Card>
    </div>

    <Card>
      <CardHeader><CardTitle className="text-base">Recent Transactions</CardTitle></CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((t, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
              <div className="flex items-center gap-3">
                <div className={t.type === 'credit' ? 'stat-icon-green' : 'stat-icon-orange'}>{t.type === 'credit' ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}</div>
                <div><p className="font-medium text-sm">{t.desc}</p><p className="text-xs text-muted-foreground">{t.date}</p></div>
              </div>
              <div className="text-right">
                <p className={`font-semibold text-sm ${t.type === 'credit' ? 'text-success' : ''}`}>{t.type === 'credit' ? '+' : '-'}{t.amount}</p>
                <Badge variant="secondary" className="text-[10px]">{t.category}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default HealthWallet;
