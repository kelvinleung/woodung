const Register = {
  REGISTER_SUCCESS: {
    code: 0,
    message: "Registered successfully.",
  },
  UNKNOWN_ERROR: {
    code: 1000,
    message: "Unknown error.",
  },
  USER_EXIST: {
    code: 1001,
    message: "User already registered.",
  },
};

const Login = {
  LOGIN_SUCCESS: {
    code: 0,
    message: "Login successfully.",
  },
  UNKNOWN_ERROR: {
    code: 2000,
    message: "Unknown error.",
  },
  USER_PASSWORD_INCORRECT: {
    code: 2001,
    message: "User or password incorrect.",
  },
};

const Quiz = {
  CREATE_SUCCESS: {
    code: 0,
    message: "Quiz created successfully.",
  },
  CREATE_ERROR: {
    code: 3001,
    message: "Error creating quiz.",
  },
  DELETE_SUCCESS: {
    code: 0,
    message: "Quiz deleted successfully.",
  },
  DELETE_NOT_FOUND: {
    code: 3101,
    message: "Error, quiz not found.",
  },
  DELETE_ERROR: {
    code: 3102,
    message: "Error deleting quiz.",
  },
  UPDATE_SUCCESS: {
    code: 0,
    message: "Quiz updated successfully.",
  },
  UPDATE_NOT_FOUND: {
    code: 3201,
    message: "Error, quiz not found.",
  },
  UPDATE_ERROR: {
    code: 3202,
    message: "Error updating quiz.",
  },
  GET_BY_ID_SUCCESS: {
    code: 0,
    message: "OK.",
  },
  GET_BY_ID_NOT_FOUND: {
    code: 3301,
    message: "Quiz not found.",
  },
  GET_BY_ID_ERROR: {
    code: 3302,
    message: "Error getting quiz.",
  },
  GET_ALL_SUCCESS: {
    code: 0,
    message: "OK.",
  },
  GET_ALL_ERROR: {
    code: 3401,
    message: "Error getting all quizzes.",
  },
};

module.exports = { Register, Login, Quiz };
