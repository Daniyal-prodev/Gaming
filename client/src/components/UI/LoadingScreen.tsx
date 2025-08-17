import React from 'react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';

export default function LoadingScreen() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 flex items-center justify-center">
      <Card className="cyber-panel p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold neon-text">Loading Race</h2>
          
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Initializing 3D engine...
            </div>
            <Progress value={progress} className="w-full" />
            <div className="text-xs text-muted-foreground">
              {progress}% Complete
            </div>
          </div>
          
          <div className="space-y-2 text-xs text-muted-foreground">
            <div>• Loading car physics</div>
            <div>• Generating track</div>
            <div>• Preparing audio systems</div>
            <div>• Initializing checkpoints</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
