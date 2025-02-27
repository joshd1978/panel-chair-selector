
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface CaseNumberInputProps {
  onSubmit: (caseNumber: string) => void;
}

const CaseNumberInput = ({ onSubmit }: CaseNumberInputProps) => {
  const [caseNumber, setCaseNumber] = useState("");
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();

  // Validate the case number format
  useEffect(() => {
    const regex = /^\d{2}-\d{4}$/;
    setIsValid(regex.test(caseNumber));
  }, [caseNumber]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Auto-insert hyphen after 2 digits
    if (value.length === 2 && !value.includes("-")) {
      value = value + "-";
    }
    
    // Limit to the format XX-XXXX
    if (value.length <= 7) {
      setCaseNumber(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isValid) {
      onSubmit(caseNumber);
      setCaseNumber("");
      toast({
        title: "Case Number Submitted",
        description: `Case ${caseNumber} has been assigned a panel chair.`,
      });
    } else {
      toast({
        title: "Invalid Case Number",
        description: "Please use the format XX-XXXX (e.g., 01-2345).",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fade-scale">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="caseNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Enter Case Number
          </label>
          <div className="relative">
            <Input
              id="caseNumber"
              type="text"
              placeholder="XX-XXXX"
              value={caseNumber}
              onChange={handleChange}
              className="input-mask text-lg font-medium tracking-wide"
              autoComplete="off"
              autoFocus
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Format: XX-XXXX (e.g., 01-2345)
          </p>
        </div>
        <Button 
          type="submit" 
          disabled={!isValid}
          className="w-full transition-all duration-300 hover:shadow-md"
        >
          Assign Panel Chair
        </Button>
      </form>
    </div>
  );
};

export default CaseNumberInput;
