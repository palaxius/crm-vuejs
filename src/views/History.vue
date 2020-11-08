<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!records.length" class="center">
      Записей пока нет.
      <router-link to="/record">Создать запись</router-link>
    </p>
    <section v-else>
      <HistoryTable :records="records" />
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/HistoryTable";
export default {
  components: { HistoryTable },
  data: () => ({
    records: [],
    categories: [],
    loading: true
  }),
  async mounted() {
    this.categories = await this.$store.dispatch("getCategories");
    const records = await this.$store.dispatch("getRecords");
    this.records = records
      .map(rec => {
        return {
          ...rec,
          categoryName: this.categories.find(c => c.id === rec.categoryId)
            .title,
          typeClass: rec.type === "income" ? "green" : "red",
          type: rec.type === "income" ? "Доход" : "Расход"
        };
      })
      .reverse();

    this.loading = false;
  }
};
</script>
