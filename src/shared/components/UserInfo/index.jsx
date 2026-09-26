import React, { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { onJWTAuthSignout } from '../../../redux/actions';
import { useThemeContext } from '../../../@crema/context/AppContextProvider/ThemeContextProvider';
import clsx from 'clsx';
import { makeStyles } from '@mui/styles';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import { AuthType, Fonts } from '../../constants/AppEnums';

const useStyles = makeStyles((themeMode) => {
  return {
    crUserInfo: {
      backgroundColor: 'rgba(0,0,0,.08)',
      paddingTop: 9,
      paddingBottom: 9,
      minHeight: 56,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      [themeMode.breakpoints.up('sm')]: {
        paddingTop: 10,
        paddingBottom: 10,
        minHeight: 70,
      },
    },
    profilePic: {
      fontSize: 13,
      backgroundColor: themeMode.palette.primary.main,
    },
    userInfo: {
      width: 'calc(100% - 75px)',
    },
    userName: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      fontSize: 16,
      fontWeight: Fonts.MEDIUM, // eslint-disable-next-line prettier/prettier
      color: (props) => (// eslint-disable-next-line prettier/prettier
        props.themeMode === 'light'// eslint-disable-next-line prettier/prettier
        ? themeMode.palette.primary// eslint-disable-next-line prettier/prettier
        : themeMode.palette.primary// eslint-disable-next-line prettier/prettier
      ),
    },
    designation: {
      marginTop: -2,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      color: themeMode.palette.text.secondary,
    },
    pointer: {
      cursor: 'pointer',
    },
  };
});

const UserInfo = (props) => {
  const { themeMode } = useThemeContext();
  const dispatch = useDispatch();
  const {user} = useSelector(({auth}) => auth);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  console.log(user)

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getUserAvatar = () => {
    if (user.displayName) {
      return user.displayName.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
  };

  const classes = useStyles({ themeMode });

  return (
    <Box
      px={{ xs: 4, xl: 7 }}
      className={clsx(classes.crUserInfo, 'cr-user-info')}
    >
      <Box display='flex' alignItems='center'>
        {user.photoURL ? (
          <Avatar className={classes.profilePic} src={user.photoURL} />
        ) : (
          <Avatar className={classes.profilePic}>{getUserAvatar()}</Avatar>
        )}
        <Box ml={4} className={clsx(classes.userInfo, 'user-info')}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box mb={0} className={clsx(classes.userName)}>
              {user.displayName ? user.displayName : 'Admin User '}
            </Box>
            <Box
              ml={0}
              className={classes.pointer}
              color={themeMode === 'light' ? '#313541' : 'white'}
            >
              <ExpandMoreIcon onClick={handleClick} />
              <Menu
                id='simple-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem
                  onClick={() => {
                    if (user && user.authType === 'jwt_auth') {
                      dispatch(onJWTAuthSignout());
                    }
                  }}
                >
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </Box>
          </Box>
          <Box className={classes.designation}>{user.correo_electronico}</Box>
        </Box>
      </Box>
    </Box>
  );
};

export default UserInfo;
