const INVITATION_STATUS = {
    NOT_ANSWER: 1,
    ACCEPT: 2,
    REJECT: 3
}
const allInvitationStatus = {
    1: "EXCEEDED_STORAGE_LIMIT",
    2: "PUBLISHED_STORE_BE_SENT_TO_DRAFT"
};

const invitationStatus = Object.keys(allInvitationStatus).map(el => +el);

module.exports = {
    INVITATION_STATUS,
    allInvitationStatus,
    invitationStatus
};