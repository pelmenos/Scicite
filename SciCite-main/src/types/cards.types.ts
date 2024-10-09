import { TUser } from "./user.types"

export type TCard = {
    id: string
    cart_number: number
    user: TUser
    base: TCardInfo
    tariff: TTariff
    article: TArticle
    is_exchangable: boolean
    is_active: boolean
    theme: string
    category: TCardInfo[]
    offers_count: string
    created_at: Date
    achievement: string
}

export type TResponseCard = {
    id: string
    user: string
    base: string
    tariff: string
    article: string
    is_exchangable: boolean
    is_active: boolean
    theme: string[]
    category: string[]
}

export type TRequestCards = {
    user: string
    base: string[] | null
    tariff: string[] | null
    article: string
    is_exchangable: boolean | null
    is_active: boolean | null
    theme: string
    category: string[] | null
    ordering: string
    page: number
    search: string
}

export type TServerCardCreate = {
    user: string,
    base: string,
    tariff?: string,
    article: string,
    is_exchangable: boolean,
    is_active: boolean,
    theme: string,
    category: string[],
}

export type TCreateCardFormData = {
    user: string,
    category: string,
    theme: string,
    article: string,
    file?: File,
    doi: string,
    abstract: string,
    citationUrl: string,
    journalName: string,
    authors: string,
    publicationYear: string,
    volume: string,
    pageNumbers: string,
    keywords: string,
    requiredbase: string,
    isExchangable: string,
    tariff: string,
}

export type TRequestTariff = {
    scicoins: string
    period: string
    page: number
}

export type TTariff = {
    id: string
    scicoins: number
    period: number
}

export type TRequestArticlemetaData = {
    doi?: string
    title?: string
    abstract?: string
    citation_url?: string
    journal_name?: string
    authors?: string[]
    publication_year?: number
    volume?: number
    page_numbers?: string
    keywords?: number[]
    file?: File
    file_publication?: File
}

export type TResponseArticlemetaData = {
    id: string
    doi: string
    title: string
    abstract: string
    file: string
    file_publication: string
    citation_url: string
    journal_name: string
    authors: TCardInfo[]
    publication_year: string
    volume: string
    page_numbers: string
    keywords: TCardInfo[]
}

export type TArticle = TResponseArticlemetaData & { id: string }

export type TCardInfo = {
    id: string
    name: string
}