<template>
  <div>
    <Loader v-if="loading" />
    <p v-else-if="!record" class="center">{{ "NoCertainRecord" | localize }}</p>
    <div v-else>
      <div class="breadcrumb-wrap">
        <router-link to="/history" class="breadcrumb">{{
          "Menu_History" | localize
        }}</router-link>
        <a class="breadcrumb" @click.prevent>
          {{
            record && record.type === "income" ? "Income" : "Outcome" | localize
          }}
        </a>
      </div>
      <div class="row">
        <div class="col s12 m6">
          <div
            class="card"
            :class="record && record.type === 'income' ? 'green' : 'red'"
          >
            <div class="card-content white-text">
              <p>
                {{ "Description" | localize }}:
                {{ record && record.description }}
              </p>
              <p>
                {{ "Amount" | localize }}:
                {{ record && record.amount | currency }}
              </p>
              <p>
                {{ "Category" | localize }}: {{ record && record.categoryName }}
              </p>

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
  metaInfo() {
    return {
      title: this.$title("DetailTitle")
    };
  },
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
