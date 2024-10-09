import { FC, useEffect, useState } from 'react'
import cn from 'classnames'
import style from './MyCards.module.scss'
import styleBtns from 'assets/scss/btns.module.scss'
import { BtnsHelp } from 'shared/ui/BtnsHelp/BtnsHelp'
import { MyCardsEmpty } from 'components/MyCards/Empty/MyCardsEmpty'
import { MyCardsOrder } from 'components/MyCards/Order/MyCardsOrder'
import { MyCardsArchive } from 'components/MyCards/Arhive/MyCardsArchive'
import useWindow from 'shared/CustomHooks'
import { useDispatch, useSelector } from 'react-redux'
import { getIsFetching, getUserCards, getUserCardsCount, getUserCardsCurrentPage, getUserCardsNextPage } from 'store/cards/cardsSelector'
import { resetUserCards, requestUserCards } from 'store/cards/cardsSlice'
import { AppDispatch } from 'store/store'
import { getUserId } from 'store/user/userSelector'
import { useTranslation } from 'react-i18next'

const MyCards: FC<{ setFooterVisible: (toggle: boolean) => void }> = ({
	setFooterVisible,
}) => {
	const {t} = useTranslation()

	const dispatch: AppDispatch = useDispatch()
	const isMobile = useWindow()
	const cards = useSelector(getUserCards)
	const cardsCount = useSelector(getUserCardsCount)
	const currentPage = useSelector(getUserCardsCurrentPage)
	const nextPage = useSelector(getUserCardsNextPage)
	const userId = useSelector(getUserId)
	const [isOrdersView, setIsOrdersView] = useState(true)
	const isFetching = useSelector(getIsFetching)

	useEffect(() => {
		setFooterVisible(true)
	}, [setFooterVisible])

	useEffect(() => {
		const getCards = () => {
			if (userId && isOrdersView) {
				dispatch(resetUserCards())
				dispatch(requestUserCards({
					user: userId,
					base: null,
					tariff: null,
					category: null,
					theme: '',
					is_exchangable: null,
					is_active: true,
					article: '',
					search: '',
					page: 1,
					ordering: '',
				}))
			} else if (userId && !isOrdersView) {
				dispatch(resetUserCards())
				dispatch(requestUserCards({
					user: userId,
					base: null,
					tariff: null,
					category: null,
					theme: '',
					is_exchangable: null,
					is_active: false,
					article: '',
					search: '',
					page: 1,
					ordering: '',
				}))
			}
		}

		getCards()
	}, [userId, isOrdersView, dispatch])

	const scrollHandler = (e: React.UIEvent<HTMLDivElement>) => {
		const containerHeight = e.currentTarget.clientHeight;
		const scrollHeight = e.currentTarget.scrollHeight;

		const scrollTop = e.currentTarget.scrollTop;
		if (scrollHeight - (scrollTop + containerHeight) < 100 && nextPage && !isFetching) {
			dispatch(requestUserCards({
				user: userId,
				base: null,
				tariff: null,
				category: null,
				theme: '',
				is_exchangable: null,
				is_active: isOrdersView,
				article: '',
				search: '',
				page: currentPage + 1,
				ordering: '',
			}))
		}
	}

	return (
		<main className={style.myCards}>
			<div className={cn('container', style.myCards__toogleBlock)}>
				<button
					className={cn(
						'btn-reset',
						style.myCards__btnToogle,
						isMobile ? styleBtns.btnAstral : '',
						isMobile && isOrdersView ? styleBtns.btnAstral_active : ''
					)}
					style={!isMobile && isOrdersView ? { borderBottomWidth: '6px' } : {}}
					onClick={() => setIsOrdersView(true)}
				>
					{t("orders")}
				</button>
				<button
					className={cn(
						'btn-reset',
						style.myCards__btnToogle,
						isMobile ? styleBtns.btnAstral : '',
						isMobile && !isOrdersView ? styleBtns.btnAstral_active : ''
					)}
					style={!isMobile && !isOrdersView ? { borderBottomWidth: '6px' } : {}}
					onClick={() => setIsOrdersView(false)}
				>
					{t("archive")}
				</button>
			</div>
			{isOrdersView ? (
				cardsCount > 0 ? (
					<MyCardsOrder
						cards={isOrdersView ? cards : null}
						isMobile={isMobile}
						onScroll={scrollHandler}
					/>
				) : (
					isFetching ? '' : <MyCardsEmpty />
				)
			) : (
				<MyCardsArchive cards={!isOrdersView ? cards : null} onScroll={scrollHandler}/>
			)}
			<BtnsHelp />
		</main>
	)
}

export default MyCards
