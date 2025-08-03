import { create } from 'zustand'

export type FilterValue = 'all' | 'text' | 'file' | 'image' | 'video' | 'audio' | 'document'

interface FilterState {
  currentFilter: FilterValue
  setFilter: (filter: FilterValue) => void
}

export const useFilterStore = create<FilterState>((set) => ({
  currentFilter: 'all',
  setFilter: (filter) => set({ currentFilter: filter }),
}))