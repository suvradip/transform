import { RECEIVE_CONFIG } from "../constants/actionTypes";

export default (state = {}, action) => {
   switch (action.type) {
      case RECEIVE_CONFIG:
         return { ...state, fcConfiguration: action.payload };
      default:
         return state;
   }
};
