import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import LoadingComponent from "./components/CirrusLoadingComponent";
import Loadable from 'react-loadable';
import ViewerComponent from "./scenes/Header/ViewerComponent";
import NotFound from "./scenes/NotFound";
import {navigate} from "./utils/navigate";
import {cirrusColors} from "./cirrusTheme";
import {AppBar, Button, Drawer, Icon, IconButton, Toolbar, Typography, withStyles} from "material-ui";
import MenuIcon from 'material-ui-icons/Menu';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import PropTypes from "prop-types";
import classNames from 'classnames';
import ViewerTopRepositories from "./scenes/Viewer/ViewerTopRepositories";

const AsyncHome = Loadable({
  loader: () => import('./scenes/Home/Home'),
  loading: LoadingComponent
});

const AsyncBuild = Loadable({
  loader: () => import('./scenes/Build/Build'),
  loading: LoadingComponent
});

const AsyncRepository = Loadable({
  loader: () => import('./scenes/Repository/Repository'),
  loading: LoadingComponent
});

const AsyncRepositorySettings = Loadable({
  loader: () => import('./scenes/RepositorySettings/RepositorySettings'),
  loading: LoadingComponent
});

const AsyncTask = Loadable({
  loader: () => import('./scenes/Task/Task'),
  loading: LoadingComponent
});

const AsyncGitHub = Loadable({
  loader: () => import('./scenes/GitHub/GitHub'),
  loading: LoadingComponent
});

const AsyncGitHubRepository = Loadable({
  loader: () => import('./scenes/Repository/GitHubRepository'),
  loading: LoadingComponent
});

const drawerWidth = 360;

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  hide: {
    display: 'none',
  },
  menuButton: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  titleShift: {
    marginLeft: 2 * theme.spacing.unit,
  },
  viewer: {
    marginRight: theme.spacing.unit,
  },
  appFrame: {
    width: "100%",
    height: "100%",
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
  },
  appBar: {
    position: 'absolute',
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0',
    backgroundColor: cirrusColors.cirrusGrey,
    ...theme.mixins.toolbar,
  },
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
  },
  topRepositories: {
    width: drawerWidth,
    height: "100%",
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    padding: 0,
    marginLeft: 0,
  },
});

class Routes extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      openDrawer: localStorage.getItem("cirrusOpenDrawer") === "true",
    };
    this.handleDrawerOpen = this.handleDrawerOpen.bind(this);
    this.handleDrawerClose = this.handleDrawerClose.bind(this);
  }

  handleDrawerOpen() {
    this.setState({openDrawer: true});
    localStorage.setItem("cirrusOpenDrawer", "true");
  }

  handleDrawerClose() {
    this.setState({openDrawer: false});
    localStorage.setItem("cirrusOpenDrawer", "false");
  }

  render() {
    let {classes} = this.props;
    let {openDrawer} = this.state;

    const drawer = (
      <Drawer
        variant="persistent"
        open={openDrawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="title"
                      color="inherit">
            Active Repositories
          </Typography>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon/>
          </IconButton>
        </div>
        <ViewerTopRepositories className={classes.topRepositories}/>
      </Drawer>
    );

    return (
      <BrowserRouter>
        <div className={classes.appFrame}>
          <AppBar position="static"
                  className={classNames(classes.appBar, {
                    [classes.appBarShift]: openDrawer,
                  })}>
            <Toolbar disableGutters={true}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={this.handleDrawerOpen}
                className={classNames(classes.menuButton, openDrawer && classes.hide)}
              >
                <MenuIcon/>
              </IconButton>
              <Typography variant="title"
                          className={classNames(classes.flex, {
                            [classes.titleShift]: openDrawer,
                          })}
                          style={{cursor: "pointer"}}
                          onClick={(e) => navigate(this.context.router, e, "/")}
                          color="inherit">
                Cirrus CI
              </Typography>
              <Button className={classes.button}
                      style={{color: cirrusColors.cirrusWhite, marginRight: 8}}
                      href="https://cirrus-ci.org/"
              >
                <Icon className={classNames("fa", "fa-book", classes.leftIcon)}/>
                Documentation
              </Button>
              <div className={classes.viewer}>
                <ViewerComponent/>
              </div>
            </Toolbar>
          </AppBar>
          {openDrawer ? drawer : null}
          <main
            className={classNames(classes.content, {
              [classes.contentShift]: openDrawer,
            })}
          >
            <div className={classNames("invisible", classes.drawerHeader)}/>
            <Switch>
              <Route exact path="/" component={AsyncHome} props={this.props}/>
              <Route exact path="/build/:buildId" component={AsyncBuild} props={this.props}/>
              <Route exact path="/github/:owner/:name/:branch*" component={AsyncGitHubRepository} props={this.props}/>
              <Route exact path="/github" component={AsyncGitHub} props={this.props}/>
              <Route exact path="/repository/:repositoryId/:branch*" component={AsyncRepository} props={this.props}/>
              <Route exact path="/settings/repository/:repositoryId" component={AsyncRepositorySettings}
                     props={this.props}/>
              <Route exact path="/task/:taskId" component={AsyncTask} props={this.props}/>
              <Route exact path="/:owner/:name/:branch*" component={AsyncGitHubRepository} props={this.props}/>
              <Route component={NotFound} props={this.props}/>
            </Switch>
          </main>
        </div>
      </BrowserRouter>
    )
  }
}

export default withStyles(styles)(Routes);
