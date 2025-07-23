import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface StepOneProps {
  selectedOil: string;
  onSelectOil: (oil: string) => void;
}

const oils = [
  { id: 'uva', name: 'Aceite de semilla de uva', emoji: '🍇', description: 'Rico en antioxidantes' },
  { id: 'jojoba', name: 'Aceite de jojoba', emoji: '🌿', description: 'Hidratación profunda' },
  { id: 'almendra', name: 'Aceite de almendra', emoji: '🌰', description: 'Suaviza la piel' },
  { id: 'rosa', name: 'Aceite de rosa mosqueta', emoji: '🌹', description: 'Regenerador natural' }
];

const StepOne: React.FC<StepOneProps> = ({ selectedOil, onSelectOil }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-2">🟢 Paso 1</h2>
        <p className="text-green-600 text-lg">Elige un aceite vegetal</p>
      </div>
      
      <RadioGroup value={selectedOil} onValueChange={onSelectOil}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {oils.map((oil) => (
            <Card 
              key={oil.id}
              className={`cursor-pointer transition-all duration-200 ${
                selectedOil === oil.id 
                  ? 'ring-2 ring-green-400 bg-gradient-to-br from-green-50 to-green-100 shadow-lg' 
                  : 'hover:shadow-md hover:scale-105 bg-white'
              }`}
              onClick={() => onSelectOil(oil.id)}
            >
              <CardContent className="p-4 text-center relative">
                <RadioGroupItem 
                  value={oil.id} 
                  id={oil.id}
                  className="absolute top-2 right-2"
                />
                <Label htmlFor={oil.id} className="cursor-pointer">
                  <div className="text-4xl mb-3">{oil.emoji}</div>
                  <h3 className="font-semibold text-sm text-gray-800 mb-1 leading-tight">{oil.name}</h3>
                  <p className="text-xs text-gray-500">{oil.description}</p>
                </Label>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default StepOne;