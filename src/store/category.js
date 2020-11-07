import firebase from "firebase";

export default {
  state: {},
  getters: {},
  actions: {
    async createCategory({ commit, dispatch }, { title, limit }) {
      try {
        const uid = await dispatch("getUid");
        const category = await firebase
          .database()
          .ref(`/users/${uid}/categories`)
          .push({ title, limit });

        return { title, limit, id: category.key };
      } catch (e) {
        commit("setError", e);
        throw new Error(e);
      }
    },
    async updateCategory({ commit, dispatch }, { title, limit, id }) {
      try {
        const uid = await dispatch("getUid");
        await firebase
          .database()
          .ref(`/users/${uid}/categories/${id}`)
          .update({ title, limit });
      } catch (e) {
        commit("setError", e);
        throw new Error(e);
      }
    },
    async getCategories({ commit, dispatch }) {
      try {
        const uid = await dispatch("getUid");
        const categories =
          (
            await firebase
              .database()
              .ref(`users/${uid}/categories`)
              .once("value")
          ).val() || [];

        return Object.keys(categories).map(id => ({ ...categories[id], id }));
      } catch (e) {
        commit("setError", e);
        throw new Error(e);
      }
    }
  }
};
