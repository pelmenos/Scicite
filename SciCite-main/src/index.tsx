import ReactDOM from 'react-dom/client';
import App from 'app/App';
import { Provider } from 'react-redux';
import { store } from 'store/store';

import './i18n'
import { CookiesProvider } from 'react-cookie';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={store}>
    <CookiesProvider defaultSetOptions={{path: "/"}}>
      <App />
    </CookiesProvider>
  </Provider>
);

