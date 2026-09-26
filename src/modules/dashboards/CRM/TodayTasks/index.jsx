import React from 'react';
import TaskList from './TaskList';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import DateSelector from './DateSelector';
import IntlMessages from '@crema/helpers/IntlMessages';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { grey } from '@mui/material/colors';
import AppCard from '@crema/components/AppCard';
import { useIntl } from 'react-intl';

const TodayTasks = ({ todayTaskData = [] }) => {
  const { messages } = useIntl();
  return (
    <AppCard
      title={messages['dashboard.todayTasks']}
      sxStyle={{ height: 1 }}
      action={
        <Box>
          <Link
            sx={{
              fontSize: 14,
              px: { xs: 2, sm: 5 },
              color: grey[500],
            }}
            component="button"
            underline="none"
          >
            <IntlMessages id="common.createTask" />
          </Link>
          <Link
            sx={{
              fontSize: 14,
              px: { xs: 2, sm: 5 },
            }}
            color="secondary"
            component="button"
            underline="none"
          >
            <IntlMessages id="common.viewAll" />
          </Link>
        </Box>
      }
    >
      <Grid container spacing={5}>
        <Grid
          size={{
            xs: 12,
            md: 6,
            xl: 7
          }}>
          <TaskList todayTaskData={todayTaskData} />
        </Grid>

        <Grid
          size={{
            xs: 12,
            md: 6,
            xl: 5
          }}>
          <DateSelector />
        </Grid>
      </Grid>
    </AppCard>
  );
};

export default TodayTasks;

TodayTasks.propTypes = {
  todayTaskData: PropTypes.array,
};
