import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import AppContextProvider from '@crema/context/AppContextProvider';
import AppThemeProvider from '@crema/context/AppThemeProvider';
import AppStyleProvider from '@crema/context/AppStyleProvider';
import AppLocaleProvider from '@crema/context/AppLocaleProvider';
import InfoViewContextProvider from '@crema/context/AppContextProvider/InfoViewContextProvider';
import AppAuthProvider from '@crema/core/AppAuthProvider';
import AuthRoutes from '@crema/components/AuthRoutes';
import AppLayout from '@crema/core/AppLayout';
import store from './@crema/redux/store';
import { Provider } from 'react-redux';
import '@crema/mockapi';
import './styles/index.css';

function App() {

  return (
    <>
        <AppContextProvider>
            <Provider store={store}>
            <AppThemeProvider>
                <AppStyleProvider>
                    <AppLocaleProvider>
                        <BrowserRouter>
                            <InfoViewContextProvider>
                                <AppAuthProvider>
                                    <AuthRoutes>
                                        <CssBaseline />
                                        <AppLayout />
                                    </AuthRoutes>
                                </AppAuthProvider>
                            </InfoViewContextProvider>
                        </BrowserRouter>
                    </AppLocaleProvider>
                </AppStyleProvider>
            </AppThemeProvider>
           </Provider>    
        </AppContextProvider>
    </>
  )
}

export default App
