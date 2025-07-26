import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

export default function ProgressPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
      <Card className="max-w-md">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
             <TrendingUp className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Spiritual Growth Tracker</CardTitle>
          <CardDescription>Coming Soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Here you'll find a leveling system and visualizations of your progress in knowledge and devotion. Keep track of verses memorized, characters unlocked, and books mastered!</p>
        </CardContent>
      </Card>
    </div>
  );
}
