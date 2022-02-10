
var vm = new Vue({
  el: '#app',

  /*
  | model data
  |
  */
  data: {

    title: 'Ciudades',
    subtitle: 'Listado',

    groups: [],
    group:{
      uid:'',
      name:'',
      slug:'',
      country:'',
      facebook_id:'',
      facebook_user:'',
      twitter_user:'',
      youtube_user:'',
      instagram_user:'',
      google_site_verification:'',
      mail_address:'',
      mail_user:'',
      mail_password:'',
      status: 1,
    },

    search: '',
    autocomplete_data:[],

    pagination: {
      current_page: 1,
      last_page: 0,
      per_page: 0,
      to: 0,
      total: 0,
    },

    countries:[
      {"value":"Argentina", "label":"Argentina"},
      {"value":"Bolivia", "label":"Bolivia"},
      {"value":"Brasil", "label":"Brasil"},
      {"value":"Canadá", "label":"Canadá"},
      {"value":"Colombia", "label":"Colombia"},
      {"value":"Costa Rica", "label":"Costa Rica"},
      {"value":"Cuba", "label":"Cuba"},
      {"value":"Ecuador", "label":"Ecuador"},
      {"value":"El Salvador", "label":"El Salvador"},
      {"value":"Estados Unidos", "label":"Estados Unidos"},
      {"value":"Guatemala", "label":"Guatemala"},
      {"value":"Haití", "label":"Haití"},
      {"value":"Honduras", "label":"Honduras"},
      {"value":"México", "label":"México"},
      {"value":"Nicaragua", "label":"Nicaragua"},
      {"value":"Panamá", "label":"Panamá"},
      {"value":"Paraguay", "label":"Paraguay"},
      {"value":"Perú", "label":"Perú"},
      {"value":"República Dominicana", "label":"República Dominicana"},
      {"value":"Uruguay", "label":"Uruguay"},
      {"value":"Venezuela", "label":"Venezuela"},
    ],

    country:'',

    form: false,
    deleteModal: false,
    errors:[],

    submit: false,

  },

  /*
  | lifecicle functions
  |
  */
  mounted: function () {
      this.getData()
  },

  /*
  | computed properties
  |
  */
  computed: {

    classObject: function () {
      return {
        'fa fa-save': this.form == 'create' && !this.submit,
        'fa fa-edit': this.form == 'edit' && !this.submit,
        'fa fa-spin fa-refresh': this.submit
      }
    }

  },

  /*
  | watchers methods
  |
  */
  watch:{

      group: {
        handler: function (val, oldVal) {
          this.errors = [];
        },
        deep: true
      },

      'group.name': function(value){
        this.group.slug = getSlug(value.toLowerCase(), '');
      },

      'group.slug': function(value){
          if(this.form == 'create'){
            this.group.mail_address = value != '' ? value +'@webnoticias.co' : '';
            this.group.mail_user = value != '' ? value +'@webnoticias.co' : '';
          }
      },

      country: function(value){
        this.group.country = value != null ? value.value : '';
      },
  },

  /*
  | Methods
  |
  */
  methods: {

    resetForm: function(){
      for (value in this.group) this.group[value] = '';
      this.group.status = 1;
      this.country = '';
      this.errors = [];
      this.closeNotification();
    },

    showList: function(){
      this.subtitle = 'Listado';
      this.form = false;
      this.resetForm();
    },

    getData: function(page){
        var vm = this;
        vm.$Progress.start();
        axios.get('/group', {
          params: {
            'q': vm.search,
            'page': page != '' ? page : vm.pagination.current_page,
          }
      }).then(function (response) {
            vm.groups = response.data.data;
            vm.pagination = response.data;
            vm.$Progress.finish();
        })
        .catch(function (error) {
            vm.procError(error);
        })

        return false;
    },

    displayStatus: function(status){
          return status ? 'Activo' : 'Deshabilitado';
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

    create: function(){
        this.resetForm();
        this.subtitle = 'Ingresar';
        this.form = 'create';
    },

    edit: function(id){
        var vm = this
        var groups = [];
        vm.$Progress.start();
        axios.get('/group/'+ id)
        .then(function (response){
            vm.group = response.data;
            vm.country = {"value": response.data.country, "label":response.data.country},
            vm.subtitle = 'Editar';
            vm.form = 'edit';
            vm.$Progress.finish();
        });
    },

    remove: function(id){
      this.group.uid = id;
      this.deleteModal = true;
    },

    onSubmit: function(){
        var vm = this
        vm.closeNotification();
        if (! vm.validateFields()){
          vm.submit = true;
          vm.$Progress.start()
          vm.addNotification('En proceso', 'info');
          if(vm.form === 'create'){
            axios.post('/group', vm.group)
            .then(function (response) {
                vm.group.uid = response.data.uid;
                vm.subtitle = 'Editar'
                vm.form = 'edit';
                vm.submit = false;
                vm.pagination.current_page = 1;
                vm.search = '';
                vm.getData();
                vm.$Progress.finish();
                vm.closeNotification();
                vm.addNotification('Ciudad registrada', 'success');
            })
            .catch(function (error) {
              vm.procError(error);
            });

          }else if(vm.form === 'edit'){
            axios.put('/group/'+ vm.group.uid, vm.group)
            .then(function (response) {
                vm.submit = false;
                vm.getData();
                vm.$Progress.finish();
                vm.closeNotification();
                vm.addNotification('Datos editados', 'success');
            })
            .catch(function (error) {
              vm.procError(error);
            });

          }
        }
    },

    destroy: function(){
      var vm = this;
      vm.submit = true;
      vm.closeNotification();
      vm.$Progress.start();
      axios.delete('/group/'+ vm.group.uid)
      .then(function (response){
        vm.$Progress.finish();
        vm.submit = false;
        if(response.data == 'success.true'){
          vm.getData();
          vm.deleteModal = false;
          vm.addNotification('Ciudad eliminada', 'success');
        }else if(response.data == 'relationship.true'){
          vm.addNotification('Ciudad no eliminada por tener registros dependientes', 'danger');
        }
      });

    },

    validateFields: function(){

        for (value in this.errors) this.errors[value] = '';

        if (! this.group.name){
          this.$set( this.errors, 'name', 'Ingrese nombre de ciudad');
          this.$refs.name.focus();
          return true;
        }

        if (! this.group.name.match(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{4,20}$/)) {
          this.$set( this.errors, 'name', 'Ingrese nombre de ciudad válido');
          this.$refs.name.focus();
          return true;
        }

        if (! this.group.slug.match(/^[a-z]{4,16}$/)) {
          this.$set( this.errors, 'slug', 'Ingrese nombre de subdominio válido');
          this.$refs.slug.focus();
          return true;
        }

        if (! this.group.country){
          this.$set( this.errors, 'country', 'Seleccione País');
          this.$refs.country.focus();
          return true;
        }

        if (! this.group.facebook_id.match(/^[0-9]{4,20}$/)) {
            this.$set( this.errors, 'facebook_id', 'Ingrese ID de cuenta de Facebook válido');
            this.$refs.facebook_id.focus();
            return true;
        }

        if (! this.group.facebook_user.match(/^[a-zA-Z0-9.]{3,30}$/)) {
          this.$set( this.errors, 'facebook_user', 'Ingrese usuario de Facebook válido');
          this.$refs.facebook_user.focus();
          return true;
        }

        if (! this.group.twitter_user.match(/^[a-zA-Z0-9_-]{3,30}$/)) {
          this.$set( this.errors, 'twitter_user', 'Ingrese usuario de Twitter válido sin @');
          this.$refs.twitter_user.focus();
          return true;
        }


        if (! this.group.youtube_user.match(/^[a-zA-Z0-9_-]{3,30}$/)) {
            this.$set( this.errors, 'youtube_user', 'Ingrese usuario de YouTube válido');
            this.$refs.youtube_user.focus();
            return true;
        }


        if (! this.group.instagram_user.match(/^[a-zA-Z0-9_-]{3,30}$/)) {
            this.$set( this.errors, 'instagram_user', 'Ingrese usuario de Instagram válido sin @');
            this.$refs.instagram_user.focus();
            return true;
        }

        if(this.group.google_site_verification){
          if (! this.group.google_site_verification.match(/^[a-zA-Z0-9]{40,50}$/)) {
            this.$set( this.errors, 'google_site_verification', 'Número de verificación de sitio de Google inválido');
            this.$refs.google_site_verification.focus();
            return true;
          }
        }

        if (this.group.mail_address){
          if (! this.group.mail_address.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) {
            this.$set( this.errors, 'mail_address', 'Ingrese correo electrónico válido');
            this.$refs.mail_address.focus();
            return true;
          }
        }


    },

    addNotification: function(Notificationmessage, Notificationtype){
      this.$notify({ message: Notificationmessage, type: Notificationtype})
    },

    closeNotification: function() {
      for (var i = 0; i < this.$notifications.state.length; i++) {
         this.$notifications.state.pop();
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
