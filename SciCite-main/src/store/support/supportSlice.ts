import { PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit"
import { TResponseWithResults } from "api/api"
import { supportApi } from "api/support.api"
import { AxiosError } from "axios"
import { TAction, TAppState } from "store/store"
import { TCreateSupport, TRequestSupport, TSuppStatusResults, TSuppTypeResults, TSupport } from "types/support.types"

type TPayloadSuppInfo = {
    count: number,
    next: string,
    previous: string,
}

const initialState = {
    support: {
        count: null as number | null,
        next: null as string | null,
        previous: null as string | null,
        support: [] as TSupport[],
        currentPage: 1
    },
    supportTypes: null as TResponseWithResults<TSuppTypeResults> | null,
    supportStatus: null as TResponseWithResults<TSuppStatusResults> | null,
    isFetching: false,
	errors: null as { [k: string]: string[] } | null
}

const suppSlice = createSlice({
    name: 'suppSlice',
    initialState,
    reducers: {
        setSupports: (state, action: PayloadAction<TSupport[]>) => {
            state.support.support = [...state.support.support, ...action.payload]
        },

        setSupportsSuppInfo: (state, action: PayloadAction<TPayloadSuppInfo>) => {
            state.support.count = action.payload.count
            state.support.next = action.payload.next
            state.support.previous = action.payload.previous
        },

        setSupportsListCurrentPage: (state, action: PayloadAction<number>) => {
            state.support.currentPage = action.payload
        },

        resetSupports: (state) => {
            state.support.support = []
        },

        setSupportTypes: (state, action: PayloadAction<TResponseWithResults<TSuppTypeResults>>) => {
            state.supportTypes = { ...action.payload }
        },

        setSupportStatus: (state, action: PayloadAction<TResponseWithResults<TSuppStatusResults>>) => {
            state.supportStatus = { ...action.payload }
        },

		setErrors: (state, action: PayloadAction<{ [k: string]: string[] } | null>) => {
			state.errors = action.payload
		},

        setIsFetching: (state, action: PayloadAction<boolean>) => {
            state.isFetching = action.payload
        },
    }
})

export const {
    setSupports,
    resetSupports,
    setSupportTypes,
    setSupportStatus,
    setErrors
} = suppSlice.actions

type TThunk = ThunkAction<Promise<void>, TAppState, unknown, TAction<typeof suppSlice.actions>>

export const requestSupport = (supportData: TRequestSupport): TThunk => async (dispatch) => {
    const data = await supportApi.getSupport({
        page: supportData.page ? supportData.page : 1,
        declarer__id: supportData.declarer__id,
        reporter__id: supportData.reporter__id,
        status__id__in: supportData.status__id__in,
        type_support__id: supportData.type_support__id,
        offer__id: supportData.offer__id,
        search: supportData.search
    })
    dispatch(setSupports(data.results))
}

export const resetSupport = (): TThunk => async (dispatch) => {
    dispatch(resetSupports())
}

export const createSupport = (createSupportData: TCreateSupport): TThunk => async (dispatch) => {
    try {
        const data = await supportApi.createSupport(createSupportData)
    } catch (error) {
        const err = error as AxiosError
		if (typeof err.response?.data === "object") {
			dispatch(setErrors({ ...err.response?.data }))
		}
    }
}

export const getSupportTypes = (page = ''): TThunk => async (dispatch) => {
    const data = await supportApi.getSuppTypes(page)
    dispatch(setSupportTypes(data))
}

export const getSupportStatus = (page = ''): TThunk => async (dispatch) => {
    const data = await supportApi.getSuppStatus(page)
    dispatch(setSupportStatus(data))
}

export const deleteSupport = (suppId: string): TThunk => async (dispatch) => {
    const data = await supportApi.deleteSupport(suppId)
}



export default suppSlice.reducer 