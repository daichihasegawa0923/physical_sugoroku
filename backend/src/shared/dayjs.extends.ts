import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

export default () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  dayjs.tz.setDefault('Asia/Tokyo');
  return dayjs().tz();
};
