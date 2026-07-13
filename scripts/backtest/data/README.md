# Prodloužení faktorových řad (factor_extensions.csv)

Denní ceny `us_momentum` a `us_quality` pro období 1999-12-31 až do začátku dat ETF
(2013-04 resp. 2013-07), napojené na ETF řady v `index_historical_data`.

**Zdroj:** Kenneth R. French Data Library (Dartmouth), denní value-weighted portfolia:
- momentum: `6_Portfolios_ME_Prior_12_2_Daily` → sloupec **BIG HiPRIOR** (velké firmy, top 30 % momentum).
  Bez kalibrace – v překryvu s MTUM (2013–2026) korelace denních výnosů r=0,957 a CAGR o 0,7 p. b.
  NIŽŠÍ než ETF (konzervativní směr).
- quality: `Portfolios_Formed_on_OP_Daily` → sloupec **Hi 30** (top 30 % provozní ziskovosti).
  Kalibrováno denním faktorem −1,89 %/rok tak, aby CAGR v překryvu odpovídala QUAL
  (syrová akademická řada bez poplatků přestřelovala; korelace r=0,976).

**Konstrukce:** zpětný chod od kotevní ceny (první den ETF v DB):
price[t−1] = price[t] / (1 + r_t), kde r_t je denní výnos French portfolia (u quality × kalibrace).

Generátor: `scripts/backtest/build_factor_extensions.py`. Načtení do DB: jednorázový SQL
přes Postgres `http` extension (viz memory/PR popis). Na webu přiznáno v metodických poznámkách.
