export type TUser = {
    id: string
    level: TLevel
    balance: number
    login: string
    roles: TRoules
    number_phone: string
    email: string
    full_name: string
    created_at: string
    updated_at: string
    is_staff: boolean
}

export type TUpdateUser = {
    login: string
    number_phone: string
    email: string
    full_name: string
}

export type TLevel = {
    id: string
    name: string
    limit: number
    count_offers: number
}

export type TProgress = {
    count_publication: number
    next_level: TLevel | null
}

export type TAchivement = {
    id: string
    achievement: string
}

export type TRoules = {
    id: string
    name: string
    description: string
}

export type TStatistic = {
    card_create: number
    citations_formatted: number
    citations_received: number
    exchanges_completed: number
    scicoins_earned: number
    scicoins_spent: number
    successful_citations: string
}

export type TNotification = {
    link: string
    message: string
}