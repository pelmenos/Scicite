import { TAppState } from 'store/store'

export const getSearchCardsCount = (state: TAppState) => {
	return state.cards.searchCards.count
}

export const getSearchCards = (state: TAppState) => {
	return state.cards.searchCards.cards
}

export const getSearchCurrentPage = (state: TAppState) => {
	return state.cards.searchCards.currentPage
}

export const getSearchNextPage = (state: TAppState) => {
	return state.cards.searchCards.next
}

export const getUserCardsCount = (state: TAppState) => {
	return state.cards.userCards.count
}

export const getUserCards = (state: TAppState) => {
	return state.cards.userCards.cards
}

export const getUserCardsCurrentPage = (state: TAppState) => {
	return state.cards.userCards.currentPage
}

export const getUserCardsNextPage = (state: TAppState) => {
	return state.cards.userCards.next
}

export const getTariff = (state: TAppState) => {
	return state.cards.tariff.tariff
}

export const getCategoryList = (state: TAppState) => {
	return state.cards.category.list
}

export const getRequiredbaseList = (state: TAppState) => {
	return state.cards.requiredbase.list
}

export const getIsFetching = (state: TAppState) => {
	return state.cards.isFetching
}

export const getErrors = (state: TAppState) => {
	return state.cards.errors
}
