import React, { Component } from "react";
import { withStyles } from '@material-ui/styles';

import {
  Card,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
} from '@material-ui/core';

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
  }
});

class JobDetail extends Component{
    render(){
        //const job_position = {};
        const { classes, job_position} = this.props;
        return(
             <Card>
      <CardContent className={classes.cardContent}>
        <div className={classes.details}>
            <CardContent style={{display: "flex", padding: 30}}>
            <Avatar
            className={classes.avatar}
            src={job_position.image_url}
          />
          <div style={{color: "white"}}>
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
      <CardContent className={classes.cardContent} style={{display: "flex", padding: 30}}>
          <div className={classes.description}>
              <Typography  variant="body1" style={{fontWeight: "bold", textDecoration: "underline"}} gutterBottom>
                  Description
              </Typography>
              <Typography variant="body1" gutterBottom>
                  {job_position.description}
              </Typography>
          </div>
          <div className={classes.basicInfo}>
              <Typography  variant="body1" style={{fontWeight: "bold", textDecoration: "underline"}} gutterBottom>
                  Basic information
              </Typography>
               <Typography  variant="body1" style={{fontWeight: "bold",}} gutterBottom>
                  Applicants: {job_position.application}
              </Typography>
              <Typography  variant="body1" style={{fontWeight: "bold",}} gutterBottom>
                  Posted time: {job_position.posted_time}
              </Typography>
              <Typography  variant="body1" style={{fontWeight: "bold",}} gutterBottom>
                  Deadline: {job_position.deadline}
              </Typography>
               <Typography  variant="body1" style={{fontWeight: "bold",}} gutterBottom>
                  Position type: {job_position.type_name}
              </Typography>
          </div>
      </CardContent>
      <CardActions>
        <Button
          className={classes.uploadButton}
          color="secondary"
          variant="contained"
        >
          Apply
        </Button>
      </CardActions>
    </Card>
        )
    }
}

export default withStyles(styles)(JobDetail)