import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PanelChair, ChairSelection } from '../types';

interface ChairState {
  chairs: PanelChair[];
  recentSelections: ChairSelection[];
  nextChairIndex: number;
  adminPin: string;
  setAdminPin: (pin: string) => void;
  addSelection: (caseNumber: string) => void;
  toggleChairActive: (id: number) => void;
  getNextActiveChair: () => PanelChair | null;
  resetChairRotation: () => void;
}

const initialChairs: PanelChair[] = [
  { id: 1, name: "Laura Anderson", isActive: true },
  { id: 2, name: "Sean Biggs", isActive: true },
  { id: 3, name: "Melissa Cheng", isActive: true },
  { id: 4, name: "Michael Jaffe", isActive: true },
  { id: 5, name: "Randy Rummler", isActive: true },
  { id: 6, name: "Scott Smith", isActive: true },
  { id: 7, name: "Chris Bell", isActive: true },
  { id: 8, name: "Spencer Checketts", isActive: true },
  { id: 9, name: "Emil Cheng", isActive: true },
  { id: 10, name: "Angela Dunn", isActive: true },
  { id: 11, name: "Tyler Durns", isActive: true },
  { id: 12, name: "Graham Hill", isActive: true },
  { id: 13, name: "Angela Krull", isActive: true },
  { id: 14, name: "Wes Madsen", isActive: true },
  { id: 15, name: "Brett Martindale", isActive: true },
  { id: 16, name: "Gabriel Pepper", isActive: true }
];

export const useChairStore = create<ChairState>()(
  persist(
    (set, get) => ({
      chairs: initialChairs,
      recentSelections: [],
      nextChairIndex: 0,
      adminPin: "1234", // Default PIN, should be changed by admin

      setAdminPin: (pin: string) => set({ adminPin: pin }),

      addSelection: (caseNumber: string) => {
        const nextChair = get().getNextActiveChair();
        if (!nextChair) return;
        
        const newSelection: ChairSelection = {
          id: `${Date.now()}`,
          chairId: nextChair.id,
          chairName: nextChair.name,
          caseNumber: caseNumber,
          timestamp: Date.now()
        };
        
        set(state => {
          // Update the chair index to point to the next one in rotation
          let newIndex = state.nextChairIndex;
          do {
            newIndex = (newIndex + 1) % state.chairs.length;
          } while (!state.chairs[newIndex].isActive && newIndex !== state.nextChairIndex);
          
          // Keep only the last 4 selections
          const updatedSelections = [newSelection, ...state.recentSelections].slice(0, 4);
          
          return {
            recentSelections: updatedSelections,
            nextChairIndex: newIndex
          };
        });
      },

      toggleChairActive: (id: number) => {
        set(state => ({
          chairs: state.chairs.map(chair => 
            chair.id === id ? { ...chair, isActive: !chair.isActive } : chair
          )
        }));
      },

      getNextActiveChair: () => {
        const { chairs, nextChairIndex } = get();
        
        // If no chairs are active, return null
        if (!chairs.some(chair => chair.isActive)) return null;
        
        // Find the next active chair in rotation
        let currentIndex = nextChairIndex;
        
        // If the current chair is not active, find the next active one
        if (!chairs[currentIndex].isActive) {
          let i = 0;
          while (i < chairs.length) {
            currentIndex = (currentIndex + 1) % chairs.length;
            if (chairs[currentIndex].isActive) break;
            i++;
          }
        }
        
        return chairs[currentIndex];
      },

      resetChairRotation: () => set({ nextChairIndex: 0 })
    }),
    {
      name: 'panel-chair-storage'
    }
  )
);
