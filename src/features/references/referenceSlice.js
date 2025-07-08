import { createSlice } from '@reduxjs/toolkit'

export const referenceSlice = createSlice({
    name: 'reference',
    initialState: {

        introduction: {
            id: 0,
            name: "Introduction",
            entries: {

            }
        },
        litReview: {
            id: 0,
            name: "Literature Review",
            entries: {

            }
        },
        section1: {
            id: 0,
            name: "Section 1",
            entries: {

            }
        },
        section2: {
            id: 0,
            name: "Section 1",
            entries: {

            }
        },
    },
    reducers: {
        addReference: (state, action) => {



            // Redux Toolkit allows us to write "mutating" logic in reducers. It
            // doesn't actually mutate the state because it uses the Immer library,
            // which detects changes to a "draft state" and produces a brand new
            // immutable state based off those changes.
            // Also, no return statement is required from these functions.


            for (const key in state) {
                if (state[key].name === action.payload.name) {
                    // Add to entries object, using a unique key (e.g., timestamp or id)
                    const entryId = state[key].id + 1;
                    state[key].id = entryId;
                    state[key].entries[entryId] = action.payload;
                    break;
                }
            }
        }
    },
})

// Action creators are generated for each case reducer function
export const { addReference } = referenceSlice.actions

export default referenceSlice.reducer