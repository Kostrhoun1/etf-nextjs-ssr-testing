import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, Sparkles, Target, Clock, Home, GraduationCap, PiggyBank, ExternalLink , Globe, TrendingUp, Building} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { portfolioEngine, InvestorProfile, PortfolioRecommendation } from '@/utils/portfolioRecommendationEngine';
import { PortfolioProjectionChart } from '@/components/portfolio/PortfolioProjectionChart';

interface PortfolioWizardProps {
  onClose?: () => void;
  className?: string;
}

const PortfolioWizard: React.FC<PortfolioWizardProps> = ({ onClose, className = "" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [profile, setProfile] = useState<Partial<InvestorProfile>>({});
  const [recommendation, setRecommendation] = useState<PortfolioRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const steps = [
    {
      title: "Vítejte v portfoliovém průvodci!",
      description: "Doporučíme vám optimální portfolio strategie pro váš investorský profil",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
            <TrendingUp className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Individuální portfolio průvodce</h3>
            <p className="text-gray-600">
              Navržeme vám optimální portfolio strategii založenou na vědeckých principech diverzifikace 
              podle vašeho rizikového profilu a investičních cílů.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Řízení rizika</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Cílené výnosy</div>
            </div>
          </div>
          
        </div>
      )
    },
    {
      title: "Kolik je vám let?",
      description: "Věk ovlivňuje optimální poměr akcií a dluhopisů",
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-violet-600 mb-2">
              {profile.age || 25} let
            </div>
            <Slider
              value={[profile.age || 25]}
              onValueChange={(value) => setProfile({...profile, age: value[0]})}
              max={80}
              min={18}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>18</span>
              <span>80</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">💡 Proč věk záleží?</h4>
            <p className="text-sm text-gray-600">
              {profile.age && profile.age < 30 && "Mladí investoři mohou riskovat více pro vyšší výnosy"}
              {profile.age && profile.age >= 30 && profile.age < 50 && "Ve středním věku hledáme vyvážený přístup"}
              {profile.age && profile.age >= 50 && "Blíže k důchodu preferujeme stabilitu a ochranu kapitálu"}
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Jaká je vaše tolerance k riziku?",
      description: "Investování vždy obsahuje riziko - jak moc jste ochotni riskovat?",
      content: (
        <div className="space-y-4">
          {[
            { 
              id: 'conservative', 
              label: 'Konzervativní', 
              desc: 'Preferuji stabilitu, pokles o 5-10% by mě znervóznil',
              icon: Shield,
              color: 'green'
            },
            { 
              id: 'moderate', 
              label: 'Vyvážený', 
              desc: 'Akceptuji střední riziko, pokles o 10-20% zvládnu',
              icon: Target,
              color: 'blue'
            },
            { 
              id: 'aggressive', 
              label: 'Agresivní', 
              desc: 'Chci maximální výnosy, pokles o 20-30% neřeším',
              icon: TrendingUp,
              color: 'purple'
            }
          ].map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all hover:border-${option.color}-300 ${
                profile.riskTolerance === option.id ? `border-${option.color}-500 bg-${option.color}-50` : ''
              }`}
              onClick={() => setProfile({...profile, riskTolerance: option.id as any})}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`w-12 h-12 bg-${option.color}-100 rounded-full flex items-center justify-center`}>
                  <option.icon className={`w-6 h-6 text-${option.color}-600`} />
                </div>
                <div className="flex-1">
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
      title: "Jaký je váš investiční horizont?",
      description: "Za jak dlouho budete peníze potřebovat?",
      content: (
        <div className="space-y-4">
          {[
            { 
              id: 'short', 
              label: 'Krátkodobý (do 5 let)', 
              desc: 'Budu peníze potřebovat brzo - koupě domu, auto, apod.',
              icon: Clock
            },
            { 
              id: 'medium', 
              label: 'Střednědobý (5-15 let)', 
              desc: 'Plánuji využít za několik let - vzdělání dětí, apod.',
              icon: Target
            },
            { 
              id: 'long', 
              label: 'Dlouhodobý (15+ let)', 
              desc: 'Investuji na důchod nebo obecné budování bohatství',
              icon: TrendingUp
            }
          ].map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all hover:border-violet-300 ${
                profile.timeHorizon === option.id ? 'border-violet-500 bg-violet-50' : ''
              }`}
              onClick={() => setProfile({...profile, timeHorizon: option.id as any})}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <option.icon className="w-8 h-8 text-violet-600" />
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
      title: "Jaké jsou vaše zkušenosti s investováním?",
      description: "Pomůže nám to doporučit vhodnou strategii",
      content: (
        <div className="space-y-4">
          {[
            { 
              id: 'beginner', 
              label: 'Začátečník', 
              desc: 'Začínám s investováním, preferuji jednoduché řešení',
              icon: GraduationCap
            },
            { 
              id: 'intermediate', 
              label: 'Pokročilý', 
              desc: 'Mám nějaké zkušenosti, rozumím základům investování',
              icon: Target
            },
            { 
              id: 'advanced', 
              label: 'Expert', 
              desc: 'Mám rozsáhlé znalosti a chci sofistikované strategie',
              icon: TrendingUp
            }
          ].map((option) => (
            <Card 
              key={option.id}
              className={`cursor-pointer transition-all hover:border-violet-300 ${
                profile.experience === option.id ? 'border-violet-500 bg-violet-50' : ''
              }`}
              onClick={() => setProfile({...profile, experience: option.id as any})}
            >
              <CardContent className="p-4 flex items-center gap-4">
                <option.icon className="w-8 h-8 text-violet-600" />
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
      title: "Jaké jsou vaše investiční cíle?",
      description: "Můžete vybrat více možností",
      content: (
        <div className="space-y-4">
          {[
            { 
              id: 'retirement', 
              label: 'Důchod', 
              desc: 'Dlouhodobé spoření na penzi',
              icon: PiggyBank
            },
            { 
              id: 'house', 
              label: 'Koupě nemovitosti', 
              desc: 'Spoření na vlastní bydlení',
              icon: Home
            },
            { 
              id: 'education', 
              label: 'Vzdělání', 
              desc: 'Škola pro děti nebo další vzdělání',
              icon: GraduationCap
            },
            { 
              id: 'general_wealth', 
              label: 'Obecné budování bohatství', 
              desc: 'Zhodnocení úspor bez konkrétního cíle',
              icon: TrendingUp
            }
          ].map((option) => {
            const isSelected = profile.goals?.includes(option.id as any);
            return (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all hover:border-violet-300 ${
                  isSelected ? 'border-violet-500 bg-violet-50' : ''
                }`}
                onClick={() => {
                  const currentGoals = profile.goals || [];
                  const newGoals = isSelected 
                    ? currentGoals.filter(g => g !== option.id)
                    : [...currentGoals, option.id as any];
                  setProfile({...profile, goals: newGoals});
                }}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <option.icon className="w-8 h-8 text-violet-600" />
                  <div className="flex-1">
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </div>
                  {isSelected && (
                    <Badge variant="secondary" className="bg-violet-100 text-violet-700">
                      Vybráno
                    </Badge>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )
    },
    {
      title: "Kolik plánujete investovat?",
      description: "Nastavte jednorazovou i pravidelnou investici",
      content: (
        <div className="space-y-8">
          {/* Jednorazová investice */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <PiggyBank className="w-4 h-4" />
              Jednorazová vstupní investice
            </h4>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                {(profile.initialAmount || 0).toLocaleString()} Kč
              </div>
              <Slider
                value={[profile.initialAmount || 0]}
                onValueChange={(value) => setProfile({...profile, initialAmount: value[0]})}
                max={500000}
                min={0}
                step={5000}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>0 Kč</span>
                <span>500 000 Kč</span>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[0, 50000, 100000, 250000].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setProfile({...profile, initialAmount: amount})}
                  className={profile.initialAmount === amount ? 'border-blue-500 bg-blue-50' : ''}
                >
                  {amount === 0 ? 'Žádná' : `${(amount/1000)} tis. Kč`}
                </Button>
              ))}
            </div>
          </div>

          {/* Měsíční investice */}
          <div className="bg-violet-50 p-4 rounded-lg border border-violet-200">
            <h4 className="font-semibold text-violet-800 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pravidelná měsíční investice
            </h4>
            <div className="text-center">
              <div className="text-2xl font-bold text-violet-600 mb-2">
                {(profile.monthlyAmount || 5000).toLocaleString()} Kč
              </div>
              <Slider
                value={[profile.monthlyAmount || 5000]}
                onValueChange={(value) => setProfile({...profile, monthlyAmount: value[0]})}
                max={50000}
                min={500}
                step={500}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>500 Kč</span>
                <span>50 000 Kč</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 mt-3">
              {[1000, 5000, 10000].map(amount => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setProfile({...profile, monthlyAmount: amount})}
                  className={profile.monthlyAmount === amount ? 'border-violet-500 bg-violet-50' : ''}
                >
                  {amount.toLocaleString()} Kč
                </Button>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Vaše portfolio doporučení",
      description: "Portfolio navržené na míru vašemu investorskému profilu",
      content: recommendation ? (
        <div className="space-y-6">
          {/* Portfolio Overview */}
          <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">{recommendation.name}</h3>
            <p className="text-gray-600 mb-4">{recommendation.description}</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Očekávaný výnos</div>
                <div className="font-semibold text-green-600">{recommendation.expectedReturn}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Úroveň rizika</div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{recommendation.riskLevel}/10</div>
                  <div className="flex gap-1">
                    {Array.from({length: 10}).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full ${
                          i < recommendation.riskLevel ? 'bg-violet-500' : 'bg-gray-200'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Allocation Chart */}
          <div>
            <h4 className="font-semibold mb-3">Složení portfolia</h4>
            <div className="space-y-3">
              {recommendation.etfs.map((etf, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Link 
                        href={`/etf/${etf.isin}?from=portfolio`}
                        className="font-medium text-sm text-gray-900 hover:text-violet-700 hover:underline transition-colors"
                      >
                        {etf.name}
                      </Link>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 px-2 text-xs text-violet-600 hover:bg-violet-50"
                        onClick={() => window.open(`/etf/${etf.isin}?from=portfolio`, '_blank')}
                      >
                        Detail
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      ISIN: {etf.isin} • {etf.reason}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="font-semibold text-lg">{etf.allocation}%</div>
                    <Badge variant="secondary" className="text-xs">
                      {etf.category === 'stocks' && '📈 Akcie'}
                      {etf.category === 'bonds' && '🏛️ Dluhopisy'}
                      {etf.category === 'commodities' && '🥇 Komodity'}
                      {etf.category === 'reits' && '🏠 Nemovitosti'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategy Explanation */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Charakteristiky této strategie</h4>
            <p className="text-sm text-gray-700 mb-3">{recommendation.explanation.strategy}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="font-medium text-green-700 mb-1">✅ Výhody:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {recommendation.explanation.pros.map((pro, i) => (
                    <li key={i}>• {pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium text-amber-700 mb-1">⚠️ Rizika:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {recommendation.explanation.cons.map((con, i) => (
                    <li key={i}>• {con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Portfolio Projection Chart */}
          <PortfolioProjectionChart
            portfolioName={recommendation.name}
            riskLevel={recommendation.riskLevel}
            defaultMonthlyAmount={profile.monthlyAmount || 5000}
            initialAmount={profile.initialAmount || 0}
            expectedReturn={parseFloat(recommendation.expectedReturn) || 0}
          />

          {/* Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg text-sm">
            <div className="font-medium text-amber-800 mb-2">⚠️ Upozornění</div>
            <div className="text-amber-700">
              <p>Toto není investiční doporučení. Jedná se o obecné informace založené na vašem profilu. Před investováním vždy konzultujte s kvalifikovaným investičním poradcem.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Hledáme vhodné modelové portfolio...</p>
        </div>
      )
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      
      // Generate model portfolio on last step
      if (currentStep === steps.length - 2) {
        setIsLoading(true);
        try {
          const rec = await portfolioEngine.getPortfolioRecommendation(profile as InvestorProfile);
          setRecommendation(rec);
        } catch (error) {
          console.error('Error generating model portfolio:', error);
        }
        setIsLoading(false);
      }
    } else {
      // Navigate to ETF comparison with portfolio
      if (recommendation) {
        const isins = recommendation.etfs.map(etf => etf.isin).join(',');
        router.push(`/srovnani-etf?portfolio=${isins}&wizard=portfolio`);
      }
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
      case 1: return profile.age !== undefined;
      case 2: return profile.riskTolerance !== undefined;
      case 3: return profile.timeHorizon !== undefined;
      case 4: return profile.experience !== undefined;
      case 5: return profile.goals && profile.goals.length > 0;
      case 6: return profile.monthlyAmount !== undefined;
      case 7: return recommendation !== null;
      default: return false;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <Card className={`w-full max-w-3xl mx-auto ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
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
          
          {currentStep === steps.length - 1 ? (
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  if (recommendation) {
                    const isins = recommendation.etfs.map(etf => etf.isin).join(',');
                    router.push(`/srovnani-etf?compare=${isins}&portfolio=true`);
                  }
                }}
                variant="outline"
                disabled={!recommendation}
                className="border-violet-500 text-violet-600 hover:bg-violet-50"
              >
                Porovnat ETF
                <TrendingUp className="w-4 h-4 ml-2" />
              </Button>
              
              <Button 
                onClick={() => {
                  if (recommendation && (recommendation as any).detailUrl) {
                    router.push((recommendation as any).detailUrl);
                  }
                  onClose?.();
                }}
                disabled={!recommendation || isLoading}
                className="bg-violet-600 hover:bg-violet-700"
              >
                Zobrazit strategii
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="bg-violet-600 hover:bg-violet-700"
            >
              Pokračovat
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioWizard;