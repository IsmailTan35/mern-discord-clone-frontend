import Panel from 'layouts/Panel';

import {SocketContext, client} from 'controller/Context';

import 'bootstrap/dist/css/bootstrap.min.css';
import SocketController from 'controller/SocketController';
const App = () => {

  return (
    <>
     <SocketContext.Provider value={client}>
       <SocketController/>
        <Panel/>
      </SocketContext.Provider>
    </> 
  );
}

export default App;
