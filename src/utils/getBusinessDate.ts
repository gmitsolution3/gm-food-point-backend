import { BUSINESS } from "../constants/business.constant";
import getBusinessNow from "./getBusinessNow";

const getBusinessDate = (): string => {
  return getBusinessNow().format(BUSINESS.DATE_FORMAT);
};

export default getBusinessDate;
