/* eslint-disable */
const $ = window.$;
import React from "react";

// import { ReactComponent as Icon } from "./roadmap1.svg";
// import items from "./items.json";

import { ReactComponent as Icon } from "./Behance.svg";
// import { ReactComponent as Icon } from "./treeOfUp.svg";
import items from "./items.json";

// import { ReactComponent as Icon } from "./drawing.svg";
// import items from "./items2.json";

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
