import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import IntlMessages from '@crema/helpers/IntlMessages';
import { BiUser } from 'react-icons/bi';
import { AiOutlineLock } from 'react-icons/ai';
import { IoMdInformationCircleOutline } from 'react-icons/io';
import { IoShareSocialOutline } from 'react-icons/io5';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import { accountData } from '@crema/mockapi';
import AppAnimate from '@crema/components/AppAnimate';
import { Fonts } from '@crema/constants/AppEnums';
import Social from './Social';
import Notification from './Notification';
import ChangePassword from './ChangePassword';
import Information from './Information';
import AccountTabsWrapper from './AccountTabsWrapper';
import PersonalInfo from './PersonalInfo';
import { useDispatch, useSelector } from 'react-redux';


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const tabs = [
  { id: 1, icon: <BiUser />, name: <IntlMessages id='common.personalInfo' /> },
  {
    id: 2,
    icon: <AiOutlineLock />,
    name: <IntlMessages id='common.changePassword' />,
  },
  // {
  //   id: 3,
  //   icon: <IoMdInformationCircleOutline />,
  //   name: <IntlMessages id='common.information' />,
  // },
  // {
  //   id: 4,
  //   icon: <IoShareSocialOutline />,
  //   name: <IntlMessages id='common.social' />,
  // },
];

const Account = () => {
  const [value, setValue] = React.useState(0);
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const [usuario, setUsuario] = React.useState('');
  const onTabsChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(()=>{
    setUsuario(user);
  }, [user, usuario])

  return (
    <Box>
      <AppAnimate animation='transition.slideDownIn' delay={300}>
        <Box
          component='h1'
          variant='h1'
          sx={{
            fontSize: 19,
            color: 'text.primary',
            fontWeight: Fonts.SEMI_BOLD,
            mb: {
              xs: 2,
              lg: 4,
            },
          }}
        >
          Mi cuenta
        </Box>
      </AppAnimate>
      <AccountTabsWrapper key='2'>
        <AppAnimate animation='transition.slideLeftIn' delay={300}>
          <Tabs
            className='account-tabs'
            value={value}
            onChange={onTabsChange}
            aria-label='basic tabs example'
            orientation='vertical'
          >
            {tabs.map((tab, index) => (
              <Tab
                className='account-tab'
                label={tab.name}
                icon={tab.icon}
                key={index}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </AppAnimate>
        <AppAnimate animation='transition.slideRightIn' delay={300}>
          <Box className='account-tabs-content'>
            {value === 0 && <PersonalInfo user={usuario} />}
            {value === 1 && <ChangePassword usuario={usuario} />}
            {value === 2 && <Information user={usuario} />}
            {value === 3 && <Social usuario={usuario} social={accountData.member} />}
          </Box>
        </AppAnimate>        
      </AccountTabsWrapper>
      
    </Box>
  );
};

export default Account;
