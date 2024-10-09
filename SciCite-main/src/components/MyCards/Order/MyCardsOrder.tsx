import { FC, useState } from 'react'
import cn from 'classnames'
import style from './MyCardsOrder.module.scss'
import { MyCardsOrderList } from './OrderList/MyCardsOrderList'
import { OffersInfo } from '../CardInfo/OffersInfo'
import { TCard } from 'types/cards.types'
import { useTranslation } from 'react-i18next'

type TProps = {
	cards: TCard[] | null
	isMobile: boolean
	onScroll: (e: React.UIEvent<HTMLDivElement>) => void
}

export type TPublicationDeadline = {
	created: Date | null
	deadline: Date | null
}

export const MyCardsOrder: FC<TProps> = ({ isMobile, cards, onScroll }) => {
	const { t } = useTranslation()
	const [toggleStatus, setToggleStatus] = useState(t("offers_status.citation"))
	const [currentItem, setCurrentItem] = useState<TCard | undefined>(cards ? cards[0] : undefined)
	const [publicationDeadline, setPublicationDeadline] = useState<TPublicationDeadline>({
		created: cards ? new Date(cards[0].created_at) : null,
		deadline: cards ? new Date(new Date(cards[0].created_at)
			.setMonth(new Date(cards[0].created_at)
				.getMonth() + cards[0].tariff.period)) : null
	})

	return (
		<div className={cn('container', style.myCardsOrder)}>
			<MyCardsOrderList
				cards={cards}
				currentCard={currentItem}
				setCurrentCard={setCurrentItem}
				toggleStatus={toggleStatus}
				setToggleStatus={setToggleStatus}
				publicationDeadline={publicationDeadline}
				setPublicationDeadline={setPublicationDeadline}
				onScroll={onScroll}
			/>
			{!isMobile ?
				<OffersInfo
					currentCard={currentItem}
					toggleStatus={toggleStatus}
					setToggleStatus={setToggleStatus}
					publicationDeadline={publicationDeadline}
				/> : ''}
		</div>
	)
}
