import React, { Component } from "react";
import { withStyles } from '@material-ui/styles';
import Tooltip from '@material-ui/core/Tooltip';
import { green } from '@material-ui/core/colors';
import {
    Card,
    CardActions,
    CardContent,
    Avatar,
    Typography,
    Divider,
    Button,
    Grid,
} from '@material-ui/core';
import Authentication from "../utils/Authentication";
import { HOST, JOB_APPLY } from "../api/Api";
import MySnackbarContentWrapper from './Snackbar';
import { Snackbar } from "@material-ui/core";
import LinearProgress from '@material-ui/core/LinearProgress';
import CheckCircleRoundedIcon from '@material-ui/icons/CheckCircleRounded';
const styles = theme => ({
    root: {},
    cardContent: {
        padding: 0,
        "&:last-child": {
            paddingBottom: 0
        },
        border: 0,
    },
    details: {
        display: 'flex',
        backgroundColor: '#512da8',
        height: 150,
    },
    avatar: {
        marginRight: 10,
        height: 100,
        width: 100,
        flexShrink: 0,
        flexGrow: 0
    },
    description: {
        marginRight: 30,
    },
    basicInfo: {
        //flexShrink: 1,
        //flexGrow: 0,
        width: 900,
    },
    uploadButton: {
        marginRight: 2,
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
});

class JobDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            open: false,
            job_position: this.props.job_position,
            applied: false,
            initialized: false,
        }
    }

    init = () => {
        this.setState({initialized: false})
        const { job_position } = this.state;
        return fetch(HOST + JOB_APPLY + `?user_id=${Authentication.getUserId()}&position_id=${job_position.id}`)
        .then(res => res.json())
            .then(
                res => {
                    if (res.result) {
                        this.setState({ applied: new Boolean(res.result) });
                    }
                    this.setState({ initialized: true });
                },
                err => {
                    this.setState({ initialized: true });
                }
            )
    }

    componentDidMount(){
        this.init();
    }

    onApply = () => {
        console.log("Clicked");
        const { job_position } = this.state;
        this.setState({ loading: true });
        return fetch(HOST + JOB_APPLY + `?user_id=${Authentication.getUserId()}&position_id=${job_position.id}`,{
            method: 'post',
        })
            .then(res => res.json())
            .then(
                res => {
                    console.log(res)
                    this.setState({ loading: false });
                    if (res.result) {
                        this.setState({ open: true });
                        this.init();
                    }
                },
                err => {
                    console.log(err);
                    this.setState({ loading: false });
                }
            )
    }

    renderAction() {
        const {classes} = this.props;
        const loggedIn = Authentication.isLoggedIn();
        const applied = this.state.applied;
        if (loggedIn){
            if (applied) 
                return (
                    <Grid container spacing={1}>
                            <Grid item ><CheckCircleRoundedIcon color="primary"/></Grid>
                            <Grid item ><Typography>You already applied for this role</Typography></Grid>
                    </Grid>
                )
            return (
                <Button
                    className={classes.uploadButton}
                    color="secondary"
                    variant="contained"
                    disabled={this.state.loading}
                    onClick={() => this.onApply()}>
                    Apply
                </Button>
            )
        } 
        return (
            <Tooltip title="You must login to start appling" aria-label="add">
                <Button
                    className={classes.uploadButton}
                    color="secondary"
                    variant="contained"
                    disabled={true}
                >
                    Apply
                </Button>
            </Tooltip>
        )
        
    }

    handleClose = () => {
        this.setState({open: false})
    }

    render() {
        //const job_position = {};
        const { classes } = this.props;
        const { job_position, initialized} = this.state;
        
        return (
            <Card><Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={this.state.open}
                autoHideDuration={2000}
                onClose={this.handleClose}
            >
                <MySnackbarContentWrapper
                    variant="success"
                    className={classes.margin}
                    message="You have applied your this role successfully!"
                />
            </Snackbar>
                <CardContent className={classes.cardContent}>
                    <div className={classes.details}>
                        <CardContent style={{ display: "flex", padding: 30 }}>
                            <Avatar
                                className={classes.avatar}
                                src={job_position.image_url}
                            />
                            <div style={{ color: "white" }}>
                                <Typography
                                    gutterBottom
                                    variant="h4"
                                >
                                    {job_position.position_name}
                                </Typography>
                                <Typography
                                    className={classes.locationText}
                                    variant="body1"
                                >
                                    {job_position.company_name}
                                </Typography>
                                <Typography
                                    className={classes.locationText}
                                    variant="body1"
                                >
                                    {job_position.location}
                                </Typography>
                            </div>
                        </CardContent>
                    </div>
                </CardContent>
                <Divider />
                <CardContent className={classes.cardContent} style={{ display: "flex", padding: 30 }}>
                    <div className={classes.description}>
                        <Typography variant="body1" style={{ fontWeight: "bold", textDecoration: "underline" }} gutterBottom>
                            Description
              </Typography>
                        <Typography variant="body1" gutterBottom>
                            {job_position.description}
                        </Typography>
                    </div>
                    <div className={classes.basicInfo}>
                        <Typography variant="body1" style={{ fontWeight: "bold", textDecoration: "underline" }} gutterBottom>
                            Basic information
              </Typography>
                        <Typography variant="body1" style={{ fontWeight: "bold", }} gutterBottom>
                            Applicants: {job_position.application}
                        </Typography>
                        <Typography variant="body1" style={{ fontWeight: "bold", }} gutterBottom>
                            Posted time: {job_position.posted_time}
                        </Typography>
                        <Typography variant="body1" style={{ fontWeight: "bold", }} gutterBottom>
                            Deadline: {job_position.deadline}
                        </Typography>
                        <Typography variant="body1" style={{ fontWeight: "bold", }} gutterBottom>
                            Position type: {job_position.type_name}
                        </Typography>
                    </div>
                </CardContent>
                <CardActions>
                    {initialized ? this.renderAction() : null}
                </CardActions>
                {!initialized ? 
                 <LinearProgress variant="query" color="secondary" /> : null}
            </Card>
        )
    }
}

export default withStyles(styles)(JobDetail)