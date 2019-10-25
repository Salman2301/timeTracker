import React, { Component } from "react";
import moment from "moment";

class Clock extends Component {
  constructor() {
    super();
    this.state = {
      time: moment().format("LTS"),
      class: {
        h1: {
          color: "#5dd4bf",
          fontSize: "4.5em"
        }
      }
    };

    // this.clicked = this.clicked.bind(this)
  }
  componentDidMount() {
    setInterval(() => {
      this.setState({
        time: moment().format("LTS")
      });
    }, 1000);
  }

  render() {
    return (
      <div id="clock" style={this.state.background}>
        <h1 style={this.state.class.h1}>{this.state.time}</h1>
      </div>
    );
  }
}

export default Clock;
