import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const emissionStore = (set) => ({
  emission: {},
  count: 0,
  addEmission: (newEmission) => {
    set((state) => ({
      emission: { ...state.emission, [newEmission.id]: newEmission.data },
    }));
  },
  isExist: (id) => {
    return (state) => state.emission[id] !== undefined;
  },
  removeEmission: (id) => {
    set((state) => {
      const { [id]: removed, ...rest } = state.emission;
      return { emission: rest };
    });
  },
  increase: () => set((state) => ({ count: (state.count || 0) + 1 })),
});

const useEmissionStore = create(
  devtools(
    persist(emissionStore, {
      name: "emission-store",
    })
  )
);

const callStore = (set) => ({
  CallCount: {},
  addCall: (id) => {
    set((state) => {
      const current = state.CallCount[id] || 0;
      return { CallCount: { ...state.CallCount, [id]: current + 1 } };
    });
  },
});

const useCallStore = create(
  devtools(
    persist(callStore, {
      name: "call-store",
    })
  )
);

export { useEmissionStore, useCallStore };
