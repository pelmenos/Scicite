import { Dispatch, PayloadAction, ThunkAction, createSlice } from '@reduxjs/toolkit'
import { TResponseWithResults } from 'api/api'
import { cardsAPI } from 'api/cards.api'
import { AxiosError } from 'axios'
import { createOffer } from 'store/offers/offersSlice'
import { TAction, TAppState } from 'store/store'
import { getCurrentAcievement } from 'store/user/usersSlice'
import { TCard, TCardInfo, TCreateCardFormData, TRequestCards, TRequestTariff, TTariff } from 'types/cards.types'

const initialState = {
	searchCards: {
		cards: [] as TCard[],
		next: null as string | null,
		previous: null as string | null,
		count: 0,
		currentPage: 1,
	},
	userCards: {
		cards: [] as TCard[],
		next: null as string | null,
		previous: null as string | null,
		count: 0,
		currentPage: 1,
	},
	category: {
		next: null as string | null,
		previous: null as string | null,
		count: 0,
		list: null as TCardInfo[] | null,
	},
	requiredbase: {
		next: null as string | null,
		previous: null as string | null,
		count: 0,
		list: null as TCardInfo[] | null,
	},
	tariff: {
		next: null as string | null,
		previous: null as string | null,
		count: 0,
		tariff: null as TTariff[] | null
	},
	isFetching: false,
	errors: null as { [k: string]: string[] } | null
}

const cardsSlice = createSlice({
	name: 'cardsSlice',
	initialState,
	reducers: {
		setSearchCards: (
			state,
			action: PayloadAction<TResponseWithResults<TCard>>
		) => {
			state.searchCards.cards = [
				...state.searchCards.cards,
				...action.payload.results,
			]
			state.searchCards.next = action.payload.next
			state.searchCards.previous = action.payload.previous
			state.searchCards.count = action.payload.count
		},
		setSearchCurrentPage: (state, action: PayloadAction<number>) => {
			state.searchCards.currentPage = action.payload
		},
		setResetSearchCards: state => {
			state.searchCards.cards = []
			state.searchCards.next = null
			state.searchCards.previous = null
			state.searchCards.count = 0
		},
		setUserCards: (
			state,
			action: PayloadAction<TResponseWithResults<TCard>>
		) => {
			state.userCards.cards = [
				...state.userCards.cards,
				...action.payload.results,
			]
			state.userCards.next = action.payload.next
			state.userCards.previous = action.payload.previous
			state.userCards.count = action.payload.count
		},
		setUserCurrentPage: (state, action: PayloadAction<number>) => {
			state.userCards.currentPage = action.payload
		},
		setResetUserCards: state => {
			state.userCards.cards = []
			state.userCards.next = null
			state.userCards.previous = null
			state.userCards.count = 0
		},
		setTariff: (state, action: PayloadAction<TTariff[]>) => {
			state.tariff.tariff = action.payload
		},
		setCategory: (
			state,
			action: PayloadAction<TResponseWithResults<TCardInfo>>
		) => {
			state.category.next = action.payload.next
			state.category.previous = action.payload.previous
			state.category.count = action.payload.count
			state.category.list = [...action.payload.results]
		},
		setRequiredbase: (
			state,
			action: PayloadAction<TResponseWithResults<TCardInfo>>
		) => {
			state.requiredbase.next = action.payload.next
			state.requiredbase.previous = action.payload.previous
			state.requiredbase.count = action.payload.count
			state.requiredbase.list = [...action.payload.results]
		},
		setFetching: (state, action: PayloadAction<boolean>) => {
			state.isFetching = action.payload
		},
		setErrors: (state, action: PayloadAction<{ [k: string]: string[] } | null>) => {
			state.errors = action.payload
		},
	},
})

export const {
	setSearchCards,
	setSearchCurrentPage,
	setResetSearchCards,
	setUserCards,
	setUserCurrentPage,
	setResetUserCards,
	setTariff,
	setCategory,
	setRequiredbase,
	setFetching,
	setErrors
} = cardsSlice.actions

type TThunk = ThunkAction<
	Promise<void>,
	TAppState,
	unknown,
	TAction<typeof cardsSlice.actions>
>

const requestCards = async (
	dispatch: Dispatch,
	requestData: TRequestCards,
	setCardsActionCreator: ({ ...data }: TResponseWithResults<TCard>) => TAction<typeof cardsSlice.actions>,
	setPageActionCreator: (page: number) => TAction<typeof cardsSlice.actions>
) => {
	dispatch(setFetching(true))
	const data = await cardsAPI.getCards(requestData)
	dispatch(setCardsActionCreator({ ...data }))
	dispatch(setPageActionCreator(requestData.page))
	dispatch(setFetching(false))
}

export const requestSearchCards = (requestData: TRequestCards): TThunk => {
	return async (dispatch) => {
		await requestCards(dispatch, requestData, setSearchCards, setSearchCurrentPage)
	}
}

export const resetSearchCards = (): TThunk => async dispatch => {
	dispatch(setResetSearchCards())
}

export const requestUserCards = (requestData: TRequestCards): TThunk => {
	return async (dispatch) => {
		await requestCards(dispatch, requestData, setUserCards, setUserCurrentPage)
	}
}

export const resetUserCards = (): TThunk => async dispatch => {
	dispatch(setResetUserCards())
}

export const createCard = (cardData: TCreateCardFormData, barter?: boolean): TThunk => async dispatch => {
	try {
		const authorsArray = cardData.authors.split(',')
		const dataAuthors = []
		for (let i = 0; i < authorsArray.length; i++) {
			const data = await cardsAPI.setAuthors(authorsArray[i])
			dataAuthors.push(data.id)
		}

		const keywordsArray = cardData.keywords.length ? cardData.keywords.split(',') : []
		const dataKeywords = []
		for (let i = 0; i < keywordsArray.length; i++) {
			const data = await cardsAPI.setKeywords(keywordsArray[i])
			dataKeywords.push(+data.id)
		}

		const dataArticlemeta = await cardsAPI.setArticleMeta(cardData.file && dataKeywords.length ? {
			doi: cardData.doi,
			abstract: cardData.abstract,
			citation_url: cardData.citationUrl,
			journal_name: cardData.journalName,
			authors: dataAuthors,
			file: cardData.file,
			publication_year: +cardData.publicationYear,
			volume: +cardData.volume,
			page_numbers: cardData.pageNumbers,
			keywords: dataKeywords,
		} : !cardData.file && dataKeywords.length ?
			{
				doi: cardData.doi,
				abstract: cardData.abstract,
				citation_url: cardData.citationUrl,
				journal_name: cardData.journalName,
				authors: dataAuthors,
				publication_year: +cardData.publicationYear,
				volume: +cardData.volume,
				page_numbers: cardData.pageNumbers,
				keywords: dataKeywords
			}
			: cardData.file && !dataKeywords.length ?
				{
					doi: cardData.doi,
					abstract: cardData.abstract,
					citation_url: cardData.citationUrl,
					journal_name: cardData.journalName,
					authors: dataAuthors,
					file: cardData.file,
					publication_year: +cardData.publicationYear,
					volume: +cardData.volume,
					page_numbers: cardData.pageNumbers,
				} :
				{
					doi: cardData.doi,
					abstract: cardData.abstract,
					citation_url: cardData.citationUrl,
					journal_name: cardData.journalName,
					authors: dataAuthors,
					publication_year: +cardData.publicationYear,
					volume: +cardData.volume,
					page_numbers: cardData.pageNumbers,
				}
		)
		const data = await cardsAPI.createCard({
			user: cardData.user,
			base: cardData.requiredbase,
			tariff: cardData.tariff,
			article: dataArticlemeta.id,
			is_exchangable: !!+cardData.isExchangable,
			is_active: true,
			theme: cardData.theme,
			category: cardData.category.split(','),
		})
		if (data.data.achievement) {
			await dispatch(getCurrentAcievement(data.data.achievement))
		}
		if (!barter) {
			dispatch(resetSearchCards())
			await dispatch(
				requestSearchCards({
					user: '',
					tariff: null,
					base: null,
					category: null,
					theme: '',
					is_exchangable: null,
					is_active: true,
					search: '',
					article: '',
					ordering: '',
					page: 1
				})
			)
		}
		dispatch(resetUserCards())
		await dispatch(
			requestUserCards({
				user: cardData.user,
				tariff: null,
				base: null,
				category: null,
				theme: '',
				is_exchangable: null,
				is_active: true,
				search: '',
				article: '',
				ordering: '',
				page: 1
			})
		)
	} catch (error) {
		const err = error as AxiosError
		if (typeof err.response?.data === "object") {
			dispatch(setErrors({ ...err.response?.data }))
		}
	}
}

export const updateCard = (
	articleId: string,
	cardId: string,
	updateCardData: TCreateCardFormData
): TThunk => async (dispatch) => {
	const authorsArray = updateCardData.authors.split(',')
	const dataAuthors = []
	for (let i = 0; i < authorsArray.length; i++) {
		const data = await cardsAPI.setAuthors(authorsArray[i])
		dataAuthors.push(data.id)
	}

	const keywordsArray = updateCardData.keywords.split(',')
	const dataKeywords = []
	for (let i = 0; i < keywordsArray.length; i++) {
		const data = await cardsAPI.setKeywords(keywordsArray[i])
		dataKeywords.push(+data.id)
	}

	const dataArticlemeta = await cardsAPI.updateArticleMeta(articleId, {
		doi: updateCardData.doi,
		abstract: updateCardData.abstract,
		citation_url: updateCardData.citationUrl,
		journal_name: updateCardData.journalName,
		authors: dataAuthors,
		publication_year: +updateCardData.publicationYear,
		volume: +updateCardData.volume,
		page_numbers: updateCardData.pageNumbers,
		keywords: dataKeywords,
		file: updateCardData.file,
	})

	const data = await cardsAPI.editCard(cardId, {
		user: updateCardData.user,
		base: updateCardData.requiredbase,
		article: dataArticlemeta.id,
		is_exchangable: !!+updateCardData.isExchangable,
		is_active: true,
		theme: updateCardData.theme,
		category: updateCardData.category.split(','),
	})
	dispatch(resetUserCards())
	await dispatch(
		requestUserCards({
			user: updateCardData.user,
			tariff: null,
			base: null,
			category: null,
			theme: '',
			is_exchangable: null,
			is_active: true,
			search: '',
			article: '',
			ordering: '',
			page: 1
		})
	)
}

export const prolongCard = (cardId: string, period: number): TThunk => async (dispatch) => {
	try {
		const tariffData = await cardsAPI.createTariff(100, period)
		await cardsAPI.editCard(cardId, { tariff: tariffData.id })
	} catch (error) {
		const err = error as AxiosError
		if (typeof err.response?.data === "object") {
			dispatch(setErrors({ ...err.response?.data }))
		}	
	}
}

export const requestTariff = (requestTariffData?: TRequestTariff): TThunk => async (dispatch) => {
	const data = await cardsAPI.getTariff({
		page: requestTariffData?.page ? requestTariffData.page : 1,
		period: requestTariffData?.period ? requestTariffData?.period : '',
		scicoins: requestTariffData?.scicoins ? requestTariffData?.scicoins : ''
	})
	dispatch(setTariff(data.data))
}

export const getCategory = (name = '', page = 1): TThunk => async dispatch => {
	const data = await cardsAPI.getCategory(name, page)
	dispatch(setCategory(data))
}

export const getRequiredbase = (name = '', page = 1): TThunk => async dispatch => {
	const data = await cardsAPI.getRequiredbase(name, page)
	dispatch(setRequiredbase(data))
}

export const activeToggleCard = (userId: string, itemId: string, is_active: boolean): TThunk => async dispatch => {
	const data = await cardsAPI.editCard(itemId, { is_active: is_active })
	dispatch(resetUserCards())
	if (!is_active) {
		await dispatch(requestUserCards({
			user: userId,
			tariff: null,
			base: null,
			category: null,
			theme: '',
			is_exchangable: null,
			is_active: true,
			search: '',
			article: '',
			ordering: '',
			page: 1
		}))
	} else {
		await dispatch(requestUserCards({
			user: userId,
			tariff: null,
			base: null,
			category: null,
			theme: '',
			is_exchangable: null,
			is_active: false,
			search: '',
			article: '',
			ordering: '',
			page: 1
		}))
	}
}

export const deleteCard = (itemId: string, userId?: string): TThunk => async dispatch => {
	const data = await cardsAPI.deleteCards(itemId)
	if (userId) {
		dispatch(resetUserCards())
		await dispatch(requestUserCards({
			user: userId,
			tariff: null,
			base: null,
			category: null,
			theme: '',
			is_exchangable: null,
			is_active: false,
			search: '',
			article: '',
			ordering: '',
			page: 1
		}))
	} else {
		dispatch(resetSearchCards())
		await dispatch(requestSearchCards({
			user: '',
			tariff: null,
			base: null,
			category: null,
			theme: '',
			is_exchangable: null,
			is_active: true,
			search: '',
			article: '',
			ordering: '',
			page: 1
		}))
	}
}

export default cardsSlice.reducer
