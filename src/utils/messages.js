import localizeFilter from "@/filters/localize.filter";

export default {
  logout: localizeFilter("Logout"),
  login: localizeFilter("FirstLogin"),
  "auth/user-not-found": localizeFilter("NoUserWithEmail"),
  "auth/wrong-password": localizeFilter("WrongPassword"),
  "auth/email-already-in-use": localizeFilter("EmailInUse")
};
