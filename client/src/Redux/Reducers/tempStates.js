import {
    createReducer
} from "@reduxjs/toolkit";

export const isMetamask = createReducer({
    data: null
}, {
    setIsMetamask: (state, action) => {
        state.data = action.payload;
    }
})

export const isLoading = createReducer({
    data: true
}, {
    setIsLoading: (state, action) => {
        state.data = action.payload;
    }
})

export const operationsData = createReducer({
    data: {
        selectedOperation: {
            num: 1,
            text: "Join"
        },
        unSelectedOperations: [{
            num: 0,
            text: "Create"
        }, {
            num: 2,
            text: "End"
        }, {
            num: 3,
            text: "Distribution"
        }]
    }
}, {
    setOperationsData: (state, action) => {
        state.data = action.payload;
    }
})

export const isActivitiesShower = createReducer({
    data: false
}, {
    setIsActivitiesShower: (state, action) => {
        state.data = action.payload;
    }
})

export const chakraId = createReducer({
    data: null
}, {
    setChakraId: (state, action) => {
        state.data = action.payload;
    }
})