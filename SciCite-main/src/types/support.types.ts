import { TOffer } from "./offers.types"
import { TUser } from "./user.types"

export type TRequestSupport = {
    offer__id?: string
    declarer__id?: string
    reporter__id?: string
    status__id__in?: string[]
    type_support__id?: string[]
    search?: string
    page?: number
}

export type TSupport = {
    id: string
    narrative: string
    response: string
    offer: TOffer
    declarer: TUser
    reporter: TUser
    status: string
    type_support: TSuppTypeResults
    created_at: Date
}

export type TSuppStatusResults = {
    id: string
    code: number
    name: string
    description: string
}

export type TSuppTypeResults = {
    id: string
    name: string
    description: string
}

export type TCreateSupport = {
    narrative: string
    response?: string
    offer?: string
    declarer: string
    reporter?: string
    status: string
    type_support: string
}