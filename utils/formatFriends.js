export default (friends) =>
  friends.map(
    ({ _id, firstName, lastName, occupation, location, userPicturePath }) => ({
      userId: _id,
      firstName,
      lastName,
      occupation,
      location,
      userPicturePath,
    })
  );
