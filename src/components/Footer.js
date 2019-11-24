import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/doannamthai">
                Thai Doan
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


const styles = theme => ({
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
});
class Footer extends Component{
    render(){
        const { classes } = this.props;
        return(
            <footer className={classes.footer}>
                    <Typography variant="h6" align="center" gutterBottom>
                        Findie
                    </Typography>
                    <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                        An application helps you find jobs and manage your applications in timely manner
                    </Typography>
                    <Copyright />
                </footer>
        )
    }
}

export default withStyles(styles)(Footer);