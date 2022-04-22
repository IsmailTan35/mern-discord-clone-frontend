import Panel from 'layouts/Panel';

import {SocketContext, client} from 'controller/Context';
import LandingPage from 'layouts/LandingPage';
import Auth from 'layouts/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import SocketController from 'controller/SocketController';
import { Route } from 'react-router-dom/cjs/react-router-dom.min';
import Dashboard from 'views/Dashboard';

const App = () => {

  return (
    <>
      <SocketContext.Provider value={client}>
        <SocketController/>
        <Route exact path="/" component={LandingPage} />
        <Route strict path="/auth" component={Auth} />
        <Route path="/channels/@me" component={Panel} />
        <Route path="/channels/Server" component={Panel} />
        <Route path="/store" component={Panel} />
      </SocketContext.Provider>
    </> 
  );
}

export default App;
