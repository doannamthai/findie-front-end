import React from "react";
// react plugin for creating charts
//import ChartistGraph from "react-chartist";
// @material-ui/core
import { withStyles } from "@material-ui/core/styles";
import {Chart} from "react-google-charts";
// core components
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import {HOST, STATISTIC} from '../../../api/Api';
import Authentication from "../../../utils/Authentication";
import { CardHeader, CardContent, Typography } from "@material-ui/core";


const useStyles = ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    //width: 320,
  },
  control: {
    padding: 10,
  },
});

const colorMap = {
    1: "#292929",
    2: "#d84315",
    3: "#4e342e",
    4: "#c62828",
    5: "#2e7d32"
}

function processData(data){
    const total_submission = data.total_submission;

    let res = [];  
    let hashMap = {
        1: {
            name: "Total submission",
            count: total_submission,
            id: 1,
            color: colorMap[1],
        },
        2: {
            name: "Screening",
            count: 0,
            id: 2,
            color: colorMap[2],
        },
        3: {
            name: "Interviewing",
            count: 0,
            id: 3,
            color: colorMap[3],
        },
        4: {
            name: "Rejected",
            count: 0,
            id: 4,
            color: colorMap[4],
        },
        5: {
            name: "Offered",
            count: 0,
            id: 5,
            color: colorMap[5],
        },
    } 
   
    const progress = data.progress_statistic;
    for (let i = 0; i < progress.length; i++){
        const last_progress_type = progress[i].last_progress_type;
        if (last_progress_type === 1) continue;
        hashMap[last_progress_type] = {
            name: progress[i].name,
            id: last_progress_type,
            count: progress[i].count,
            color: colorMap[last_progress_type]
        };
    }

    for (var e in hashMap) res.push(hashMap[e]);

    return res;
}

function convertToArray(submissions_in_30_days){
    let res = [];
    for (var d in submissions_in_30_days){
        res.push([submissions_in_30_days[d].create_time, submissions_in_30_days[d].submissions])
    }
    return res;
}


class Dashboard extends React.Component {
    state = {
        mainInfo: [],
        submissions_in_30_days: [],
    }

    componentDidMount(){
        fetch(HOST + STATISTIC + `?user_id=${Authentication.getUserId()}`)
        .then(res => res.json())
        .then(
            res => {
                if (res.result){
                    this.setState({submissions_in_30_days: convertToArray(res.result.submissions_in_30_days), mainInfo: processData(res.result)});
                }
            }
        )
    }

    render() {
        const {classes} = this.props;
        const {mainInfo, submissions_in_30_days} = this.state;
        console.log(submissions_in_30_days);
        return (
            <div>
                <Grid container className={classes.root} spacing={6}>
                    <Grid item xs={12}>
                        <Grid container justify="flex-start" spacing={4}>
                            {mainInfo.map(value => (
                                <Grid key={value.id} item md>
                                    <Card className={classes.paper}>
                                        <CardHeader style={{backgroundColor: value.color, 
                                        color: "white", textAlign: "center", fontSize: 14}} title={value.name}></CardHeader>
                                        <CardContent style={{textAlign: "center"}}>
                                            <Typography variant="h4"  gutterBottom>
                                                {value.count}
                                            </Typography>
                                        </CardContent>
                                        </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                     <Grid item>
                        <Grid container justify="center">
                            <Grid item md>
                                <Card style={{ height: 500 }}>
                                    <CardHeader style={{
                                        
                                    }} title="Submissions in last 30 days"></CardHeader>
                                    <CardContent>
                                        <Chart
                                            width={'800px'}
                                            height={'400px'}
                                            chartType="LineChart"
                                            loader={<div>Loading Chart</div>}
                                            data={[['x', 'Your submissions'], ...submissions_in_30_days]}
                                            options={{
                                                hAxis: {
                                                    title: 'Date',
                                                },
                                                vAxis: {
                                                    title: 'Submissions',
                                                },
                                            }}
                                            rootProps={{ 'data-testid': '1' }}
                                        />
                                    </CardContent>

                                </Card>
                            </Grid>
                           
                         </Grid>
                        
                     </Grid>
                </Grid>
            </div>
        );
    }

}

export default withStyles(useStyles)(Dashboard);