import { withProviders } from "./providers";
import { useEffect, useState } from 'react';
import './App.scss';
import { Header } from '../features/Header/Header';
import { Footer } from '../features/Footer/Footer';
import { Routing } from "pages/pages";
import { AppDispatch } from "store/store";
import { useDispatch } from "react-redux";
import { checkAuth } from "store/auth/authSlice";

function App() {  
  const dispatch: AppDispatch = useDispatch()
  const [footerVisible, setFooterVisible] = useState(true)

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(checkAuth())
    }
  }, [])

  return (
    <>
      <Header />
      <Routing setFooterVisible={setFooterVisible} />
      {
        footerVisible ?
          <Footer /> :
          ''
      }
    </>
  );
}

export default withProviders(App);
