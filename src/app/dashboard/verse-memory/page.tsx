import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookText } from 'lucide-react';

export default function VerseMemoryPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
      <Card className="max-w-md">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
             <BookText className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Verse Memory Challenges</CardTitle>
          <CardDescription>Coming Soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This section will feature fill-in-the-blank games, timed recall challenges, and daily devotion quests to help you memorize Bible verses.</p>
        </CardContent>
      </Card>
    </div>
  );
}
