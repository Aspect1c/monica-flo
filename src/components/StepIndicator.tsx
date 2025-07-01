import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
      <span className="font-semibold">{currentStep}</span> of <span>{totalSteps}</span>
    </div>
  );
};

export default StepIndicator;