import { Switch, Route } from 'react-router-dom'
import Main from 'layouts/Main';
import SocketController from 'controller/SocketController';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <>
     
       <SocketController/>
       <Main/>
    
    </> 
  );
}

export default App;
