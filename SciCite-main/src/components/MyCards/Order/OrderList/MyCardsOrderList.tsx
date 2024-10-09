import { FC } from 'react'
import style from './MyCardsOrderList.module.scss'
import { MyCardsOrderItem } from 'entities/cards/MyCardsOrderItem/MyCardsOrderItem'
import { TCard } from 'types/cards.types'
import { TPublicationDeadline } from '../MyCardsOrder'
import { useSelector } from 'react-redux'
import { getSettings } from 'store/admin/adminSelector'

type TProps = {
	cards: TCard[] | null
	currentCard: TCard | undefined
	setCurrentCard: (card: TCard | undefined) => void
	toggleStatus: string
	setToggleStatus: (status: string) => void
	publicationDeadline: TPublicationDeadline
	setPublicationDeadline: (obj: TPublicationDeadline) => void
	onScroll: (e: React.UIEvent<HTMLDivElement>) => void
}

export const MyCardsOrderList: FC<TProps> = (
	{
		cards,
		currentCard,
		setCurrentCard,
		toggleStatus,
		setToggleStatus,
		publicationDeadline,
		setPublicationDeadline,
		onScroll
	}
) => {
	const { price_publication } = { ...useSelector(getSettings) }


	const MyCardsItems = cards?.map(card => (
		<MyCardsOrderItem
			key={card.id}
			current={currentCard?.id === card.id}
			setCurrentCard={setCurrentCard}
			card={card}
			toggleStatus={toggleStatus}
			setToggleStatus={setToggleStatus}
			publicationDeadline={publicationDeadline}
			setPublicationDeadline={setPublicationDeadline}
			cardPrice={price_publication}
		/>
	))

	return (
		<div className={style.myCardsOrderList} onScroll={onScroll}>
			{MyCardsItems}
		</div>
	)
}
