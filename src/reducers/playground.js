import { CONVERT_HC_TO_FC } from "../constants/actionTypes";

export default (state = {}, action) => {
   switch (action.type) {
      case CONVERT_HC_TO_FC:
         return {
            ...state,
            fcConfiguration: action.payload
         };

      default:
         return state;
   }
};
