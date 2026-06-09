import { CURRENT_USER } from "../data/mock/authData";

export const getCurrentUser = async () => {
  return CURRENT_USER;
};

export const loginUser = async (data) => {
  return {
    success: true,
    user: CURRENT_USER,
  };
};

export const registerUser = async (data) => {
  return {
    success: true,
    user: CURRENT_USER,
  };
};

export const forgotPassword = async (data) => {
  return {
    success: true,
    message: "Reset link sent",
  };
};