<template>
  <div>
    <div class="page-title">
      <h3>{{ "ProfileTitle" | localize }}</h3>
    </div>

    <form class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="name"
          :class="{ invalid: $v.name.$dirty && !$v.name.required }"
        />
        <label for="description">{{ "ProfileName" | localize }}</label>
        <span
          class="helper-text invalid"
          v-if="$v.name.$dirty && !$v.name.required"
        >
          {{ "ProfileHelperText" | localize }}
        </span>
      </div>

      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale" />
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ "ProfileButton" | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { required } from "vuelidate/lib/validators";
export default {
  metaInfo() {
    return {
      title: this.$title("ProfileTitle")
    };
  },
  data: () => ({
    name: "",
    isRuLocale: true
  }),
  validations: {
    name: { required }
  },
  computed: {
    ...mapGetters(["info"])
  },
  methods: {
    ...mapActions(["updateInfo"]),
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      try {
        await this.updateInfo({
          name: this.name,
          locale: this.isRuLocale ? "ru-RU" : "en-EN"
        });
        this.$message(
          this.isRuLocale
            ? "Настройки успешно обновлены!"
            : "Settings updated successfully!"
        );
      } catch (e) {
        this.$message(
          this.isRuLocale ? "Что-то пошло не так" : "Something went wrong"
        );
      }
    }
  },
  async mounted() {
    this.isRuLocale = this.info.locale === "ru-RU";
    this.name = this.info.name;
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      M.updateTextFields();
    }, 0);
  }
};
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>
