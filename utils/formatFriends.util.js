export default (friends) =>
  friends.map(
    ({ _id, firstName, lastName, occupation, location, userPicturePath, lastOnline }) => ({
      userId: _id,
      firstName,
      lastName,
      occupation,
      location,
      userPicturePath,
      lastOnline
    })
  );
