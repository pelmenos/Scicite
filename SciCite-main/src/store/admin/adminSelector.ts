import { TAppState } from "store/store"

export const getUsersList = (state: TAppState) => {
    return state.admin.users.list
}

export const getUsersListCurrentPage = (state: TAppState) => {
    return state.admin.users.currentPage
}

export const getUsersListNextPage = (state: TAppState) => {
    return state.admin.users.next
}

export const getCardOffers = (state: TAppState) => {
    return state.admin.cardOffers.offers
}

export const getCardOffersCount = (state: TAppState) => {
    return state.admin.cardOffers.count
}

export const getCardOffersCurrentPage = (state: TAppState) => {
    return state.admin.cardOffers.currentPage
}

export const getCardOffersNextPage = (state: TAppState) => {
    return state.admin.cardOffers.next
}

export const getHelpList = (state: TAppState) => {
    return state.admin.help.list
}

export const getHelpListCurrentPage = (state: TAppState) => {
    return state.admin.help.currentPage
}

export const getHelpListNextPage = (state: TAppState) => {
    return state.admin.help.next
}

export const getTransactionList = (state: TAppState) => {
    return state.admin.transaction.list
}

export const getTransactionListCurrentPage = (state: TAppState) => {
    return state.admin.transaction.currentPage
}

export const getTransactionListNextPage = (state: TAppState) => {
    return state.admin.transaction.next
}

export const getSettings = (state: TAppState) => {
    return state.admin.settings
}

export const getLevels = (state: TAppState) => {
    return state.admin.levels
}

export const getIsFetching = (state: TAppState) => {
    return state.admin.isFetching
}

export const getErrors = (state: TAppState) => {
    return state.admin.errors
}
