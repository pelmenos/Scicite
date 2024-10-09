import { FC } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import MainPage from './Main/Main';
import ProfilePage from './Profile/Profile';
import SearchPage from './Search/Search';
import ResponsesPage from './Responses/Responses';
import MyCardsPage from './MyCards/MyCards';
import HowUsePage from './HowUse/HowUse';
import AdminKitPage from './AdminKit/MainAdminKit';
import { useSelector } from "react-redux";
import { getIsAuth } from "store/auth/authSelector";

export const Routing: FC<{ setFooterVisible: (toggle: boolean) => void }> = ({ setFooterVisible }) => {
    const isAuth = useSelector(getIsAuth)

    return (
        <Routes>
            <Route path={'/'} element={<Navigate to={'/main'} />} />

            <Route path={'/main'} element={<MainPage setFooterVisible={setFooterVisible} />} />
            <Route path={'/profile'} element={isAuth ?
                <ProfilePage setFooterVisible={setFooterVisible} /> :
                <MainPage setFooterVisible={setFooterVisible} />
            } />
            <Route path={'/search'} element={isAuth ?
                <SearchPage setFooterVisible={setFooterVisible} /> :
                <MainPage setFooterVisible={setFooterVisible} />
            } />
            <Route path={'/responses'} element={isAuth ?
                <ResponsesPage setFooterVisible={setFooterVisible} /> :
                <MainPage setFooterVisible={setFooterVisible} />
            } />
            <Route path={'/mycards'} element={isAuth ?
                <MyCardsPage setFooterVisible={setFooterVisible} /> :
                <MainPage setFooterVisible={setFooterVisible} />
            } />
            <Route path={'/howuse'} element={<HowUsePage setFooterVisible={setFooterVisible} />} />
            <Route path={'/adminkit'} element={isAuth ?
                <AdminKitPage setFooterVisible={setFooterVisible} /> :
                <MainPage setFooterVisible={setFooterVisible} />
            } />
        </Routes>
    );
};