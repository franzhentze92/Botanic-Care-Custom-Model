import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface StepThreeProps {
  selectedFunction: string;
  onSelectFunction: (func: string) => void;
}

const functions = [
  {
    id: 'anti-aging',
    name: 'Anti-aging',
    emoji: '✨',
    ingredients: ['Extracto de hongos', 'Aceite de incienso', 'Aceite de geranio', 'Ácido hialurónico']
  },
  {
    id: 'hidratante',
    name: 'Hidratante',
    emoji: '💧',
    ingredients: ['Ácido hialurónico', 'Glicerina vegetal', 'Manteca de karité', 'Ceramidas']
  },
  {
    id: 'purificante',
    name: 'Purificante',
    emoji: '🌸',
    ingredients: ['Arcilla verde', 'Aceite de árbol de té', 'Extracto de hamamelis', 'Niacinamida']
  }
];

const StepThree: React.FC<StepThreeProps> = ({ selectedFunction, onSelectFunction }) => {
  const selectedFunctionData = functions.find(f => f.id === selectedFunction);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-2">✨ Paso 3</h2>
        <p className="text-green-600">Elige una función activa</p>
      </div>
      
      <div className="max-w-md mx-auto">
        <Select value={selectedFunction} onValueChange={onSelectFunction}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una función" />
          </SelectTrigger>
          <SelectContent>
            {functions.map((func) => (
              <SelectItem key={func.id} value={func.id}>
                <span className="flex items-center">
                  <span className="mr-2">{func.emoji}</span>
                  {func.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedFunctionData && (
        <Card className="max-w-md mx-auto bg-pink-50 border-pink-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-pink-800 mb-2 flex items-center">
              <span className="mr-2">{selectedFunctionData.emoji}</span>
              {selectedFunctionData.name}
            </h3>
            <p className="text-sm text-pink-600 mb-2">Incluye:</p>
            <ul className="text-sm text-pink-700 space-y-1">
              {selectedFunctionData.ingredients.map((ingredient, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1 h-1 bg-pink-400 rounded-full mr-2"></span>
                  {ingredient}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StepThree;