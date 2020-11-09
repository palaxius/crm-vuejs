<template>
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>{{ "Amount" | localize }}</th>
        <th>{{ "Date" | localize }}</th>
        <th>{{ "Description" | localize }}</th>
        <th>{{ "Category" | localize }}</th>
        <th>{{ "Open" | localize }}</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(record, idx) in records" :key="record.id">
        <td>{{ idx + 1 }}</td>
        <td>{{ record.amount | currency("RUB") }}</td>
        <td>{{ record.date | date("date") }}</td>
        <td>{{ record.categoryName }}</td>
        <td>
          <span class="white-text badge" :class="record.typeClass">{{
            record.type
          }}</span>
        </td>
        <td>
          <button
            v-tooltip="'OpenRecord'"
            data-position="top"
            class="btn-small btn"
            @click="$router.push('/detail/' + record.id)"
          >
            <i class="material-icons">open_in_new</i>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  props: ["records"]
};
</script>
