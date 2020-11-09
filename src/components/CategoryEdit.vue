<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ "Edit" | localize }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
              >{{ category.title }}
            </option>
          </select>
          <label>{{ "SelectCategory" | localize }}</label>
        </div>

        <div class="input-field">
          <input
            id="name"
            type="text"
            v-model="title"
            :class="{ invalid: $v.title.$dirty && !$v.title.required }"
          />
          <label for="name">{{ "Title" | localize }}</label>
          <span
            class="helper-text invalid"
            v-if="$v.title.$dirty && !$v.title.required"
            >{{ "Message_CategoryTitle" | localize }}</span
          >
        </div>

        <div class="input-field">
          <input
            id="limit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: $v.limit.$dirty && !$v.limit.minValue }"
          />
          <label for="limit">{{ "Limit" | localize }}</label>
          <span
            class="helper-text invalid"
            v-if="$v.limit.$dirty && !$v.limit.minValue"
            >{{ "Message_MinLength" | localize }} 100</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ "ProfileButton" | localize }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { minValue, required } from "vuelidate/lib/validators";

export default {
  data: () => ({
    title: "",
    limit: 100,
    select: null,
    current: null
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(100) }
  },
  props: ["categories"],
  mounted() {
    // eslint-disable-next-line no-undef
    this.select = M.FormSelect.init(this.$refs.select);
    // eslint-disable-next-line no-undef
    M.updateTextFields();
  },
  created() {
    const { id, title, limit } = this.categories[0];
    this.current = id;
    this.title = title;
    this.limit = limit;
  },
  watch: {
    current(id) {
      const { title, limit } = this.categories.find(c => c.id === id);
      this.title = title;
      this.limit = limit;
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      try {
        const categoryData = {
          title: this.title,
          limit: this.limit,
          id: this.current
        };

        await this.$store.dispatch("updateCategory", categoryData);

        this.title = "";
        this.limit = 100;
        this.$v.$reset();
        this.$message(
          this.$store.getters.info.locale === "ru-RU"
            ? "Категория успешно обновлена"
            : "Category has been updated"
        );
        this.$emit("updated", categoryData);
      } catch (e) {
        console.log(e);
      }
    }
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  }
};
</script>
