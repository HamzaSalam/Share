import {create} from 'zustand';
import {Buffer} from 'buffer';
interface ChunkState {
  chunkStore: {
    id: string | null;
    name: string;
    totalChunk: number;
    chunkArray: Buffer[];
  } | null;
  currentChunkSet: {
    id: string | null;
    totalChunk: number;
    chunkArray: Buffer[];
  } | null;

  setChunkeStore: (chunkStore: any) => void;
  resetChunkeStore: () => void;
  setCurrentChunkeSet: (chunkChunkStore: any) => void;
  resetCurrentChunkeSet: () => void;
}
export const useChunkStore = create<ChunkState>(set => ({
  chunkStore: null,
  currentChunkSet: null,
  setChunkeStore: chunkStore => set(() => ({chunkStore})),
  resetChunkeStore: () => set(() => ({chunkStore: null})),
  setCurrentChunkeSet: currentChunkSet => set(() => ({currentChunkSet})),
  resetCurrentChunkeSet: () => set(() => ({currentChunkSet: null})),
}));
