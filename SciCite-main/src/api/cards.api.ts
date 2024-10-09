import {
	TCard,
	TCardInfo,
	TRequestArticlemetaData,
	TRequestCards,
	TRequestTariff,
	TResponseArticlemetaData,
	TServerCardCreate,
	TTariff,
} from 'types/cards.types'
import { TResponse, TResponseWithResults, instance } from './api'

export const cardsAPI = {
	async getCards(cardRequest: TRequestCards) {
		const response = await instance.get<TResponseWithResults<TCard>>(
			`/cards/?page=${cardRequest.page}` +
			(cardRequest.user === '' ? '' : `&user=${cardRequest.user}`) +
			(cardRequest.tariff?.length ? `&tariff__in=${cardRequest.tariff.map(t => t).join(',')}` : '') +
			(cardRequest.article === '' ? '' : `&article=${cardRequest.article}`) +
			(cardRequest.is_exchangable === null ? '' : `&is_exchangable=${cardRequest.is_exchangable}`) +
			(cardRequest.is_active === null ? '' : `&is_active=${cardRequest.is_active}`) +
			(cardRequest.theme === '' ? '' : `&theme=${cardRequest.theme}`) +
			(cardRequest.ordering === '' ? '' : `&ordering=${cardRequest.ordering}`) +
			(cardRequest.search === '' ? '' : `&search=${cardRequest.search}`) +
			(cardRequest.category?.length ? cardRequest.category.map(c => `&category=${c}`).join('') : '') +
			(cardRequest.base?.length ? `&base__in=${cardRequest.base.map(b => b).join(',')}` : '')
		);
		return response.data;
	},

	async createCard(cardData: TServerCardCreate) {
		const response = await instance.post<TResponse<TCard>>(`/cards/`, cardData)
		return response.data
	},

	async editCard(
		id: string, 
		editCardData: TServerCardCreate | { is_active: boolean } | { tariff: string }
	) {
		const response = await instance.patch<TResponse<TCard>>(`/cards/${id}/`, editCardData)
		return response.data.data
	},

	async deleteCards(id: string) {
		const response = await instance.delete<any>(`/cards/${id}/`)
		return response
	},

	async getTariff(requestTariffData: TRequestTariff) {
		const response = await instance.get<TResponse<TTariff[]>>(
			`/cards/tariff/` +
			(!requestTariffData.period ? '' : `?period=${requestTariffData.period}`) +
			(!requestTariffData.scicoins ? '' : `&scicoins=${requestTariffData.scicoins}`)
		)
		return response.data
	},

	async getCategory(name: string, page: number) {
		const response = await instance.get<TResponseWithResults<TCardInfo>>(
			`/cards/category/?page=${page}` + (name === '' ? '' : `&name=${name}`)
		)
		return response.data
	},

	async getCategoryById(id: string) {
		const response = await instance.get<TResponse<TCardInfo>>(
			`/cards/category/${id}/`
		)
		return response.data
	},

	async getRequiredbase(name: string, page: number) {
		const response = await instance.get<TResponseWithResults<TCardInfo>>(
			`/cards/requiredbase/?page=${page}` + (name === '' ? '' : `&name=${name}`)
		)
		return response.data
	},

	async getRequiredbaseById(id: string) {
		const response = await instance.get<TResponse<TCardInfo>>(
			`/cards/requiredbase/${id}/`
		)
		return response.data
	},

	async getArticlemetaById(artilemetaId: string) {
		const response = await instance.get<TResponse<TResponseArticlemetaData>>(
			`/cards/articlemeta/${artilemetaId}/`
		)
		return response.data.data
	},

	async setArticleMeta(articlemetaData: TRequestArticlemetaData) {
		const formData = new FormData()
		if (articlemetaData.file) {
			formData.append('file', articlemetaData.file)
		}
		if (articlemetaData.file_publication) {
			formData.append('file_publication', articlemetaData.file_publication)
		}
		const response = await instance.post<any>(
			'/cards/articlemeta/', articlemetaData.file && articlemetaData.file_publication ?
			{
				...articlemetaData,
				file: formData.get('file'),
				file_publication: formData.get('file_publication'),
			} : articlemetaData.file ?
				{
					...articlemetaData,
					file: formData.get('file'),
				} :
				articlemetaData.file_publication ?
					{
						...articlemetaData,
						file_publication: formData.get('file_publication'),
					} :
					{
						...articlemetaData
					},
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		)
		return response.data.data
	},

	async updateArticleMeta(
		id: string,
		articlemetaData: TRequestArticlemetaData
	) {
		const formData = new FormData()
		if (articlemetaData.file) {
			formData.append('file', articlemetaData.file)
		}
		if (articlemetaData.file_publication) {
			formData.append('file_publication', articlemetaData.file_publication)
		}
		const response = await instance.patch<any>(
			`/cards/articlemeta/${id}/`,
			articlemetaData.file ?
				{
					...articlemetaData,
					file: formData.get('file'),
				} :
				articlemetaData.file_publication ?
					{
						...articlemetaData,
						file_publication: formData.get('file_publication'),
					} :
					{
						...articlemetaData
					}, articlemetaData.file || articlemetaData.file_publication ?
			{

				headers: {
					'Content-Type': 'multipart/form-data',
				},
			} : {}
		)
		return response.data.data
	},

	async getAuthorById(authorId: string) {
		const response = await instance.get<TCardInfo>(
			`/cards/articlemeta/authors/${authorId}/`
		)
		return response.data
	},

	async setAuthors(name: string) {
		const response = await instance.post<{ id: string; name: string }>(
			'/cards/articlemeta/authors/', { name }
		)
		return response.data
	},

	async updateAuthors(id: string, name: string) {
		const response = await instance.patch<{ id: string; name: string }>(
			`/cards/articlemeta/authors/${id}/`, { name }
		)
		return response.data
	},

	async getKeywordById(keywordId: string) {
		const response = await instance.get<TCardInfo>(
			`/cards/articlemeta/keywords/${keywordId}/`
		)
		return response.data
	},

	async setKeywords(name: string) {
		const response = await instance.post<{ id: string; name: string }>(
			'/cards/articlemeta/keywords/', { name }
		)
		return response.data
	},

	async updateKeywords(id: string, name: string) {
		const response = await instance.post<{ id: string; name: string }>(
			`/cards/articlemeta/keywords/${id}/`, { name }
		)
		return response.data
	},

	async setTheme(name: string) {
		const response = await instance.post<any>('/cards/theme/', { name })
		return response.data.data
	},

	async updateTheme(id: string, name: string) {
		const response = await instance.post<any>(`/cards/theme/${id}/`, { name })
		return response.data.data
	},

	async createTariff(scicoins: number, period: number) {
		const response = await instance.post<TResponse<TTariff>>('/cards/tariff/', {scicoins, period})
		return response.data.data
	}
}
