import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface PurchaseStepProps {
  selectedOil: string;
  selectedExtracts: string[];
  selectedFunction: string;
  onAddToCart: () => void;
  onAddToSubscription: () => void;
}

const oilNames: Record<string, string> = {
  uva: 'Aceite de semilla de uva',
  jojoba: 'Aceite de jojoba',
  almendra: 'Aceite de almendra',
  rosa: 'Aceite de rosa mosqueta'
};

const extractNames: Record<string, string> = {
  aloe: 'Aloe vera',
  pepino: 'Hidrolato de pepino',
  acerola: 'Extracto de acerola',
  zanahoria: 'Extracto de zanahoria'
};

const functionNames: Record<string, string> = {
  'anti-aging': 'Anti-aging',
  'hidratante': 'Hidratante',
  'purificante': 'Purificante'
};

const PurchaseStep: React.FC<PurchaseStepProps> = ({ 
  selectedOil, 
  selectedExtracts, 
  selectedFunction, 
  onAddToCart,
  onAddToSubscription
}) => {
  const [purchaseOption, setPurchaseOption] = useState('');

  const handleProceed = () => {
    if (purchaseOption === 'cart') {
      onAddToCart();
    } else if (purchaseOption === 'subscription') {
      onAddToSubscription();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-800 mb-2">🛒 ¡Producto Creado!</h2>
        <p className="text-green-600">¿Cómo deseas continuar?</p>
      </div>
      
      <Card className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-pink-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-center text-green-800 flex items-center justify-center">
            <span className="mr-2">🌿</span>
            Mi Crema Botanic Care
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-green-700 mb-2 flex items-center">
              <span className="mr-2">🟢</span>
              Aceite Base
            </h3>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {oilNames[selectedOil]}
            </Badge>
          </div>
          
          <div>
            <h3 className="font-semibold text-green-700 mb-2 flex items-center">
              <span className="mr-2">🌿</span>
              Extractos Botánicos
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedExtracts.map((extract) => (
                <Badge key={extract} variant="secondary" className="bg-blue-100 text-blue-800">
                  {extractNames[extract]}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold text-green-700 mb-2 flex items-center">
              <span className="mr-2">✨</span>
              Función Activa
            </h3>
            <Badge variant="secondary" className="bg-pink-100 text-pink-800">
              {functionNames[selectedFunction]}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="max-w-md mx-auto">
        <CardContent className="p-6">
          <RadioGroup value={purchaseOption} onValueChange={setPurchaseOption}>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="cart" id="cart" />
                <Label htmlFor="cart" className="flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🛒</span>
                    <div>
                      <h3 className="font-semibold">Agregar al carrito</h3>
                      <p className="text-sm text-gray-500">Compra única - Pagar ahora</p>
                    </div>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="subscription" id="subscription" />
                <Label htmlFor="subscription" className="flex-1 cursor-pointer">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">📦</span>
                    <div>
                      <h3 className="font-semibold">Agregar a mi suscripción</h3>
                      <p className="text-sm text-gray-500">Recibe mensualmente con descuento</p>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
      
      <div className="text-center">
        <Button 
          onClick={handleProceed}
          disabled={!purchaseOption}
          className="bg-gradient-to-r from-green-500 to-pink-500 hover:from-green-600 hover:to-pink-600 text-white px-8 py-3 text-lg disabled:opacity-50"
          size="lg"
        >
          {purchaseOption === 'cart' ? 'Ir al Carrito' : purchaseOption === 'subscription' ? 'Agregar a Suscripción' : 'Selecciona una opción'}
        </Button>
      </div>
    </div>
  );
};

export default PurchaseStep;