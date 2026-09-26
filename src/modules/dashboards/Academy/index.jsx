import React from 'react';
import Box from '@mui/material/Box';
import AppGridContainer from '@crema/components/AppGridContainer';
import { Grid } from '@mui/material';
import { useGetDataApi } from '@crema/hooks/APIHooks';
import GeneralStats from './GeneralStats';
import CourseCategories from './CourseCategories';
import MyProfile from './MyProfile';
import MyCourses from './MyCourses';
import Notifications from './Notifications';
import CourseDetail from './CourseDetail';
import MyLearning from './MyLearning';
import LatestResults from './LatestResults';
import MyClass from './MyClass';
import StudentRankings from './StudentRankings';
import PromoCard from './PromoCard';
import AverageGrades from './AverageGrades';
import RelatedCourses from './RelatedCourses';
import VideoPromo from './VideoPromo';
import AppLoader from '@crema/components/AppLoader';

const Academy = () => {
  const [{ apiData: academyData, loading }] = useGetDataApi('/dashboard/academy');

  return (
    <>
      {loading ? (
        <AppLoader />
      ) : (
        <Box>
          <Box
            sx={{
              pb: { xs: 5, md: 8 },
            }}
          >
            <AppGridContainer>
              {academyData.academicStats.map((item, index) => (
                <Grid
                  key={index}
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 3
                  }}>
                  <GeneralStats stats={item} />
                </Grid>
              ))}

              {academyData.courseCategories.map((item, index) => (
                <Grid
                  key={index}
                  size={{
                    xs: 12,
                    sm: 6,
                    lg: 3
                  }}>
                  <CourseCategories course={item} />
                </Grid>
              ))}
            </AppGridContainer>
          </Box>

          <Box
            sx={{
              pb: { xs: 5, md: 8 },
            }}
          >
            <AppGridContainer>
              <Grid
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3
                }}>
                <MyProfile profile={academyData.profile} />
              </Grid>

              <Grid
                sx={{
                  order: { lg: 2 },
                }}
                size={{
                  xs: 12,
                  sm: 6,
                  lg: 3
                }}>
                <Notifications notifications={academyData.notifications} />
              </Grid>

              <Grid
                sx={{
                  order: { lg: 1 },
                }}
                size={{
                  xs: 12,
                  sm: 12,
                  lg: 6
                }}>
                <MyCourses courses={academyData.courses} />
              </Grid>
            </AppGridContainer>
          </Box>

          <AppGridContainer>
            {academyData.courseDetails.map((item, index) => (
              <Grid
                key={index}
                size={{
                  xs: 12,
                  sm: 12,
                  md: 4
                }}>
                <CourseDetail course={item} />
              </Grid>
            ))}

            <Grid
              size={{
                xs: 12,
                sm: 12,
                md: 5,
                xl: 6
              }}>
              <VideoPromo videoPromo={academyData.videoPromo} />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 12,
                md: 7,
                xl: 6
              }}>
              <AppGridContainer>
                <Grid
                  size={{
                    xs: 12,
                    sm: 12,
                    md: 12
                  }}>
                  <MyLearning learningData={academyData.learningData} />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    xl: 6
                  }}>
                  <LatestResults latestResults={academyData.latestResults} />
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                    xl: 6
                  }}>
                  <MyClass classData={academyData.classData} />
                </Grid>
              </AppGridContainer>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 12,
                md: 9
              }}>
              <StudentRankings studentRankings={academyData.studentRankings} />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 12,
                md: 3
              }}>
              <PromoCard />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 12,
                md: 6
              }}>
              <AverageGrades grades={academyData.grades} />
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 12,
                md: 6
              }}>
              <RelatedCourses relatedCourses={academyData.relatedCourses} />
            </Grid>
          </AppGridContainer>
        </Box>
      )}
    </>
  );
};

export default Academy;
