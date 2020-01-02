import * as types from "../constants/ActionTypes";

export const getFcConfig = payload => ({
   type: types.CONVERT_HC_TO_FC,
   payload
});
