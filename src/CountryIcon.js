import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles((theme) => ({
  imageIcon: {
    width: "24px",
  },
  iconRoot: {
    textAlign: "center",
    paddingRight: "4px",
  },
}));

export default function CountryIcon({ code }) {
  const classes = useStyles();
  try {
    return (
      <Icon classes={{ root: classes.iconRoot }}>
        <img
          className={classes.imageIcon}
          alt={code.name}
          src={require(`svg-country-flags/svg/${code}.svg`)}
        />
      </Icon>
    );
  } catch {
    return null;
  }
}
