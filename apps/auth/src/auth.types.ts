export type UserContext = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user" |"ADMIN" | "USER";
  isAdmin: boolean;
};
