import * as types from "../constants/actionTypes";
import service from "../service";

export const getFcConfig = async (dispatch, params) => {
   const data = await service.post(params);
   dispatch({
      type: types.RECEIVE_CONFIG,
      payload: data
   });
};
