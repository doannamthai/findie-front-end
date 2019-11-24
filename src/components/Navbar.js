import React, { Component } from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import deepOrange from '@material-ui/core/colors/deepOrange';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Authentication from '../utils/Authentication';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import ProfileIcon from '@material-ui/icons/PieChart';
import ChildCareIcon from '@material-ui/icons/ChildCare';
import { Link, Grid, AppBar, Toolbar, Button, Typography, IconButton,  MenuItem, ListItemText, 
ListItemIcon, Paper, Grow, ClickAwayListener, MenuList, Popper} from '@material-ui/core';
const styles = theme => ({
    appBar: {
      position: 'fixed',
      zIndex: theme.zIndex.drawer + 1,
      background: '#0277bd',
    },
    transparent: {
      background: 'transparent',
      borderBottom: '1px solid #fff',
    },
    toolbarSpacer: theme.mixins.toolbar,
    
    rightComponents: {
      marginRight: theme.spacing.unit * 8,
      padding: '0px!important',
    },
    grow: {
      flexGrow: 1,
    },
    title: {
      color: 'white',
      display: 'none',
      marginLeft: 10,
      [theme.breakpoints.up('sm')]: {
      display: 'block',
      },
    },
    
    
    orangeAvatar: {
      margin: 10,
      width: 80,
      height: 80,
      color: '#fff',
      backgroundColor: deepOrange[500],
    },
   
  });


function PrivateElement(props){
  if(props.loggedIn === true){
    return props.children;
  }
  return null;
}

function UnLoggedInElement(props){
  if(props.loggedIn === false){
    return props.children;
  }
  return null;
}



class NavBar extends Component{
  constructor(props){
    super(props);
    this.state = {
      loggedIn: Authentication.isLoggedIn(),
      menuPopup: null,
      placementMenu: null,
      open: false,
    };
  }

  handleMenu = placement => event => {
    this.setState({
       menuPopup: event.currentTarget,
       open: this.state.placement !== placement || !this.state.open,
       placementMenu: placement,
      });
  };

 
  handleClose = () => {
    this.setState({ 
      menuPopup: null,
      open: false,
    });
  };

  handleLink = (src) => {
    window.location.href = src;
  }

  logOut = () => {
    Authentication.deleteSession();
    window.location.reload();

  }

    render(){
      const { classes } = this.props;
      let appBarCss = classes.appBar;
      const { open, menuPopup,  placementMenu} = this.state;
      appBarCss += this.props.transparent ? " " + classes.transparent : "";
        return(
          <div>
            <AppBar elevation={0} className={appBarCss}>
            <Toolbar>
            <ChildCareIcon width={40} height={40}/>
              <Typography  className={classes.title} variant="h6" color="inherit">
                  <Link href="/" className={classes.link} style={{ textDecoration: 'none', color: 'white'}}> Findie  </Link>
              </Typography>
              
              <div className={classes.grow}/>
              <div className={classes.rightComponents}>
              <UnLoggedInElement loggedIn={this.state.loggedIn}>
              <Button style={{color: "white"}} href="/register">Register</Button>
              <Button style={{marginLeft: 10, background: "#b71c1c", color: "white"}}  variant="contained" href="/login">Login</Button>
              </UnLoggedInElement>
              <PrivateElement loggedIn={this.state.loggedIn}>

             
    
              <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu('bottom')}
                  color="inherit">
                <AccountCircle />
                </IconButton>
              <Popper placement={placementMenu} open={open} anchorEl={menuPopup} transition disablePortal>
                  {({ TransitionProps }) => (
                  <Grow {...TransitionProps}>
                  <Paper>
                  <ClickAwayListener onClickAway={this.handleClose}>
                    <MenuList>
                        <Grid container justify="center" alignItems="center">
                          <Avatar className={classes.orangeAvatar}>OP</Avatar>
                        </Grid>      
                      <MenuItem  onClick={() => {this.handleLink("/dashboard")}} className={classes.menuItem}>
                        <ListItemIcon className={classes.icon}>
                          <ProfileIcon />
                        </ListItemIcon>
                        <ListItemText classes={{ primary: classes.primary }} primary="Dashboard" />
                      </MenuItem>
                
                      <MenuItem onClick={() => {this.handleClose(); this.logOut()}} className={classes.menuItem}>
                      <ListItemIcon className={classes.icon}>
                        <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText classes={{ primary: classes.primary }} primary="Logout" />
                      </MenuItem>

                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
                )}
              </Popper>
              </PrivateElement>
              </div>
            </Toolbar>
            </AppBar>
            <div className={classes.toolbarSpacer}></div>
            </div>
        );
    }
}

NavBar.propTypes = {
    classes: PropTypes.object.isRequired,
 };
  

export default withStyles(styles)(NavBar);