import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import "dotenv/config";

import { BUSINESS } from "../constants/business.constant";

dayjs.extend(utc);
dayjs.extend(timezone);

const getBusinessNow = () => {
  return dayjs().tz(BUSINESS.TIMEZONE);
};

export default getBusinessNow;
