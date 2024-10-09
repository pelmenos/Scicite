import {
  TCreateTransaction,
  THelp,
  TRequestUsersData,
  TSettings,
  TTransaction,
  TUsers,
} from "types/admin.types";
import { TResponse, TResponseWithResults, instance } from "./api";
import { TLevel } from "types/user.types";

export const adminAPI = {
  async getUsers(requestUsersData: TRequestUsersData) {
    const response = await instance.get<TResponseWithResults<TUsers>>(
      `/profiles/users/admin/?limit=40` +
        (requestUsersData.page <= 1
          ? ""
          : `&offset=${(requestUsersData.page - 1) * 40}`) +
        (requestUsersData.filter_login === ""
          ? ""
          : `&filter_login=${requestUsersData.filter_login}`)
    );
    return response.data;
  },

  async getHelp(requestHelpData: TRequestUsersData) {
    const response = await instance.get<TResponseWithResults<THelp>>(
      `/support/admin/help/?page=${requestHelpData.page}` +
        (requestHelpData.filter_login === ""
          ? ""
          : `&filter_login=${requestHelpData.filter_login}`)
    );
    return response.data;
  },

  async getTransaction(requestTransactionData: TRequestUsersData) {
    const response = await instance.get<TResponseWithResults<TTransaction>>(
      `/profiles/transactions/?page=${requestTransactionData.page}` +
        (requestTransactionData.filter_login === ""
          ? ""
          : `&filter_login=${requestTransactionData.filter_login}`)
    );
    return response.data;
  },

  async createTransaction(createTransactionData: TCreateTransaction) {
    const response = await instance.post<TResponse<TTransaction>>(
      "/profiles/transactions/",
      createTransactionData
    );
    return response.data;
  },

  async deleteTransaction(transactionId: string) {
    const response = await instance.delete<TResponse>(
      `/profiles/transactions/${transactionId}/`
    );
    return response;
  },

  async requestSettings() {
    const response = await instance.get<TResponse<TSettings>>(
      "/profiles/settings/"
    );
    return response.data;
  },

  async updateSettings(settings: TSettings) {
    const response = await instance.put<TResponse<TSettings>>(
      "/profiles/settings/",
      settings
    );
    return response.data;
  },

  async requestLevels() {
    const response = await instance.get<TResponseWithResults<TLevel>>(
      "/profiles/levels/"
    );
    return response.data;
  },

  async updateLevel(level: TLevel) {
    const response = await instance.put<TResponse<TLevel>>(
      `/profiles/levels/${level.id}/`,
      { limit: level.limit, count_offers: level.count_offers }
    );
    return response.data;
  },
};
