import { create } from 'zustand';

export const useMatchStore = create((set) => ({

    draftSessionDTO: null,
    error: { stage: null, message: null },
    matchStarted: false,
    matchResult: null,
    matchSubmissions : [],

    handleIncomingMessage: (payload) => {
        switch (payload.status) {
            case 'MATCH_STARTED_REDIRECT':
                set({ matchStarted: true });
                break;
            case 'DRAFT':
                set({ draftSessionDTO: payload.payload });
                break;
            case 'MATCH_FINISHED':
                set({ matchResult: payload.payload });
                break;

            case 'SUBMISSION':
                set((state) => ({
                    matchSubmissions: [ payload.payload, ...state.matchSubmissions]
                }));
                break;
        }
    },

    handleErrorMessage: (payload) => {
        set({ error: { stage: null, message: payload.message } });
    },

    resetStore: () => set({ matchStarted: null, error: null, matchResult: null }),
}));