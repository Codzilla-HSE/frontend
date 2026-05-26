import { create } from 'zustand';

export const useMatchStore = create((set) => ({

    draftSessionDTO: null,

    error: {stage : null, message: null},

    matchStarted: false,


    handleIncomingMessage: (payload) => {

        switch (payload.status) {
            case "MATCH_STARTED_REDIRECT":
                set({matchStarted : true});
                break;
            case "DRAFT":
                set({draftSessionDTO: payload.payload});
                break;
        }
    },


    handleErrorMessage: (payload) => {

            set({ error: {stage: null, message: payload.message} });
    },


    resetStore: () => set({ matchStarted: null, error: null })
}));