export default (posts) =>
  posts.map(
    ({
      _id,
      userId,
      firstName,
      lastName,
      location,
      description,
      postPicturePath,
      userPicturePath,
      likes,
      comments,
    }) => ({
      postId: _id,
      userId,
      firstName,
      lastName,
      location,
      description,
      postPicturePath,
      userPicturePath,
      likes,
      comments,
    })
  );
