var vm = new Vue({

  el: '#app',

  /*
  | model data
  |
  */
  data: {

    title: 'Sitio',
    subtitle: 'Estadística',

    statistic: [],

    errors:[],
    submit: false,

    filters:[
      {"value":"views", "label":"Vistas/Impresiones"},
      {"value":"unique_visits", "label":"Visitas Unicas"},
      {"value":"date", "label":"Fecha"},
    ],

    orderBy:null,

    groups:[],
    group_selected: null,

    ranges:[],
    range_selected: null,

    params:{
        "range":null,
        "group":null,
        "orderby":null
    }

  },

  /*
  | lifecicle functions
  |
  */
  mounted: function () {
      //this.getData()
      this.getGroups()
      this.getRanges()
  },


  /*
  | computed properties
  |
  */
  computed: {

    totalViews: function () {
      var total = 0;
      this.statistic.forEach(function (data) {
            total += data.views;
      });
      return total;
    },

    totalUniques: function () {
      var total = 0;
      this.statistic.forEach(function (data) {
            total += data.unique_visits;
      });
      return total;
    }

  },


  /*
  | watchers methods
  |
  */
  watch:{

      group_selected: function(value){
        this.params.group = value != null ? value.value : null;
      },

      range_selected: function(value){
        this.params.range = value != null ? value.value : null;
      },

      orderBy: function(value){
        this.params.orderby = value != null ? value.value : null;
      },

      params: {
          handler: function (val, oldVal) {
            this.statistic = [];
            this.getData();
          },
          deep: true
      }


    },

  /*
  | Methods
  |
  */
  methods: {

    getData: function(page){
        var vm = this;

        if(vm.params.group != null && vm.params.range != null){
          vm.submit = true;
          vm.$Progress.start();
          axios.get('/group/visit', {
            params: {
              'group': vm.params.group,
              'range': vm.params.range,
              'orderby': vm.params.orderby
            }
        }).then(function (response) {
              vm.statistic = response.data;
              vm.$Progress.finish();
              vm.submit = false;
          })
          .catch(function (error) {
              vm.procError(error);
          })

          return false;
        }
    },

    getGroups: function(){
      var vm = this;
      axios.get('/group-list').then(function (response) {
        for(var i = 0; i < response.data.length; i++){
          vm.groups.push({'value': response.data[i].uid, 'label': response.data[i].name, 'slug':response.data[i].slug});
        }
      });
    },

    getRanges: function(){
      var vm = this;
      axios.get('/group-ranges').then(function (response) {
        for(var i = 0; i < response.data.length; i++){
          if(i == 0){
            vm.range_selected = {'value': response.data[i].value, 'label': response.data[i].label};
          }
          vm.ranges.push({'value': response.data[i].value, 'label': response.data[i].label});
        }
      });
    },



    visitPercentage: function( views){
        return (views * 100) / this.totalViews;
    },

    uniquePercentage: function( unique){
        return (unique * 100) / this.totalUniques;
    },

    procError: function(error){
      this.submit = false;
      this.$Progress.fail()

      if (error.response && error.response.status === 422) {
        $.each( error.response.data.errors, function( key, value ) {
              vm.addNotification(value.toString() , 'danger')
              return;
        });
      }
    }

  }

})
