import React, { useState } from 'react';
import { EvaluationCriterion, ImageEvaluation, RatingValue } from '../types';
import RatingSelector from './RatingSelector';
import { submitEvaluation } from '../api/evaluations';
import { CheckCircle, RefreshCw } from 'lucide-react';

interface ImageEvaluationFormProps {
  modelName: string;
  imageId: string;
  onSubmitted: () => void;
}

// Evaluation criteria
const evaluationCriteria: EvaluationCriterion[] = [
  { id: 'bouquetShape', name: 'Форма букету', description: 'Наскільки форма відповідає очікуванням?' },
  { id: 'style', name: 'Стиль', description: 'Чи відповідає стиль вашому вибору?' },
  { id: 'flowerQuality', name: 'Якість відтворення квітів', description: 'Наскільки реалістично виглядають квіти?' },
  { id: 'colorBalance', name: 'Баланс і точність кольорів', description: 'Чи правильно передані кольори?' },
  { id: 'accentElements', name: 'Акцентні елементи', description: 'Якість додаткових декоративних елементів' },
  { id: 'wrappingStyle', name: 'Стиль і колір пакування', description: 'Наскільки добре відтворено пакування?' },
  { id: 'bouquetSize', name: 'Розмір букету', description: 'Чи відповідає розмір вашим очікуванням?' },
  { id: 'background', name: 'Відтворення фону', description: 'Якість і відповідність фону' },
];

const ImageEvaluationForm: React.FC<ImageEvaluationFormProps> = ({ 
  modelName, 
  imageId,
  onSubmitted
}) => {
  const [ratings, setRatings] = useState<Record<string, RatingValue | null>>(
    Object.fromEntries(evaluationCriteria.map((criterion) => [criterion.id, null]))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRatingChange = (criterionId: string, value: RatingValue) => {
    setRatings(prev => ({
      ...prev,
      [criterionId]: value
    }));
  };

  const isFormComplete = Object.values(ratings).every(rating => rating !== null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormComplete) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const evaluation: ImageEvaluation = {
        modelName,
        imageId,
        bouquetShape: ratings.bouquetShape as RatingValue,
        style: ratings.style as RatingValue,
        flowerQuality: ratings.flowerQuality as RatingValue,
        colorBalance: ratings.colorBalance as RatingValue,
        accentElements: ratings.accentElements as RatingValue,
        wrappingStyle: ratings.wrappingStyle as RatingValue,
        bouquetSize: ratings.bouquetSize as RatingValue,
        background: ratings.background as RatingValue,
      };
      
      const result = await submitEvaluation(evaluation);
      
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          onSubmitted();
        }, 1500);
      } else {
        setError(result.error || 'Помилка при відправці оцінки');
      }
    } catch (err) {
      setError('Сталася непередбачена помилка');
      console.error('Error submitting evaluation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 text-center animate-fadeIn">
        <div className="flex justify-center mb-3">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
        <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-2">
          Дякуємо за вашу оцінку!
        </h3>
        <p className="text-green-600 dark:text-green-400">
          Ваш відгук важливий для нас і допоможе покращити якість згенерованих зображень.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {evaluationCriteria.map((criterion) => (
          <div key={criterion.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">{criterion.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{criterion.description}</p>
              </div>
            </div>
            <RatingSelector
              id={`${modelName}-${criterion.id}`}
              name={`${modelName}-${criterion.id}`}
              value={ratings[criterion.id]}
              onChange={(value) => handleRatingChange(criterion.id, value)}
            />
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!isFormComplete || isSubmitting}
        className={`
          w-full py-3 px-4 rounded-lg font-medium transition-all duration-200
          ${isFormComplete 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
        `}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
            Відправка...
          </span>
        ) : (
          'Відправити оцінку'
        )}
      </button>
    </form>
  );
};

export default ImageEvaluationForm;