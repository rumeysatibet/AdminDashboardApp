export interface DataRefreshContextValue {
  refreshTrigger: number;
  triggerRefresh: () => void;
}