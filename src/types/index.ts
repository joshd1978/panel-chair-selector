
export interface PanelChair {
  id: number;
  name: string;
  isActive: boolean;
}

export interface ChairSelection {
  id: string;
  chairId: number;
  chairName: string;
  caseNumber: string;
  timestamp: number;
}
