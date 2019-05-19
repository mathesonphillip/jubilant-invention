/* eslint-disable */
const $ = window.$;
import React from "react";

// Switch images here by commenting out one of the import blocks
// ######################################################

import { ReactComponent as Icon } from "./svg/education.svg";
import items from "./data/education.json";

// import { ReactComponent as Icon } from "./svg/roadmap.svg";
// import items from "./data/roadmap.json";

// ######################################################
import { main } from "./vendor/tree";
import "./styles.css";
class App extends React.Component {
  componentDidMount() {
    main(items);
  }

  render() {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <div id="popup" />

        <div id="viewer">
          <Icon />
        </div>
      </React.Fragment>
    );
  }
}

export default App;
