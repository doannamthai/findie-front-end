import React from 'react';
import { withStyles } from '@material-ui/styles';
import Authentication from '../../../utils/Authentication';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import {
    Card,
    CardActions,
    CardContent,
    Avatar,
    IconButton,
    Button,
    Grid,
    TextField,
    Divider,
    CardHeader,
    MenuItem
} from '@material-ui/core';
import {HOST, POSITION_TYPE, COMPANY, POSITION_SUBMIT} from '../../../api/Api';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';

const styles = theme => ({
    root: {},
    content: {
        padding: 0
    },
    inner: {
        minWidth: 1050
    },
    nameContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    avatar: {
        marginRight: 2,
    },
    actions: {
        justifyContent: 'flex-end'
    },
    deleteButton: {
        marginBottom: 20,
        position: 'relative',
    },
    addButton: {
        marginBottom: 20,
    },
    wrapper: {
        margin: 10,
        position: 'relative',
    },

    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
    menu: {
        width: 200,
    },
});

class RoleAdd extends React.Component {
    state = {
        name: '',
        description: '',
        position_type: 0,
        posted_time: moment(new Date()).utc(false).format('YYYY-MM-DD').toString(),
        deadline: moment(new Date()).utc(false).format('YYYY-MM-DD').toString(),
        location: '',
        company_id: 0,
        position_type_list: [],
        companies: [],
        loading: false,
    }
    componentDidMount() {
        Promise.all([
            fetch(HOST + COMPANY + `?user_id=${Authentication.getUserId()}`),
            fetch(HOST + POSITION_TYPE),
        ])
            .then(([companies, types]) => Promise.all([companies.json(), types.json()]))
            .then(([companies, types]) => {
                this.setState({
                    companies: !companies.error ? companies.result : [],
                    position_type_list: !types.error ? types.result : [],
                });
            }).catch((err) => {
                console.log(err);
            });

    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleChangePostTime = (date) => this.setState({ posted_time: moment(date).utc(false).format('YYYY-MM-DD').toString() });
    handleChangeDeadline = (date) => this.setState({ deadline: moment(date).utc(false).format('YYYY-MM-DD').toString() });

    handleSubmit = () =>{
        this.setState({loading: true});
        const js = {
            name: this.state.name,
            description: this.state.description,
            position_type: this.state.position_type,
            posted_time: this.state.posted_time,
            deadline: this.state.deadline,
            location: this.state.location,
            company_id: this.state.company_id,
            user_created: Authentication.getUserId(),
        }
        return fetch(HOST + POSITION_SUBMIT,{
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(js)
        })
        .then(res => res.json())
        .then(
            res => {
                this.setState({loading: false})
                if (res.result){

                    this.props.refresh();
                }
            }, 
            err => {
                this.setState({loading: false})
            }
        )
    }

    render() {
        const { classes } = this.props;
        const { name, description, deadline, position_type,
            posted_time, location, company_id, position_type_list, companies } = this.state;
        return (
            <Card>
                <form
                    autoComplete="off"
                    noValidate
                >
                    <CardHeader
                        subheader="Add a new submission to your portfolio"
                        title="Role detail"
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
                                    label="Company"
                                    margin="dense"
                                    name="company_id"
                                    onChange={this.handleChange}
                                    required
                                    select
                                    value={company_id}
                                    variant="outlined"
                                    SelectProps={{
                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}
                                >
                                    {companies.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            <Grid container spacing={1}>
                                                <Grid item xs={1}><Avatar style={{ width: 20, height: 20 }} src={option.image_url} /></Grid>
                                                <Grid item md={6}>{option.name}</Grid>
                                            </Grid>
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item md={6} xs={12}
                            >
                                <TextField
                                    fullWidth
                                    label="Location"
                                    margin="dense"
                                    name="location"
                                    onChange={this.handleChange}
                                    required
                                    value={location}
                                    variant="outlined"

                                >

                                </TextField>
                            </Grid>
                            <Grid item md={6} xs={12}
                            >

                                <TextField
                                    fullWidth
                                    label="Role name"
                                    margin="dense"
                                    name="name"
                                    onChange={this.handleChange}
                                    required
                                    value={name}
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
                                    label="Role type"
                                    margin="dense"
                                    name="position_type"
                                    onChange={this.handleChange}
                                    required
                                    select
                                    value={position_type}
                                    variant="outlined"
                                    SelectProps={{
                                        MenuProps: {
                                            className: classes.menu,
                                        },
                                    }}
                                    helperText="Please select your role type"
                                >
                                    {position_type_list.map(option => (
                                        <MenuItem key={option.id} value={option.id}>
                                            {option.type_name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <TextField
                                fullWidth
                                label="Description"
                                margin="dense"
                                name="description"
                                onChange={this.handleChange}
                                multiline={true}
                                rows={4}
                                rowsMax={10}
                                variant="outlined"
                                value={description}
                            />
                        </Grid>
                        <div style={{ marginBottom: 30 }} />
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                                item
                                md={6}
                                xs={12}
                            >
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        fullWidth
                                        autoOk
                                        required
                                        variant="inline"
                                        inputVariant="outlined"
                                        label="Post time"
                                        format="yyyy-MM-dd"
                                        value={posted_time}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={this.handleChangePostTime}
                                    />

                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid
                                item
                                md={6}
                                xs={12}
                            >
                                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                    <KeyboardDatePicker
                                        fullWidth
                                        autoOk
                                        required
                                        variant="inline"
                                        inputVariant="outlined"
                                        label="Deadline"
                                        format="yyyy-MM-dd"
                                        value={deadline}
                                        InputAdornmentProps={{ position: "start" }}
                                        onChange={this.handleChangeDeadline}
                                    />

                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <CardActions>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={this.handleSubmit}
                            disabled={this.state.loading}
                        >
                            Submit
                                </Button>
                        {this.state.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </CardActions>
                </form>
            </Card>
        )
    }
}

export default withStyles(styles)(RoleAdd)