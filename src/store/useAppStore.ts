import { create } from 'zustand';

/**
 * App Store
 * 전역 상태 관리를 위한 Zustand Store
 */
interface AppStore {
  count: number;
  inc: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
}));
