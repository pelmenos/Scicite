import { TCreateOffer, TEvidence, TOffer, TOfferStatus, TRequestOffersData, TRequestOffersStatus, TServerUpdateOffer } from "types/offers.types"
import { TResponse, TResponseWithResults, instance } from "./api"

export const offersAPI = {
    async getOffers(requestOfferData: TRequestOffersData) {
        const response = await instance.get<TResponseWithResults<TOffer>>(
            `/offers/?page=${requestOfferData.page}` +
            (requestOfferData.card_id === '' ? '' : `&card__id=${requestOfferData.card_id}`) +
            (requestOfferData.status_executor__id === '' ? '' :
                `&status_executor__id=${requestOfferData.status_executor__id}`) +
            (requestOfferData.status_customer__id === '' ? '' :
                `&status_customer__id=${requestOfferData.status_customer__id}`) +
            (requestOfferData.perfomer_id === '' ? '' : `&perfomer__id=${requestOfferData.perfomer_id}`) +
            (requestOfferData.search === '' ? '' : `&search=${requestOfferData.search}`) +
            (!requestOfferData.is_evidence ? '' : `&is_evidence=${requestOfferData.is_evidence}`)
        );
        return response.data
    },

    async createOffer(createOfferData: TCreateOffer) {
        const response = await instance.post<TResponse<TOffer>>('/offers/', createOfferData);
        return response.data
    },

    async updateOffer(offerId: string, updateOfferData: TServerUpdateOffer) {
        const response = await instance.patch<any>(`/offers/${offerId}/`, updateOfferData);
        return response.data        
    },

    async deleteOffer(offerId: string) {
        const response = await instance.delete<any>(`/offers/${offerId}/`);
        return response.data
    },

    async createEvidence(articleId: string) {
        const response = await instance.post<TResponse<TEvidence>>('/offers/evidence/', { article: articleId });
        return response.data
    },

    async getOffersStatus(requestOffersStatusData: TRequestOffersStatus) {
        const response = await instance.get<TResponseWithResults<TOfferStatus>>(
            `/offers/offersstatus/?page=${requestOffersStatusData.page}` +
            (requestOffersStatusData.code === '' ? '' : `&code=${requestOffersStatusData.code}`) +
            (requestOffersStatusData.name === '' ? '' : `&name=${requestOffersStatusData.name}`) +
            (requestOffersStatusData.search === '' ? '' : `&search=${requestOffersStatusData.search}`)
        );
        return response.data
    }
}