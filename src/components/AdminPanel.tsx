
import { useState } from "react";
import { PanelChair } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Lock } from "lucide-react";

interface AdminPanelProps {
  chairs: PanelChair[];
  adminPin: string;
  onToggleActive: (id: number) => void;
  onPinChange: (pin: string) => void;
  onResetRotation: () => void;
}

const AdminPanel = ({ 
  chairs, 
  adminPin, 
  onToggleActive, 
  onPinChange,
  onResetRotation
}: AdminPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [newPin, setNewPin] = useState("");
  const { toast } = useToast();

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pinInput === adminPin) {
      setAuthenticated(true);
      setPinInput("");
    } else {
      toast({
        title: "Invalid PIN",
        description: "The PIN you entered is incorrect.",
        variant: "destructive"
      });
    }
  };

  const handleSavePin = () => {
    if (newPin.length < 4) {
      toast({
        title: "Invalid PIN",
        description: "PIN must be at least 4 characters.",
        variant: "destructive"
      });
      return;
    }
    
    onPinChange(newPin);
    setNewPin("");
    toast({
      title: "PIN Updated",
      description: "The admin PIN has been updated successfully."
    });
  };

  const handleResetRotation = () => {
    onResetRotation();
    toast({
      title: "Rotation Reset",
      description: "Panel chair rotation has been reset to the beginning of the list."
    });
  };

  const handleDialogClose = () => {
    setIsOpen(false);
    setAuthenticated(false);
    setPinInput("");
    setNewPin("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Lock className="h-3 w-3" />
          <span>Admin</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" onInteractOutside={handleDialogClose}>
        <DialogHeader>
          <DialogTitle>Administrator Panel</DialogTitle>
          <DialogDescription>
            Manage panel chairs and system settings.
          </DialogDescription>
        </DialogHeader>

        {!authenticated ? (
          <form onSubmit={handlePinSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="pin" className="text-sm font-medium">
                Enter Admin PIN
              </label>
              <Input
                id="pin"
                type="password"
                placeholder="PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
              />
            </div>
            <Button type="submit" className="w-full">
              Verify PIN
            </Button>
          </form>
        ) : (
          <div className="py-4 space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Panel Chair Status</h3>
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                {chairs.map((chair) => (
                  <div key={chair.id} className="flex items-center justify-between">
                    <span className="text-sm">{chair.name}</span>
                    <Switch
                      checked={chair.isActive}
                      onCheckedChange={() => onToggleActive(chair.id)}
                      aria-label={`Toggle ${chair.name} active status`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Change Admin PIN</h3>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="New PIN"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                />
                <Button onClick={handleSavePin} size="sm">
                  Save
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Reset Chair Rotation</h3>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleResetRotation}
              >
                Reset to First Chair
              </Button>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-end">
          <Button 
            variant="secondary" 
            onClick={handleDialogClose}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPanel;
