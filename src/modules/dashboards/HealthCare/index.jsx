import React from 'react';
import { Grid } from '@mui/material';
import AppGridContainer from '@crema/components/AppGridContainer';
import AppAnimate from '@crema/components/AppAnimate';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import DrCard from './DrCard';
import Activities from './Activities';
import HealthStatics from './HealthStatics';
import TopDoctors from './TopDoctors';
import UpcomingAppointments from './UpcomingAppointments';
import Notifications from './Notifications';
import HospitalStatics from './HospitalStatics';
import RecentPatients from './RecentPatients';
import InfoWidget from './InfoWidget';
import HospitalActivity from './HospitalActivity';
import ProfileCard from './ProfileCard';
import AppointmentCard from './AppointmentCard';
import HeartRate from './HeartRate';
import YourActivity from './YourActivity';
import AppLoader from '@crema/components/AppLoader';

const HealthCare = () => {
  const [{ apiData: healthCare, loading }] = useGetDataApi('/dashboard/health_care');

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <AppAnimate animation="transition.slideUpIn" delay={200}>
          <AppGridContainer>
            {healthCare.salesState.map((data, index) => (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3
                }}>
                <DrCard data={data} />
              </Grid>
            ))}

            <Grid
              size={{
                xs: 12,
                sm: 12,
                md: 6
              }}>
              <HospitalActivity data={healthCare.hospitalActivity} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <ProfileCard />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <AppGridContainer>
                {healthCare.appointmentCards.map((data, index) => (
                  <Grid key={index} size={12}>
                    <AppointmentCard data={data} />
                  </Grid>
                ))}
              </AppGridContainer>
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 12,
                lg: 4
              }}>
              <TopDoctors data={healthCare.topDoctors} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                lg: 4
              }}>
              <UpcomingAppointments data={healthCare.upcomingAppointment} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                lg: 4
              }}>
              <Notifications data={healthCare.notifications} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <HeartRate data={healthCare.heartCard} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <YourActivity data={healthCare.yourActivity} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <HeartRate data={healthCare.temperatureCard} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 6,
                md: 3
              }}>
              <AppGridContainer>
                {healthCare.doses.map((data, index) => (
                  <Grid key={index} size={12}>
                    <HospitalStatics data={data} />
                  </Grid>
                ))}
              </AppGridContainer>
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <HealthStatics data={healthCare.heathStatics} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                md: 6
              }}>
              <Activities activities={healthCare.activities} />
            </Grid>

            {healthCare.hospitalStatics.map((data, index) => (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  sm: 6,
                  md: 3
                }}>
                <HospitalStatics data={data} />
              </Grid>
            ))}
            <Grid
              size={{
                xs: 12,
                sm: 12,
                md: 8,
                lg: 7,
                xl: 8
              }}>
              <RecentPatients recentPatients={healthCare.recentPatients} />
            </Grid>
            <Grid
              size={{
                xs: 12,
                sm: 12,
                md: 4,
                lg: 5,
                xl: 4
              }}>
              <AppGridContainer>
                {healthCare.bloodCard.map((data, index) => (
                  <Grid
                    key={'grid-' + index}
                    size={{
                      xs: 12,
                      sm: 6
                    }}>
                    <InfoWidget data={data} />
                  </Grid>
                ))}
              </AppGridContainer>
            </Grid>
          </AppGridContainer>
        </AppAnimate>
      )}
    </>
  );
};

export default HealthCare;
