
import { useState } from "react";
import { ChairSelection } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RecentSelectionsProps {
  selections: ChairSelection[];
}

const RecentSelections = ({ selections }: RecentSelectionsProps) => {
  // Group selections by case number to identify duplicates
  const caseNumberCounts = selections.reduce((acc, selection) => {
    acc[selection.caseNumber] = (acc[selection.caseNumber] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Format timestamp to readable date/time
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + 
           ' ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  if (selections.length === 0) {
    return (
      <Card className="w-full min-h-[200px] bg-secondary/30 border border-border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Recently Used Panel Chairs</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[150px]">
          <p className="text-sm text-muted-foreground">No panel chairs have been assigned yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full min-h-[200px] glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Recently Used Panel Chairs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[150px] pr-4">
          <div className="space-y-3">
            {selections.map((selection, index) => (
              <div 
                key={selection.id} 
                className={`p-3 rounded-lg bg-secondary/50 border border-border/50 transition-all fade-scale delay-${index * 100}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm">{selection.chairName}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs font-normal">
                        {selection.caseNumber}
                      </Badge>
                      {caseNumberCounts[selection.caseNumber] > 1 && (
                        <Badge variant="destructive" className="text-xs font-normal">
                          Duplicate
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(selection.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentSelections;
