var vm = new Vue({
  el: '#app',

  /*
  | model data
  |
  */
  data: {

    title: 'Categorías',
    subtitle: 'Listado',

    categories: [],
    category:{
      uid:'',
      name:'',
      slug:'',
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

      category: {
        handler: function (val, oldVal) {
          this.errors = [];
        },
        deep: true
      },

      'category.name': function(value){
        this.category.slug = getSlug(value.toLowerCase(), '');
      }
  },

  /*
  | Methods
  |
  */
  methods: {

    resetForm: function(){
      for (value in this.category) this.category[value] = '';
      this.category.status = 1;
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
        axios.get('/category').then(function (response) {
            vm.categories = response.data;
            vm.$Progress.finish();
        }).catch(function (error) {
            vm.procError(error);
        })

        return false;
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
        vm.$Progress.start();
        axios.get('/category/'+ id)
        .then(function (response){
            vm.category = response.data;
            vm.subtitle = 'Editar';
            vm.form = 'edit';
            vm.$Progress.finish();
        });
    },

    remove: function(id){
      this.category.uid = id;
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
            axios.post('/category', vm.category)
            .then(function (response) {
                vm.category.uid = response.data.uid;
                vm.subtitle = 'Editar'
                vm.form = 'edit';
                vm.submit = false;
                vm.getData();
                vm.$Progress.finish();
                vm.closeNotification();
                vm.addNotification('Categoría registrada', 'success');
            })
            .catch(function (error) {
              vm.procError(error);
            });

          }else if(vm.form === 'edit'){
            axios.put('/category/'+ vm.category.uid, vm.category)
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
      axios.delete('/category/'+ vm.category.uid)
      .then(function (response){
        vm.$Progress.finish();
        vm.submit = false;
        if(response.data == 'success.true'){
          vm.getData();
          vm.deleteModal = false;
          vm.addNotification('Categoría eliminada', 'success');
        }else if(response.data == 'relationship.true'){
          vm.addNotification('Categoría no eliminada por tener registros dependientes', 'danger');
        }
      });

    },

    validateFields: function(){

        for (value in this.errors) this.errors[value] = '';

        if (! this.category.name){
          this.$set( this.errors, 'name', 'Ingrese nombre de categoría');
          this.$refs.name.focus();
          return true;
        }

        if (! this.category.name.match(/^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{4,20}$/)) {
          this.$set( this.errors, 'name', 'Ingrese nombre de categoría válido');
          this.$refs.name.focus();
          return true;
        }

        if (! this.category.slug.match(/^[a-z]{4,16}$/)) {
          this.$set( this.errors, 'slug', 'Ingrese nombre de etiqueta válido');
          this.$refs.slug.focus();
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
