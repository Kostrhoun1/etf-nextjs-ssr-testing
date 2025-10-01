export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      app_admins: {
        Row: {
          id: string
          updated_at: string | null
          user_email: string
        }
        Insert: {
          id?: string
          updated_at?: string | null
          user_email: string
        }
        Update: {
          id?: string
          updated_at?: string | null
          user_email?: string
        }
        Relationships: []
      }
      daily_pnl: {
        Row: {
          created_at: string
          id: string
          pnl: number
          session_id: string
          trade_date: string
          trades_count: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          pnl?: number
          session_id: string
          trade_date: string
          trades_count?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          pnl?: number
          session_id?: string
          trade_date?: string
          trades_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_pnl_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "trading_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      etf_funds: {
        Row: {
          beta: number | null
          category: string | null
          correlation: number | null
          country_1_name: string | null
          country_1_weight: number | null
          country_2_name: string | null
          country_2_weight: number | null
          country_3_name: string | null
          country_3_weight: number | null
          country_4_name: string | null
          country_4_weight: number | null
          country_5_name: string | null
          country_5_weight: number | null
          created_at: string
          current_dividend_yield: string | null
          current_dividend_yield_numeric: number | null
          current_price: number | null
          degiro_free: boolean | null
          description_cs: string | null
          description_en: string | null
          distribution_frequency: string | null
          distribution_policy: string | null
          dividend_extraction_method: string | null
          dividends_12m: string | null
          dividends_12m_currency: string | null
          dividends_12m_numeric: number | null
          exchange_1_bloomberg: string | null
          exchange_1_currency: string | null
          exchange_1_market_maker: string | null
          exchange_1_name: string | null
          exchange_1_reuters: string | null
          exchange_1_ticker: string | null
          exchange_2_bloomberg: string | null
          exchange_2_currency: string | null
          exchange_2_market_maker: string | null
          exchange_2_name: string | null
          exchange_2_reuters: string | null
          exchange_2_ticker: string | null
          exchange_3_bloomberg: string | null
          exchange_3_currency: string | null
          exchange_3_market_maker: string | null
          exchange_3_name: string | null
          exchange_3_reuters: string | null
          exchange_3_ticker: string | null
          exchange_4_bloomberg: string | null
          exchange_4_currency: string | null
          exchange_4_market_maker: string | null
          exchange_4_name: string | null
          exchange_4_reuters: string | null
          exchange_4_ticker: string | null
          exchange_5_bloomberg: string | null
          exchange_5_currency: string | null
          exchange_5_market_maker: string | null
          exchange_5_name: string | null
          exchange_5_reuters: string | null
          exchange_5_ticker: string | null
          fund_currency: string | null
          fund_domicile: string | null
          fund_provider: string | null
          fund_size: string | null
          fund_size_currency: string | null
          fund_size_numeric: number | null
          holding_1_name: string | null
          holding_1_weight: number | null
          holding_10_name: string | null
          holding_10_weight: number | null
          holding_2_name: string | null
          holding_2_weight: number | null
          holding_3_name: string | null
          holding_3_weight: number | null
          holding_4_name: string | null
          holding_4_weight: number | null
          holding_5_name: string | null
          holding_5_weight: number | null
          holding_6_name: string | null
          holding_6_weight: number | null
          holding_7_name: string | null
          holding_7_weight: number | null
          holding_8_name: string | null
          holding_8_weight: number | null
          holding_9_name: string | null
          holding_9_weight: number | null
          id: string
          inception_date: string | null
          index_name: string | null
          information_ratio: number | null
          investment_focus: string | null
          currency_risk: string | null
          strategy_risk: string | null
          parsed_asset_class: string | null
          parsed_region: string | null
          parsed_sector: string | null
          parsed_market_cap: string | null
          parsed_investment_style: string | null
          is_leveraged: boolean | null
          isin: string
          last_price_update: string | null
          legal_structure: string | null
          max_drawdown_1y: number | null
          max_drawdown_3y: number | null
          max_drawdown_5y: number | null
          max_drawdown_inception: number | null
          name: string | null
          performance_last_updated: string | null
          primary_exchange: string | null
          primary_ticker: string | null
          rating: number | null
          rating_performance_score: number | null
          rating_provider_score: number | null
          rating_score: number | null
          rating_size_score: number | null
          rating_ter_score: number | null
          rating_track_record_score: number | null
          region: string | null
          replication: string | null
          retry_count: number | null
          return_10y_percent: number | null
          return_1m: number | null
          return_1y: number | null
          return_1y_percent: number | null
          return_2021: number | null
          return_2022: number | null
          return_2023: number | null
          return_2024: number | null
          return_3m: number | null
          return_3y: number | null
          return_3y_percent: number | null
          return_5y: number | null
          return_5y_percent: number | null
          return_6m: number | null
          return_inception: number | null
          return_per_risk_1y: number | null
          return_per_risk_3y: number | null
          return_per_risk_5y: number | null
          return_ytd: number | null
          scraping_date: string | null
          scraping_status: string | null
          sector_1_name: string | null
          sector_1_weight: number | null
          sector_2_name: string | null
          sector_2_weight: number | null
          sector_3_name: string | null
          sector_3_weight: number | null
          sector_4_name: string | null
          sector_4_weight: number | null
          sector_5_name: string | null
          sector_5_weight: number | null
          sustainability: string | null
          ter: string | null
          ter_numeric: number | null
          total_exchanges: number | null
          total_holdings: number | null
          tracking_error: number | null
          updated_at: string
          url: string | null
          volatility_1y: number | null
          volatility_3y: number | null
          volatility_5y: number | null
          ytd_return_percent: number | null
        }
        Insert: {
          beta?: number | null
          category?: string | null
          correlation?: number | null
          country_1_name?: string | null
          country_1_weight?: number | null
          country_2_name?: string | null
          country_2_weight?: number | null
          country_3_name?: string | null
          country_3_weight?: number | null
          country_4_name?: string | null
          country_4_weight?: number | null
          country_5_name?: string | null
          country_5_weight?: number | null
          created_at?: string
          current_dividend_yield?: string | null
          current_dividend_yield_numeric?: number | null
          current_price?: number | null
          degiro_free?: boolean | null
          description_cs?: string | null
          description_en?: string | null
          distribution_frequency?: string | null
          distribution_policy?: string | null
          dividend_extraction_method?: string | null
          dividends_12m?: string | null
          dividends_12m_currency?: string | null
          dividends_12m_numeric?: number | null
          exchange_1_bloomberg?: string | null
          exchange_1_currency?: string | null
          exchange_1_market_maker?: string | null
          exchange_1_name?: string | null
          exchange_1_reuters?: string | null
          exchange_1_ticker?: string | null
          exchange_2_bloomberg?: string | null
          exchange_2_currency?: string | null
          exchange_2_market_maker?: string | null
          exchange_2_name?: string | null
          exchange_2_reuters?: string | null
          exchange_2_ticker?: string | null
          exchange_3_bloomberg?: string | null
          exchange_3_currency?: string | null
          exchange_3_market_maker?: string | null
          exchange_3_name?: string | null
          exchange_3_reuters?: string | null
          exchange_3_ticker?: string | null
          exchange_4_bloomberg?: string | null
          exchange_4_currency?: string | null
          exchange_4_market_maker?: string | null
          exchange_4_name?: string | null
          exchange_4_reuters?: string | null
          exchange_4_ticker?: string | null
          exchange_5_bloomberg?: string | null
          exchange_5_currency?: string | null
          exchange_5_market_maker?: string | null
          exchange_5_name?: string | null
          exchange_5_reuters?: string | null
          exchange_5_ticker?: string | null
          fund_currency?: string | null
          fund_domicile?: string | null
          fund_provider?: string | null
          fund_size?: string | null
          fund_size_currency?: string | null
          fund_size_numeric?: number | null
          holding_1_name?: string | null
          holding_1_weight?: number | null
          holding_10_name?: string | null
          holding_10_weight?: number | null
          holding_2_name?: string | null
          holding_2_weight?: number | null
          holding_3_name?: string | null
          holding_3_weight?: number | null
          holding_4_name?: string | null
          holding_4_weight?: number | null
          holding_5_name?: string | null
          holding_5_weight?: number | null
          holding_6_name?: string | null
          holding_6_weight?: number | null
          holding_7_name?: string | null
          holding_7_weight?: number | null
          holding_8_name?: string | null
          holding_8_weight?: number | null
          holding_9_name?: string | null
          holding_9_weight?: number | null
          id?: string
          inception_date?: string | null
          index_name?: string | null
          information_ratio?: number | null
          investment_focus?: string | null
          currency_risk?: string | null
          strategy_risk?: string | null
          parsed_asset_class?: string | null
          parsed_region?: string | null
          parsed_sector?: string | null
          parsed_market_cap?: string | null
          parsed_investment_style?: string | null
          is_leveraged?: boolean | null
          isin: string
          last_price_update?: string | null
          legal_structure?: string | null
          max_drawdown_1y?: number | null
          max_drawdown_3y?: number | null
          max_drawdown_5y?: number | null
          max_drawdown_inception?: number | null
          name?: string | null
          performance_last_updated?: string | null
          primary_exchange?: string | null
          primary_ticker?: string | null
          rating?: number | null
          rating_performance_score?: number | null
          rating_provider_score?: number | null
          rating_score?: number | null
          rating_size_score?: number | null
          rating_ter_score?: number | null
          rating_track_record_score?: number | null
          region?: string | null
          replication?: string | null
          retry_count?: number | null
          return_10y_percent?: number | null
          return_1m?: number | null
          return_1y?: number | null
          return_1y_percent?: number | null
          return_2021?: number | null
          return_2022?: number | null
          return_2023?: number | null
          return_2024?: number | null
          return_3m?: number | null
          return_3y?: number | null
          return_3y_percent?: number | null
          return_5y?: number | null
          return_5y_percent?: number | null
          return_6m?: number | null
          return_inception?: number | null
          return_per_risk_1y?: number | null
          return_per_risk_3y?: number | null
          return_per_risk_5y?: number | null
          return_ytd?: number | null
          scraping_date?: string | null
          scraping_status?: string | null
          sector_1_name?: string | null
          sector_1_weight?: number | null
          sector_2_name?: string | null
          sector_2_weight?: number | null
          sector_3_name?: string | null
          sector_3_weight?: number | null
          sector_4_name?: string | null
          sector_4_weight?: number | null
          sector_5_name?: string | null
          sector_5_weight?: number | null
          sustainability?: string | null
          ter?: string | null
          ter_numeric?: number | null
          total_exchanges?: number | null
          total_holdings?: number | null
          tracking_error?: number | null
          updated_at?: string
          url?: string | null
          volatility_1y?: number | null
          volatility_3y?: number | null
          volatility_5y?: number | null
          ytd_return_percent?: number | null
        }
        Update: {
          beta?: number | null
          category?: string | null
          correlation?: number | null
          country_1_name?: string | null
          country_1_weight?: number | null
          country_2_name?: string | null
          country_2_weight?: number | null
          country_3_name?: string | null
          country_3_weight?: number | null
          country_4_name?: string | null
          country_4_weight?: number | null
          country_5_name?: string | null
          country_5_weight?: number | null
          created_at?: string
          current_dividend_yield?: string | null
          current_dividend_yield_numeric?: number | null
          current_price?: number | null
          degiro_free?: boolean | null
          description_cs?: string | null
          description_en?: string | null
          distribution_frequency?: string | null
          distribution_policy?: string | null
          dividend_extraction_method?: string | null
          dividends_12m?: string | null
          dividends_12m_currency?: string | null
          dividends_12m_numeric?: number | null
          exchange_1_bloomberg?: string | null
          exchange_1_currency?: string | null
          exchange_1_market_maker?: string | null
          exchange_1_name?: string | null
          exchange_1_reuters?: string | null
          exchange_1_ticker?: string | null
          exchange_2_bloomberg?: string | null
          exchange_2_currency?: string | null
          exchange_2_market_maker?: string | null
          exchange_2_name?: string | null
          exchange_2_reuters?: string | null
          exchange_2_ticker?: string | null
          exchange_3_bloomberg?: string | null
          exchange_3_currency?: string | null
          exchange_3_market_maker?: string | null
          exchange_3_name?: string | null
          exchange_3_reuters?: string | null
          exchange_3_ticker?: string | null
          exchange_4_bloomberg?: string | null
          exchange_4_currency?: string | null
          exchange_4_market_maker?: string | null
          exchange_4_name?: string | null
          exchange_4_reuters?: string | null
          exchange_4_ticker?: string | null
          exchange_5_bloomberg?: string | null
          exchange_5_currency?: string | null
          exchange_5_market_maker?: string | null
          exchange_5_name?: string | null
          exchange_5_reuters?: string | null
          exchange_5_ticker?: string | null
          fund_currency?: string | null
          fund_domicile?: string | null
          fund_provider?: string | null
          fund_size?: string | null
          fund_size_currency?: string | null
          fund_size_numeric?: number | null
          holding_1_name?: string | null
          holding_1_weight?: number | null
          holding_10_name?: string | null
          holding_10_weight?: number | null
          holding_2_name?: string | null
          holding_2_weight?: number | null
          holding_3_name?: string | null
          holding_3_weight?: number | null
          holding_4_name?: string | null
          holding_4_weight?: number | null
          holding_5_name?: string | null
          holding_5_weight?: number | null
          holding_6_name?: string | null
          holding_6_weight?: number | null
          holding_7_name?: string | null
          holding_7_weight?: number | null
          holding_8_name?: string | null
          holding_8_weight?: number | null
          holding_9_name?: string | null
          holding_9_weight?: number | null
          id?: string
          inception_date?: string | null
          index_name?: string | null
          information_ratio?: number | null
          investment_focus?: string | null
          currency_risk?: string | null
          strategy_risk?: string | null
          parsed_asset_class?: string | null
          parsed_region?: string | null
          parsed_sector?: string | null
          parsed_market_cap?: string | null
          parsed_investment_style?: string | null
          is_leveraged?: boolean | null
          isin?: string
          last_price_update?: string | null
          legal_structure?: string | null
          max_drawdown_1y?: number | null
          max_drawdown_3y?: number | null
          max_drawdown_5y?: number | null
          max_drawdown_inception?: number | null
          name?: string | null
          performance_last_updated?: string | null
          primary_exchange?: string | null
          primary_ticker?: string | null
          rating?: number | null
          rating_performance_score?: number | null
          rating_provider_score?: number | null
          rating_score?: number | null
          rating_size_score?: number | null
          rating_ter_score?: number | null
          rating_track_record_score?: number | null
          region?: string | null
          replication?: string | null
          retry_count?: number | null
          return_10y_percent?: number | null
          return_1m?: number | null
          return_1y?: number | null
          return_1y_percent?: number | null
          return_2021?: number | null
          return_2022?: number | null
          return_2023?: number | null
          return_2024?: number | null
          return_3m?: number | null
          return_3y?: number | null
          return_3y_percent?: number | null
          return_5y?: number | null
          return_5y_percent?: number | null
          return_6m?: number | null
          return_inception?: number | null
          return_per_risk_1y?: number | null
          return_per_risk_3y?: number | null
          return_per_risk_5y?: number | null
          return_ytd?: number | null
          scraping_date?: string | null
          scraping_status?: string | null
          sector_1_name?: string | null
          sector_1_weight?: number | null
          sector_2_name?: string | null
          sector_2_weight?: number | null
          sector_3_name?: string | null
          sector_3_weight?: number | null
          sector_4_name?: string | null
          sector_4_weight?: number | null
          sector_5_name?: string | null
          sector_5_weight?: number | null
          sustainability?: string | null
          ter?: string | null
          ter_numeric?: number | null
          total_exchanges?: number | null
          total_holdings?: number | null
          tracking_error?: number | null
          updated_at?: string
          url?: string | null
          volatility_1y?: number | null
          volatility_3y?: number | null
          volatility_5y?: number | null
          ytd_return_percent?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          subscribed_at: string
          unsubscribed_at: string | null
        }
        Insert: {
          email: string
          id?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Update: {
          email?: string
          id?: string
          subscribed_at?: string
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      newsletters: {
        Row: {
          body: string
          created_at: string
          csv_etf_data: string | null
          id: string
          sent_at: string | null
          sent_by: string | null
          subject: string
        }
        Insert: {
          body: string
          created_at?: string
          csv_etf_data?: string | null
          id?: string
          sent_at?: string | null
          sent_by?: string | null
          subject: string
        }
        Update: {
          body?: string
          created_at?: string
          csv_etf_data?: string | null
          id?: string
          sent_at?: string | null
          sent_by?: string | null
          subject?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          avg_price: number
          cost_basis: number
          created_at: string
          description: string | null
          id: string
          multiplier: number | null
          quantity: number
          session_id: string
          symbol: string
          user_id: string
        }
        Insert: {
          avg_price: number
          cost_basis: number
          created_at?: string
          description?: string | null
          id?: string
          multiplier?: number | null
          quantity: number
          session_id: string
          symbol: string
          user_id: string
        }
        Update: {
          avg_price?: number
          cost_basis?: number
          created_at?: string
          description?: string | null
          id?: string
          multiplier?: number | null
          quantity?: number
          session_id?: string
          symbol?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "trading_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      trades: {
        Row: {
          action: string
          amount: number
          commission: number | null
          created_at: string
          currency: string | null
          description: string | null
          exchange: string | null
          id: string
          multiplier: number | null
          pnl: number | null
          price: number
          quantity: number
          session_id: string
          symbol: string
          trade_date: string
          trade_id: string
          trade_time: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          action: string
          amount: number
          commission?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          exchange?: string | null
          id?: string
          multiplier?: number | null
          pnl?: number | null
          price: number
          quantity: number
          session_id: string
          symbol: string
          trade_date: string
          trade_id: string
          trade_time?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          action?: string
          amount?: number
          commission?: number | null
          created_at?: string
          currency?: string | null
          description?: string | null
          exchange?: string | null
          id?: string
          multiplier?: number | null
          pnl?: number | null
          price?: number
          quantity?: number
          session_id?: string
          symbol?: string
          trade_date?: string
          trade_id?: string
          trade_time?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trades_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "trading_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_sessions: {
        Row: {
          created_at: string
          file_name: string | null
          id: string
          session_name: string
          total_pnl: number | null
          total_trades: number | null
          updated_at: string
          upload_date: string
          user_id: string
          win_rate: number | null
        }
        Insert: {
          created_at?: string
          file_name?: string | null
          id?: string
          session_name: string
          total_pnl?: number | null
          total_trades?: number | null
          updated_at?: string
          upload_date?: string
          user_id: string
          win_rate?: number | null
        }
        Update: {
          created_at?: string
          file_name?: string | null
          id?: string
          session_name?: string
          total_pnl?: number | null
          total_trades?: number | null
          updated_at?: string
          upload_date?: string
          user_id?: string
          win_rate?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_user_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
