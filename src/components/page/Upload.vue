<template>
    <div class="charts">
      <v-chart ref='chart' :options="option" :auto-resize="true" class="chart"/>
  </div>
</template>

<script>
   
    export default {
        name: 'upload',
        data: function(){
            return {
               option:{}
            }
        },
        components: {
            
        },
        mounted(){
            this.getop()
        },
        methods:{
              getop(){
                  var hour = ['0', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];

                this.option = {
                    xAxis: {
                        type: 'category',
                        data: hour 
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: [0,0,0,0,0,1,1,1,1,1,2,2,2,2,0,1,1,1,1,0,0,0,0,0],
                        type: 'line'
                    }]
                };
            }
        },
        created(){
          
        }
    }
</script>

<style scoped>
    .charts{
        width: 100%;
        height: 100%;
    }
</style>