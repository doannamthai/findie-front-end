import React from 'react';
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
import {HOST, COMPANY, COMPANY_ADD, COMPANY_DELETE, COMPANY_UPDATE} from '../../../api/Api';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green } from '@material-ui/core/colors';
import Card from '@material-ui/core/Card';
import { withStyles } from '@material-ui/styles';
import MaterialTable from 'material-table';
import Authentication from '../../../utils/Authentication';
import Snackbar from '@material-ui/core/Snackbar';
import MySnackbarContentWrapper from '../../../components/Snackbar';


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

class Company extends React.Component{

    state = {
        data: [],
        selectedSubmissions: [],
        fetchLoading: false,
        rejectDialogOpen: false,
    }

    columns = () => [
      { title: 'Image', field: 'image_url', render: rowData => <img src={rowData.image_url} style={{width: 50, borderRadius: '50%'}}/>},
      { title: 'Name', field: 'name' },
      { title: 'Description', 
        field: 'description', 
      },
      { title: 'Updatable', 
        field: 'user_create', 
        editable: 'never',
        render: rowData => rowData ? (rowData.user_created === Authentication.getUserId() ? "Yes":"No") : "Yes"
      }
    ]

    fetchCompany = () => {
        return fetch(HOST + COMPANY + `?user_id=${Authentication.getUserId()}`)
        .then(res => res.json())
        .then(
            res => {
                if (res.result){
                    this.setState({data: res.result})
                }
            }
        )
    }

    onAddCompany = (data) => {
        return fetch(HOST + COMPANY_ADD + `?user_id=${Authentication.getUserId()}`, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(
            res => {
                if (res.result){
                    this.fetchCompany();
                }
            }
        )
    }

    onUpdateCompany = (data) => {
        return fetch(HOST + COMPANY_UPDATE, {
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(
            res => {
                if (res.result){
                    this.fetchCompany();
                }
            }
        )
    }

    onDeleteCompany = (data) => {
        const company_id = data.id;
        return fetch(HOST + COMPANY_DELETE + `?user_id=${Authentication.getUserId()}&company_id=${company_id}`, {
            method: 'post'
        })
        .then(res => res.json())
        .then(
            res => {
                if (res.result){
                    this.fetchCompany();
                }
            }
        )
    }


    componentDidMount(){
        this.fetchCompany();
    }

    checkUpdate(data){
        if (data.user_created !== Authentication.getUserId()){
            this.setState({rejectDialogOpen: true});
            return false;
        }
        return true;
    }

    handleCloseDialog = (event, reason) => {
        
        this.setState({rejectDialogOpen: false})
    };
    render(){
        const {classes} = this.props;
        const {selectedSubmissions} = this.state;
        return(
    <Card
      className={classes.root}
    >
     <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={this.state.rejectDialogOpen}
        autoHideDuration={6000}
        onClose={this.handleCloseDialog}
      >
          <MySnackbarContentWrapper
        variant="error"
        className={classes.margin}
        message="You are not allow to edit/delete this row"
      />
      </Snackbar>
       
     <MaterialTable
        title={"Company"}
        columns={this.columns()}
        data={this.state.data}
        icons={tableIcons}
        options={{paging: false}}
        
        editable={{
            onRowAdd: newData =>
            new Promise(resolve => {
                setTimeout(() => {
                resolve();
                this.onAddCompany(newData);
                }, 200);
            }),
            onRowUpdate: (newData, oldData) =>   
            new Promise(resolve => {
                setTimeout(() => {
                resolve();
                if (oldData && this.checkUpdate(oldData)) {
                    this.onUpdateCompany(newData);
                }
                }, 200);
            })
            ,
            onRowDelete: oldData =>
            new Promise(resolve => {
                setTimeout(() => {
                resolve();
                if (this.checkUpdate(oldData)){
                    this.onDeleteCompany(oldData)
                }
                }, 200);
            }),
        }}
        />
    </Card>
        )
    }
}






export default withStyles(styles)(Company);