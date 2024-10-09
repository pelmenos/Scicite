import { TCreateSupport, TRequestSupport, TSuppStatusResults, TSuppTypeResults, TSupport } from "types/support.types";
import { TResponse, TResponseWithResults, instance } from "./api";


export const supportApi = {
    async getSupport(supportData: TRequestSupport) {
        const response = await instance.get<TResponseWithResults<TSupport>>(
            `/support/?page=${supportData.page}` +
            (!supportData.declarer__id ? '' : `&declarer__id=${supportData.declarer__id}`) +
            (!supportData.reporter__id ? '' : `&reporter__id=${supportData.reporter__id}`) +
            (!supportData.status__id__in?.length ? '' : `&status__in=${supportData.status__id__in.join(',')}`) +
            (!supportData.type_support__id?.length ? '' : `&type_support__in=${supportData.type_support__id.join(',')}`) +
            (!supportData.search ? '' : `&search=${supportData.search}`)
        );
        return response.data
    },

    async createSupport(createSupportDate: TCreateSupport) {
        const response = await instance.post<any>('/support/', createSupportDate);
        return response.data
    },

    async getSuppStatus(page: string) {
        const response = await instance.get<TResponseWithResults<TSuppStatusResults>>(
            '/support/supportstatus/' + (page ? `?page=${page}` : '')
        );
        return response.data
    },

    async getSuppTypes(page: string) {
        const response = await instance.get<TResponseWithResults<TSuppTypeResults>>(
            '/support/supporttype/' + (page ? `?page=${page}` : '')
        );
        return response.data
    },

    async deleteSupport(suppId: string) {
        const response = await instance.delete<TResponse>(`/support/${suppId}/`);
        return response
    },

}