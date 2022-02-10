
var vm = new Vue({
  el: '#app',

  /*
  | model data
  |
  */
  data: {

    title: 'Banners Adsense',
    subtitle: 'Listado',

    banners: [],
    banner:{
      uid:'',
      code: '',
      size:1,
      groups: '',
      status: 1,
    },

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

      banner: {
        handler: function (val, oldVal) {
          this.errors = [];
        },
        deep: true
      },
    },

  /*
  | Methods
  |
  */
  methods: {

    resetForm: function(){
      for (value in this.banner) this.banner[value] = '';
      this.banner.size = 1;
      this.banner.status = 1;
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
        axios.get('/advertising').then(function (response) {
            vm.banners = response.data;
            vm.$Progress.finish();
        })
        .catch(function (error) {
            vm.procError(error);
        })

        return false;
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
          return status ? 'Activo' : 'Deshabilitado';
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
        axios.get('/advertising/'+ id)
        .then(function (response){
            vm.banner = response.data;
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
            axios.post('/advertising', vm.banner)
            .then(function (response) {
                vm.banner.uid = response.data.uid;
                vm.subtitle = 'Editar'
                vm.form = 'edit';
                vm.submit = false;
                vm.getData();
                vm.$Progress.finish();
                vm.closeNotification();
                vm.addNotification('Datos registrados', 'success');
            })
            .catch(function (error) {
              vm.procError(error);
            });

          }else if(vm.form === 'edit'){
            axios.put('/advertising/'+ vm.banner.uid, vm.banner)
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
      vm.$Progress.start();
      axios.delete('/advertising/'+ vm.banner.uid)
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

        if (! this.banner.code){
          this.$set( this.errors, 'code', 'Ingrese código de banner');
          this.$refs.title.focus();
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
