import React, { useState, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";
import CustomButton from "../layout/CustomButton";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import LikeButton from "./LikeButton";
import Comments from "./Comments";
import CommentForm from "./CommentForm";
// Material UI
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/core/styles/makeStyles";
import globalTheme from "../../util/theme";
// Icons
import CloseIcon from "@material-ui/icons/Close";
import UnfoldMore from "@material-ui/icons/UnfoldMore";
import ChatIcon from "@material-ui/icons/Chat";
// Redux
import { connect } from "react-redux";
import { getScream } from "../../redux/actions/dataActions";

const styles = makeStyles({
  ...globalTheme,
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: "50%",
    objectFit: "cover",
  },
  userHandleSpace: {
    marginRight: 10,
  },
  spinnerDiv: {
    textAlign: "center",
    margin: "50px auto",
  },
  closeButton: {
    position: "absolute",
    left: "90%",
  },
});

const ScreamDialog = ({
  screamId,
  userHandle,
  getScream,
  UI: { loading },
  scream: { body, createdAt, likeCount, commentCount, userImage, comments },
  openDialog,
}) => {
  const [open, setOpen] = useState(false);
  const [oldPath, setOldPath] = useState("");
  const [newPath, setNewPath] = useState("");

  const classes = styles();

  useEffect(() => {
    if (openDialog) {
      handleOpen();
    }
  }, []);

  const handleOpen = () => {
    let currentOldPath = window.location.pathname;
    const currentNewPath = `/users/${userHandle}/scream/${screamId}`;

    if (currentOldPath === currentNewPath)
      currentOldPath = `/users/${userHandle}`;

    window.history.pushState(null, null, currentNewPath);

    setOldPath(currentOldPath);
    setNewPath(currentNewPath);

    setOpen(true);
    getScream(screamId);
  };

  const handleClose = () => {
    window.history.pushState(null, null, oldPath);

    setOpen(false);
  };

  const dialogMarkup = loading ? (
    <div className={classes.spinnerDiv}>
      <CircularProgress size={150} />
    </div>
  ) : (
    <Grid container spacing={16}>
      <Grid item sm={3}>
        <img src={userImage} alt="Profile" className={classes.profileImage} />
      </Grid>
      <Grid item sm={7}>
        <Typography
          component={Link}
          color="black"
          variant="h5"
          to={`/users/${userHandle}`}
          className={classes.userHandleSpace}
        >
          {userHandle}
        </Typography>
        <hr />
        <Typography variant="body1" color="textSecondary">
          {dayjs(createdAt).format("h:mm a, MMMM DD YYYY")}
        </Typography>

        <hr />
        <Typography variant="body1">{body}</Typography>
        <LikeButton screamId={screamId} />
        <span>{likeCount}</span>
        <CustomButton tip="Comments">
          <ChatIcon color="primary" />
        </CustomButton>
        <span>{commentCount}</span>
      </Grid>
      <CommentForm screamId={screamId} />
      <Comments comments={comments} />
    </Grid>
  );

  return (
    <Fragment>
      <CustomButton
        onClick={handleOpen}
        tip="Expand this"
        tipClassName={classes.expandButton}
      >
        <UnfoldMore />
      </CustomButton>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <CustomButton
          tip="Close"
          onClick={handleClose}
          tipClassName={classes.closeButton}
        >
          <CloseIcon />
        </CustomButton>
        <DialogContent className={classes.dialogContent}>
          {dialogMarkup}
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

ScreamDialog.propTypes = {
  screamId: PropTypes.string.isRequired,
  userHandle: PropTypes.string.isRequired,
  scream: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  getScream: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  scream: state.data.scream,
  UI: state.UI,
});

export default connect(mapStateToProps, { getScream })(ScreamDialog);
