import { createSlice } from '@reduxjs/toolkit';

export const joyrideSlice = createSlice({
    name: 'joyrideSlice',
    initialState: {
        run: false,
        storeOnboardingRunForViewer: false,
        storeOnboardingRunForRetailer: false,
        stepIndex: 0,
        stepStoreOnboardingIndexForViewer: 0,
        stepStoreOnboardingIndexForRetailer: 0,
        steps: [],
        stepsStoreOnboardingForViewer: [],
        stepsStoreOnboardingForRetailer: [],
        waitingForAction: false
    },
    reducers: {
        setRun: (state, action) => {
            state.run = action.payload;
        },
        setStoreOnboardingRunForViewer: (state, action) => {
            state.storeOnboardingRunForViewer = action.payload;
        },
        setStoreOnboardingRunForRetailer: (state, action) => {
            state.storeOnboardingRunForRetailer = action.payload;
        },
        setStepIndex: (state, action) => {
            state.stepIndex = action.payload;
        },
        setStepStoreOnboardingIndexForViewer: (state, action) => {
            state.stepStoreOnboardingIndexForViewer = action.payload;
        },
        setStepStoreOnboardingIndexForRetailer: (state, action) => {
            state.stepStoreOnboardingIndexForRetailer = action.payload;
        },
        setSteps: (state, action) => {
          const { payload } = action;
               const isStepAlreadyAdded = state.steps.some(step => step.target === payload.target);

               if (!isStepAlreadyAdded) {
                 state.steps.push(payload);
               }
        },
        setStepsStoreOnboardingForViewer: (state, action) => {
            const { payload } = action;
            const isStepAlreadyAdded = state.stepsStoreOnboardingForViewer.some(step => step.target === payload.target);

            if (!isStepAlreadyAdded) {
            state.stepsStoreOnboardingForViewer.push(payload);
            }
        },
        setStepsStoreOnboardingForRetailer: (state, action) => {
            const { payload } = action;

           const isStepAlreadyAdded = state.stepsStoreOnboardingForRetailer.some(step => step.target === payload.target);

             if (!isStepAlreadyAdded) {
                // alert("inside")
                  state.stepsStoreOnboardingForRetailer.push(payload);
             }
        },
        setWaitingForAction: (state, action) => {
            state.waitingForAction = action.payload;
        }
    }
})

export const {
    setRun,
    setStepIndex,
    setSteps,
    setWaitingForAction,
    setStoreOnboardingRunForViewer,
    setStepStoreOnboardingIndexForViewer,
    setStepsStoreOnboardingForViewer,
    setStoreOnboardingRunForRetailer,
    setStepsStoreOnboardingForRetailer,
    setStepStoreOnboardingIndexForRetailer
} = joyrideSlice.actions;

export const getStoreOnboardingRunForRetailer = (state) => state.joyride.storeOnboardingRunForRetailer
export const getStoreOnboardingRunForViewer = (state) => state.joyride.storeOnboardingRunForViewer
export const getRun = (state) => state.joyride.run
export const getStepIndex = (state) => state.joyride.stepIndex
export const getStepStoreOnboardingIndexForViewer = (state) => state.joyride.stepStoreOnboardingIndexForViewer
export const getStepStoreOnboardingIndexForRetailer = (state) => state.joyride.stepStoreOnboardingIndexForRetailer
export const getSteps = (state) => state.joyride.steps
export const getStepsStoreOnboardingForViewer = (state) => state.joyride.stepsStoreOnboardingForViewer
export const getStepsStoreOnboardingForRetailer = (state) => state.joyride.stepsStoreOnboardingForRetailer
export const getWaitingForAction = (state) => state.joyride.waitingForAction

export default joyrideSlice.reducer;
