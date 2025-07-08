import { configureStore } from '@reduxjs/toolkit'

import referenceReducer, { referenceSlice } from './features/references/referenceSlice'

/* eslint-disable no-underscore-dangle */
export default configureStore({
    reducer: {
        reference: referenceReducer

    },

}, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
/* eslint-enable */