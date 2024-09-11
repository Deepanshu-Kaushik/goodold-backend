export const createNotificationWithType = (type, { firstName, lastName }) => {
  if (type === 'like') {
    return `${firstName} ${lastName} liked your post`;
  } else if (type === 'comment') {
    return `${firstName} ${lastName} commented on your post`;
  } else if (type === 'friend-request') {
    return `${firstName} ${lastName} sent you a friend request`;
  } else {
    throw new Error('Invalid request! Please try again');
  }
};
