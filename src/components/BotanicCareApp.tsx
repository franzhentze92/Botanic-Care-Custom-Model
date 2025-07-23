import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import StepOne from './StepOne';
import StepTwo from './StepTwo';
import StepThree from './StepThree';
import SummaryStep from './SummaryStep';
import PurchaseStep from './PurchaseStep';

const BotanicCareApp: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOil, setSelectedOil] = useState('');
  const [selectedExtracts, setSelectedExtracts] = useState<string[]>([]);
  const [selectedFunction, setSelectedFunction] = useState('');

  const handleToggleExtract = (extract: string) => {
    setSelectedExtracts(prev => {
      if (prev.includes(extract)) {
        return prev.filter(e => e !== extract);
      } else if (prev.length < 2) {
        return [...prev, extract];
      }
      return prev;
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedOil !== '';
      case 2: return selectedExtracts.length > 0;
      case 3: return selectedFunction !== '';
      default: return true;
    }
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateCream = () => {
    setCurrentStep(5);
  };

  const handleAddToCart = () => {
    alert('¡Producto agregado al carrito! 🛒');
  };

  const handleAddToSubscription = () => {
    alert('¡Producto agregado a tu suscripción! 📦');
  };

  const progress = (currentStep / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">🌿 Botanic Care</h1>
          <p className="text-green-600">Crea tu crema facial personalizada</p>
          <div className="mt-4">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-gray-500 mt-2">Paso {currentStep} de 5</p>
          </div>
        </div>

        {/* Main Content */}
        <Card className="mb-6">
          <CardContent className="p-6">
            {currentStep === 1 && (
              <StepOne 
                selectedOil={selectedOil} 
                onSelectOil={setSelectedOil} 
              />
            )}
            {currentStep === 2 && (
              <StepTwo 
                selectedExtracts={selectedExtracts} 
                onToggleExtract={handleToggleExtract} 
              />
            )}
            {currentStep === 3 && (
              <StepThree 
                selectedFunction={selectedFunction} 
                onSelectFunction={setSelectedFunction} 
              />
            )}
            {currentStep === 4 && (
              <SummaryStep 
                selectedOil={selectedOil}
                selectedExtracts={selectedExtracts}
                selectedFunction={selectedFunction}
                onCreateCream={handleCreateCream}
              />
            )}
            {currentStep === 5 && (
              <PurchaseStep 
                selectedOil={selectedOil}
                selectedExtracts={selectedExtracts}
                selectedFunction={selectedFunction}
                onAddToCart={handleAddToCart}
                onAddToSubscription={handleAddToSubscription}
              />
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1 || currentStep === 5}
            className="px-6"
          >
            Anterior
          </Button>
          {currentStep < 4 && (
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-green-600 hover:bg-green-700 px-6"
            >
              Siguiente
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotanicCareApp;