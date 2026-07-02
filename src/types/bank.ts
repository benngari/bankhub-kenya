export type BankCategory =
  | "Commercial Bank"
  | "Microfinance Bank"
  | "Digital Bank"
  | "Islamic Bank"
  | "Investment Bank";

export interface DigitalServices {
  mobileBanking: boolean;
  internetBanking: boolean;
  agencyBanking: boolean;
  visa: boolean;
  mastercard: boolean;
  applePay: boolean;
  googlePay: boolean;
  samsungPay: boolean;
  mpesaIntegration: boolean;
  airtelMoney: boolean;
  qrPayments: boolean;
  instantTransfers: boolean;
  rtgs: boolean;
  eft: boolean;
  standingOrders: boolean;
  directDebits: boolean;
}

export interface ContactInfo {
  customerCare: string;
  whatsapp: string;
  email: string;
  website: string;
  wikipedia?: string;
  social: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}

export interface BankingInfo {
  bankCode: string;
  swiftCode: string;
  cbkLicense: string;
  branchCount: number;
  atmCount: number;
  countiesServed: number;
}

export interface RatesInfo {
  savingsInterestMin: number;
  savingsInterestMax: number;
  loanRateMin: number;
  loanRateMax: number;
  mortgageRateMin: number;
  mortgageRateMax: number;
  monthlyAccountFee: number;
  atmWithdrawalFee: number;
  mobileBankingRating: number; // out of 5
  customerRating: number; // out of 5
}

export interface Branch {
  id: string;
  bankId: string;
  name: string;
  county: string;
  town: string;
  address: string;
  phone: string;
  hours: string;
  hasAtm: boolean;
  wheelchairAccessible: boolean;
  lat: number;
  lng: number;
}

export interface Bank {
  id: string;
  name: string;
  shortName: string;
  acronym: string;
  tagline: string;
  founded: number;
  headquarters: string;
  ceo: string;
  parentCompany: string;
  ownership: "Local Private" | "Foreign" | "Government" | "Cooperative" | "Public Listed";
  category: BankCategory;
  description: string;
  logoInitials: string;
  colorFrom: string;
  colorTo: string;
  contact: ContactInfo;
  banking: BankingInfo;
  rates: RatesInfo;
  digitalServices: DigitalServices;
  products: string[];
  isFeatured?: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: "CBK" | "Loans" | "Digital Banking" | "Investments" | "Forex" | "Fintech";
  date: string;
  author: string;
  readMinutes: number;
}

export interface ExchangeRate {
  code: string;
  name: string;
  symbol: string;
  buy: number;
  sell: number;
  change: number;
}
