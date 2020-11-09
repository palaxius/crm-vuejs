<template>
  <div>
    <div class="page-title">
      <h3>{{ "History_Title" | localize }}</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!records.length" class="center">
      {{ "NoRecords" | localize }}
      <router-link to="/record">{{ "CreateRecord" | localize }}</router-link>
    </p>
    <section v-else>
      <HistoryTable :records="items" />
      <Paginate
        v-model="page"
        :page-count="pageCount"
        :click-handler="pageChangeHandler"
        :prev-text="'Back' | localize"
        :next-text="'Forward' | localize"
        :container-class="'pagination'"
        :page-class="'waves-effect'"
      />
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/HistoryTable";
import paginationMixin from "@/mixins/pagination.mixin";
import { Pie } from "vue-chartjs";
import localizeFilter from "@/filters/localize.filter";
export default {
  components: { HistoryTable },
  metaInfo() {
    return {
      title: this.$title("Menu_History")
    };
  },
  data: () => ({
    records: [],
    loading: true
  }),
  extends: Pie,
  mixins: [paginationMixin],
  async mounted() {
    this.records = await this.$store.dispatch("getRecords");
    const categories = await this.$store.dispatch("getCategories");

    this.setup(categories);
    this.loading = false;
  },
  methods: {
    setup(categories) {
      this.setupPagination(
        this.records.map(rec => {
          return {
            ...rec,
            categoryName: categories.find(c => c.id === rec.categoryId).title,
            typeClass: rec.type === "income" ? "green" : "red",
            type:
              rec.type === "income"
                ? localizeFilter("Income")
                : localizeFilter("Outcome")
          };
        })
      );
      this.renderChart({
        labels: categories.map(cat => cat.title),
        datasets: [
          {
            label: "'CostsForCategories'",
            data: categories.map(c => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === c.id && r.type === "outcome") {
                  total += +r.amount;
                }
                return total;
              }, 0);
            }),
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(255, 159, 64, 0.2)"
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
              "rgba(255, 159, 64, 1)"
            ],
            borderWidth: 1
          }
        ]
      });
    }
  },
  watch: {
    $route(to) {
      if (!to.query.page) {
        this.pageChangeHandler(1);
        this.page = 1;
      }
    }
  }
};
</script>
