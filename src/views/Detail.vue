<template>
  <div>
    <Loader v-if="loading" />
    <p v-else-if="!record" class="center">Такой записи нет</p>
    <div v-else>
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">История</router-link>
        <a class="breadcrumb" @click.prevent>
          {{ record && record.type === "income" ? "Доход" : "Расход" }}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div
            class="card"
            :class="record && record.type === 'income' ? 'green' : 'red'"
          >
            <div class="card-content white-text">
              <p>Описание: {{ record && record.description }}</p>
              <p>Сумма: {{ record && record.amount | currency }}</p>
              <p>Категория: {{ record && record.categoryName }}</p>

              <small>{{ record && record.date | date("datetime") }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    record: null,
    loading: true
  }),
  async mounted() {
    const record = await this.$store.dispatch(
      "getRecord",
      this.$route.params.id
    );
    const category = await this.$store.dispatch(
      "getCategory",
      record.categoryId
    );

    this.record = {
      ...record,
      categoryName: category.title
    };

    this.loading = false;
  }
};
</script>
