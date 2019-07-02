import { 
  postServerMembership, 
  deleteServerMembership, 
  patchServerMembership, 
  getServerMembershipsByServerId
} from '../util/server_membership_api_util';
import { patchInviteUses, getInviteByCode } from '../util/server_invite_api_util';
import { receiveServer, removeServer } from './servers_actions';
import { receiveUsers } from './users_actions';
import { focusServer } from './ui_actions';
import { receiveErrors } from './errors_actions';

export const RECEIVE_MEMBERSHIP = "RECEIVE_MEMBERSHIP";
export const RECEIVE_MEMBERSHIPS = "RECEIVE_MEMBERSHIPS";
export const REMOVE_MEMBERSHIP = "REMOVE_MEMBERSHIP";

const receiveServerMembership = membership => ({
  type: RECEIVE_MEMBERSHIP,
  membership
});

const receiveServerMemberships = memberships => ({
  type: RECEIVE_MEMBERSHIPS,
  memberships
});

const removeServerMembership = membershipId => ({
  type: REMOVE_MEMBERSHIP,
  membershipId
});

export const fetchServerMembershipsByServerId = serverId => dispatch => {
  return getServerMembershipsByServerId(serverId)
    .then(payload => {
    
      dispatch(receiveServerMemberships(payload.server_memberships));      
      dispatch(receiveUsers(payload.users));
    })}
;

export const joinServerByCode = (code) => dispatch => (
  getInviteByCode(code)
    .then(invite => {
      dispatch(
        joinServer(invite.server_id)
      ).then(() => (patchInviteUses(invite.id)));
      return invite.server_id
    }, errors => dispatch(receiveErrors(errors.responseJSON)))
);

export const joinServer = serverId => dispatch => (
  postServerMembership(serverId)
    .then(payload => {
      dispatch(receiveServerMembership(payload.server_membership));
      dispatch(receiveServer(payload.server));
      dispatch(focusServer(payload.server.id));
    }, errors => dispatch(receiveErrors(errors.responseJSON)))
);

export const leaveServer = serverMembershipId => dispatch => (
  deleteServerMembership(serverMembershipId)
    .then(payload => {
      dispatch(removeServerMembership(payload.membershipId));
      dispatch(removeServer(payload.serverId));
      dispatch(focusServer("@me"));
    })
);

export const changeNickname = (id, nickname) => dispatch => (
  patchServerMembership(id, nickname)
    .then(serverMembership => {
      dispatch(receiveServerMembership(serverMembership));      
    })
);