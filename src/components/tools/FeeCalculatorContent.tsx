'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, TrendingDown, AlertTriangle, Info, ArrowRight, Loader2, DollarSign } from 'lucide-react';

const FeeCalculatorContent: React.FC = () => {
  // Společné parametry investice
  const [investedAmount, setInvestedAmount] = useState<number>(250000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(12500);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(20);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  
  // TER pro oba typy fondů
  const [etfTER, setEtfTER] = useState<number>(0.2);
  const [activeTER, setActiveTER] = useState<number>(1.8);
  
  // Výsledky pro ETF
  const [etfFinalValue, setEtfFinalValue] = useState<number>(0);
  const [etfTotalFees, setEtfTotalFees] = useState<number>(0);
  const [etfTotalInvested, setEtfTotalInvested] = useState<number>(0);
  
  // Výsledky pro aktivní fond
  const [activeFinalValue, setActiveFinalValue] = useState<number>(0);
  const [activeTotalFees, setActiveTotalFees] = useState<number>(0);
  const [activeTotalInvested, setActiveTotalInvested] = useState<number>(0);
  
  // Rozdíl mezi nimi
  const [valueDifference, setValueDifference] = useState<number>(0);
  const [feeDifference, setFeeDifference] = useState<number>(0);

  const calculateComparison = () => {
    const annualReturn = expectedReturn / 100;
    const months = investmentPeriod * 12;
    
    // Ochrana proti edge cases
    if (months <= 0 || investedAmount < 0 || monthlyContribution < 0) {
      setEtfFinalValue(0);
      setEtfTotalFees(0);
      setActiveFinalValue(0);
      setActiveTotalFees(0);
      setValueDifference(0);
      setFeeDifference(0);
      return;
    }
    
    // Přesnější model: poplatky se strhávají průběžně během růstu
    // Proto snížíme efektivní výnos o poplatky
    const annualETFReturn = Math.max(-0.99, annualReturn - (etfTER / 100)); // Min -99% loss
    const annualActiveReturn = Math.max(-0.99, annualReturn - (activeTER / 100)); // Min -99% loss
    
    const monthlyETFReturn = Math.pow(1 + annualETFReturn, 1/12) - 1;
    const monthlyActiveReturn = Math.pow(1 + annualActiveReturn, 1/12) - 1;
    
    // Výpočet pro ETF
    let etfTotalInvestedCalc = investedAmount;
    let etfPortfolioValue = investedAmount;
    let etfTotalFeesCalc = 0;

    for (let month = 1; month <= months; month++) {
      // 1. Aplikovat růst na stávající hodnotu (už s odečtenými poplatky)
      etfPortfolioValue *= (1 + monthlyETFReturn);
      
      // 2. Přidat měsíční příspěvek
      etfPortfolioValue += monthlyContribution;
      etfTotalInvestedCalc += monthlyContribution;
      
      // 3. Spočítat teoretický poplatek pro zobrazení
      // (ve skutečnosti už je zahrnut v nižším výnosu)
      const monthlyFee = etfPortfolioValue * (etfTER / 100 / 12);
      etfTotalFeesCalc += monthlyFee;
    }

    // Výpočet pro aktivní fond - stejná logika
    let activeTotalInvestedCalc = investedAmount;
    let activePortfolioValue = investedAmount;
    let activeTotalFeesCalc = 0;

    for (let month = 1; month <= months; month++) {
      // 1. Aplikovat růst na stávající hodnotu (už s odečtenými poplatky)
      activePortfolioValue *= (1 + monthlyActiveReturn);
      
      // 2. Přidat měsíční příspěvek
      activePortfolioValue += monthlyContribution;
      activeTotalInvestedCalc += monthlyContribution;
      
      // 3. Spočítat teoretický poplatek pro zobrazení
      const monthlyFee = activePortfolioValue * (activeTER / 100 / 12);
      activeTotalFeesCalc += monthlyFee;
    }

    // Kontrola na nekonečné hodnoty a NaN
    const safeETFValue = isFinite(etfPortfolioValue) ? etfPortfolioValue : 0;
    const safeActiveValue = isFinite(activePortfolioValue) ? activePortfolioValue : 0;
    const safeETFFees = isFinite(etfTotalFeesCalc) ? etfTotalFeesCalc : 0;
    const safeActiveFees = isFinite(activeTotalFeesCalc) ? activeTotalFeesCalc : 0;

    // Nastavení výsledků s ochranou proti edge cases
    setEtfTotalInvested(etfTotalInvestedCalc);
    setEtfFinalValue(Math.max(0, safeETFValue)); // Minimálně 0
    setEtfTotalFees(Math.max(0, safeETFFees));
    
    setActiveTotalInvested(activeTotalInvestedCalc);
    setActiveFinalValue(Math.max(0, safeActiveValue)); // Minimálně 0 
    setActiveTotalFees(Math.max(0, safeActiveFees));
    
    // Rozdíly
    setValueDifference(safeETFValue - safeActiveValue);
    setFeeDifference(safeActiveFees - safeETFFees);
  };

  useEffect(() => {
    calculateComparison();
  }, [investedAmount, monthlyContribution, investmentPeriod, expectedReturn, etfTER, activeTER]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('cs-CZ', {
      style: 'currency',
      currency: 'CZK',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const brokerFees = [
    { broker: "DEGIRO", buyFee: "1€ (Core), 3€ (ostatní)", custody: "2,5€/rok", notes: "Core Selection ETF zdarma, zahraniční burza 2,5€/rok", highlight: true },
    { broker: "XTB", buyFee: "0 Kč*", custody: "0 Kč", notes: "Do 100k€ měsíčně zdarma", highlight: true },
    { broker: "Trading 212", buyFee: "0 Kč", custody: "0 Kč", notes: "Všechny ETF úplně zdarma", highlight: true },
    { broker: "Interactive Brokers", buyFee: "0,35%", custody: "0 Kč", notes: "Min. 35 Kč, max. 1% z hodnoty", highlight: false },
    { broker: "Fio e-Broker", buyFee: "190-390 Kč", custody: "0 Kč", notes: "Podle burzy (Frankfurt 190 Kč)", highlight: false },
    { broker: "Česká spořitelna", buyFee: "0,6%", custody: "1500 Kč/rok", notes: "Min. 242 Kč za transakci", highlight: false }
  ];

  // Mock ETF data pro nejlevnější ETF
  const isLoading = false;
  const cheapestETFs = [
    { name: "SPDR Core S&P 500 UCITS ETF", ticker: "SPXS", isin: "IE00B3XXRP09", ter: 0.03, ter_percent: "0,03%", region: "USA" },
    { name: "Vanguard S&P 500 UCITS ETF", ticker: "VUSA", isin: "IE00B3XXRQ26", ter: 0.07, ter_percent: "0,07%", region: "USA" },
    { name: "iShares Core EURO STOXX 50 UCITS ETF", ticker: "SX5E", isin: "IE00B4L5YC18", ter: 0.10, ter_percent: "0,10%", region: "Evropa" },
    { name: "Xtrackers MSCI World UCITS ETF", ticker: "XMWO", isin: "IE00BZ02LR44", ter: 0.12, ter_percent: "0,12%", region: "Svět" },
    { name: "HSBC MSCI World UCITS ETF", ticker: "HMWO", isin: "IE00B4X9L533", ter: 0.15, ter_percent: "0,15%", region: "Svět" },
    { name: "iShares Core MSCI World UCITS ETF", ticker: "IWDA", isin: "IE00B4L5Y983", ter: 0.20, ter_percent: "0,20%", region: "Svět" },
    { name: "SPDR MSCI ACWI IMI UCITS ETF", ticker: "SPYY", isin: "IE00B3YLTY66", ter: 0.17, ter_percent: "0,17%", region: "Svět" },
    { name: "Vanguard FTSE All-World UCITS ETF", ticker: "VWCE", isin: "IE00BK5BQT80", ter: 0.22, ter_percent: "0,22%", region: "Svět" },
    { name: "iShares Core S&P 500 UCITS ETF", ticker: "CSPX", isin: "IE00B5BMR087", ter: 0.07, ter_percent: "0,07%", region: "USA" },
    { name: "Amundi Prime Global UCITS ETF DR", ticker: "PGLO", isin: "LU1931974429", ter: 0.05, ter_percent: "0,05%", region: "Svět" },
    { name: "Xtrackers Core DAX UCITS ETF", ticker: "XDAX", isin: "LU0274211480", ter: 0.09, ter_percent: "0,09%", region: "Německo" },
    { name: "iShares Core DAX UCITS ETF", ticker: "EXS1", isin: "DE0005933931", ter: 0.16, ter_percent: "0,16%", region: "Německo" },
    { name: "SPDR S&P 400 US Mid Cap UCITS ETF", ticker: "SPMD", isin: "IE00BKWQ0Q14", ter: 0.30, ter_percent: "0,30%", region: "USA" },
    { name: "Vanguard FTSE Developed Europe UCITS ETF", ticker: "VEUR", isin: "IE00B945VV12", ter: 0.10, ter_percent: "0,10%", region: "Evropa" },
    { name: "iShares MSCI EM IMI UCITS ETF", ticker: "EIMI", isin: "IE00BKM4GZ66", ter: 0.18, ter_percent: "0,18%", region: "Rozvíjející se trhy" },
    { name: "Xtrackers MSCI Emerging Markets UCITS ETF", ticker: "XMEM", isin: "IE00BTJRMP35", ter: 0.18, ter_percent: "0,18%", region: "Rozvíjející se trhy" },
    { name: "iShares Core FTSE 100 UCITS ETF", ticker: "ISF", isin: "IE00B53SZB19", ter: 0.07, ter_percent: "0,07%", region: "Velká Británie" },
    { name: "SPDR FTSE UK All Share UCITS ETF", ticker: "SPUK", isin: "IE00B7452L46", ter: 0.20, ter_percent: "0,20%", region: "Velká Británie" },
    { name: "iShares NASDAQ 100 UCITS ETF", ticker: "CNDX", isin: "IE00BFZXGZ54", ter: 0.33, ter_percent: "0,33%", region: "USA" },
    { name: "Amundi NASDAQ-100 UCITS ETF", ticker: "ANX", isin: "LU1681038672", ter: 0.23, ter_percent: "0,23%", region: "USA" }
  ];

  const etfsCount = 3500;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Hero sekce */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
          <Calculator className="w-4 h-4" />
          Kalkulačka poplatků 2025
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          ETF vs. bankovní fond
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Zjistěte, kolik vám ušetří levný ETF oproti drahému bankovnímu fondu.
        </p>
      </div>

      <div className="space-y-8">

      {/* Hlavní kalkulačka */}
      <section>
        {/* Kompaktní kalkulačka */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="w-5 h-5" />
              Parametry srovnání
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Parametry investice - kompaktní */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <Label htmlFor="initial">Počáteční investice (Kč)</Label>
                <Input
                  id="initial"
                  type="number"
                  min="0"
                  max="50000000"
                  value={investedAmount}
                  onChange={(e) => setInvestedAmount(Math.max(0, Number(e.target.value)))}
                  className="mt-1 h-10"
                />
              </div>
              <div>
                <Label htmlFor="monthly">Měsíční příspěvek (Kč)</Label>
                <Input
                  id="monthly"
                  type="number"
                  min="0"
                  max="1000000"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                  className="mt-1 h-10"
                />
              </div>
              <div>
                <Label htmlFor="period">Doba (roky)</Label>
                <Input
                  id="period"
                  type="number"
                  min="1"
                  max="50"
                  value={investmentPeriod}
                  onChange={(e) => setInvestmentPeriod(Math.max(1, Math.min(50, Number(e.target.value))))}
                  className="mt-1 h-10"
                />
              </div>
              <div>
                <Label htmlFor="return">Očekávaný výnos (%)</Label>
                <Input
                  id="return"
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(Math.max(0, Math.min(30, Number(e.target.value))))}
                  className="mt-1 h-10"
                />
              </div>
            </div>

            {/* Srovnání fondů - kompaktní */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* ETF fond */}
              <div className="border rounded-lg p-4 bg-violet-25">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingDown className="w-4 h-4 text-violet-600" />
                  <h3 className="font-semibold">ETF fond</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="etf-ter">TER poplatek (%)</Label>
                    <Input
                      id="etf-ter"
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={etfTER}
                      onChange={(e) => setEtfTER(Math.max(0, Math.min(5, Number(e.target.value))))}
                      className="mt-1 h-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-white rounded border">
                      <p className="text-xs text-gray-600">Finální hodnota</p>
                      <p className="font-bold">{formatCurrency(etfFinalValue)}</p>
                    </div>
                    <div className="p-2 bg-white rounded border">
                      <p className="text-xs text-gray-600">Poplatky</p>
                      <p className="font-semibold">{formatCurrency(etfTotalFees)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bankovní fond */}
              <div className="border rounded-lg p-4 bg-gray-25">
                <div className="flex items-center gap-2 mb-3">
                  <DollarSign className="w-4 h-4 text-violet-600" />
                  <h3 className="font-semibold">Bankovní fond</h3>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="active-ter">TER poplatek (%)</Label>
                    <Input
                      id="active-ter"
                      type="number"
                      step="0.01"
                      min="0"
                      max="5"
                      value={activeTER}
                      onChange={(e) => setActiveTER(Math.max(0, Math.min(5, Number(e.target.value))))}
                      className="mt-1 h-10"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-white rounded border">
                      <p className="text-xs text-gray-600">Finální hodnota</p>
                      <p className="font-bold">{formatCurrency(activeFinalValue)}</p>
                    </div>
                    <div className="p-2 bg-white rounded border">
                      <p className="text-xs text-gray-600">Poplatky</p>
                      <p className="font-semibold">{formatCurrency(activeTotalFees)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Varování */}
        {(etfTER >= activeTER || expectedReturn < 3 || expectedReturn > 15) && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800">Kontrola parametrů</h4>
                <ul className="text-sm text-amber-700 mt-1 space-y-1">
                  {etfTER >= activeTER && <li>• ETF má stejný nebo vyšší TER než aktivní fond</li>}
                  {expectedReturn < 3 && <li>• Velmi nízký očekávaný výnos (pod 3%)</li>}
                  {expectedReturn > 15 && <li>• Velmi vysoký očekávaný výnos (nad 15%)</li>}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Výsledek srovnání - kompaktní */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-center text-lg">
              Rozdíl za {investmentPeriod} let
            </CardTitle>
          </CardHeader>
          <CardContent>
            {etfTER >= activeTER ? (
              // Scénář kdy má ETF vyšší nebo stejný TER jako bankovní fond
              <div className="text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <h4 className="text-lg font-semibold text-amber-800">Neobvyklá situace</h4>
                </div>
                <p className="text-sm text-amber-700 mb-3">
                  Bankovní fond má nižší poplatky než ETF. Zkontrolujte zadané hodnoty TER.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-white rounded border">
                    <p className="text-xs font-medium text-gray-600">Rozdíl portfolia</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(Math.abs(valueDifference))}</p>
                    <p className="text-xs text-gray-700">
                      {valueDifference >= 0 ? "ETF lepší" : "Fond lepší"}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded border">
                    <p className="text-xs font-medium text-gray-600">Rozdíl poplatků</p>
                    <p className="text-lg font-bold text-gray-900">{formatCurrency(Math.abs(feeDifference))}</p>
                    <p className="text-xs text-gray-700">
                      {feeDifference >= 0 ? "ETF levnější" : "Fond levnější"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              // Normální scénář kdy ETF má nižší TER
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-4 bg-violet-50 rounded-lg">
                    <h4 className="font-semibold text-violet-800 mb-1">Více peněz v kapse</h4>
                    <p className="text-2xl font-bold text-violet-900">{formatCurrency(valueDifference)}</p>
                    <p className="text-xs text-violet-700 mt-1">S ETF budete mít více</p>
                  </div>
                  
                  <div className="text-center p-4 bg-violet-50 rounded-lg">
                    <h4 className="font-semibold text-violet-800 mb-1">Ušetřené poplatky</h4>
                    <p className="text-2xl font-bold text-violet-900">{formatCurrency(feeDifference)}</p>
                    <p className="text-xs text-violet-700 mt-1">Méně na poplatcích</p>
                  </div>
                </div>

                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    ETF ušetří <strong className="text-violet-600">{formatCurrency(feeDifference)}</strong> na poplatcích 
                    a portfolio bude větší o <strong className="text-violet-600">{formatCurrency(valueDifference)}</strong>
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Srovnání broker poplatků */}
      <section>
        <Card>
          <CardHeader className="text-center">
            <div className="inline-flex items-center bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🏦 Broker poplatky
            </div>
            <CardTitle className="text-2xl">
              Poplatky brokerů za nákup ETF
            </CardTitle>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Správný výběr brokera vám může ušetřit stovky eur ročně na poplatcích
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brokerFees.map((broker, index) => (
                <div key={index} className={`p-4 border rounded-lg ${broker.highlight ? "border-violet-300 bg-violet-50" : "border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{broker.broker}</h3>
                    {broker.highlight && (
                      <Badge className="bg-violet-100 text-violet-800">Doporučeno</Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Poplatek za nákup:</span>
                      <span className="font-medium">{broker.buyFee}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Poplatek za držení:</span>
                      <span className="font-medium">{broker.custody}</span>
                    </div>
                    <div className="text-xs text-gray-500 pt-2 border-t">
                      {broker.notes}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link 
                href="/kde-koupit-etf"
                className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                Podrobné srovnání všech brokerů
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Nejlevnější ETF z databáze */}
      <section>
        <Card>
          <CardHeader className="text-center">
            <div className="inline-flex items-center bg-violet-100 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              📋 Aktuální nejlevnější ETF
            </div>
            <CardTitle className="text-2xl">
              Top 20 nejlevnějších ETF z naší databáze
            </CardTitle>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aktuální seznam nejlevnějších ETF fondů seřazených podle TER poplatků
            </p>
          </CardHeader>
          <CardContent>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Načítám aktuální data ETF...</span>
          </div>
        ) : cheapestETFs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Data ETF se nenačetla. Zkuste obnovit stránku.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 p-4 text-left font-semibold">ETF</th>
                  <th className="border border-gray-200 p-4 text-center font-semibold">Ticker</th>
                  <th className="border border-gray-200 p-4 text-center font-semibold">TER</th>
                  <th className="border border-gray-200 p-4 text-center font-semibold">Region</th>
                </tr>
              </thead>
              <tbody>
                {cheapestETFs.map((etf, index) => (
                  <tr key={etf.isin} className={index % 2 === 0 ? "bg-white" : "bg-gray-25"}>
                    <td className="border border-gray-200 p-4 font-medium">
                      <div className="font-semibold text-blue-600">{etf.ticker}</div>
                      <div className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {etf.name}
                      </div>
                    </td>
                    <td className="border border-gray-200 p-4 text-center">
                      <code className="bg-gray-100 px-2 py-1 rounded">{etf.ticker}</code>
                    </td>
                    <td className="border border-gray-200 p-4 text-center">
                      <span className={etf.ter <= 0.15 ? "text-green-600 font-semibold" : etf.ter <= 0.35 ? "text-yellow-600" : "text-red-600"}>
                        {etf.ter_percent}
                      </span>
                    </td>
                    <td className="border border-gray-200 p-4 text-center">
                      <span className="text-gray-700 text-sm">
                        {etf.region}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link 
            href="/srovnani-etf"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            Zobrazit kompletní srovnání všech {etfsCount}+ ETF fondů
          </Link>
        </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ sekce */}
      <section className="mt-16">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">
              Často kladené otázky o ETF poplatcích
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Co je TER poplatek u ETF?</h3>
                <p className="text-gray-700">
                  TER (Total Expense Ratio) je roční poplatek ETF fondu vyjádřený v procentech z hodnoty investice. Zahrnuje všechny náklady na správu fondu včetně poplatků za správu, administrativních nákladů a obchodních nákladů. TER 0.2% znamená, že ročně zaplatíte 500 Kč z každých 250 000 Kč investice.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Kde najdu nejlevnější ETF s nejnižším TER?</h3>
                <p className="text-gray-700">
                  Nejlevnější ETF mají TER již od 0.03%. Nejlepší volby pro rok 2025: SPDR Core S&P 500 (0.03%), Vanguard S&P 500 (0.07%), iShares Core EURO STOXX 50 (0.10%). Použijte naše srovnání ETF pro nalezení fondů s nejnižšími poplatky seřazených podle TER.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Který broker má nejnižší poplatky za ETF?</h3>
                <p className="text-gray-700">
                  Trading 212 má všechny ETF zcela zdarma bez omezení. XTB nabízí 0% poplatky do 100 000€ měsíčně, pak 0.2%. DEGIRO účtuje 1€ za Core Selection ETF (200+ fondů) a 3€ za ostatní ETF, plus 2.5€ ročně za zahraniční burzu.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Jak se počítají poplatky TER u ETF?</h3>
                <p className="text-gray-700">
                  TER se počítá automaticky a průběžně se strhává z hodnoty fondu. Není to přímý poplatek z vašeho účtu, ale snižuje se o něj každodenní hodnota NAV (Net Asset Value). Proto se TER projeví jako nižší výnos fondu oproti jeho indexu.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Jaký je rozdíl mezi TER a skutečnými náklady ETF?</h3>
                <p className="text-gray-700">
                  TER nezahrnuje transakční náklady (poplatky brokerům), spread (rozdíl mezi nákupní a prodejní cenou) ani daně. Celkové náklady na investování = TER + broker poplatky + spread + daně. Proto je důležité vybrat jak levný ETF, tak levného brokera.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Jak moc ovlivňují poplatky dlouhodobé výnosy?</h3>
                <p className="text-gray-700">
                  Poplatky mají dramatický dopad na dlouhodobé výnosy kvůli složenému úročení. Rozdíl mezi 0.03% a 0.5% TER může za 30 let představovat ztrátu 12-15% celkových výnosů. U investice 500 000 Kč za 30 let to může být rozdíl více než 400 000 Kč!
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">Jsou levnější ETF také horší kvalitou?</h3>
                <p className="text-gray-700">
                  Ne, levnější ETF nejsou nutně horší. Naopak, pasivní ETF s nejnižšími TER často sledují stejné indexy jako dražší fondy. Klíčové je sledovat tracking error (odchylku od indexu), likviditu a velikost fondu, ne jen TER.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Internal Linking */}
      <section className="mt-16">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl mb-4">
              Související stránky
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Link href="/srovnani-etf" className="block p-4 border rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-colors">
                <h3 className="font-semibold mb-2">Srovnání ETF fondů</h3>
                <p className="text-sm text-gray-600">Najděte ETF s nejnižšími poplatky</p>
              </Link>
              
              <Link href="/kde-koupit-etf" className="block p-4 border rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-colors">
                <h3 className="font-semibold mb-2">Kde koupit ETF</h3>
                <p className="text-sm text-gray-600">Brokeři s nejlevnějšími poplatky</p>
              </Link>
              
              <Link href="/nejlepsi-etf/nejlepsi-etf-2025" className="block p-4 border rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-colors">
                <h3 className="font-semibold mb-2">Nejlepší ETF 2025</h3>
                <p className="text-sm text-gray-600">Top ETF s nízkými náklady</p>
              </Link>
              
              <Link href="/kalkulacky" className="block p-4 border rounded-lg hover:border-violet-300 hover:bg-violet-50 transition-colors">
                <h3 className="font-semibold mb-2">Investiční kalkulačky</h3>
                <p className="text-sm text-gray-600">Další kalkulačky a nástroje</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      </div>
    </div>
  );
};

export default FeeCalculatorContent;