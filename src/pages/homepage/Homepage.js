import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { fade, withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Navbar from '../../components/Navbar';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Footer from '../../components/Footer';
import {HOST, JOB_LISTING} from '../../api/Api';
import CircularProgress from '@material-ui/core/CircularProgress';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import ApartmentIcon from '@material-ui/icons/Apartment';
import PeopleIcon from '@material-ui/icons/People';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import JobDetail from '../../components/JobDetail';

const styles = theme => ({
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        background: 'linear-gradient(#0277bd, #29b6f6)',
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        padding: theme.spacing(8, 0, 6),
    },
    heroButtons: {
        marginTop: theme.spacing(4),
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    cardMedia: {
        width: 100,
        height: 100,
        margin: 'auto',
        marginTop: 10,
      
    },
    cardContent: {
        flexGrow: 1,
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.85),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.95),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 120,
      '&:focus': {
        width: 200,
      },
    },
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);



class Homepage extends Component {

    state = {
        limit: 10,
        loading: true,
        data: [],
        job: null,
    }

    handleClickOpen = (job) => {
        this.setState({job: job});
    };
    handleClose = () => {
        this.setState({job: null})
    };

    jobDialog = () => {
        if (!this.state.job) return;
        return (
     <Dialog maxWidth="lg" onClose={this.handleClose} aria-labelledby="customized-dialog-title" open={true}>
        <DialogTitle id="customized-dialog-title" onClose={this.componentDidCatchhandleClose}>
          Position information
        </DialogTitle>
        <DialogContent dividers>
            <JobDetail job_position={this.state.job}/>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={this.handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
        )
    }

    fetchData = (callback) => {
        return fetch(HOST + JOB_LISTING + `?limit=${this.state.limit}`)
        .then(res => res.json())
        .then(
            (res) => {
                this.setState({loading: false})
                callback(res);
            },
            (err) => {
                this.setState({ loading: false})
            }
        )
    }

    componentDidMount(){
        this.fetchData((res) => {
            if (res.result){
                this.setState({data: res.result})
            }
        })
    }

    render() {
        const { classes } = this.props;
        const {data, loading} = this.state;
        return (
            <React.Fragment>
                <CssBaseline />

                <Navbar />
                <main >
                    {this.jobDialog()}
                    {/* Hero unit */}
                    <div className={classes.heroContent}>
                        <Container maxWidth="sm">
                            <Typography component="h1" variant="h2" align="center" style={{ color: "white" }} gutterBottom>
                                Find Jobs Near You
                            </Typography>
                            <div className={classes.search}>
                                <div className={classes.searchIcon}>
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                            <div className={classes.heroButtons}>
                                <Grid container spacing={2} justify="center">
                                    <Grid item>
                                        <Button variant="contained" color="default">
                                            Search job
                                         </Button>
                                    </Grid>
                                    
                                </Grid>
                            </div>
                        </Container>
                    </div>
                    
                    <Container className={classes.cardGrid} maxWidth="md">
                        {/* End hero unit */}
                        {loading ? <CircularProgress/> :
                        <Grid container spacing={4}>
                            {data.map(d => (
                                <Grid item key={d.id} xs={12} sm={6} md={4}>
                                    <Card className={classes.card}>
                                        <CardMedia
                                            className={classes.cardMedia}
                                            image={d.image_url}
                                        />
                                        <CardContent className={classes.cardContent}>
                                            
                                            <Typography gutterBottom style={{fontWeight: "bold", fontSize: 16}}>
                                                {d.position_name}
                                            </Typography>
                                            <Grid container direction="row" alignItems="center" style={{fontSize: 14, color: "#636363"}}>
                                                <Grid item>
                                                    <ApartmentIcon style={{marginRight: 5}} fontSize="small"/>
                                                </Grid>
                                            <Grid item>
                                                 {d.company_name}
                                            </Grid>
                                            </Grid>
                                            <Grid container direction="row" alignItems="center" style={{fontSize: 14, color: "#636363"}}>
                                                <Grid item>
                                                    <LocationOnIcon style={{marginRight: 5}} fontSize="small"/>
                                                </Grid>
                                            <Grid item>
                                                 {d.location}
                                            </Grid>
                                            </Grid>
                                            <Grid container direction="row" alignItems="center" style={{fontSize: 14, color: "#636363"}}>
                                                <Grid item>
                                                    <PeopleIcon style={{marginRight: 5}} fontSize="small"/>
                                                </Grid>
                                            <Grid item>
                                                 {d.application}
                                            </Grid>
                                            </Grid>                                          
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" color="primary" onClick={() => this.handleClickOpen(d)}>
                                                View & Apply
                                            </Button>
                                            
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        }
                        
                    </Container>
                     
                </main>
                {/* Footer */}
               <Footer/>
                {/* End footer */}
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(Homepage);