import React from 'react';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { withStyles } from '@material-ui/styles';
import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TablePagination,
  Chip,
  IconButton,
  Dialog,
  Button,
} from '@material-ui/core';
import {HOST, SUBMISSION_LISTING, SUBMISSION_DELETE} from '../../../api/Api';
import Authentication from '../../../utils/Authentication';
import BorderColorIcon from '@material-ui/icons/BorderColor';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import CloseIcon from '@material-ui/icons/Close';
import ProgressTable from './ProgressTable';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';

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
});

const dialogStyles = theme => ({
  root: {
    margin: 0,
    padding: "20 20 30 20",
  },
  closeButton: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
});


const DialogTitle = withStyles(dialogStyles)(props => {
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
    padding:10
      },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: 5,
  },
}))(MuiDialogActions);



function getChip(progress){
    const progress_type = progress.progress_type, progress_name = progress.name
    if (progress_type === 1) return <Chip style={{backgroundColor: "#424242", color: "white"}} label={progress_name}/>
    else if (progress_type === 2) return <Chip style={{backgroundColor: "#d84315", color: "white"}} label={progress_name}/>
    else if (progress_type === 3) return <Chip style={{backgroundColor: "#4e342e", color: "white"}} label={progress_name}/>
    else if (progress_type === 4) return <Chip style={{backgroundColor: "#c62828", color: "white"}} label={progress_name}/>
    return <Chip style={{backgroundColor: "#2e7d32", color: "white"}} label={progress_name}/>
}

class Submission extends React.Component{

    state = {
        submissions: [],
        curSubmission: null,
        selectedSubmissions: [],
        page: 0,
        rowsPerPage: 10,
        fetchLoading: false,
        modalOpen: false,
    }

    fetchSubmissions = () => {
        this.setState({fetchLoading: true})
        return fetch(HOST + SUBMISSION_LISTING + `?user_id=${Authentication.getUserId()}`)
        .then(res => res.json())
        .then(
            res => {
                console.log(HOST + SUBMISSION_LISTING + `?user_id=${Authentication.getUserId()}`);
                this.setState({fetchLoading: false, submissions: res.result})
            }
        )
    }

    componentDidMount(){
        this.fetchSubmissions();
    }


    handleSelectAll = event => {
        const { submissions } = this.state

        let selectedSubmissions;

        if (event.target.checked) {
        selectedSubmissions = submissions.map(submission => submission.id);
        } else {
        selectedSubmissions = [];
        }
        this.setState({selectedSubmissions})
    };

    handleSelectOne = (event, id) => {
        const {selectedSubmissions} = this.state;
        const selectedIndex = selectedSubmissions.indexOf(id);
        let newSelectedSubmissions = [];

        if (selectedIndex === -1) {
        newSelectedSubmissions = newSelectedSubmissions.concat(selectedSubmissions, id);
        } else if (selectedIndex === 0) {
        newSelectedSubmissions = newSelectedSubmissions.concat(selectedSubmissions.slice(1));
        } else if (selectedIndex === selectedSubmissions.length - 1) {
        newSelectedSubmissions = newSelectedSubmissions.concat(selectedSubmissions.slice(0, -1));
        } else if (selectedIndex > 0) {
        newSelectedSubmissions = newSelectedSubmissions.concat(
            selectedSubmissions.slice(0, selectedIndex),
            selectedSubmissions.slice(selectedIndex + 1)
        );
        }
        this.setState({selectedSubmissions: newSelectedSubmissions});
    };

    handlePageChange = (event, page) => {
        this.setState({page})
    };

    handleRowsPerPageChange = event => {
        this.setState({rowsPerPage: event.target.value})
    };

    handleCloseDialog = () => {
        this.setState({curSubmission: null})
    }

    progressModel(){
        const {classes} = this.props;
        const {curSubmission} = this.state;
        const open = Boolean(curSubmission);
        if (!curSubmission) return;
        return (
            <Dialog maxWidth="md" fullWidth  aria-labelledby="customized-dialog-title" open={open}>
            <DialogTitle id="customized-dialog-title" onClose={this.handleCloseDialog}>
                <div className={classes.nameContainer}>
                        <Avatar className={classes.avatar} src={curSubmission.image_url}/>
                        <Typography style={{fontSize: 16, marginLeft: 10}}>{curSubmission.name}</Typography>
                </div>
            </DialogTitle>
            <DialogContent>
                <ProgressTable progress={curSubmission.progress} reload={this.fetchSubmissions}/>
            </DialogContent>
            <DialogActions></DialogActions>
            </Dialog>
        )
    }

    handleDelete = () => {
        this.setState({deleteLoading: true});
        const sendData = {
            submissions: this.state.selectedSubmissions
        }
        return fetch(HOST + SUBMISSION_DELETE, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendData),
        })
        .then(res => res.json())
        .then(
            res => {
                if (res.result){
                    this.setState({deleteLoading: false});
                    this.fetchSubmissions();
                }
            },
            err => {
                this.setState({deleteLoading: false});
            }
        )
    }

    render(){
        const {classes} = this.props;
        const {submissions, page, rowsPerPage, selectedSubmissions, deleteLoading} = this.state;
        const disableDelete = selectedSubmissions.length === 0;
        return(
    <Card
      className={classes.root}
    >
        <div style={{position: 'relative', padding: 20}}>
        <Button
        disabled={disableDelete || deleteLoading}
        variant="contained"
        color="secondary"
        className={classes.deleteButton}
        startIcon={<DeleteIcon />}
        onClick={this.handleDelete}
      >
        Delete
      </Button>
      {deleteLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
        {this.progressModel()}
      <CardContent className={classes.content}>
        <PerfectScrollbar>
          <div className={classes.inner}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedSubmissions.length === submissions.length}
                      color="primary"
                      indeterminate={
                        selectedSubmissions.length > 0 &&
                        selectedSubmissions.length < submissions.length
                      }
                      onChange={this.handleSelectAll}
                    />
                  </TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Submit date</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Application status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {submissions.slice(0, rowsPerPage).map(submission => (
                  <TableRow
                    className={classes.tableRow}
                    hover
                    key={submission.id}
                    selected={selectedSubmissions.indexOf(submission.id) !== -1}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedSubmissions.indexOf(submission.id) !== -1}
                        color="primary"
                        onChange={event => this.handleSelectOne(event, submission.id)}
                        value="true"
                      />
                    </TableCell>
                    <TableCell>
                      <div className={classes.nameContainer}>
                        <Avatar
                          className={classes.avatar}
                          src={submission.image_url}
                        >
                        </Avatar>
                      </div>
                    </TableCell>
                    <TableCell>{submission.name}</TableCell>
                    <TableCell>{submission.location} </TableCell>
                    <TableCell>
                      {moment(submission.progress[0].create_time).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                      {moment(submission.deadline).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell>
                        {getChip(submission.progress[submission.progress.length-1])}
                    </TableCell>
                     <TableCell>
                        <IconButton onClick={() => this.setState({curSubmission: submission})}><BorderColorIcon/></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </PerfectScrollbar>
      </CardContent>
      <CardActions className={classes.actions}>
        <TablePagination
          component="div"
          count={submissions.length}
          onChangePage={this.handlePageChange}
          onChangeRowsPerPage={this.handleRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </CardActions>
    </Card>
        )
    }
}






export default withStyles(styles)(Submission);