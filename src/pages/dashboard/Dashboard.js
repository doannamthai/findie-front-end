import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import Submission from './submission/Submission';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import Statistic from './statistic/Statistic';
import Profile from './profile/Profile';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PeopleIcon from '@material-ui/icons/People';
import PieChartIcon from '@material-ui/icons/PieChart';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Authentication from '../../utils/Authentication';
import BusinessIcon from '@material-ui/icons/Business';
import Company from './company/Company';

const drawerWidth = 240;
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  heading: {
    padding: 20,
    marginBottom: 20,
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    backgroundColor: "#0277bd",
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: "#0277bd",
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
    "&.MuiSvgIcon-root": {backgroundColor: "white"},
  },
  menuButtonHidden: {
    display: 'none',
  },
 
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    border: "none",
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
 title: {
     flexGrow: 1
    },
}));

function SubmissionPanel(){
    return (
         <div>
        <Breadcrumbs style={{marginBottom: 10}} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" href="/" >
          Findie
        </Link>
        <Link color="inherit" href="/dashboard" >
          Dashboard
        </Link>
        <Typography color="textPrimary">Submissions</Typography>
      </Breadcrumbs>
            <Submission/>
            </div>
    )
}


function StatisticPanel(){
    return (
         <div>
        <Breadcrumbs style={{marginBottom: 10}} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" href="/" >
          Findie
        </Link>
        <Link color="inherit" href="/dashboard" >
          Dashboard
        </Link>
        <Typography color="textPrimary">Statistic</Typography>
      </Breadcrumbs>
            <Statistic/>
            </div>
    )
}


function CompanyPanel(){
    return (
         <div>
        <Breadcrumbs style={{marginBottom: 10}} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" href="/" >
          Findie
        </Link>
        <Link color="inherit" href="/dashboard" >
          Dashboard
        </Link>
        <Typography color="textPrimary">Company</Typography>
      </Breadcrumbs>
            <Company/>
            </div>
    )
}


function ProfilePanel(){
    return (
         <div>
        <Breadcrumbs style={{marginBottom: 10}} separator={<NavigateNextIcon fontSize="small" />} aria-label="breadcrumb">
        <Link color="inherit" href="/" >
          Findie
        </Link>
        <Link color="inherit" href="/dashboard" >
          Dashboard
        </Link>
        <Typography color="textPrimary">Profile</Typography>
      </Breadcrumbs>
            <Profile/>
            </div>
    )
}

function handleLink(src){
    window.location.href = src;
  }

function findComponent(subName){
    if (subName === "submission") return <SubmissionPanel/>
    else if (subName === "profile") return <ProfilePanel/>
    else if (subName === "statistic") return <StatisticPanel/>
    else if (subName === "company") return <CompanyPanel/>
}

export default function Dashboard(props) {
  const classes = useStyles();
  const [open] = React.useState(true);

  const pathName = props.location.pathname;
  const subName = pathName.substring(pathName.lastIndexOf("/")+1);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar  elevation={0} position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
        
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
      >
        <div className={classes.toolbarIcon}>  
            <ChildCareIcon style={{color: "white", marginLeft: 10}} width={40} height={40}/>
              <Typography  className={classes.title} variant="h6" color="inherit">
                  <Link href="/" className={classes.link} style={{ textDecoration: 'none', color: 'white', marginLeft: 10}}> Findie  </Link>
              </Typography>
              
        </div>
        <Divider />
        <List style={{marginTop: 30}}>
            
    <ListItem button selected={subName === "submission"} onClick={() => handleLink("/dashboard/submission")} >
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Submissions" />
    </ListItem>
    <ListItem button  selected={subName === "company"} onClick={() => handleLink("/dashboard/company")} >
      <ListItemIcon>
        <BusinessIcon/>
      </ListItemIcon>
      <ListItemText primary="Company" />
    </ListItem>
    <ListItem button selected={subName === "statistic"} onClick={() => handleLink("/dashboard/statistic")} >
      <ListItemIcon>
        <PieChartIcon/>
      </ListItemIcon>
      <ListItemText primary="Statistic" />
    </ListItem>
    <ListItem button  selected={subName === "profile"} onClick={() => handleLink("/dashboard/profile")} >
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Profile" />
    </ListItem>
        </List>
        <Divider />
        <List>
    <ListSubheader inset>Others</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <HomeIcon/>
      </ListItemIcon>
      <ListItemText primary="Homepage"  onClick={() => handleLink("/")} />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <ExitToAppIcon/>
      </ListItemIcon>
      <ListItemText primary="Logout"  onClick={() => {Authentication.deleteSession(); handleLink("/")}} />
    </ListItem>

        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>
            {findComponent(subName)}
        </Container>
      </main>
    </div>
  );
}