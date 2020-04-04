import React from "react";
import { Link } from "react-router-dom";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ReportIcon from "@material-ui/icons/List";

export default function MenuList() {
  return (
    <div>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Map" />
        </ListItem>
        <ListItem button component={Link} to="/list">
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
          <ListItemText primary="List" />
        </ListItem>
      </List>
    </div>
  );
}
