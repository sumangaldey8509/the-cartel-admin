import { PublihserInterface } from "@/interface/publishers"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface PublisherState {
    publisher: PublihserInterface | null
}

const initialState: PublisherState = {
    publisher: null
}

const publisherSlice = createSlice({
    name: "publisher",
    initialState,
    reducers: {
        editPublisher(
            state,
            action: PayloadAction<PublihserInterface | null>
        ) {
            console.log(action.payload)
            state.publisher = action.payload
        }
    }
})

export const { editPublisher } = publisherSlice.actions
export default publisherSlice.reducer
