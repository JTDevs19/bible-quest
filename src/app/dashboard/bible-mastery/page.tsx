import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Milestone } from 'lucide-react';

export default function BibleMasteryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
      <Card className="max-w-md">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
             <Milestone className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Books of the Bible Mastery</CardTitle>
          <CardDescription>Coming Soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Learn the books of the Bible with sorting games, explore key themes in the book explorer, and unlock achievements for mastering sections like the Gospels.</p>
        </CardContent>
      </Card>
    </div>
  );
}
