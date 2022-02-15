import * as React from 'react';
import { Theme, Radio, RadioGroup, Slider, Tooltip } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { COLOR_SPECTRUM } from 'components/Theme/colorSpectrum';
import { TimeZone } from './helpers';

function valueText(value: number) {
  return `${value}s`;
}

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
}));

const CustomSlider = withStyles({
  root: {
    color: COLOR_SPECTRUM.indigo60.color,
    height: 4,
    padding: '15px 0',
    width: 360
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 12px)',
    color: COLOR_SPECTRUM.black.color,
    top: -22,
    '& *': {
      background: 'transparent',
      color: COLOR_SPECTRUM.black.color
    }
  },
  track: {
    height: 4
  },
  rail: {
    height: 4,
    opacity: 0.5,
    backgroundColor: COLOR_SPECTRUM.gray20.color
  },
  mark: {
    backgroundColor: COLOR_SPECTRUM.gray20.color,
    height: 8,
    width: 2,
    marginTop: -2
  },
  markLabel: {
    top: -6,
    fontSize: 12,
    color: COLOR_SPECTRUM.gray40.color
  },
  markActive: {
    opacity: 1,
    backgroundColor: 'currentColor'
  },
  marked: {
    marginBottom: 0
  }
})(Slider);

const formatSeconds = t => {
  const time = Math.floor(t);
  if (time < 60) {
    return `${time}s`;
  }
  if (time % 60 === 0) {
    return `${Math.floor(time / 60)}m`;
  }
  return `${Math.floor(time / 60)}m ${time % 60}s`;
};

const percentage = [0, 0.1, 0.25, 0.5, 0.75, 1];

interface ExecutionTimelineFooterProps {
  maxTime: number;
  onTimezoneChange?: (timezone: string) => void;
  onTimeIntervalChange?: (interval: number) => void;
}

export const ExecutionTimelineFooter: React.FC<ExecutionTimelineFooterProps> = ({
  maxTime,
  onTimezoneChange,
  onTimeIntervalChange
}) => {
  const styles = useStyles();
  const [timezone, setTimezone] = React.useState(TimeZone.Local);
  const [timeInterval, setTimeInterval] = React.useState(1);

  const getTitle = React.useCallback(
    value => {
      return value === 0 ? '1s' : formatSeconds(maxTime * percentage[value]);
    },
    [maxTime]
  );

  const marks = React.useMemo(
    () =>
      percentage.map((_, index) => ({
        value: index,
        label: getTitle(index)
      })),
    [getTitle]
  );

  const handleTimezoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTimezone = (event.target as HTMLInputElement).value;
    setTimezone(newTimezone);
    if (onTimezoneChange) {
      onTimezoneChange(newTimezone);
    }
  };

  const handleTimeIntervalChange = (event, newValue) => {
    setTimeInterval(newValue);
    if (onTimeIntervalChange) {
      onTimeIntervalChange(newValue === 0 ? 1 : Math.floor(maxTime * percentage[newValue]));
    }
  };

  return (
    <div className={styles.container}>
      <CustomSlider
        value={timeInterval}
        onChange={handleTimeIntervalChange}
        marks={marks}
        max={5}
        ValueLabelComponent={({ children, open, value }) => (
          <Tooltip arrow open={open} enterTouchDelay={0} placement="top" title={getTitle(value)}>
            {children}
          </Tooltip>
        )}
        valueLabelDisplay="on"
        getAriaValueText={valueText}
      />
      <RadioGroup row aria-label="timezone" name="timezone" value={timezone} onChange={handleTimezoneChange}>
        <FormControlLabel value={TimeZone.Local} control={<Radio />} label="Local Time" />
        <FormControlLabel value={TimeZone.UTC} control={<Radio />} label="UTC" />
      </RadioGroup>
    </div>
  );
};
