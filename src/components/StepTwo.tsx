import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

interface StepTwoProps {
  selectedExtracts: string[];
  onToggleExtract: (extract: string) => void;
}

const extracts = [
  { id: 'aloe', name: 'Aloe vera', emoji: '🌱' },
  { id: 'pepino', name: 'Hidrolato de pepino', emoji: '🥒' },
  { id: 'acerola', name: 'Extracto de acerola', emoji: '🍒' },
  { id: 'zanahoria', name: 'Extracto de zanahoria', emoji: '🥕' }
];

const StepTwo: React.FC<StepTwoProps> = ({ selectedExtracts, onToggleExtract }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-2">🌿 Paso 2</h2>
        <p className="text-green-600">Elige hasta dos extractos botánicos</p>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        {extracts.map((extract) => {
          const isSelected = selectedExtracts.includes(extract.id);
          const canSelect = selectedExtracts.length < 2 || isSelected;
          
          return (
            <Card 
              key={extract.id}
              className={`cursor-pointer transition-all ${
                isSelected 
                  ? 'ring-2 ring-green-400 bg-green-50' 
                  : canSelect ? 'hover:shadow-md' : 'opacity-50'
              }`}
              onClick={() => canSelect && onToggleExtract(extract.id)}
            >
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Checkbox 
                    checked={isSelected}
                    disabled={!canSelect}
                    className="mr-2"
                  />
                  <span className="text-2xl">{extract.emoji}</span>
                </div>
                <h3 className="font-medium text-sm">{extract.name}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default StepTwo;