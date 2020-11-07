import firebase from "firebase";

export default {
  actions: {
    async createRecord({ dispatch, commit }, record) {
      try {
        const uid = await dispatch("getUid");
        return await firebase
          .database()
          .ref(`/users/${uid}/records`)
          .push(record);
      } catch (e) {
        commit("setError", e);
        throw new Error(e);
      }
    }
  }
};
