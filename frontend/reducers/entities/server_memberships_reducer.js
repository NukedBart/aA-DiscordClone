
import { RECEIVE_MEMBERSHIP, RECEIVE_MEMBERSHIPS, REMOVE_MEMBERSHIP } from "../../actions/server_memberships_actions";


const serverMembershipsReducer = (state = {}, action) => {
  Object.freeze(state);
  switch (action.type) {
    case RECEIVE_MEMBERSHIP:
      return Object.assign({}, state, { [action.membership.id]: action.membership })
    case RECEIVE_MEMBERSHIPS:
      return Object.assign({}, state, action.memberships)
    case REMOVE_MEMBERSHIP:
      const newObj = Object.assign({}, state);
      delete newObj[action.membershipId];
      return newObj
    default:
      return state;
  }
}

export default serverMembershipsReducer;
