
import React from 'react';
import { useDevices } from '@/store/DeviceStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const RecentCommands: React.FC = () => {
  const { recentCommands } = useDevices();

  if (recentCommands.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-butler-primary" />
          <CardTitle className="text-lg">Letzte Befehle</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {recentCommands.map((command, index) => (
          <div key={index} className="flex items-start space-x-2 py-1">
            <Badge variant="outline" className="mt-0.5 shrink-0">
              <MessageSquare className="h-3 w-3 mr-1" />
              {index + 1}
            </Badge>
            <span className="text-sm text-muted-foreground">{command}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentCommands;
