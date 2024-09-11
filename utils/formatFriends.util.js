export default (friends) =>
  friends.map(
    ({ _id, firstName, lastName, occupation, location, userPicturePath, lastOnline }) => ({
      _id,
      userId: _id,
      firstName,
      lastName,
      occupation,
      location,
      userPicturePath,
      lastOnline
    })
  );
