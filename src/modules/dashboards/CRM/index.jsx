import React from 'react';
import { Grid } from '@mui/material';
import AppGridContainer from '@crema/components/AppGridContainer';
import AppAnimate from '@crema/components/AppAnimate';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import SocialMediaAdvertise from './SocialMediaAdvertise';
import GoalProgress from './GoalProgress';
import TicketSupport from './TicketSupport';
import VisitorsPageViews from './VisitorsPageViews';
import EmailMarketing from './EmailMarketing';
import OpportunitiesWon from './OpportunitiesWon';
import DealsNew from './DealsNew';
import RecentActivities from './RecentActivities';
import Report from './Report';
import TeamState from './TeamState';
import Timesheet from './Timesheet';
import ToDoLists from './ToDoLists';
import TopLeaders from './TopLeaders';
import TotalVisitor from './TotalVisitor';
import AppLoader from '@crema/components/AppLoader';
import { StatsDirCard } from '../CommonComponents';

const CRM = () => {
  const [{ apiData: crmData, loading }] = useGetDataApi('/dashboard/crm');

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation="transition.slideUpIn" delay={200}>
          <AppGridContainer>
            {crmData.stateData.map((data) => (
              <Grid
                key={data.id}
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3
                }}>
                <StatsDirCard data={data} />
              </Grid>
            ))}
            <Grid
              size={{
                xs: 12,
                md: 8
              }}>
              <VisitorsPageViews data={crmData.visitorPageView} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 4
              }}>
              <OpportunitiesWon data={crmData.opportunitiesWonGraphData} />
            </Grid>
            {crmData.teamStateData.map((data) => (
              <Grid
                key={data.id}
                size={{
                  xs: 12,
                  md: 6,
                  lg: 3
                }}>
                <TeamState data={data} />
              </Grid>
            ))}
            <Grid
              size={{
                xs: 12,
                md: 7,
                xl: 9
              }}>
              <TopLeaders topLeaders={crmData.topLeaders} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 5,
                xl: 3
              }}>
              <EmailMarketing emailMarketing={crmData.emailMarketing} />
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 12,
                lg: 12,
                xl: 9
              }}>
              <AppGridContainer>
                <Grid
                  size={{
                    xs: 12,
                    md: 12,
                    lg: 8
                  }}>
                  <AppGridContainer>
                    <Grid
                      size={{
                        xs: 12,
                        md: 12,
                        lg: 12
                      }}>
                      <Timesheet timesheet={crmData.timesheet} />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        md: 12,
                        lg: 12
                      }}>
                      <ToDoLists data={crmData.todoLists} />
                    </Grid>
                  </AppGridContainer>
                </Grid>
                <Grid
                  size={{
                    xs: 12,
                    md: 12,
                    lg: 4
                  }}>
                  <AppGridContainer>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                        lg: 12
                      }}>
                      <Report />
                    </Grid>
                    <Grid
                      size={{
                        xs: 12,
                        sm: 6,
                        lg: 12
                      }}>
                      <SocialMediaAdvertise socialMediaData={crmData.socialMediaData} />
                    </Grid>
                  </AppGridContainer>
                </Grid>
              </AppGridContainer>
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 12,
                lg: 12,
                xl: 3
              }}>
              <RecentActivities data={crmData.recentActivities} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 12,
                lg: 12,
                xl: 8
              }}>
              <DealsNew dealsTableData={crmData.dealsTableData} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 12,
                lg: 12,
                xl: 4
              }}>
              <TotalVisitor totalVisitors={crmData.totalVisitors} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 12,
                lg: 12,
                xl: 8
              }}>
              <TicketSupport ticketSupportData={crmData.ticketSupportData} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 12,
                lg: 12,
                xl: 4
              }}>
              <GoalProgress progressGraphData={crmData.progressGraphData} />
            </Grid>
          </AppGridContainer>
        </AppAnimate>
      )}
    </>
  );
};

export default CRM;
