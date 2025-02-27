
import { useState, useEffect } from "react";
import { useChairStore } from "@/store/chairStore";
import CaseNumberInput from "@/components/CaseNumberInput";
import CurrentChair from "@/components/CurrentChair";
import RecentSelections from "@/components/RecentSelections";
import AdminPanel from "@/components/AdminPanel";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const { 
    chairs, 
    recentSelections, 
    adminPin,
    getNextActiveChair, 
    addSelection, 
    toggleChairActive,
    setAdminPin,
    resetChairRotation
  } = useChairStore();
  const nextChair = getNextActiveChair();
  const { toast } = useToast();

  // Handle case number submission
  const handleCaseSubmit = (caseNumber: string) => {
    if (!nextChair) {
      toast({
        title: "No Active Panel Chairs",
        description: "There are no active panel chairs available. Please contact an administrator.",
        variant: "destructive"
      });
      return;
    }

    // Check if this case has already been assigned
    const hasDuplicate = recentSelections.some(
      selection => selection.caseNumber === caseNumber
    );

    if (hasDuplicate) {
      toast({
        title: "Duplicate Case Number",
        description: `Case ${caseNumber} has already been assigned. This will be marked as a duplicate.`,
        variant: "default"
      });
    }

    addSelection(caseNumber);
    setIsRevealed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex flex-col">
      <header className="px-6 py-4 border-b">
        <div className="container flex justify-between items-center">
          <h1 className="text-xl font-semibold">Panel Chair Selector</h1>
          <AdminPanel 
            chairs={chairs}
            adminPin={adminPin}
            onToggleActive={toggleChairActive}
            onPinChange={setAdminPin}
            onResetRotation={resetChairRotation}
          />
        </div>
      </header>

      <main className="flex-1 container py-8 px-4">
        <div className="max-w-md mx-auto space-y-8 animate-fadeIn">
          {/* Instructions */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Panel Chair Assignment</h2>
            <p className="text-muted-foreground">
              Enter a case number to be assigned the next available panel chair.
            </p>
          </div>

          {/* Case number input */}
          <CaseNumberInput onSubmit={handleCaseSubmit} />

          {/* Current chair display */}
          <div className="pt-4">
            <CurrentChair chair={nextChair} isRevealed={isRevealed} />
          </div>
          
          {/* Recent selections */}
          <div className="pt-4">
            <RecentSelections selections={recentSelections} />
          </div>
        </div>
      </main>
      
      <footer className="border-t py-4 px-6">
        <div className="container text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Panel Chair Selector
        </div>
      </footer>
    </div>
  );
};

export default Index;
