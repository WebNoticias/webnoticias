
var vm = new Vue({
  el: '#app',

  /*
  | model data
  |
  */
  data: {

    title: 'Columnistas',
    subtitle: 'Listado',

    authors: [],
    author:{
      uid:'',
      name:'',
      last_name:'',
      slug:'',
      description:'',
      email: '',
      twitter:'',
      image:'',
      file:'',
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

    form: false,
    show_data: false,
    deleteModal: false,
    errors:[],

    submit: false,

    imageSrc:'',

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

    fullName: function () {
      return upperFirst(this.author.name)+' '+upperFirst(this.author.last_name);
    },

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

      author: {
        handler: function (val, oldVal) {
          this.errors = [];
        },
        deep: true
      },

      'author.name': function(){
          this.slugName();
      },

      'author.last_name': function(){
          this.slugName();
      },

      imageSrc: function(value){
        this.author.file = value.match(/data:image/g) ? value : '';
      },
  },

  /*
  | Methods
  |
  */
  methods: {

    resetForm: function(){
      for (value in this.author) this.author[value] = '';
      this.errors = [];
      this.imageSrc = '';
      this.closeNotification();
    },

    showList: function(){
      this.subtitle = 'Listado';
      this.form = false;
      this.show_data = false;
      this.resetForm();
    },

    getData: function(page){
        var vm = this;
        vm.$Progress.start();
        axios.get('/author', {
          params: {
            'q': vm.search,
            'page': page != '' ? page : vm.pagination.current_page,
          }
      }).then(function (response) {
            vm.authors = response.data.data;
            vm.pagination = response.data;
            vm.$Progress.finish();
        })
        .catch(function (error) {
            vm.procError(error);
        })

        return false;
    },

    displayName: function( name, last_name){
        return capitalize(name) +' '+ capitalize(last_name);
    },

    slugName: function(){
        this.author.slug = getSlug(this.author.name.split(" ")[0]+' '+this.author.last_name.split(" ")[0]);
    },

    trigger: function(){
        for (value in this.errors) this.errors[value] = '';
        this.closeNotification();
        this.$refs.UploadFile.click();
    },

    UploadFileChange: function(event){

      var input = event.target;
      var vm = this;
      var img = document.createElement("img");

      vm.imageSrc = '';

      if (input.files && input.files[0]) {

        if (input.files[0].size > 10000000){
          vm.addNotification('Tamaño de archivo excede los 10 Mb', 'danger')
          return;
        }

        var reader = new FileReader();

        reader.onload = function(e)
        {
            img.src = e.target.result;

            img.onload = function () {

              vm.$delete(vm.author, 'delete_old_image')

              var max_width = 400;
              var max_height = 600;
              var width = img.width;
              var height = img.height;

              if(width <= max_width){

                  vm.imageSrc = e.target.result;

              }else{

                  var canvas = document.createElement("canvas");
                  var ctx = canvas.getContext("2d");

                  ctx.drawImage(img, 0, 0);

                  if (width > height) {
                    if (width > max_width) {
                      height *= max_width / width;
                      width = max_width;
                    }
                  } else {
                    if (height > max_height) {
                      width *= max_height / height;
                      height = max_height;
                    }
                  }

                  canvas.width = width;
                  canvas.height = height;

                  var ctx = canvas.getContext("2d");

                  ctx.drawImage(img, 0, 0, width, height);

                  vm.imageSrc = canvas.toDataURL("image/jpeg");

              }

            }
        }

        reader.readAsDataURL(input.files[0]);

      }

    },

    UploadFileDelete(){
      this.imageSrc = '';
      this.$set(this.author, 'delete_old_image', true);
      this.closeNotification();
    },

    onSearch: function(){
        this.pagination.current_page = 1;
        this.getData();
    },

    autocomplete: function(){
        var vm = this;
        if(vm.search.length > 2){
          axios.get('/author-autocomplete?q='+ vm.search).then(function (response) {
            vm.autocomplete_data = response.data;
          });
        }
    },

    selected: function(value){
        this.search = value.name + ' ' + value.last_name;
        this.autocomplete_data = [];
        this.onSearch();
    },

    create: function(){
        this.resetForm();
        this.subtitle = 'Ingresar';
        this.form = 'create';
        this.show_data = false;
    },

    edit: function(id){
        var vm = this
        vm.$Progress.start();
        axios.get('/author/'+ id)
        .then(function (response){
            vm.author = response.data;
            if(response.data.image){
              vm.imageSrc = 'storage/profiles/'+response.data.image;
            }
            vm.subtitle = 'Editar';
            vm.show_data = false;
            vm.form = 'edit';
            vm.$Progress.finish();
        });
    },

    show: function(id){
        var vm = this
        vm.$Progress.start();
        axios.get('/author/'+ id)
        .then(function (response){
          vm.author = response.data;
          if(response.data.image){
            vm.imageSrc = 'storage/profiles/'+response.data.image;
          }
          vm.subtitle = 'Datos';
          vm.show_data = true;
          vm.$Progress.finish();
        });
    },

    remove: function(id){
      this.author.uid = id;
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
            axios.post('/author', vm.author)
            .then(function (response) {
                vm.author.uid = response.data.uid;
                vm.subtitle = 'Editar'
                vm.form = 'edit';
                vm.submit = false;
                vm.autocomplete_data = [],
                vm.pagination.current_page = 1;
                vm.search = '',
                vm.getData();
                vm.$Progress.finish();
                vm.closeNotification();
                vm.addNotification('Datos registrados', 'success');
            })
            .catch(function (error) {
              vm.procError(error);
            });

          }else if(vm.form === 'edit'){
            axios.put('/author/'+ vm.author.uid, vm.author)
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
      axios.delete('/author/'+ vm.author.uid)
      .then(function (response){
        vm.$Progress.finish();
        vm.submit = false;
        if(response.data == 'success.true'){
          vm.getData();
          vm.deleteModal = false;
          vm.addNotification('Registro eliminado', 'success');
        }else if(response.data == 'relationship.true'){
          vm.addNotification('Registro no eliminado por tener registros dependientes', 'danger');
        }
      });

    },

    validateFields: function(){

        for (value in this.errors) this.errors[value] = '';

        if (! this.author.name){
          this.$set( this.errors, 'name', 'Ingrese nombre');
          this.$refs.name.focus();
          return true;
        }

        if (! this.author.last_name){
          this.$set( this.errors, 'last_name', 'Ingrese apellido');
          this.$refs.last_name.focus();
          return true;
        }

        if (this.author.email){
          if (! this.author.email.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) {
            this.$set( this.errors, 'email', 'Ingrese correo electrónico válido');
            this.$refs.email.focus();
            return true;
          }
        }

        if (this.author.twitter){
          if (! this.author.twitter.match(/^[a-zA-Z0-9_-]{3,20}$/)) {
            this.$set( this.errors, 'twitter', 'Ingrese usuario de Twitter válido sin @');
            this.$refs.twitter.focus();
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
