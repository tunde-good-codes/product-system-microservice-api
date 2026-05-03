export type UserContext = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  isAdmin: boolean;
};
