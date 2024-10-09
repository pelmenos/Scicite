import { TAppState } from "store/store";

export const getOffers = (state: TAppState) => {
    return state.offers.offers.offers
}

export const getOffersCount = (state: TAppState) => {
    return state.offers.offers.count
}

export const getOffersCurrentPage = (state: TAppState) => {
    return state.offers.offers.currentPage
}

export const getOffersNextPage = (state: TAppState) => {
    return state.offers.offers.next
}

export const getIsFetching = (state: TAppState) => {
    return state.offers.isFetching
}

export const getOffersStatus = (state: TAppState) => {
    return state.offers.status.status
}

export const getErrors = (state: TAppState) => {
	return state.offers.errors
}
