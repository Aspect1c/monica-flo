import React, { useState, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  SkipForward,
  RefreshCw,
} from "lucide-react";
import OptionButton from "./OptionButton";
import ProgressBar from "./ProgressBar";
import StepIndicator from "./StepIndicator";
import { generateImages, revokeImageUrl } from "../api/imageGeneration";
import { GeneratedImage, ImageGenerationError } from "../types";
import {
  shapes,
  styles,
  mainFlowers,
  accentFlowers,
  colors,
  wrappingStyles,
  sizes,
  backgrounds,
} from "../data/bouquetOptions";
import {
  shapeTranslations,
  styleTranslations,
  mainFlowerTranslations,
  accentFlowerTranslations,
  colorTranslations,
  backgroundTranslations,
  wrappingStyleTranslations,
  sizeTranslations,
} from "../data/translations";
import ImageEvaluationSection from "./ImageEvaluationSection";
import ImageCard from "./ImageCard";

const steps = [
  { id: 1, title: "Shape", description: "Choose your bouquet shape" },
  { id: 2, title: "Style", description: "Select the overall style" },
  { id: 3, title: "Flowers", description: "Pick your main flowers" },
  { id: 4, title: "Accents", description: "Select accent flowers" },
  { id: 5, title: "Details", description: "Choose wrapping and size" },
  { id: 6, title: "Background", description: "Select the background style" },
];

const wrappingsRequiringColor = [
  "Tulle or Organza with Embroidery",
  "Corrugated paper",
  "Silk ribbon",
];

const BouquetGenerator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selections, setSelections] = useState({
    shape: "",
    otherShape: "",
    style: "",
    otherStyle: "",
    accentFlowers: [] as string[],
    wrapping: "",
    wrappingColor: "",
    size: "",
    otherSize: "",
    customPrompt: "",
    background: "",
    backgroundColor: "",
    floristChoice: false,
  });
  const [showWrappingColorSelection, setShowWrappingColorSelection] = useState(false);
  const [flowerColorPairs, setFlowerColorPairs] = useState<{ flower: string; color: string }[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [currentFlowerToColor, setCurrentFlowerToColor] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [errors, setErrors] = useState<ImageGenerationError[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const progress = (currentStep / steps.length) * 100;

  // Function to generate unique IDs for images when they're created
  useEffect(() => {
    // Add IDs to generated images if they don't have them
    if (generatedImages.length > 0) {
      const imagesWithIds = generatedImages.map(img => {
        if (!img.id) {
          return {
            ...img,
            id: `${img.modelName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
          };
        }
        return img;
      });
      
      if (JSON.stringify(imagesWithIds) !== JSON.stringify(generatedImages)) {
        setGeneratedImages(imagesWithIds);
      }
    }
  }, [generatedImages]);

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    handleSubmit();
  };

  const handleSelection = (
    type: keyof typeof selections,
    value: string | string[] | boolean
  ) => {
    setSelections((prev) => ({
      ...prev,
      [type]: value,
    }));
    if (type === "background" && typeof value === "string") {
      if (value === "Solid Color") {
        setSelections((prev) => ({ ...prev, background: value }));
      } else {
        setSelections((prev) => ({ ...prev, background: value, backgroundColor: "" }));
      }
    }
    

    if (type === "wrapping" && typeof value === "string") {
      setShowWrappingColorSelection(wrappingsRequiringColor.includes(value));
      if (!wrappingsRequiringColor.includes(value)) {
        setSelections((prev) => ({
          ...prev,
          wrappingColor: "",
          floristChoice: false,
        }));
      }
    }
  };

  const handleMultiSelection = (type: "accentFlowers", value: string) => {
    setSelections((prev) => {
      const currentValues = [...prev[type]];
      const maxItems = 2;

      if (currentValues.includes(value)) {
        return {
          ...prev,
          [type]: currentValues.filter((item) => item !== value),
        };
      } else if (currentValues.length < maxItems) {
        return {
          ...prev,
          [type]: [...currentValues, value],
        };
      }
      return prev;
    });
  };

  const handleMainFlowerSelection = (flower: string) => {
    if (flowerColorPairs.find((pair) => pair.flower === flower)) {
      setFlowerColorPairs((prev) =>
        prev.filter((pair) => pair.flower !== flower)
      );
    } else if (flowerColorPairs.length < 3) {
      setCurrentFlowerToColor(flower);
    }
  };

  const handleColorSelectionForFlower = (color: string) => {
    if (currentFlowerToColor) {
      setFlowerColorPairs((prev) => [
        ...prev,
        { flower: currentFlowerToColor, color },
      ]);
      setCurrentFlowerToColor(null);
    }
  };

  const handleWrappingColorSelection = (color: string) => {
    setSelections((prev) => ({
      ...prev,
      wrappingColor: color,
      floristChoice: false,
    }));
  };

  const handleFloristChoice = () => {
    setSelections((prev) => ({
      ...prev,
      wrappingColor: "",
      floristChoice: true,
    }));
  };

  const createPrompt = () => {
    let backgroundText = "";

    if (selections.background === "Solid Color" && selections.backgroundColor) {
      backgroundText = ` The background is a solid ${selections.backgroundColor} color.`;
    } else if (selections.background) {
      backgroundText = ` The background features a ${selections.background.toLowerCase()} setting.`;
    } else {
      backgroundText = ` The background features a stylish flower studio interior.`;
    }

    if (isEditing && selections.customPrompt) {
      return selections.customPrompt;
    }

    const shape = selections.otherShape || selections.shape || "round";
    const style = selections.otherStyle || selections.style || "elegant";
    const size = selections.otherSize || selections.size || "medium";

    const mainFlowersList =
      flowerColorPairs.length > 0
        ? flowerColorPairs
            .map(({ flower, color }) => `${flower} in ${color}`)
            .join(", ")
        : "roses in pink, lilies in white";

    const accentFlowersList =
      selections.accentFlowers.length > 0
        ? ` with ${selections.accentFlowers.join(" and ")} accents`
        : "";

    let wrappingText = "";
    if (selections.wrapping && selections.wrapping !== "None") {
      wrappingText = `, wrapped with ${selections.wrapping}`;

      if (wrappingsRequiringColor.includes(selections.wrapping)) {
        if (selections.floristChoice) {
          wrappingText += " (color at florist's discretion)";
        } else if (selections.wrappingColor) {
          wrappingText += ` in ${selections.wrappingColor}`;
        }
      }
    }

    const prompt = `Create a high-resolution, photorealistic image of a ${size}, ${style} flower bouquet arranged in a ${shape} shape, prominently featuring ${mainFlowersList}${accentFlowersList}. The bouquet should have elegant composition and balanced symmetry${wrappingText}.${backgroundText} Capture the bouquet from an arm's-length angle with soft natural lighting. Emphasize realistic textures, vivid colors, and artistic floristry.`;

    return prompt;
  };

  const handleSubmit = async () => {
    setIsGenerating(true);
    setShowResult(true);
    setErrors([]);
    
    // Clean up previous image URLs to prevent memory leaks
    generatedImages.forEach(image => {
      if (image.url) {
        revokeImageUrl(image.url);
      }
    });
    
    try {
      const prompt = createPrompt();
      const style = selections.style.toLowerCase() || "elegant";

      const result = await generateImages(prompt, style);
      
      // Add IDs to the generated images
      const imagesWithIds = result.images.map(img => ({
        ...img,
        id: `${img.modelName}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      }));
      
      setGeneratedImages(imagesWithIds);
      setErrors(result.errors);
    } catch (err) {
      console.error("Error generating images:", err);
      setErrors([{ 
        modelName: 'General', 
        message: err instanceof Error ? err.message : 'An unknown error occurred'
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = async (image: GeneratedImage) => {
    if (!image || !image.url) return;

    setIsDownloading(true);

    try {
      const shape = selections.otherShape || selections.shape || "round";
      const style = selections.otherStyle || selections.style || "elegant";
      const filename = `bouquet-${style}-${shape}-${image.modelName}-${Date.now()}.png`;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.crossOrigin = "anonymous";

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = image.url;
      });

      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      const pngUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading image:", err);
      setErrors([...errors, {
        modelName: 'Download',
        message: 'Failed to download image. Please try again.'
      }]);
    } finally {
      setIsDownloading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
              Яку форму ви хочете для букету
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {shapes.map((shape) => (
                <OptionButton
                  key={shape.name}
                  name={shapeTranslations[shape.name] || shape.name}
                  image={shape.image}
                  isSelected={selections.shape === shape.name}
                  onClick={() => handleSelection("shape", shape.name)}
                />
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6 text-black dark:text-white">
              Який стиль букету ви хочете
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {styles.map((style) => (
                <OptionButton
                  key={style.name}
                  name={styleTranslations[style.name] || style.name}
                  image={style.image}
                  isSelected={selections.style === style.name}
                  onClick={() => handleSelection("style", style.name)}
                />
              ))}
            </div>
          </div>
        );
      case 3:
        if (currentFlowerToColor) {
          return (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">
                Виберіть колір для квітки:{" "}
                {mainFlowerTranslations[currentFlowerToColor] ||
                  currentFlowerToColor}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {colors.map((color) => (
                  <OptionButton
                    key={color.name}
                    name={colorTranslations[color.name] || color.name}
                    image={color.image}
                    isSelected={false}
                    onClick={() => handleColorSelectionForFlower(color.name)}
                  />
                ))}
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">
              Оберіть квіти для своєї композиції
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {mainFlowers.map((flower) => (
                <OptionButton
                  key={flower.name}
                  name={mainFlowerTranslations[flower.name] || flower.name}
                  image={flower.image}
                  isSelected={
                    !!flowerColorPairs.find(
                      (pair) => pair.flower === flower.name
                    )
                  }
                  onClick={() => handleMainFlowerSelection(flower.name)}
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Вибрано:{" "}
              <span className="font-bold">{flowerColorPairs.length}</span>/3
            </p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">
              Оберіть декоративні доповнення до композиції
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {accentFlowers.map((flower) => (
                <OptionButton
                  key={flower.name}
                  name={accentFlowerTranslations[flower.name] || flower.name}
                  image={flower.image}
                  isSelected={selections.accentFlowers.includes(flower.name)}
                  onClick={() =>
                    handleMultiSelection("accentFlowers", flower.name)
                  }
                />
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Вибрано:{" "}
              <span className="font-bold">
                {selections.accentFlowers.length}
              </span>
              /2
            </p>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">
                Оберіть пакування для вашої композиції
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {wrappingStyles.map((style) => (
                  <OptionButton
                    key={style.name}
                    name={wrappingStyleTranslations[style.name] || style.name}
                    image={style.image}
                    isSelected={selections.wrapping === style.name}
                    onClick={() => handleSelection("wrapping", style.name)}
                  />
                ))}
              </div>
            </div>

            {showWrappingColorSelection && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-2xl font-semibold mb-6">
                  Виберіть колір для{" "}
                  {wrappingStyleTranslations[selections.wrapping] ||
                    selections.wrapping}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {colors.map((color) => (
                    <OptionButton
                      key={color.name}
                      name={colorTranslations[color.name] || color.name}
                      image={color.image}
                      isSelected={selections.wrappingColor === color.name}
                      onClick={() => handleWrappingColorSelection(color.name)}
                    />
                  ))}
                </div>
                <button
                  onClick={handleFloristChoice}
                  className={`mt-4 w-full p-4 rounded-xl font-medium transition-all duration-200 
                        ${
                          selections.floristChoice
                            ? "bg-purple-100 dark:bg-purple-900 border-2 border-purple-500 text-purple-700 dark:text-purple-300"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white border-2 border-transparent"
                        }`}
                >
                  Колір на розсуд флориста
                </button>
              </div>
            )}

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold mb-6">
                Оберіть розмір букету
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {sizes.map((size) => (
                  <OptionButton
                    key={size.name}
                    name={sizeTranslations[size.name] || size.name}
                    image={size.image}
                    isSelected={selections.size === size.name}
                    onClick={() => handleSelection("size", size.name)}
                  />
                ))}
              </div>
            </div>
          </div>
        );
        case 6:
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold mb-6">
        Оберіть стиль заднього фону
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {backgrounds.map((bg) => (
          <OptionButton
            key={bg.name}
            name={backgroundTranslations[bg.name] || bg.name}
            image={bg.image}
            isSelected={selections.background === bg.name}
            onClick={() => handleSelection("background", bg.name)}
          />
        ))}
      </div>

      {selections.background === "Solid Color" && (
        <div className="space-y-4 animate-fadeIn">
          <h3 className="text-lg font-medium">Оберіть колір фону</h3>
          <div className="grid grid-cols-3 gap-3">
            {colors.map((color) => (
              <OptionButton
                key={color.name}
                name={colorTranslations[color.name] || color.name}
                image={color.image}
                isSelected={selections.backgroundColor === color.name}
                onClick={() =>
                  setSelections((prev) => ({
                    ...prev,
                    backgroundColor: color.name,
                  }))
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

      default:
        return <div className="text-center py-12">Loading...</div>;
    }
  };

  if (showResult) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
          <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Твій згенерований власноруч букет
          </h2>

          {errors.some(e => e.modelName === 'General') && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-4 rounded-lg mb-6">
              <p className="font-medium">Error</p>
              <p>{errors.find(e => e.modelName === 'General')?.message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {['ClipDrop', 'Stability Ultra', 'Stability Core'].map((modelName) => {
              const modelImage = generatedImages.find(img => img.modelName === modelName);
              const modelError = errors.find(e => e.modelName === modelName);
              
              if (isGenerating) {
                return (
                  <div key={modelName} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
                    <div className={`p-4 text-white ${
                      modelName === 'ClipDrop' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-700'
                        : modelName === 'Stability Ultra'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-700'
                        : 'bg-gradient-to-r from-green-500 to-green-700'
                    }`}>
                      <h3 className="font-bold">{modelName}</h3>
                    </div>
                    <div className="aspect-square relative bg-gray-100 dark:bg-gray-900">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <RefreshCw className="w-12 h-12 text-blue-500 animate-spin" />
                      </div>
                    </div>
                  </div>
                );
              }
              
              if (modelError) {
                return (
                  <div key={modelName} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
                    <div className={`p-4 text-white ${
                      modelName === 'ClipDrop' 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-700'
                        : modelName === 'Stability Ultra'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-700'
                        : 'bg-gradient-to-r from-green-500 to-green-700'
                    }`}>
                      <h3 className="font-bold">{modelName}</h3>
                    </div>
                    <div className="aspect-square relative bg-gray-100 dark:bg-gray-900">
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                        <p className="text-red-500 font-medium mb-2">Error</p>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {modelError.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
              
              if (modelImage) {
                return (
                  <ImageCard 
                    key={modelName}
                    image={modelImage}
                    isGenerating={isGenerating}
                    onDownload={handleDownloadImage}
                    isDownloading={isDownloading}
                  />
                );
              }
              
              return (
                <div key={modelName} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md">
                  <div className={`p-4 text-white ${
                    modelName === 'ClipDrop' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700'
                      : modelName === 'Stability Ultra'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-700'
                      : 'bg-gradient-to-r from-green-500 to-green-700'
                  }`}>
                    <h3 className="font-bold">{modelName}</h3>
                  </div>
                  <div className="aspect-square relative bg-gray-100 dark:bg-gray-900">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-400">No image generated</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => {
                setShowResult(false);
                setGeneratedImages([]);
              }}
              className="flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-medium transition-all duration-200"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Повернутися
            </button>

            <button
              onClick={handleSubmit}
              disabled={isGenerating}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                  Генерування...
                </>
              ) : (
                <>
                  {generatedImages.length > 0 ? "Перегенерувати" : "Згенерувати"}
                  <RefreshCw className="ml-2 h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20">
        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
          Генератор букетів
        </h1>
        <ProgressBar progress={progress} />
        <StepIndicator currentStep={currentStep} totalSteps={steps.length} />
        {renderStepContent()}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              currentStep === 1
                ? "opacity-0 pointer-events-none"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
            }`}
          >
            <ChevronLeft className="mr-2 h-5 w-5" /> Назад
          </button>

          <div className="flex gap-3">
            {currentStep === steps.length && (
              <button
                onClick={handleSkip}
                className="flex items-center px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl font-medium transition-all duration-200"
              >
                <SkipForward className="mr-2 h-5 w-5" /> Пропустити
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all duration-200 transform hover:scale-105"
            >
              {currentStep === steps.length ? "Підтвердити" : "Далі"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BouquetGenerator;