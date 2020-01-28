import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";

export default () => (
  <BrowserRouter>
    <Switch>
      <Route path="/" exact component={Home}></Route>
      <Route path="/register" exact component={Register}></Route>
    </Switch>
  </BrowserRouter>
);
