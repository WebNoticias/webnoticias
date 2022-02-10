var vm = new Vue({

  el: '#app',

  /*
  | model data
  |
  */
  data: {

    title: 'Banners',
    subtitle: 'Estadística',

    banners: [],

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
      {"value":"size", "label":"Posicíon"},
      {"value":"status", "label":"Estatus"},
      {"value":"published_at", "label":"Fecha de Ingreso"},
    ],

    orderBy:null,

    autocomplete:[],
    banner_selected: null,

    groups:[],
    group_selected: null,

    positions:[
      {"value":"1", "label":"Banner cabecera"},
      {"value":"2", "label":"Banner interno"},
      {"value":"3", "label":"Banner lateral"},
    ],

    position:null,

    params:{
        "q":null,
        "orderby":null,
        "group":null,
        "position":null
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

      banner_selected: function(value){
        this.params.q = value != null ? value.label : null;
      },

      orderBy: function(value){
        this.params.orderby = value != null ? value.value : null;
      },

      group_selected: function(value){
          this.params.group = value != null ? value.slug : null;
      },

      position: function(value){
        this.params.position = value != null ? value.value : null;
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
        axios.get('/banner/visit', {
          params: {
            'q': vm.params.q,
            'orderby': vm.params.orderby,
            'group': vm.params.group,
            'position': vm.params.position,
            'page': page != '' ? page : vm.pagination.current_page,
          }
      }).then(function (response) {
            vm.banners = response.data.data;
            vm.pagination = response.data;
            vm.$Progress.finish();
            vm.submit = false;
        })
        .catch(function (error) {
            vm.procError(error);
        })

        return false;
    },

    bannerUrl(file){
        return '/storage/banners/'+file;
    },

    displaySize: function(size){
          if(size == 1){
            return 'Banner cabecera'
          }else if(size == 2){
            return 'Banner interno'
          }else if(size == 3){
            return 'Banner lateral'
          }
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

    getBanners: function(search, loading){
      var vm = this;
      vm.autocomplete = [];
      if(search.length > 1){
        loading(true)
        axios.get('/banner-autocomplete?q='+ search).then(function (response) {
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
