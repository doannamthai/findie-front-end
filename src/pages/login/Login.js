import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Navbar from '../../components/Navbar';
import {HOST, LOGIN} from '../../api/Api';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Authentication from '../../utils/Authentication';

const styles = theme => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(https://source.unsplash.com/random)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: theme.palette.grey[50],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(20, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  alert: {
    ...theme.typography.button,
    backgroundColor: "#e53935",
    padding: theme.spacing(1),
    borderRadius: 10,
    color: "white"
  },
 
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
});

class Login extends Component {

    state = {
        username: '',
        password: '',
        err: null,
        loading: false,
    }
    handleOnChange = e => {
        this.setState({[e.target.name]: e.target.value});
    }
    onSubmitForm = (e) => {
        e.preventDefault();
        const {username, password} = this.state;
        if (username.length === 0 || password.length === 0){
             this.setState({err: "Username and password must not be empty"});
             return;
        }
        this.setState({err: null,  loading: true});
        fetch(HOST + LOGIN + `?username=${username}&password=${password}`, {method: 'post'})
                .then(res => res.json())
                .then(
                    res => {
                        if (res.error){
                            this.setState({err: res.error, loading: false});
                        } else {
                            Authentication.setAccessToken(res.result.id, res.result.username)
                            window.location.href = "/";
                        }
                    },
                    err => {
                        this.setState({loading: false})
                    }
                )
    }
    render(){
        const {classes} = this.props;
        return (
     
    <Grid container component="main" className={classes.root}>
         <Navbar/>
      <CssBaseline />
      <Grid item xs={false} sm={4} md={7} className={classes.image} />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={this.handleOnChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.handleOnChange}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            {this.state.err ? <div className={classes.alert}>{this.state.err}</div> : null}
            <div className={classes.wrapper}>
        <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={this.state.loading}
              className={classes.submit}
              onClick = {this.onSubmitForm}
            >
          Sign In
        </Button>
        {this.state.loading ? <CircularProgress size={24} className={classes.buttonProgress} /> : null}
      </div>
            <Grid container>
              <Grid item>
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
            
          </form>
        </div>
      </Grid>
    </Grid>
  );
    }
}


export default withStyles(styles)(Login)