import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function CharacterAdventuresPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] text-center">
      <Card className="max-w-md">
        <CardHeader>
          <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4">
             <Users className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl">Bible Character Adventures</CardTitle>
          <CardDescription>Coming Soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Get ready for "Guess Who?" games, role-playing missions, and trivia battles focused on the fascinating characters of the Bible.</p>
        </CardContent>
      </Card>
    </div>
  );
}
