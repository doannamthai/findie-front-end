import React from 'react';
import MaterialTable from 'material-table';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import { forwardRef } from 'react';
import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import moment from 'moment';
import {HOST, SUBMISSION_PROGRESS_UPDATE} from '../../../api/Api';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/styles';

const tableIcons = {
Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

const useStyles = theme => ({
  wrapper: {
    margin: 10,
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
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

class ProgressTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.progress,
            tempDate: null,
            loading: false,
        };
    }

    sendNewProgress = () => {
        this.setState({loading: true});
        const sendData = {
            submission_id: this.state.data[0].submission_id,
            progress: this.state.data,
        }
        console.log(sendData);
        return fetch(HOST + SUBMISSION_PROGRESS_UPDATE, {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(sendData)
        }).then(res => res.json())
        .then(
            res => {
                this.setState({loading: false});
                if (res.result){
                    this.props.reload();
                }
            },
            err => {
                this.setState({loading: false});
            }
        )
    }

    updateTempDate = (val, row) => {
        let {tempDate} = this.state;
        row.onChange(formatDate(val));
        tempDate = val;
        this.setState({tempDate});
    }


    columns = () => [
      { title: 'Status', field: 'progress_type', lookup: { 1: 'Submitted', 2: 'Screening', 3:'Interviewing', 4:'Rejected', 5:'Offered' } },
      { title: 'Description', field: 'progress_description' },
      { 
        title: 'Time', 
        field: 'create_time', 
        editComponent: row => (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="yyyy-MM-dd"
                margin="normal"
                id="date-picker-inline"
                value={this.state.tempDate ? this.state.tempDate : moment(row.rowData.create_time).utc(false).toDate()}
                onChange={d => this.updateTempDate(d, row)}
                KeyboardButtonProps={{
                    'aria-label': 'change date',
                }}
            /></MuiPickersUtilsProvider>)
       },
    ]

    render(){
        const {classes} = this.props;
        const state = this.state;
        return (
            <React.Fragment>
        <MaterialTable
        title={"Application Progress History"}
        columns={this.columns()}
        data={state.data}
        icons={tableIcons}
        options={{search: false,paging: false}}
        editable={{
            isEditable: false, // only name(a) rows would be editable
            isDeletable: false, // only name(a) rows would be deletable
            onRowAdd: newData =>
            new Promise(resolve => {
                setTimeout(() => {
                resolve();
                this.setState({tempDate: null}, () => {
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data.push(newData);
                    return { ...prevState, data };
                });
                });
                }, 200);
            }),
            onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {
                setTimeout(() => {
                resolve();
                if (oldData) {
                    this.setState({tempDate: null}, () => {
                        this.setState(prevState => {
                    const data = [...prevState.data];
                    data[data.indexOf(oldData)] = newData;
                    return { ...prevState, data };
                    });
                    })
                    
                }
                }, 200);
            }),
            onRowDelete: oldData =>
            new Promise(resolve => {
                setTimeout(() => {
                resolve();
                this.setState({tempDate: null}, () => {
                this.setState(prevState => {
                    const data = [...prevState.data];
                    data.splice(data.indexOf(oldData), 1);
                    return { ...prevState, data };
                });
                });
                }, 200);
            }),
        }}
        />
         <div className={classes.wrapper}>
        <Button 
        fullWidth 
        color="primary" 
        variant="contained" style={{marginTop: 20}} 
        disabled={this.state.loading}
        onClick={this.sendNewProgress}>Save & Update</Button>
        {this.state.loading && <CircularProgress size={24} className={classes.buttonProgress} />}
      </div>
        </React.Fragment>
    );
    }
}

export default withStyles(useStyles)(ProgressTable);