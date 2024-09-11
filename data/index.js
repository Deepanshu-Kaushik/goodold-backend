import mongoose from "mongoose";

const userIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
];

export const users = [
  {
    _id: userIds[0],
    firstName: "test",
    lastName: "me",
    email: "aaaaaaa@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925362/p11_mtcbjs.jpg",
    userPictureId: "p11_mtcbjs",
    friends: [],
    location: "San Fran, CA",
    occupation: "Software Engineer",
    createdAt: 1115211422,
    updatedAt: 1115211422,
    __v: 0,
  },
  {
    _id: userIds[1],
    firstName: "Steve",
    lastName: "Ralph",
    email: "thataaa@gmail.com",
    password: "$!FEAS@!O)_IDJda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925362/p12_skqgj2.jpg",
    userPictureId: "p12_skqgj2",
    friends: [],
    location: "New York, CA",
    occupation: "Degenerate",
    createdAt: 1595589072,
    updatedAt: 1595589072,
    __v: 0,
  },
  {
    _id: userIds[2],
    firstName: "Some",
    lastName: "Guy",
    email: "someguy@gmail.com",
    password: "da39a3ee5e6b4b0d3255bfef95601890afd80709",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925362/p4_csoxgw.jpg",
    userPictureId: "p4_csoxgw",
    friends: [],
    location: "Canada, CA",
    occupation: "Data Scientist Hacker",
    createdAt: 1288090662,
    updatedAt: 1288090662,
    __v: 0,
  },
  {
    _id: userIds[3],
    firstName: "Whatcha",
    lastName: "Doing",
    email: "whatchadoing@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925362/p6_wod8ur.jpg",
    userPictureId: "p6_wod8ur",
    friends: [],
    location: "Korea, CA",
    occupation: "Educator",
    createdAt: 1219214568,
    updatedAt: 1219214568,
    __v: 0,
  },
  {
    _id: userIds[4],
    firstName: "Jane",
    lastName: "Doe",
    email: "janedoe@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925362/p5_z2wvbf.jpg",
    userPictureId: "p5_z2wvbf",
    friends: [],
    location: "Utah, CA",
    occupation: "Hacker",
    createdAt: 1493463661,
    updatedAt: 1493463661,
    __v: 0,
  },
  {
    _id: userIds[5],
    firstName: "Harvey",
    lastName: "Dunn",
    email: "harveydunn@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925362/p7_z573bh.jpg",
    userPictureId: "p7_z573bh",
    friends: [],
    location: "Los Angeles, CA",
    occupation: "Journalist",
    createdAt: 1381326073,
    updatedAt: 1381326073,
    __v: 0,
  },
  {
    _id: userIds[6],
    firstName: "Carly",
    lastName: "Vowel",
    email: "carlyvowel@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925363/p8_x8y5py.jpg",
    userPictureId: "p8_x8y5py",
    friends: [],
    location: "Chicago, IL",
    occupation: "Nurse",
    createdAt: 1714704324,
    updatedAt: 1642716557,
    __v: 0,
  },
  {
    _id: userIds[7],
    firstName: "Jessica",
    lastName: "Dunn",
    email: "jessicadunn@gmail.com",
    password: "$2b$10$dsasdgsagasda//G9JxQ4bQ8KXf4OAIe/X/AK9skyWUy",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925363/p9_ku4lww.jpg",
    userPictureId: "p9_ku4lww",
    friends: [],
    location: "Washington, DC",
    occupation: "A Student",
    createdAt: 1369908044,
    updatedAt: 1359322268,
    __v: 0,
  },
  {
    _id: userIds[8],
    firstName: "Deepanshu",
    lastName: "Kaushik",
    email: "deepanshuk522@gmail.com",
    password: "$2b$10$4sxVyC/UmEAnq9XvTA/Gi.rAa5PSyaMbLEwLwZfgrvPh75XxhJxGm",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1718083370/iijvyhdqcjnegnyxn9rw.jpg",
    userPictureId: "iijvyhdqcjnegnyxn9rw",
    friends: [],
    location: "New Delhi",
    occupation: "Software Engineer",
    createdAt: 1369908044,
    updatedAt: 1359322268,
    __v: 0,
  },
];

export const posts = [
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[1],
    firstName: "Steve",
    lastName: "Ralph",
    location: "New York, CA",
    description: "Some really long random description",
    postPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925363/post1_bciaxr.jpg",
    postPictureId: "post1_bciaxr",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925362/p12_skqgj2.jpg",
    likes: new Map([
      [userIds[0], true],
      [userIds[2], true],
      [userIds[3], true],
      [userIds[4], true],
    ]),
    comments: [
      "random comment",
      "another random comment",
      "yet another random comment",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[3],
    firstName: "Whatcha",
    lastName: "Doing",
    location: "Korea, CA",
    description:
      "Another really long random description. This one is longer than the previous one.",
    postPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925364/post2_g5vj8j.jpg",
    postPictureId: "post2_g5vj8j",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925362/p6_wod8ur.jpg",
    likes: new Map([
      [userIds[7], true],
      [userIds[4], true],
      [userIds[1], true],
      [userIds[2], true],
    ]),
    comments: [
      "one more random comment",
      "and another random comment",
      "no more random comments",
      "I lied, one more random comment",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[4],
    firstName: "Jane",
    lastName: "Doe",
    location: "Utah, CA",
    description:
      "This is the last really long random description. This one is longer than the previous one.",
    postPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925363/post3_qaoy6p.jpg",
    postPictureId: "post3_qaoy6p",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925362/p5_z2wvbf.jpg",
    likes: new Map([
      [userIds[1], true],
      [userIds[6], true],
      [userIds[3], true],
      [userIds[5], true],
    ]),
    comments: [
      "one more random comment",
      "I lied, one more random comment",
      "I lied again, one more random comment",
      "Why am I doing this?",
      "I'm bored",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[5],
    firstName: "Harvey",
    lastName: "Dunn",
    location: "Los Angeles, CA",
    description:
      "This is the last really long random description. This one is longer than the previous one. Man I'm bored. I'm going to keep typing until I run out of things to say.",
    postPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925364/post7_mgjizl.jpg",
    postPictureId: "post7_mgjizl",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925362/p7_z573bh.jpg",
    likes: new Map([
      [userIds[1], true],
      [userIds[6], true],
      [userIds[3], true],
    ]),
    comments: [
      "I lied again, one more random comment",
      "Why am I doing this?",
      "I'm bored",
      "I'm still bored",
      "All I want to do is play video games",
      "I'm going to play video games",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[6],
    firstName: "Carly",
    lastName: "Vowel",
    location: "Chicago, IL",
    description:
      "Just a short description. I'm tired of typing. I'm going to play video games now.",
    postPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925364/post5_vyldew.jpg",
    postPictureId: "post5_vyldew",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925363/p8_x8y5py.jpg",
    likes: new Map([
      [userIds[1], true],
      [userIds[3], true],
      [userIds[5], true],
      [userIds[7], true],
    ]),
    comments: [
      "I lied again, one more random comment",
      "Why am I doing this?",
      "Man I'm bored",
      "What should I do?",
      "I'm going to play video games",
    ],
  },
  {
    _id: new mongoose.Types.ObjectId(),
    userId: userIds[7],
    firstName: "Jessica",
    lastName: "Dunn",
    location: "Washington, DC",
    description:
      "For the last time, I'm going to play video games now. I'm tired of typing. I'm going to play video games now.",
    postPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925364/post6_fmtmvt.jpg",
    postPictureId: "post6_fmtmvt",
    userPicturePath:
      "https://res.cloudinary.com/deepanshu522/image/upload/v1717925363/p9_ku4lww.jpg",
    likes: new Map([
      [userIds[1], true],
      [userIds[2], true],
    ]),

    comments: [
      "Can I play video games now?",
      "No let's actually study",
      "Never mind, I'm going to play video games",
      "Stop it.",
      "Michael, stop it.",
    ],
  },
];
