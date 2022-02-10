var vm = new Vue({

  el: '#app',

  /*
  | model data
  |
  */
  data: {

    title: 'Galerías Fotográficas',
    subtitle: 'Estadística',

    galleries: [],

    pagination: {
      current_page: 1,
      last_page: 0,
      per_page: 0,
      to: 0,
      total: 0,
    },

    errors:[],
    submit: false,

    filters:[
      {"value":"views", "label":"Vistas/Impresiones"},
      {"value":"unique_visits", "label":"Visitas Unicas"},
      {"value":"published_at", "label":"Fecha de Publicación"},
    ],

    orderBy:null,

    autocomplete:[],
    gallery_selected: null,

    groups:[],
    group_selected: null,

    ranges:[
      {"value":"0", "label":"Hoy"},
      {"value":"7", "label":"Últimos 07 Días"},
      {"value":"30", "label":"Último Mes"},
      {"value":"90", "label":"Últimos 03 Meses"},
      {"value":"180", "label":"Últimos 06 Meses"},
      {"value":"365", "label":"Último Año"},
    ],

    range:null,

    params:{
        "q":null,
        "orderby":null,
        "group":null,
        "range":null
    }

  },

  /*
  | lifecicle functions
  |
  */
  mounted: function () {
      this.getData()
      this.getGroups()
  },



  /*
  | watchers methods
  |
  */
  watch:{

      gallery_selected: function(value){
        this.params.q = value != null ? value.label : null;
      },

      orderBy: function(value){
        this.params.orderby = value != null ? value.value : null;
      },

      group_selected: function(value){
          this.params.group = value != null ? value.slug : null;
      },

      range: function(value){
        this.params.range = value != null ? value.value : null;
      },

      params: {
          handler: function (val, oldVal) {
            this.getData(1);
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
        vm.submit = true;
        vm.$Progress.start();
        axios.get('/gallery/visit', {
          params: {
            'q': vm.params.q,
            'orderby': vm.params.orderby,
            'group': vm.params.group,
            'range': vm.params.range,
            'page': page != '' ? page : vm.pagination.current_page,
          }
      }).then(function (response) {
            vm.galleries = response.data.data;
            vm.pagination = response.data;
            vm.$Progress.finish();
            vm.submit = false;
        })
        .catch(function (error) {
            vm.procError(error);
        })

        return false;
    },

    displayStatus: function(status){
          return status ? 'Publicado' : 'Inactivo';
    },

    getGroups: function(){
      var vm = this;
      axios.get('/group-list').then(function (response) {
        for(var i = 0; i < response.data.length; i++){
          vm.groups.push({'value': response.data[i].uid, 'label': response.data[i].name, 'slug':response.data[i].slug});
        }
      });
    },

    getGalleries: function(search, loading){
      var vm = this;
      vm.autocomplete = [];
      if(search.length > 1){
        loading(true)
        axios.get('/gallery-autocomplete?q='+ search).then(function (response) {
          for(var i = 0; i < response.data.length; i++){
          vm.autocomplete.push({'value': response.data[i].uid, 'label': response.data[i].title});
          }
           loading(false)
        });
      }
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
