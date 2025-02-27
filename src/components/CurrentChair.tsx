
import { useEffect, useState } from "react";
import { PanelChair } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface CurrentChairProps {
  chair: PanelChair | null;
  isRevealed: boolean;
}

const CurrentChair = ({ chair, isRevealed }: CurrentChairProps) => {
  const [animate, setAnimate] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isRevealed && chair) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isRevealed, chair]);

  if (!chair) {
    return (
      <Card className="w-full bg-secondary/30 border border-border shadow-sm">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground text-sm">
            No active panel chairs available. Please contact an administrator.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!isRevealed) {
    return (
      <Card className="w-full glass-panel">
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Enter a case number to reveal the next panel chair
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full glass-panel transition-all duration-300 ${animate ? 'scale-105 shadow-lg' : ''}`}>
      <CardContent className="p-6 flex flex-col items-center space-y-2">
        <span className="text-xs font-medium px-2 py-1 bg-primary/10 rounded-full">
          PANEL CHAIR
        </span>
        <h2 className="text-2xl font-bold tracking-tight">{chair.name}</h2>
        <div className="w-12 h-1 bg-primary/20 rounded-full my-1"></div>
        <p className="text-sm text-muted-foreground">
          This panel chair has been assigned to your case
        </p>
      </CardContent>
    </Card>
  );
};

export default CurrentChair;
