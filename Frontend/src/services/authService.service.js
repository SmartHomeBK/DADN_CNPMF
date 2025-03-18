import { http } from "./config.service";

export const authService = {
  signin: (data) => {
    console.log("data: ", data);
    return "thành công";
  },
};
