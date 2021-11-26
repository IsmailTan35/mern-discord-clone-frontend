import { Switch, Route } from 'react-router-dom'
import Login from 'layouts/login';
function App() {
  return (
    <>
     <Switch>
       <Route exact path="/login" component={Login}/>
     </Switch>
    </> 
  );
}

export default App;
