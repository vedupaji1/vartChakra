import {
    configureStore
} from '@reduxjs/toolkit';
import {
    mainUserData,
    searchedUserData
} from './Reducers/userData';

import {
    isMetamask,
    isLoading,
    operationsData,
    isActivitiesShower,
    chakraId
} from './Reducers/tempStates';

export const store = configureStore({
    reducer: {
        mainUserData: mainUserData,
        searchedUserData: searchedUserData,
        isMetamask: isMetamask,
        isLoading: isLoading,
        operationsData: operationsData,
        isActivitiesShower: isActivitiesShower,
        chakraId: chakraId
    }
    //, // Enable It For Stopping From Showing UnSerialize Data Error
    // middleware: getDefaultMiddleware =>
    //     getDefaultMiddleware({
    //         serializableCheck: false,
    //     })
})