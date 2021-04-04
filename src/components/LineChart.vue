<template>
  <div class="example">
    <apexcharts width="700" height="600" type="line" :options="chartOptions" :series="series"></apexcharts>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts';

export default {
  name: 'Chart',
  props:{
      series:Array,
      chartOptions:Object,
  },
  components: {
    apexcharts: VueApexCharts,
  },
  data: function() {
    return {
        
    }
  },
}
</script>