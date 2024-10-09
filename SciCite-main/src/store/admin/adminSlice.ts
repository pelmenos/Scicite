import { PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit"
import { adminAPI } from "api/admin.api"
import { offersAPI } from "api/offers.api"
import { TAction, TAppState } from "store/store"
import { TCreateTransaction, THelp, TRequestUsersData, TSettings, TTransaction, TUsers } from "types/admin.types"
import { TOffer, TRequestOffersData } from "types/offers.types"
import { TLevel } from "types/user.types"

type TPayloadSuppInfo = {
    count: number,
    next: string,
    previous: string,
}

const initialState = {
    users: {
        next: null as string | null,
		previous: null as string | null,
		count: 0,
		list: [] as TUsers[],
        currentPage: 1
    },
    cardOffers: {
        count: null as number | null,
        next: null as string | null,
        previous: null as string | null,
        offers: [] as TOffer[],
        currentPage: 1,
    },
    help: {
        next: null as string | null,
		previous: null as string | null,
		count: 0,
		list: [] as any[],
        currentPage: 1
    },
    transaction: {
        next: null as string | null,
		previous: null as string | null,
		count: 0,
		list: [] as any[],
        currentPage: 1
    },
    settings: null as TSettings | null,
    levels: [] as TLevel[],
    isFetching: false,
    errors: null as { [k: string]: string[] } | null
}

const adminSlice = createSlice({
    name: 'adminSlice',
    initialState,
    reducers: {
        setUsersList: (state, action: PayloadAction<TUsers[]>) => {
            state.users.list = [...state.users.list, ...action.payload]
        },

        setUsersListSuppInfo: (state, action: PayloadAction<TPayloadSuppInfo>) => {
            state.users.count = action.payload.count
            state.users.next = action.payload.next
            state.users.previous = action.payload.previous
        },

        setUsersListCurrentPage: (state, action: PayloadAction<number>) => {
            state.users.currentPage = action.payload
        },

        resetUserList: (state) => {
            state.users.list = []
        },

        setCardOffers: (state, action: PayloadAction<TOffer[]>) => {
            state.cardOffers.offers = [...state.cardOffers.offers, ...action.payload]
        },

        setCardOffersSuppInfo: (state, action: PayloadAction<TPayloadSuppInfo>) => {
            state.cardOffers.count = action.payload.count
            state.cardOffers.next = action.payload.next
            state.cardOffers.previous = action.payload.previous
        },

        setCardOffersCurrentPage: (state, action: PayloadAction<number>) => {
            state.cardOffers.currentPage = action.payload
        },

        setResetCardOffers: (state) => {
            state.cardOffers.offers = []
            state.cardOffers.count = null
            state.cardOffers.next = null
            state.cardOffers.previous = null
        },

        setHelpList: (state, action: PayloadAction<THelp[]>) => {
            state.help.list = [...state.help.list, ...action.payload]
        },

        setHelpListSuppInfo: (state, action: PayloadAction<TPayloadSuppInfo>) => {
            state.help.count = action.payload.count
            state.help.next = action.payload.next
            state.help.previous = action.payload.previous
        },

        setHelpListCurrentPage: (state, action: PayloadAction<number>) => {
            state.help.currentPage = action.payload
        },

        resetHelpList: (state) => {
            state.help.list = []
        },

        setTransactionList: (state, action: PayloadAction<TTransaction[]>) => {
            state.transaction.list = [...state.transaction.list, ...action.payload]
        },

        setTransactionListSuppInfo: (state, action: PayloadAction<TPayloadSuppInfo>) => {
            state.transaction.count = action.payload.count
            state.transaction.next = action.payload.next
            state.transaction.previous = action.payload.previous
        },

        setTransactionListCurrentPage: (state, action: PayloadAction<number>) => {
            state.transaction.currentPage = action.payload
        },

        resetTransactionList: (state) => {
            state.transaction.list = []
        },

        setSettings: (state, action: PayloadAction<TSettings>) => {
            state.settings = {...action.payload}
        },

        setLevels: (state, action: PayloadAction<TLevel[]>) => {
            state.levels = [...action.payload]
        },
        
        setIsFetching: (state, action: PayloadAction<boolean>) => {
            state.isFetching = action.payload
        },

        setErrors: (state, action: PayloadAction<{ [k: string]: string[] } | null>) => {
            state.errors = action.payload
        },
    }
})

export const {
    setUsersList,
    setUsersListSuppInfo,
    setUsersListCurrentPage,
    resetUserList,
    setCardOffers,
    setCardOffersCurrentPage,
    setCardOffersSuppInfo,
    setResetCardOffers,
    setHelpList,
    setHelpListSuppInfo,
    setHelpListCurrentPage,
    resetHelpList,
    setTransactionList,
    setTransactionListSuppInfo,
    setTransactionListCurrentPage,
    resetTransactionList,
    setSettings,
    setLevels,
    setIsFetching,
    setErrors
} = adminSlice.actions

type TThunk = ThunkAction<Promise<void>, TAppState, unknown, TAction<typeof adminSlice.actions>>

export const requestUsersList = (requestData: TRequestUsersData): TThunk => async (dispatch) => {
    dispatch(setIsFetching(true))
    const data = await adminAPI.getUsers({
        page: requestData.page ? requestData.page : 1,
        filter_login: requestData.filter_login ? requestData.filter_login : '',
    })

    dispatch(setUsersList(data.results))
    dispatch(setUsersListCurrentPage(requestData.page ? requestData.page : 1))
    dispatch(setUsersListSuppInfo({
        count: data.count,
        next: data.next,
        previous: data.previous
    }))
    dispatch(setIsFetching(false))
}

export const resetUsersList = (): TThunk => async (dispatch) => {
    dispatch(resetUserList())
}

export const requestCardOffers = (requestOfferData: TRequestOffersData): TThunk => async (dispatch) => {
    dispatch(setIsFetching(true))
    const data = await offersAPI.getOffers(
        {
            page: requestOfferData?.page ? requestOfferData.page : 1,
            card_id: requestOfferData?.card_id ? requestOfferData.card_id : '',
            perfomer_id: requestOfferData?.perfomer_id ? requestOfferData.perfomer_id : '',
            search: requestOfferData?.search ? requestOfferData.search : '',
            status_customer__id: requestOfferData?.status_customer__id ? requestOfferData.status_customer__id : '',
            status_executor__id: requestOfferData?.status_executor__id ? requestOfferData.status_executor__id : '',
            is_evidence: requestOfferData?.is_evidence ? requestOfferData.is_evidence : null
        }
    )
    dispatch(setCardOffers(data.results))
    dispatch(setCardOffersSuppInfo({ count: data.count, next: data.next, previous: data.previous }))
    dispatch(setCardOffersCurrentPage(requestOfferData?.page ? requestOfferData?.page : 1))
    dispatch(setIsFetching(false))
}

export const resetCardOffers = (): TThunk => async (dispatch) => {
    dispatch(setResetCardOffers())
}

export const requestHelpList = (requestData: TRequestUsersData): TThunk => async (dispatch) => {
    dispatch(setIsFetching(true))
    const data = await adminAPI.getHelp({
        page: requestData.page ? requestData.page : 1,
        filter_login: requestData.filter_login ? requestData.filter_login : '',
    })

    dispatch(setHelpList(data.results))
    dispatch(setHelpListCurrentPage(requestData.page ? requestData.page : 1))
    dispatch(setHelpListSuppInfo({
        count: data.count,
        next: data.next,
        previous: data.previous
    }))
    dispatch(setIsFetching(false))
}

export const createTransaction = (creaTransactionData: TCreateTransaction): TThunk => async (dispatch) => {
    const data = await adminAPI.createTransaction(creaTransactionData)
    dispatch(resetTransactionList())
    await dispatch(requestTransactionList({page: 1, filter_login: ""}))
}

export const requestTransactionList = (requestData: TRequestUsersData): TThunk => async (dispatch) => {
    dispatch(setIsFetching(true))
    const data = await adminAPI.getTransaction({
        page: requestData.page ? requestData.page : 1,
        filter_login: requestData.filter_login ? requestData.filter_login : '',
    })

    dispatch(setTransactionList(data.results))
    dispatch(setTransactionListCurrentPage(requestData.page ? requestData.page : 1))
    dispatch(setTransactionListSuppInfo({
        count: data.count,
        next: data.next,
        previous: data.previous
    }))
    dispatch(setIsFetching(false))
}

export const deleteTransaction = (transactionId: string): TThunk => async (dispatch) => {
    const data = await adminAPI.deleteTransaction(transactionId)
    dispatch(resetTransactionList())
    await dispatch(requestTransactionList({page: 1, filter_login: ""}))
}

export const requestSettings = (): TThunk => async (dispatch) => {
    const data = await adminAPI.requestSettings()
    dispatch(setSettings(data.data))
}

export const updateSettings = (settings: TSettings): TThunk => async (dispatch) => {
    const data = await adminAPI.updateSettings(settings)
    dispatch(setSettings(data.data))
}

export const requestLevels = (): TThunk => async (dispatch) => {
    const data = await adminAPI.requestLevels()
    dispatch(setLevels(data.results))
}

export const updateLevel = (level: TLevel): TThunk => async (dispatch) => {
    const data = await adminAPI.updateLevel(level)
    await dispatch(requestLevels())
}

export default adminSlice.reducer
