import React ,{useEffect, useState}from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux';
import { sessionActions } from 'store';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';

import AuthService from "services/auth.services";
const LoginForm = () => {
    localStorage.removeItem("user")
    const [email, setEmail] = useState("");
    const firstLang=useSelector(state => state.session.lang)
    const [period, setPeriod]=useState(firstLang)
    const [password, setPassword] = useState("");
    const history = useHistory();
    const dispatch = useDispatch();

    dispatch(sessionActions.updateLanguage(period));

    const onSubmitSignin = async (e) => {
        e.preventDefault();
        AuthService.login(email, password).then(
            (user) => {
                dispatch(sessionActions.updateUser(user));
                history.push("/dashboard")
            },
            (error) => {
                toast.error("Kullanıcı adınız veya şifreniz hatalı.");
            }
          );
      };
    return (
    <Grid textAlign='center' style={{ height:window.innerHeight,backgroundImage: "linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)",}} verticalAlign='middle' padded>
        <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='teal' textAlign='center' attached style={{borderRadius:"25px 25px 0 0", userSelect:"none"}}>
            Wooz Tracker
        </Header>
        
            <Segment attached style={{borderRadius:"0 0 25px 25px",height:"300px",alignItems:"center",display:"flex"}}>
            <Form size='large' style={{width:"100%"}}>
            <Form.Input 
                fluid 
                icon='user' 
                iconPosition='left' 
                placeholder='E-mail address' 
                onChange={(e) => {
                    setEmail(e.target.value);
                  }}
            />
            <Form.Input
                fluid
                icon='lock'
                iconPosition='left'
                placeholder='Password'
                type='password'
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
                color='teal' 
                fluid size='large'
                onClick={onSubmitSignin}
            >
                Login
            </Button>
            </Form>
            </Segment>
        
        <Message>
            New to us?
        </Message>
        </Grid.Column>
    </Grid>
)}

export default LoginForm