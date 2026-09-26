import { BlockPicker, ChromePicker, CirclePicker, CompactPicker, GithubPicker, TwitterPicker } from 'react-color';

import Basic from './Basic';
import BasicSource from './Basic?raw';
import CustomPicker from './CustomPicker';
import CustomPickerSource from './CustomPicker?raw';
// import WithRedux from './WithRedux';
// import WithReduxSource from './WithRedux?raw';
import AppComponentCard from '@crema/components/AppComponentCard';
import AppComponentHeader from '@crema/components/AppComponentHeader';
import AppGridContainer from '@crema/components/AppGridContainer';
import Grid from '@mui/material/Grid';

const ColorPicker = () => {
  return (
    <>
      <AppComponentHeader
        title="React Color"
        description="13 Different Pickers - Sketch, Photoshop, Chrome and many more, Use the building block components to make your own "
        refUrl="http://casesandberg.github.io/react-color/"
      />
      <AppGridContainer>
        <Grid
          size={{
            xs: 12,
            lg: 6
          }}>
          <AppComponentCard title="Circle Picker" component={CirclePicker} />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6
          }}>
          <AppComponentCard title="Compact Picker" component={CompactPicker} />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6
          }}>
          <AppComponentCard title="Block Picker" component={BlockPicker} />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6
          }}>
          <AppComponentCard title="Chrome Picker" component={ChromePicker} />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6
          }}>
          <AppComponentCard title="Github Picker" component={GithubPicker} />
        </Grid>
        <Grid
          size={{
            xs: 12,
            lg: 6
          }}>
          <AppComponentCard title="Twitter Picker" component={TwitterPicker} />
        </Grid>
        {/*<Grid item xs={12} lg={6}>*/}
        {/*  <AppComponentCard*/}
        {/*    title='WithRedux Picker'*/}
        {/*    component={WithRedux}*/}
        {/*    source={WithReduxSource}*/}
        {/*  />*/}
        {/*</Grid>*/}
        <Grid
          size={{
            xs: 12,
            lg: 6
          }}>
          <AppGridContainer>
            <Grid size={12}>
              <AppComponentCard title="Custom Picker" component={CustomPicker} source={CustomPickerSource} />
            </Grid>
            <Grid size={12}>
              <AppComponentCard title="Basic Picker" component={Basic} source={BasicSource} />
            </Grid>
          </AppGridContainer>
        </Grid>
      </AppGridContainer>
    </>
  );
};

export default ColorPicker;
