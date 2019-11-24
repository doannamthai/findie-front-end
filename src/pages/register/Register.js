import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Navbar from '../../components/Navbar';
import {HOST, REGISTER} from '../../api/Api';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

const styles = theme => ({
  root: {
    height: '100vh',
    overflow: "none",
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
  succ: {
    ...theme.typography.button,
    backgroundColor: "#388e3c",
    padding: theme.spacing(1),
    borderRadius: 10,
    color: "white"
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
});

class Register extends Component {

    state = {
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        email: '',
        err: null,
        suc: null,
        loading: false,
    }

    handleOnChange = e => {
        this.setState({[e.target.name]: e.target.value});
    };

    onSubmitForm = (e) => {
        e.preventDefault();
        this.setState({err: null, suc: null, loading: true});
        const {username, password, email, first_name, last_name} = this.state;
        fetch(HOST + REGISTER + `?username=${username}&password=${password}&email=${email}&first_name=${first_name}&last_name=${last_name}`, {method: 'post'})
                .then(res => res.json())
                .then(
                    res => {
                        if (res.error){
                            this.setState({err: res.error, loading: false, suc: null});
                        } else {
                            this.setState({err: res.error, loading: false, suc: "You have successfully registered the account."});
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
            Sign up
          </Typography>
          <form className={classes.form} >
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
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="first_name"
              label="First name"
              type="text"
              id="first_name"
              onChange={this.handleOnChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="last_name"
              label="Last name"
              type="text"
              id="last_name"
              onChange={this.handleOnChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email address"
              type="email"
              id="email"
              onChange={this.handleOnChange}
            />
            {this.state.err ? <div className={classes.alert}>{this.state.err}</div> : null}
            {this.state.suc ? <div className={classes.succ}>{this.state.suc}</div> : null}
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
          Sign Up
        </Button>
        {this.state.loading ? <CircularProgress size={24} className={classes.buttonProgress} /> : null}
      </div>
            <Grid container>
              <Grid item>
                <Link href="/login" variant="body2">
                  {"Sign in now"}
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


export default withStyles(styles)(Register)