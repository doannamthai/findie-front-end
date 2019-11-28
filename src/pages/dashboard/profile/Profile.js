import React from "react";
// react plugin for creating charts
//import ChartistGraph from "react-chartist";
// @material-ui/core
import { withStyles } from "@material-ui/core/styles";
// core components
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import { HOST, PROFILE } from '../../../api/Api';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import { green } from '@material-ui/core/colors';
import Authentication from "../../../utils/Authentication";
import moment from 'moment';
import MySnackbarContentWrapper from '../../../components/Snackbar';
import { Snackbar } from "@material-ui/core";
          

const styles = theme => ({
    root: {
        height: '100vh',
    },
    paper: {
        margin: theme.spacing(20, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
    details: {
    display: 'flex'
  },
  avatar: {
    marginLeft: 'auto',
    flexShrink: 0,
    flexGrow: 0,
    width: 100,
    height: 100,
  },
  progress: {
    marginTop: theme.spacing(2)
  },
  uploadButton: {
    marginRight: theme.spacing(2)
  },
   margin: {
    margin: theme.spacing(1),
  },
});


class Profile extends React.Component {
    state = {
        loading: false,
        initialData: {},
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        repeated_password: '',
        error: null,
        open: false,
        
    }


    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({open: false});
    };
    fetchProfile = () => {
        return fetch(HOST + PROFILE + `?user_id=${Authentication.getUserId()}`)
        .then(res => res.json() )
        .then(
            res => {
                if (res.result){
                    this.setState({initialData: res.result, 
                    first_name: res.result.first_name, 
                    last_name: res.result.last_name,
                    email: res.result.email,
                    password: '',
                    });
                }
            }
        )
    }
    componentDidMount(){
       this.fetchProfile();
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleSubmit = () => {
        console.log("Clicked");
        this.setState({error: null});
        const {initialData, first_name, last_name, email, password, repeated_password} = this.state;
        if (first_name.length === 0 || last_name.length === 0 || email.length === 0){
            this.setState({ error: 'Required field(s) cannot be empty'});
            return;
        } else if (password.length > 0 && repeated_password.length === 0){
             this.setState({ error: 'Please repeat your password'});
            return;
        }
        this.setState({loading: true});
        let final = {
            id: initialData.id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password.trim().length === 0 ? initialData.password : password,
        };

        return fetch(HOST + PROFILE, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify(final)
        })
        .then(res => res.json())
        .then(
            res => {
                if (res.result){
                    this.setState({loading: false, open: true}, () => this.fetchProfile())
                }
            },
            err => {
                this.setState({loading: false})
            }
        )

    }

    render() {
        const { classes} = this.props;
        const values = this.state;
        const {initialData} = this.state;
        return (
            <React.Fragment>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.open}
                    autoHideDuration={6000}
                    onClose={this.handleClose}
                >
                    <MySnackbarContentWrapper
                        variant="success"
                        className={classes.margin}
                        message="You have updated your profile successfully!"
                    />
                </Snackbar>
                
                <Grid
                    container
                    spacing={4}
                >
                    <Grid item lg={4} md={6} xl={4} xs={12}>
                        <Card>
                            <CardContent>
                                <div className={classes.details}>
                                    <div>
                                        <Typography
                                            gutterBottom
                                            variant="h5">
                                            {initialData.first_name} {initialData.last_name}
                                        </Typography>
                                        <Typography
                                            className={classes.locationText}
                                            color="textSecondary"
                                            variant="body1"
                                        >
                                            Calgary, Canada
                                        </Typography>
                                        <Typography
                                            className={classes.dateText}
                                            color="textSecondary"
                                            variant="body1"
                                        >
                                            {moment().format('hh:mm A')} ({'GTM-7'})
                                    </Typography>
                                    </div>
                                    <Avatar
                                        className={classes.avatar}
                                        src="https://i.ibb.co/1bGhSwW/avatar.jpg"        
                                    />
                                </div>
                              
                            </CardContent>
                            <Divider />
                           
                        </Card>
                    </Grid>
                    <Grid
                        item
                        lg={8}
                        md={6}
                        xl={8}
                        xs={12}
                    >
                        <Card>
                            <form
                                autoComplete="off"
                                noValidate
                            >
                                <CardHeader
                                    subheader="The information can be edited"
                                    title="Profile"
                                />
                                <Divider />
                                <CardContent>
                                    <Grid
                                        container
                                        spacing={3}
                                    >
                                        <Grid item md={6} xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="First name"
                                                margin="dense"
                                                name="first_name"
                                                onChange={this.handleChange}
                                                required
                                                value={values.first_name}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={6}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Last name"
                                                margin="dense"
                                                name="last_name"
                                                onChange={this.handleChange}
                                                required
                                                value={values.last_name}
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={6}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Email Address"
                                                margin="dense"
                                                name="email"
                                                onChange={this.handleChange}
                                                required
                                                value={values.email}
                                                variant="outlined"
                                            />
                                        </Grid>

                                    </Grid>
                                    <Divider style={{ marginTop: 10, marginBottom: 10 }} />
                                    <Grid
                                        container
                                        spacing={3}
                                    >
                                        <Grid
                                            item
                                            md={6}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Password"
                                                margin="dense"
                                                name="password"
                                                onChange={this.handleChange}
                                                type="password"
                                                variant="outlined"
                                                value={values.password}
                                            />
                                        </Grid>
                                        <Grid
                                            item
                                            md={6}
                                            xs={12}
                                        >
                                            <TextField
                                                fullWidth
                                                label="Repeat password"
                                                margin="dense"
                                                name="repeated_password"
                                                onChange={this.handleChange}
                                                type="password"
                                                variant="outlined"
                                                value={values.repeated_password}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Typography style={{color: 'red', fontSize: 14}}>{this.state.error}</Typography>
                                </CardContent>
                                <Divider />
                                <CardActions>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        onClick={this.handleSubmit}
                                        disabled={this.state.loading}
                                    >
                                        Save details
                                </Button>   
                                {this.state.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                                </CardActions>
                            </form>
                        </Card>
                    </Grid>
                </Grid>

            </React.Fragment >
        );
    }
}

export default withStyles(styles)(Profile);