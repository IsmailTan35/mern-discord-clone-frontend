import Main from 'layouts/Main';
import Panel from 'layouts/Panel';

import SocketController from 'controller/SocketController';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Switch, Route } from 'react-router-dom';
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
