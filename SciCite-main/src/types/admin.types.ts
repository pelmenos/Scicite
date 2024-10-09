import { TCard } from "./cards.types";
import { TLevel, TUser, TStatistic } from "./user.types";

export type TRequestUsersData = {
  filter_login: string;
  page: number;
};

export type TUsers = {
  id: string;
  full_name: string;
  email: string;
  number_phone: string;
  login: string;
  balance: number;
  card_create: number;
  citations_formatted: number;
  citations_received: number;
  count_created_cards: number;
  count_created_offers: number;
  exchanges_completed: number;
  scicoins_earned: number;
  scicoins_spent: number;
  transactions_sum: number;
  successful_citations: string;
  level: TLevel;
  user_created_at: Date;
};

export type THelp = {
  id: string;
  support_number: number;
  type_support: string;
  status: string;
  narrative: string;
  response: string | null;
  declarer_user: TUser;
  total_supports_with_declarer: number;
  declarer_cards_count: number;
  reporter_user: TUser;
  created_at: Date;
};

export type TTransaction = {
  id: string;
  user: TUser;
  sum: number;
  balance: number;
  type_transaction: string;
  canceled_is: boolean;
  basis_creation: string;
  created_at: string;
  source: {
    card?: string;
    offer?: string;
  };
  source_object: TCard[];
  statistic: TStatistic;
};

export type TCreateTransaction = {
  user: string;
  sum: number;
  type_transaction: string;
  basis_creation: string;
};

export type TSettings = {
  //id: string
  welcome_bonus: number;
  price_publication: {
    [k: string]: number;
  };
  discount: {
    month: number;
    enabled: boolean;
    percent: number;
  };
  price_citation: {
    [k: string]: number;
  };
  scicoins: {
    price: number;
    percent: number;
    discount: number;
  };
  minimal_duration_card: number;
  free_card: {
    enabled: boolean;
    duration: number;
  };
};
