import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import UserGreeting from '@/components/UserGreeting';
import { getAdvancedGreeting, getPersonalizedSubtitle, getWelcomeMessage, getActivityBasedGreeting } from '@/utils/greetingUtils';

export default function GreetingDemo() {
  const { user } = useUser();
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('it-IT'));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('it-IT'));
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const userName = user?.firstName || 'Demo User';

  return (
    <div className="container mx-auto p-8 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text-aurora mb-2">
          Sistema di Saluti Dinamico 🎉
        </h1>
        <p className="text-muted-foreground text-lg">
          Esempi di saluti personalizzati per ogni momento della giornata
        </p>
        <Badge variant="outline" className="mt-2">
          Ora corrente: {currentTime}
        </Badge>
      </div>

      {/* UserGreeting Component Showcase */}
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🎯 Componente UserGreeting - Stile Hero</CardTitle>
            <CardDescription>
              Perfetto per pagine di benvenuto o dashboard principali
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserGreeting 
              style="hero" 
              greetingStyle="enthusiastic"
              className="p-6 glass-card rounded-2xl"
            />
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>📱 Stile Compact</CardTitle>
              <CardDescription>Per navbar o sidebar</CardDescription>
            </CardHeader>
            <CardContent>
              <UserGreeting style="compact" greetingStyle="casual" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📄 Stile Full</CardTitle>
              <CardDescription>Per sezioni dettagliate</CardDescription>
            </CardHeader>
            <CardContent>
              <UserGreeting style="full" greetingStyle="formal" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Individual Greeting Functions Showcase */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎨 Stili di Saluto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Badge variant="secondary">Formale</Badge>
              <p className="text-sm mt-1">
                {getAdvancedGreeting(userName, { style: 'formal', includeEmoji: true })}
              </p>
            </div>
            <div>
              <Badge variant="secondary">Casual</Badge>
              <p className="text-sm mt-1">
                {getAdvancedGreeting(userName, { style: 'casual' })}
              </p>
            </div>
            <div>
              <Badge variant="secondary">Entusiasta</Badge>
              <p className="text-sm mt-1">
                {getAdvancedGreeting(userName, { style: 'enthusiastic' })}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">🎭 Sottotitoli Dinamici</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {getPersonalizedSubtitle()}
            </p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              🎲 Cambia sottotitolo
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">👋 Benvenuto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {getWelcomeMessage(userName)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Activity Based Greetings */}
      <Card>
        <CardHeader>
          <CardTitle>🎵 Saluti Basati su Attività</CardTitle>
          <CardDescription>
            Esempi di saluti che si adattano alle preferenze musicali dell'utente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge>Rock Fan</Badge>
              <p className="text-sm">
                {getActivityBasedGreeting(userName, 'evening', 'rock')}
              </p>
            </div>
            <div className="space-y-2">
              <Badge>Jazz Lover</Badge>
              <p className="text-sm">
                {getActivityBasedGreeting(userName, 'night', 'jazz')}
              </p>
            </div>
            <div className="space-y-2">
              <Badge>Pop Enthusiast</Badge>
              <p className="text-sm">
                {getActivityBasedGreeting(userName, 'morning', 'pop')}
              </p>
            </div>
            <div className="space-y-2">
              <Badge>Classical</Badge>
              <p className="text-sm">
                {getActivityBasedGreeting(userName, 'afternoon', 'musica classica')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Implementation Guide */}
      <Card>
        <CardHeader>
          <CardTitle>🛠️ Come Implementare</CardTitle>
          <CardDescription>
            Guida rapida per usare i saluti dinamici nella tua app
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">1. Import delle utility:</h4>
              <code className="text-sm bg-muted p-2 rounded block">
                {`import { getAdvancedGreeting, getPersonalizedSubtitle } from '@/utils/greetingUtils';`}
              </code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Usa il componente UserGreeting:</h4>
              <code className="text-sm bg-muted p-2 rounded block">
                {`<UserGreeting style="hero" greetingStyle="enthusiastic" />`}
              </code>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. O usa le funzioni direttamente:</h4>
              <code className="text-sm bg-muted p-2 rounded block">
                {`const greeting = getAdvancedGreeting(userName, { style: 'casual' });`}
              </code>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
