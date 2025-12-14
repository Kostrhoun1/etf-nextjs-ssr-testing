import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon, TargetIcon, TrendingUpIcon, DollarIcon, SparklesIcon } from '@/components/ui/icons';
import { useRouter } from 'next/navigation';
import { recommendationEngine, UserProfile } from '@/utils/investmentRecommendationEngine';

interface QuickStartWizardProps {
  onClose?: () => void;
  className?: string;
}

const QuickStartWizard: React.FC<QuickStartWizardProps> = ({ onClose, className = "" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState({
    experience: '',
    goal: '',
    amount: '',
    timeHorizon: ''
  });
  const router = useRouter();

  const steps = [
    {
      title: "Vítejte v ETF průvodci!",
      description: "Pomůžeme vám najít ideální ETF za 3 minuty",
      content: (
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center">
            <SparklesIcon className="w-8 h-8 text-violet-600" />
          </div>
          <p className="text-gray-600">
            Ať už jste začátečník nebo zkušený investor, najdeme pro vás nejlepší ETF fondy
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary">4300+ ETF fondů</Badge>
            <Badge variant="secondary">0% poplatky</Badge>
            <Badge variant="secondary">Detailní analýzy</Badge>
          </div>
        </div>
      )
    },
    {
      title: "Jaká je vaše zkušenost s investováním?",
      description: "Pomůže nám to doporučit vhodné ETF",
      content: (
        <div className="space-y-3">
          {[
            { id: 'beginner', label: 'Začátečník', desc: 'Nové v investování' },
            { id: 'intermediate', label: 'Středně pokročilý', desc: 'Mám základní zkušenosti' },
            { id: 'advanced', label: 'Pokročilý', desc: 'Investuji pravidelně' }
          ].map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all hover:border-violet-300 ${
                userProfile.experience === option.id ? 'border-violet-500 bg-violet-50' : ''
              }`}
              onClick={() => setUserProfile({...userProfile, experience: option.id})}
            >
              <CardContent className="p-4">
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    },
    {
      title: "Jaký je váš investiční cíl?",
      description: "Různé ETF jsou vhodné pro různé cíle",
      content: (
        <div className="space-y-3">
          {[
            { id: 'growth', label: 'Růst kapitálu', desc: 'Dlouhodobé zhodnocení', icon: TrendingUpIcon },
            { id: 'income', label: 'Pasivní příjem', desc: 'Pravidelné dividendy', icon: DollarIcon },
            { id: 'balanced', label: 'Vyvážený přístup', desc: 'Kombinace růstu a příjmu', icon: TargetIcon }
          ].map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all hover:border-violet-300 ${
                userProfile.goal === option.id ? 'border-violet-500 bg-violet-50' : ''
              }`}
              onClick={() => setUserProfile({...userProfile, goal: option.id})}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <option.icon className="w-6 h-6 text-violet-600" />
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    },
    {
      title: "Kolik chcete investovat?",
      description: "Pomůže nám doporučit vhodné brokeře",
      content: (
        <div className="space-y-3">
          {[
            { id: 'small', label: 'Do 10 000 Kč', desc: 'Začínám s malými částkami' },
            { id: 'medium', label: '10 000 - 100 000 Kč', desc: 'Střední investice' },
            { id: 'large', label: 'Nad 100 000 Kč', desc: 'Větší investice' }
          ].map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all hover:border-violet-300 ${
                userProfile.amount === option.id ? 'border-violet-500 bg-violet-50' : ''
              }`}
              onClick={() => setUserProfile({...userProfile, amount: option.id})}
            >
              <CardContent className="p-4">
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    },
    {
      title: "Váš investiční horizont?",
      description: "Délka investice ovlivňuje volbu ETF",
      content: (
        <div className="space-y-3">
          {[
            { id: 'short', label: 'Do 2 let', desc: 'Krátkodobá investice' },
            { id: 'medium', label: '2-10 let', desc: 'Střednědobá investice' },
            { id: 'long', label: 'Nad 10 let', desc: 'Dlouhodobá investice' }
          ].map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all hover:border-violet-300 ${
                userProfile.timeHorizon === option.id ? 'border-violet-500 bg-violet-50' : ''
              }`}
              onClick={() => setUserProfile({...userProfile, timeHorizon: option.id})}
            >
              <CardContent className="p-4">
                <div className="font-medium">{option.label}</div>
                <div className="text-sm text-gray-600">{option.desc}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )
    }
  ];

  const getRecommendations = async () => {
    const profile: UserProfile = {
      experience: userProfile.experience as any,
      goal: userProfile.goal as any,
      amount: userProfile.amount as any,
      timeHorizon: userProfile.timeHorizon as any
    };
    
    try {
      const recommendations = await recommendationEngine.getRecommendations(profile);
      return {
        etfs: recommendations.etfs.map(etf => etf.isin),
        brokers: recommendations.brokers.map(broker => broker.name),
        tip: recommendations.strategy.description,
        fullRecommendations: recommendations
      };
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Fallback to simple recommendations
      return {
        etfs: ['IE00B4L5Y983', 'IE00B5BMR087'], // VWCE, CSPX
        brokers: ['DEGIRO', 'XTB'],
        tip: 'Výchozí doporučení pro váš profil'
      };
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final step - show recommendations
      const recommendations = await getRecommendations();
      const queryParams = new URLSearchParams({
        recommended: recommendations.etfs.join(','),
        experience: userProfile.experience,
        goal: userProfile.goal,
        wizard: 'true'
      });
      router.push(`/srovnani-etf?${queryParams}`);
      onClose?.();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return userProfile.experience !== '';
      case 2: return userProfile.goal !== '';
      case 3: return userProfile.amount !== '';
      case 4: return userProfile.timeHorizon !== '';
      default: return false;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className={`w-full max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-violet-600" />
              {steps[currentStep].title}
            </CardTitle>
            <CardDescription>{steps[currentStep].description}</CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          )}
        </div>
        <Progress value={progress} className="w-full" />
        <div className="text-sm text-gray-500">Krok {currentStep + 1} z {steps.length}</div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {steps[currentStep].content}
        
        <div className="flex justify-between pt-4">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            Zpět
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-violet-600 hover:bg-violet-700"
          >
            {currentStep === steps.length - 1 ? 'Najít ETF' : 'Pokračovat'}
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickStartWizard;