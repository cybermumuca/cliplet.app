import { create } from 'zustand'

export type SortValue = 'newest' | 'oldest' | 'type' | 'name'

interface SortState {
  currentSort: SortValue
  setSort: (sort: SortValue) => void
}

export const useSortStore = create<SortState>((set) => ({
  currentSort: 'newest',
  setSort: (sort) => set({ currentSort: sort }),
}))