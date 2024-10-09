import { TCard, TResponseArticlemetaData } from "./cards.types"
import { TUser } from "./user.types"

export type TRequestOffersData = {
    card_id: string
    status_executor__id: string
    status_customer__id: string
    perfomer_id: string
    search: string
    page: number
    is_evidence: boolean | null
}

export type TOfferStatus = {
    id: string
    code: number
    name: string
    description: string
}

export type TEvidence = {
    id: string
    article: TResponseArticlemetaData
}

export type TOffer = {
    id: string
    card: TCard
    status_executor: TOfferStatus
    status_customer: TOfferStatus
    perfomer: TUser
    deadline_at: Date
    evidence: TEvidence
    barter_is: boolean
    barter: TCard
    achievement: string
    created_at: Date
    offer_number: number
}

export type TCreateOffer = {
    card: string
    status_executor: string
    perfomer: string
    barter_is: boolean
    barter?: string | null
}

export type TProofCitation = {
    status_customer: string
    deadline_at: Date
    evidence: {
        file: File
        title: string
        journal_name: string
    }
}
export type TProofPublication = {
    status_customer: string
    evidence: {
        file_publication: File
    }
}

export type TChangeStatusOffer = {
    status_executor?: string
    status_customer?: string
}

export type TAccessBarter = {
    barter_is: boolean
}

export type TServerUpdateOffer = {
    status_executor?: string
    status_customer?: string
    perfomer?: string
    deadline_at?: Date
    evidence?: string
    barter_is?: boolean
}

export type TRequestOffersStatus = {
    code: string
    name: string
    search: string
    page: number
}
