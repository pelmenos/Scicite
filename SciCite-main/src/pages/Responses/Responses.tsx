import { FC, useEffect, useState } from "react";
import style from './Responses.module.scss';
import { BtnsHelp } from "../../shared/ui/BtnsHelp/BtnsHelp";
import { ResponsesEmpty } from "../../components/Responses/Empty/ResponsesEmpty";
import { ResponsesList } from "../../components/Responses/List/ResponsesList";
import { useDispatch, useSelector } from "react-redux";
import { getIsFetching, getOffers, getOffersCount } from "store/offers/offersSelector";
import { requestOffers, resetOffers } from "store/offers/offersSlice";
import { AppDispatch } from "store/store";
import { getUserId } from "store/user/userSelector";


const Responses: FC<{ setFooterVisible: (toggle: boolean) => void }> = ({ setFooterVisible }) => {
    const dispatch: AppDispatch = useDispatch()
    const offers = useSelector(getOffers)
    const userId = useSelector(getUserId)
    const offersCount = useSelector(getOffersCount)
    const isFetching = useSelector(getIsFetching)
    const [currentFilter, setCurrentFilter] = useState<string>('')
    const [toggleCP, setToggleCP] = useState({
        citation: false,
        publition: false
    })

    useEffect(() => {
        setFooterVisible(true)
    }, [setFooterVisible])

    useEffect(() => {
        if (userId) {
            dispatch(resetOffers())
            dispatch(requestOffers({
                page: 1,
                card_id: '',
                perfomer_id: userId,
                search: '',
                status_customer__id: '',
                status_executor__id: currentFilter,
                is_evidence: null
            }))
        }
    }, [dispatch, userId, currentFilter])


    return (
        <main className={style.responses}>
            {
                !offersCount && !currentFilter && !isFetching && (!toggleCP.citation && !toggleCP.publition) ?
                    <ResponsesEmpty /> :
                    <ResponsesList
                        offers={offers}
                        toggleCP={toggleCP}
                        setToggleCP={setToggleCP}
                        currentFilter={currentFilter}
                        setCurrentFilter={setCurrentFilter}
                    />
            }
            <BtnsHelp />
        </main>
    )
}

export default Responses;