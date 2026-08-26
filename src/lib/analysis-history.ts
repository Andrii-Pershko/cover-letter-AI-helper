export const HISTORY_PAGE_SIZE = 5;

export type AnalysisHistoryItem = {
  id: string;
  companyName: string | null;
  jobTitle: string | null;
  matchMin: number;
  matchMax: number;
  recommendation: string;
};

export type AnalysisHistoryPage = {
  items: AnalysisHistoryItem[];
  page: number;
  total: number;
};
