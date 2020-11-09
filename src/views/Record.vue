<template>
  <div>
    <div class="page-title">
      <h3>{{ "Menu_Record" | localize }}</h3>
    </div>

    <Loader v-if="loading" />

    <p class="center" v-else-if="!categories.length">
      {{ "NoCategories" | localize }}.
      <router-link to="/categories">{{ "AddCategory" | localize }}</router-link>
    </p>

    <form class="form" v-else @submit.prevent="submitHandler">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.title }}
          </option>
        </select>
        <label>{{ "SelectCategory" | localize }}</label>
      </div>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="income"
            v-model="type"
          />
          <span>{{ "Income" | localize }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
            v-model="type"
          />
          <span>{{ "Outcome" | localize }}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }"
        />
        <label for="amount">{{ "Amount" | localize }}</label>
        <span
          class="helper-text invalid"
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          >{{ "MinValue" | localize }}</span
        >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: $v.description.$dirty && !$v.description.required
          }"
        />
        <label for="description">{{ "Description" | localize }}</label>
        <span
          class="helper-text invalid"
          v-if="$v.description.$dirty && !$v.description.required"
          >{{ "Message_EnterDescription" | localize }}</span
        >
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ "Create" | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { minValue, required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  metaInfo() {
    return {
      title: this.$title("Menu_Record")
    };
  },
  data: () => ({
    categories: [],
    loading: true,
    select: null,
    category: null,
    type: "income",
    amount: 1,
    description: ""
  }),
  validations: {
    amount: { minValue: minValue(1) },
    description: { required }
  },
  computed: {
    ...mapGetters(["info"]),
    canCreateRecord() {
      if (this.type === "income") {
        return true;
      }

      return this.info.bill >= this.amount;
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      try {
        if (this.canCreateRecord) {
          await this.$store.dispatch("createRecord", {
            categoryId: this.category,
            type: this.type,
            amount: this.amount,
            description: this.description,
            date: new Date().toJSON()
          });
          const bill =
            this.type === "income"
              ? this.info.bill + this.amount
              : this.info.bill - this.amount;

          await this.$store.dispatch("updateInfo", { bill });
          this.$message(
            this.$store.getters.info.locale === "ru-RU"
              ? "Запись успешно создана!"
              : "Record has been created!"
          );
          this.$v.$reset();
          this.type = "income";
          this.amount = 1;
          this.description = "";
        } else {
          this.$message(
            this.$store.getters.info.locale === "ru-RU"
              ? `Недостаточно средств на счете (${this.amount -
                  this.info.bill})`
              : `Not enough money (${this.amount - this.info.bill})`
          );
        }
      } catch (e) {
        this.$message("Что-то пошло не так...");
      }
    }
  },
  async mounted() {
    this.categories = await this.$store.dispatch("getCategories");
    this.loading = false;

    if (this.categories.length) {
      this.category = this.categories[0].id;
    }
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      this.select = M.FormSelect.init(this.$refs.select);
      // eslint-disable-next-line no-undef
      M.updateTextFields();
    }, 0);
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  }
};
</script>
