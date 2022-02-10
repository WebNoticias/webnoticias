
var vm = new Vue({
  el: '#app',

  /*
  | model data
  |
  */
  data: {

    title: 'Banners',
    subtitle: 'Listado',

    banners: [],
    banner:{
      uid:'',
      title:'',
      size:1,
      image:'',
      url:'',
      groups: '',
      status: 1,
      file: ''
    },

    autocomplete:[],
    banner_selected: null,

    pagination: {
      current_page: 1,
      last_page: 0,
      per_page: 0,
      to: 0,
      total: 0,
    },

    form: false,
    deleteModal: false,
    errors:[],

    submit: false,

    UploadFileName:'',
    imageSrc:'',

    groups:[],
    groupsmodel: null,

    positions:[
      {"value":"1", "label":"Banner cabecera"},
      {"value":"2", "label":"Banner interno"},
      {"value":"3", "label":"Banner lateral"},
      {"value":"4", "label":"Banner newsletter"},
    ],

    position:null,

    params:{
      "q":null,
      "group":null,
      "position":null
    },

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

      banner: {
        handler: function (val, oldVal) {
          this.errors = [];
        },
        deep: true
      },

      imageSrc: function(value){
          this.banner.file = value.match(/data:image/g) ? value : '';
      },

      groupsmodel: function(){
        if(this.groupsmodel != null){
          var values = [];
          for(var i = 0; i < this.groupsmodel.length; i++){
            values.push(this.groupsmodel[i].value)
          }
          this.banner.groups = values;
        }

        if(this.form == false){
          this.params.group = this.groupsmodel != null ? this.groupsmodel.value : '';
        }
      },

      banner_selected: function(value){
        this.params.q = value != null ? value.value : null;
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

    resetForm: function(){
      for (value in this.banner) this.banner[value] = '';
      this.groupsmodel = null;
      this.banner.size = 1;
      this.banner.status = 1;
      this.UploadFileClear();
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
        axios.get('/banner', {
          params: {
            'q': vm.params.q,
            'group': vm.params.group,
            'position': vm.params.position,
            'page': page != '' ? page : vm.pagination.current_page,
          }
      }).then(function (response) {
            vm.banners = response.data.data;
            vm.pagination = response.data;
            vm.$Progress.finish();
        })
        .catch(function (error) {
            vm.procError(error);
        })

        return false;
    },

    getGroups: function(){
      var vm = this;
      axios.get('/group-list').then(function (response) {
        for(var i = 0; i < response.data.length; i++){
          vm.groups.push({'value': response.data[i].uid, 'label': response.data[i].name});
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
          vm.autocomplete.push({'value': response.data[i].title, 'label': response.data[i].title});
          }
           loading(false)
        });
      }
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
          }else if(size == 4){
            return 'Banner newsletter'
          }
    },

    displayStatus: function(status){
          return status ? 'Activo' : 'Deshabilitado';
    },



    trigger: function(){
        this.$refs.UploadFile.click();
        vm.closeNotification();
    },

    UploadFileChange: function(event){
      for (value in this.errors) this.errors[value] = '';
      this.imageSrc = '';
      this.UploadFileName = '';

      if (this.$refs.UploadFile.files[0].size > 200000){
        this.addNotification('Tamaño de archivo excede los 200 Kb permtidos', 'danger')
        return;
      }

      this.UploadFileName = this.$refs.UploadFile.files[0].name;

      var input = event.target;

      if (input.files && input.files[0]) {
          var reader = new FileReader();
          var vm = this;

          reader.onload = function(e) {
              vm.imageSrc = e.target.result;
          }

          reader.readAsDataURL(input.files[0]);
      }
    },

    UploadFileClear: function(){
      this.UploadFileName = '';
      this.imageSrc = '';
      this.closeNotification();
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
        axios.get('/banner/'+ id)
        .then(function (response){
            vm.banner = response.data;
            vm.$set( vm.banner, 'file', '');
            for(var i = 0; i < response.data.groups.length; i++){
              groups.push({'value': response.data.groups[i].uid, 'label': response.data.groups[i].name});
            }
            vm.groupsmodel = groups;
            vm.subtitle = 'Editar';
            vm.form = 'edit';
            vm.$Progress.finish();
        });
    },

    remove: function(id){
      this.banner.uid = id;
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
            axios.post('/banner', vm.banner)
            .then(function (response) {
                vm.banner.uid = response.data.uid;
                vm.subtitle = 'Editar'
                vm.form = 'edit';
                vm.submit = false;
                vm.getData();
                vm.UploadFileClear();
                vm.$Progress.finish();
                vm.closeNotification();
                vm.addNotification('Datos registrados', 'success');
            })
            .catch(function (error) {
              vm.procError(error);
            });

          }else if(vm.form === 'edit'){
            axios.put('/banner/'+ vm.banner.uid, vm.banner)
            .then(function (response) {
                vm.submit = false;
                vm.getData();
                vm.UploadFileClear();
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
      vm.$Progress.start();
      axios.delete('/banner/'+ vm.banner.uid)
      .then(function (response){
        vm.submit = false;
        vm.getData();
        vm.deleteModal = false;
        vm.$Progress.finish();
        vm.addNotification('Banner eliminado', 'success');
      });

    },

    validateFields: function(){

        for (value in this.errors) this.errors[value] = '';

        if (! this.banner.title){
          this.$set( this.errors, 'title', 'Ingrese título de banner');
          this.$refs.title.focus();
          return true;
        }

        if (! this.banner.url){
          this.$set( this.errors, 'url', 'Ingrese URL de enlace');
          this.$refs.url.focus();
          return true;
        }

        if (! this.banner.url.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/)) {
          this.$set( this.errors, 'url', 'Ingrese URL válida con protocolo http|https');
          this.$refs.url.focus();
          return true;
        }

        if (this.imageSrc == '' && this.form == 'create'){
          this.$set( this.errors, 'UploadFile', 'Seleccione archivo de imagen');
          this.$refs.UploadName.focus();
          return true;
        }

        if (this.groupsmodel == null){
          this.$set( this.errors, 'groups', 'Seleccione ciudades activas');
          return true;
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
