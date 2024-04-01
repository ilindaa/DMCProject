import ReactDOM from 'react-dom/client';
import './styles.css';
/*import './index.css';*/
import Router from './Router.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavbarComponent from './navbar.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    /*<React.StrictMode>*/ // Note: Strict mode renders twice (forms, etc.)
    <>
        <NavbarComponent />
        <Router /> 
    </>
  /*</React.StrictMode>,*/
)
