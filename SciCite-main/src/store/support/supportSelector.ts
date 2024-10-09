import { TAppState } from "store/store"

export const getSupports = (state: TAppState) => {
    return state.supp.support.support
}

export const getSupportsCurrentPage = (state: TAppState) => {
    return state.supp.support.currentPage
}

export const getSupportsNextPage = (state: TAppState) => {
    return state.supp.support.next
}

export const getSupportTypes = (state: TAppState) => {
    return state.supp.supportTypes?.results
}

export const getSupportStatus = (state: TAppState) => {
    return state.supp.supportStatus?.results
}

export const getIsFetching = (state: TAppState) => {
    return state.supp.isFetching
}

export const getErrors = (state: TAppState) => {
	return state.supp.errors
}