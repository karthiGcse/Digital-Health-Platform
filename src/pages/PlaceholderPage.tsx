import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
}

const PlaceholderPage = ({ title, description }: Props) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Card className="rounded-card shadow-sm max-w-md w-full">
      <CardContent className="p-8 text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <Construction className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-xl font-heading font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description || 'This page will be built in the next phase.'}</p>
      </CardContent>
    </Card>
  </div>
);

export default PlaceholderPage;
