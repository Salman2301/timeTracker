import React, { useState, useEffect, useRef } from "react";

import Navbar from "../Navbar";

import makeStyles from "@material-ui/core/styles/makeStyles";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FilledInput from "@material-ui/core/FilledInput";

import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import PlayIcon from "@material-ui/icons/PlayCircleFilled";
import DeleteIcon from "@material-ui/icons/Delete";

import Clock from "./Clock";

// add proverb
// add start date end date
// add a backup button

const serverURL = "http://localhost:3002/api";

function fetchJSON(url, opt = {}) {
  return fetch(url, opt)
    .then(httpRes => {
      if (!httpRes.ok) throw new Error("status is not ok : ", url);
      return httpRes.json();
    })
    .then(jsonStr => JSON.parse(jsonStr));
}
// let categories = serverURL.categories;
// console.log(categories)
const useStyles = makeStyles(theme => ({
  // backgroud color :  95c8bf
  // main color : 5dd4bf
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  },
  input: {
    width: "100%",
    margin: "5px",
    padding: "0px 10px",
    background: "#fff",
    border: "0px",
    "&.Mui-focused": {
      background: "#95c8bf"
    },
    borderRadius: "0px"
  },
  list: {
    // display: "none",
    zIndex: 99
  },
  listItem: {
    // borderWidth: "2px",
    // borderColor: "blue",
    background: "#95c8bf",
    margin: "5px",
    "&:hover": {
      background: "#5dd4bf"
      // fontWeight: "bold"
    }
  },
  listItemActive: {
    background: "#5dd4bf",
    margin: "5px",
    fontWeight: "bold",
    "&:hover": {
      background: "#5dd4bf"
    }
  },
  taskName: {
    alignItems: "center",
    textAlign: "center"
  },
  lastTimeSec: {
    // paddingBottom: "1.5rem"
  },
  workingText: {
    color: "#5dd4bf"
  }
}));

function TimeTacker() {
  const classes = useStyles();
  const noTask = "No Task";
  let taskIntervalID = useRef(false);
  let [currTask, setCurrTask] = useState(noTask);
  let [categories, setCateogries] = useState([noTask]);
  let [newCat, setNewCat] = useState("");
  let [lastTimeSec, setLastTimeSec] = useState("");
  let [lastChecked1, setLastChecked1] = useState("");

  function updateData() {
    fetchJSON(serverURL).then(json => {
      let { lastChecked, categories } = json;
      console.log("getting last Checked : ", lastChecked, json);
      setLastChecked1(lastChecked);
      console.log("update state : ", lastChecked1);
      setCateogries(categories);
    });
  }

  let checkTask = () => {
    // console.log("am i running :  ");
    if (!lastChecked1) {
      // console.log("last checked is empty : ", lastChecked1);
      return;
    }
    // console.log("last checked is empty 2: ", lastChecked1);

    let lastTime = new Date(lastChecked1);
    // console.log("last checked is empty 3: ", lastChecked1);
    let getNow = new Date();
    let lastTaskTime = getNow.getTime() - lastTime.getTime();
    // console.log("LAST CHECKED : ", lastChecked1);
    // console.log("LAST TIME : ", lastTime);
    // console.log("get now : ", getNow);
    // console.log("last task time", lastTaskTime);

    setLastTimeSec(
      `${new Date(lastTaskTime)
        .toISOString()
        .split("T")[1]
        .slice(0, -5)}`
    );
  };

  useEffect(() => {
    // refresh();

    // function refresh() {
    console.log("running");
    fetchJSON(serverURL)
      .then(json => {
        // console.log("JSON :", json);
        let { categories } = json;
        setCateogries(categories);

        let timeNow = new Date();
        let { lastChecked, lastTask } = json;
        if (!lastChecked) lastChecked = new Date();
        console.log("last checked from json : ", lastChecked, json);
        setLastChecked1(lastChecked);
        let lastTime = new Date(lastChecked);
        console.log("LAST TIME CHECKED :", lastTime);
        console.log("TIME NOW :", timeNow);
        let lastSec = (timeNow - lastTime) / 1000;

        taskIntervalID.current = setInterval(checkTask, 1000);

        if (lastSec < 300) {
          setCurrTask(lastTask);
          if (!taskIntervalID.current) clearInterval(taskIntervalID.current);
        }
      })
      .catch(console.log);
    // }
  }, [lastChecked1]);

  const updateTask = cat => {
    setCurrTask(cat);
    console.log(cat, "updating the server...");
    fetch(serverURL + "/lastChecked?name=" + cat);
    clearInterval(taskIntervalID.current);
    setTimeout(() => {
      taskIntervalID.current = setInterval(checkTask, 1000);
    });
    updateData();
  };

  const removeTask = cat => {
    setCurrTask(cat);
    if (currTask === cat) setCurrTask(noTask);
    fetch(serverURL + "/removeCat?name=" + cat);
    updateData();
  };

  const inputOnChange = async e => {
    setNewCat(e.target.value);
  };

  const inputKey = async e => {
    // console.log(e, e.key, , e.target);

    if (e.key === "Enter") {
      // setNewCat(e.target.value);
      if (!newCat) {
        console.error("please add a new name");
        return;
      }
      // console.log("new cat : ", newCat);
      await fetch(serverURL + "/insertCat?name=" + newCat);
      updateData();
      // refresh();
      setNewCat("");

      // fetchJSON(serverURL).then(json => {
      //   console.log("JSON :", json);
      //   let { categories } = json;
      //   setCateogries(categories);
      // });
    }
  };

  setInterval(() => {
    console.log("updating currtask and time...");
    fetch(serverURL + "/lastChecked?name=" + currTask);
  }, 300000);
  return (
    <div>
      <div className={classes.root}>
        <Navbar />
        <Clock />
        <h1>
          Working on :{" "}
          <span className={classes.workingText}>
            {currTask === "" ? "No task running" : currTask}
          </span>
        </h1>
        <Grid container spacing={3} justify="center" alignItems="center">
          <Grid item xs={8}>
            <FilledInput
              className={classes.input}
              placeholder="Add or search a new task"
              onChange={e => inputOnChange(e)}
              onKeyDown={e => inputKey(e)}
              value={newCat}
            />
            <List id="options" className={classes.list}>
              {categories.map(cat => {
                return (
                  <ListItem
                    button
                    key={"id-" + cat}
                    className={
                      cat !== currTask
                        ? classes.listItem
                        : classes.listItemActive
                    }
                    onClick={e => updateTask(cat, e)}
                  >
                    {cat === currTask ? (
                      <ListItemIcon>
                        <PlayIcon />
                        <ListItemText
                          className={classes.lastTimeSec}
                          primary={lastTimeSec}
                        />
                      </ListItemIcon>
                    ) : (
                      <ListItemIcon></ListItemIcon>
                    )}
                    <ListItemText className={classes.taskName} primary={cat} />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="comments"
                        onClick={e => removeTask(cat, e)}
                      >
                        {cat !== noTask ? <DeleteIcon /> : ""}
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default TimeTacker;
