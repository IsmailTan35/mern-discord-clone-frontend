import Panel from 'layouts/Panel';

import SocketController from 'controller/SocketController';
import { Switch, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
const App = () => {
  return (
    <>
     
       {/* <SocketController/> */}
       <Switch>
          <Route exact path="/" component={Panel}/>
      </Switch>
    
    </> 
  );
}

export default App;
