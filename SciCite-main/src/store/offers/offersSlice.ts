import { PayloadAction, ThunkAction, createSlice } from "@reduxjs/toolkit"
import { cardsAPI } from "api/cards.api"
import { offersAPI } from "api/offers.api"
import { AxiosError } from "axios"
import { TAction, TAppState } from "store/store"
import { getCurrentAcievement } from "store/user/usersSlice"
import { TCreateOffer, TOffer, TOfferStatus, TRequestOffersData, TRequestOffersStatus, TChangeStatusOffer, TAccessBarter, TProofCitation, TProofPublication } from "types/offers.types"

type TPayloadSuppInfo = {
    count: number,
    next: string,
    previous: string,
}

const initialState = {
    offers: {
        count: null as number | null,
        next: null as string | null,
        previous: null as string | null,
        offers: [] as TOffer[],
        currentPage: 1,
    },
    status: {
        count: null as number | null,
        next: null as string | null,
        previous: null as string | null,
        status: [] as TOfferStatus[]
    },
    isFetching: false,
    errors: null as { [k: string]: string[] } | null
}

const offersSlice = createSlice({
    name: 'offersSlice',
    initialState,
    reducers: {
        setOffers: (state, action: PayloadAction<TOffer[]>) => {
            state.offers.offers = [...state.offers.offers, ...action.payload]
        },
        setOffersSuppInfo: (state, action: PayloadAction<TPayloadSuppInfo>) => {
            state.offers.count = action.payload.count
            state.offers.next = action.payload.next
            state.offers.previous = action.payload.previous
        },
        setOffersCurrentPage: (state, action: PayloadAction<number>) => {
            state.offers.currentPage = action.payload
        },
        setIsFetching: (state, action: PayloadAction<boolean>) => {
            state.isFetching = action.payload
        },
        setResetOffers: (state) => {
            state.offers.offers = []
            state.offers.count = null
            state.offers.next = null
            state.offers.previous = null
        },
        setStatus: (state, action: PayloadAction<TOfferStatus[]>) => {
            state.status.status = action.payload
        },
        setStatusSuppInfo: (state, action: PayloadAction<TPayloadSuppInfo>) => {
            state.status.count = action.payload.count
            state.status.next = action.payload.next
            state.status.previous = action.payload.previous
        },
        setErrors: (state, action: PayloadAction<{ [k: string]: string[] } | null>) => {
            state.errors = action.payload
        },
    }
})

export const {
    setOffers,
    setOffersSuppInfo,
    setOffersCurrentPage,
    setResetOffers,
    setStatus,
    setStatusSuppInfo,
    setIsFetching,
    setErrors
} = offersSlice.actions

type TThunk = ThunkAction<Promise<void>, TAppState, unknown, TAction<typeof offersSlice.actions>>

export const createOffer = (createOfferData: TCreateOffer): TThunk => async (dispatch) => {
    try {
        const data = await offersAPI.createOffer(createOfferData)
        if (data.data.achievement) {
            await dispatch(getCurrentAcievement(data.data.achievement))
        }
    } catch (error) {
        const err = error as AxiosError
        if (typeof err.response?.data === "object") {
            dispatch(setErrors({ ...err.response?.data }))
        }
    }
}

export const requestOffers = (requestOfferData: TRequestOffersData): TThunk => async (dispatch) => {
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
    dispatch(setOffers(data.results))
    dispatch(setOffersSuppInfo({ count: data.count, next: data.next, previous: data.previous }))
    dispatch(setOffersCurrentPage(requestOfferData?.page ? requestOfferData?.page : 1))
    dispatch(setIsFetching(false))
}

export const citationProof = (
    offerId: string,
    updateOffer: TProofCitation
): TThunk => async (dispatch) => {
    try {
        const articleData = await cardsAPI.setArticleMeta(
            {
                file: updateOffer.evidence.file,
                journal_name: updateOffer.evidence.journal_name,
                title: updateOffer.evidence.title
            }
        )
        const evidenceData = await offersAPI.createEvidence(articleData.id)
        const offerData = await offersAPI.updateOffer(offerId, {
            status_customer: updateOffer.status_customer,
            deadline_at: updateOffer.deadline_at,
            evidence: evidenceData.data.id
        })
        if (offerData.data.achievement) {
            await dispatch(getCurrentAcievement(offerData.data.achievement))
        }
    } catch (error) {
        const err = error as AxiosError
        if (typeof err.response?.data === "object") {
            dispatch(setErrors({ ...err.response?.data }))
        }
    }
}

export const publicationProof = (
    offerId: string,
    articleId: string,
    updateOffer: TProofPublication
): TThunk => async (dispatch) => {
    try {
        await cardsAPI.updateArticleMeta(articleId, {
            file_publication: updateOffer.evidence.file_publication
        })
        const offerData = await offersAPI.updateOffer(offerId, {
            status_customer: updateOffer.status_customer,
        })
        if (offerData.data.achievement) {
            await dispatch(getCurrentAcievement(offerData.data.achievement))
        }
    } catch (error) {
        const err = error as AxiosError
        if (typeof err.response?.data === "object") {
            dispatch(setErrors({ ...err.response?.data }))
        }
    }
}

export const accessExchangeOffer = (offerId: string, updateOffer: TAccessBarter): TThunk => async (dispatch) => {
    await offersAPI.updateOffer(offerId, {
        barter_is: updateOffer.barter_is,
    })
}

export const changeStatusOffer = (offerId: string, offerStatusData: TChangeStatusOffer): TThunk =>
    async (dispatch) => {
        const data = await offersAPI.updateOffer(offerId, {
            status_customer: offerStatusData.status_customer,
            status_executor: offerStatusData.status_executor,
        })
    }

export const resetOffers = (): TThunk => async (dispatch) => {
    dispatch(setResetOffers())
}

export const deleteOffer = (offerId: string): TThunk => async (dispatch) => {
    await offersAPI.deleteOffer(offerId)
}

export const requestOffersStatus = (requestOffersStatusData?: TRequestOffersStatus
): TThunk => async (dispatch) => {
    const data = await offersAPI.getOffersStatus(
        {
            page: requestOffersStatusData?.page ? requestOffersStatusData.page : 1,
            code: requestOffersStatusData?.code ? requestOffersStatusData.code : '',
            name: requestOffersStatusData?.name ? requestOffersStatusData.name : '',
            search: requestOffersStatusData?.search ? requestOffersStatusData.search : '',
        }
    )
    dispatch(setStatus(data.results))
    dispatch(setStatusSuppInfo({ count: data.count, next: data.next, previous: data.previous }))
    dispatch(setOffersCurrentPage(requestOffersStatusData?.page ? requestOffersStatusData?.page : 1))
}






export default offersSlice.reducer