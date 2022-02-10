
var vm = new Vue({
  el: '#app',

  /*
  | model data
  |
  */
  data: {

    title: 'Newsletter',
    subtitle: 'Suscriptores',

    newsletters: [],

    pagination: {
      current_page: 1,
      last_page: 0,
      per_page: 0,
      to: 0,
      total: 0,
    },

    submit: false,

    filters:[
      {"value":"email", "label":"Correo Electrónico", "order": "asc"},
      {"value":"frequency", "label":"Frecuencia", "order": "asc"},
      {"value":"status", "label":"Estatus", "order": "desc"},
      {"value":"created_at", "label":"Fecha de Ingreso", "order": "desc"},
      {"value":"updated_at", "label":"Fecha de Modificación", "order": "desc"},
    ],

    orderBy:null,

    frequency:[
      {"value":1, "label":"Diario"},
      {"value":2, "label":"Semanal"},
      {"value":3, "label":"Diario y Semanal"},
    ],

    frequency_selected:null,

    status:[
      {"value":1, "label":"Activos"},
      {"value":0, "label":"Deshabilitados"}
    ],

    status_selected:null,

    groups:[],
    group_selected: null,

    newsletter_autocomplete:[],
    newsletter_selected: null,

    params:{
        "group":null,
        "frequency":null,
        "status":null,
        "newsletter":null,
        "orderby":null,
        "order":null,
    }

  },

  /*
  | lifecicle functions
  |
  */
  mounted: function () {
      this.getGroups()
  },


  /*
  | watchers methods
  |
  */
  watch:{

    group_selected: function(value){
      this.params.group = value != null ? value.value : null;
    },

    frequency_selected: function(value){
      this.params.frequency = value != null ? value.value : null;
    },

    status_selected: function(value){
      this.params.status = value != null ? value.value : null;
    },

    orderBy: function(value){
      this.params.orderby = value != null ? value.value : null;
      this.params.order = value != null ? value.order : null;
    },

    newsletter_selected: function(value){
      this.params.newsletter = value != null ? value.label : null;
    },

    params: {
        handler: function (val, oldVal) {
          this.newsletters = [];
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
        if(vm.params.group != null){
          vm.submit = true;
          vm.$Progress.start();
          axios.get('/newsletter', {
            params: {
              'group': vm.params.group,
              'frequency': vm.params.frequency,
              'status': vm.params.status,
              'newsletter': vm.params.newsletter,
              'orderby': vm.params.orderby,
              'order':vm.params.order,
              'page': page != '' ? page : vm.pagination.current_page,
            }
          }).then(function (response) {
            vm.newsletters = response.data.data;
            vm.pagination = response.data;
            vm.$Progress.finish();
            vm.submit = false;
          })
          .catch(function (error) {
            vm.procError(error);
          })

          return false;
        }
    },

    displayFrequency: function(frequency){
      if(frequency == 1){
        return 'Diario';
      }else if(frequency == 2){
        return 'Semanal';
      }else if(frequency == 3){
        return 'Diario y Semanal';
      }
    },

    displayStatus: function(status){
          return status ? 'Activo' : 'Deshabilitado';
    },

    displayConfirmed: function(confirmed){
          return confirmed ? 'SI' : 'NO';
    },

    onSearch: function(){
        this.pagination.current_page = 1;
        this.getData();
    },

    autocomplete: function(){
        var vm = this;
        if(vm.search.length > 2){
          axios.get('/group-autocomplete?q='+ vm.search).then(function (response) {
            vm.autocomplete_data = response.data;
          });
        }
    },

    selected: function(value){
        this.search = value.name;
        this.autocomplete_data = [];
        this.onSearch();
    },

    getGroups: function(){
      var vm = this;
      axios.get('/group-list').then(function (response) {
        for(var i = 0; i < response.data.length; i++){
          vm.groups.push({'value': response.data[i].uid, 'label': response.data[i].name});
        }
      });
    },

    getNewsletter: function(search, loading){
      var vm = this;
      vm.newsletter_autocomplete = [];
      if(search.length > 1){
        loading(true)
        axios.get('/newsletter-autocomplete?group='+ vm.params.group +'&q='+ search).then(function (response) {
          for(var i = 0; i < response.data.length; i++){
          vm.newsletter_autocomplete.push({'value': response.data[i].email, 'label': response.data[i].email});
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
