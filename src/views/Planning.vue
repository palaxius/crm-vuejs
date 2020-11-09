<template>
  <div>
    <div class="page-title">
      <h3>{{ "Menu_Planning" | localize }}</h3>
      <h4>{{ info.bill | currency("RUB") }}</h4>
    </div>

    <section>
      <Loader v-if="loading" />
      <p class="center" v-else-if="!categories.length">
        {{ "NoCategories" | localize }}
        <router-link to="/categories">{{
          "CreateCategory" | localize
        }}</router-link>
      </p>

      <div v-for="category in categories" :key="category.id" v-else>
        <p>
          <strong>{{ category.title }}:</strong>
          {{ category.spend | currency }} {{ "Of" | localize }}
          {{ category.limit | currency("RUB") }}
        </p>
        <div class="progress" v-tooltip.noloc="category.tooltip">
          <div
            v-bind:style="{ width: category.progressPercent + '%' }"
            class="determinate"
            :class="[category.progressColor]"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import currencyFilter from "@/filters/currency.filter";
import localizeFilter from "@/filters/localize.filter";

export default {
  name: "Planning",
  metaInfo() {
    return {
      title: this.$title("Menu_Planning")
    };
  },
  computed: {
    ...mapGetters(["info"])
  },
  data: () => ({
    bill: null,
    categories: [],
    records: [],
    loading: true
  }),
  async mounted() {
    this.bill = this.$store.getters.info.bill;
    const records = await this.$store.dispatch("getRecords");
    const categories = await this.$store.dispatch("getCategories");

    this.categories = categories.map(cat => {
      const spend = records
        .filter(rec => rec.categoryId === cat.id)
        .filter(rec => rec.type === "outcome")
        .reduce((total, record) => {
          return (total += +record.amount);
        }, 0);

      const percent = (100 * spend) / cat.limit;
      const progressPercent = percent > 100 ? 100 : percent;
      const progressColor =
        percent < 60 ? "green" : percent < 100 ? "yellow" : "red";

      const tooltipValue = cat.limit - spend;
      const tooltip = `${
        tooltipValue < 0 ? localizeFilter("MoreThan") : localizeFilter("Stayed")
      } ${currencyFilter(Math.abs(tooltipValue))}`;

      return {
        ...cat,
        progressPercent,
        progressColor,
        spend,
        tooltip
      };
    });
    this.loading = false;
  }
};
</script>
