
var vm = new Vue({
  el: '#app',

  /*
  | model data
  |
  */
  data: {

    auth_uid: document.head.querySelector('meta[name="auth-uid"]').content,

    title: 'Usuarios',
    subtitle: 'Listado',

    users: [],
    user:{
      uid:'',
      name:'',
      last_name:'',
      slug:'',
      email: '',
      twitter:'',
      image:'',
      groups: '',
      role: '',
      password:'',
      password_confirmation:'',
      status: 1,
      current_password:'',
      file:'',
    },

    autocomplete:[],
    user_selected: null,

    filters:[
      {"value":"name", "label":"Nombre", "order":"asc"},
      {"value":"last_name", "label":"Apellido", "order":"asc"},
      {"value":"role", "label":"Tipo de usuario", "order":"desc"},
      {"value":"status", "label":"Acceso", "order":"desc"},
      {"value":"created_at", "label":"Fecha de Ingreso", "order":"desc"},
      {"value":"updated_at", "label":"Fecha de Modificación", "order":"desc"}
    ],

    orderBy:null,

    params:{
      "q":null,
      "role":null,
      "group":null,
      "orderby":null,
      "order":null
    },

    pagination: {
      current_page: 1,
      last_page: 0,
      per_page: 0,
      to: 0,
      total: 0,
    },

    roles:[],
    role_selected:'',

    form: false,
    show_data: false,
    deleteModal: false,
    errors:[],

    submit: true,

    imageSrc:'',

    groups:[],
    groupsmodel: null,
  },

  /*
  | lifecicle functions
  |
  */
  mounted: function () {
      this.getData()
      this.getRoles()
      this.getGroups()
  },

  /*
  | computed properties
  |
  */
  computed: {

    fullName: function () {
      return upperFirst(this.user.name)+' '+upperFirst(this.user.last_name);
    },

    classObject: function () {
      return {
        'fa fa-save': this.form == 'create' && !this.submit,
        'fa fa-edit': this.form == 'edit' && !this.submit,
        'fa fa-spin fa-refresh': this.submit
      }
    },

  },

  /*
  | watchers methods
  |
  */
  watch:{

      user: {
        handler: function (val, oldVal) {
          this.errors = [];
        },
        deep: true
      },

      'user.name': function(){
          this.slugName();
      },

      'user.last_name': function(){
          this.slugName();
      },

      user_selected: function(value){
        this.params.q = value != null ? value.value : null;
      },

      imageSrc: function(value){
        this.user.file = value.match(/data:image/g) ? value : '';
      },

      groupsmodel: function(){
        if(this.groupsmodel != null){
          var values = [];
          for(var i = 0; i < this.groupsmodel.length; i++){
            values.push(this.groupsmodel[i].value)
          }
          this.user.groups = values;
        }

        if(this.form == false){
          this.params.group = this.groupsmodel != null ? this.groupsmodel.value : '';
        }
      },

      role_selected: function(value){
        this.user.role = value != null ? value.value : '';
        if(this.form == false){
          this.params.role = value != null ? value.value : null;
        }
      },

      orderBy: function(value){
        this.params.orderby = value != null ? value.value : null;
        this.params.order = value != null ? value.order : null;
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
      for (value in this.user) this.user[value] = '';
      this.errors = [];
      this.user.status = 1;
      this.imageSrc = '';
      this.orderBy = null;
      this.user_selected = '';
      this.role_selected = '';
      this.groupsmodel = null;
      this.role_selected = null;
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
        axios.get('/user', {
          params: {
            'q': vm.params.q,
            'role': vm.params.role,
            'group': vm.params.group,
            'orderby': vm.params.orderby,
            'order': vm.params.order,
            'page': page != '' ? page : vm.pagination.current_page,
          }
      }).then(function (response) {
            vm.users = response.data.data;
            vm.pagination = response.data;
            vm.$Progress.finish();
            vm.submit = false;
        })
        .catch(function (error) {
            vm.procError(error);
        })

        return false;
    },

    displayName: function( name, last_name){
        return capitalize(name.split(" ")[0]) +' '+ capitalize(last_name.split(" ")[0]);
    },

    slugName: function(){
        this.user.slug = getSlug(this.user.name.split(" ")[0]+' '+this.user.last_name.split(" ")[0]);
    },

    displayRole: function(role){
        if(role == 1){
          return 'Periodista';
        }else if(role == 2){
          return 'Editor';
        }else if(role == 3){
          return 'Administrador';
        }
    },


    displayStatus: function(status){
          return status ? 'Permitido' : 'Denegado';
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

              vm.$delete(vm.user, 'delete_old_image')

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
      this.closeNotification();
      this.$set(this.user, 'delete_old_image', true);
    },

    getRoles: function(){
      var vm = this;
      axios.get('/roles-list').then(function (response) {
        for(var i = 0; i < response.data.length; i++){
          vm.roles.push({'value': response.data[i].value, 'label': response.data[i].label});
        }
      });
    },

    getGroups: function(){
      var vm = this;
      axios.get('/group-list').then(function (response) {
        for(var i = 0; i < response.data.length; i++){
          vm.groups.push({'value': response.data[i].uid, 'label': response.data[i].name});
        }
      });
    },

    getUsers: function(search, loading){
      var vm = this;
      vm.autocomplete = [];
      if(search.length > 1){
        loading(true)
        axios.get('/user-autocomplete?q='+ search).then(function (response) {
          for(var i = 0; i < response.data.length; i++){
          vm.autocomplete.push({'value': response.data[i].name+' '+response.data[i].last_name, 'label': response.data[i].name+' '+response.data[i].last_name});
          }
           loading(false)
        });
      }
    },

    create: function(){
        this.resetForm();
        this.role_selected = null;
        this.groupsmodel = null;
        this.subtitle = 'Ingresar';
        this.form = 'create';
        this.show_data = false;
    },

    edit: function(id){
        var vm = this
        var groups = [];
        vm.$Progress.start();
        axios.get('/user/'+ id)
        .then(function (response){
            vm.user = response.data;
            if(response.data.image){
              vm.imageSrc = 'storage/profiles/'+response.data.image;
            }
            vm.$set( vm.user, 'current_password', '');
            for(var i = 0; i < vm.roles.length; i++){
              if(vm.roles[i].value == response.data.role)
              {
                vm.role_selected = { 'value': vm.roles[i].value, 'label': vm.roles[i].label };
              }
            }

            for(var i = 0; i < response.data.groups.length; i++){
              groups.push({'value': response.data.groups[i].uid, 'label': response.data.groups[i].slug});
            }

            vm.groupsmodel = groups;
            vm.subtitle = 'Editar';
            vm.show_data = false;
            vm.form = 'edit';
            vm.$Progress.finish();
        });
    },

    show: function(id){
        var vm = this
        vm.$Progress.start();
        axios.get('/user/'+ id)
        .then(function (response){
          vm.user = response.data;
          if(response.data.image){
            vm.imageSrc = 'storage/profiles/'+response.data.image;
          }
          vm.subtitle = 'Datos';
          vm.show_data = true;
          vm.$Progress.finish();
        });
    },

    remove: function(id){
      this.user.uid = id;
      this.deleteModal = true;
    },

    onSubmit: function(){
        var vm = this
        vm.closeNotification();
        if (! vm.validateFields()){
          vm.submit = true;
          vm.$Progress.start();
          vm.addNotification('En proceso', 'info');
          if(vm.form === 'create'){
            axios.post('/user', vm.user)
            .then(function (response) {
                vm.user.uid = response.data.uid;
                vm.user.password = '';
                vm.user.password_confirmation = '';
                vm.user.current_password = '';
                vm.subtitle = 'Editar'
                vm.form = 'edit';
                vm.submit = false;
                vm.pagination.current_page = 1;
                vm.search = '';
                vm.getData();
                vm.$Progress.finish();
                vm.closeNotification();
                vm.addNotification('Usuario registrado', 'success');
            })
            .catch(function (error) {
              vm.procError(error);
            });

          }else if(vm.form === 'edit'){
            axios.put('/user/'+ vm.user.uid, vm.user)
            .then(function (response) {
                vm.user.password = '';
                vm.user.password_confirmation = '';
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
      axios.delete('/user/'+ vm.user.uid)
      .then(function (response){
        vm.$Progress.finish();
        vm.submit = false;
        if(response.data == 'success.true'){
          vm.getData();
          vm.deleteModal = false;
          vm.addNotification('Usuario eliminado', 'success');
        }else if(response.data == 'relationship.true'){
          vm.addNotification('Usuario no eliminado por tener registros dependientes', 'danger');
        }
      });

    },

    validateFields: function(){

        for (value in this.errors) this.errors[value] = '';

        if (! this.user.name){
          this.$set( this.errors, 'name', 'Ingrese nombre de usuario');
          this.$refs.name.focus();
          return true;
        }

        if (! this.user.last_name){
          this.$set( this.errors, 'last_name', 'Ingrese apellido de usuario');
          this.$refs.last_name.focus();
          return true;
        }

        if (! this.user.email){
          this.$set( this.errors, 'email', 'Ingrese correo electrónico');
          this.$refs.email.focus();
          return true;
        }

        if (! this.user.email.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) {
          this.$set( this.errors, 'email', 'Ingrese correo electrónico válido');
          this.$refs.email.focus();
          return true;
        }

        if (! this.user.role){
          this.$set( this.errors, 'role', 'Seleccione tipo de usuario');
          this.$refs.role.focus();
          return true;
        }

        if (this.user.twitter){
          if (! this.user.twitter.match(/^[a-zA-Z0-9_-]{3,20}$/)) {
            this.$set( this.errors, 'twitter', 'Ingrese usuario de Twitter válido sin @');
            this.$refs.twitter.focus();
            return true;
          }
        }

        if (this.groupsmodel == null && this.user.role != 3){
          this.$set( this.errors, 'groups', 'Selecciones grupo(s) del usuario');
          return true;
        }

        if (! this.user.password && this.form == 'create'){
          this.$set( this.errors, 'password', 'Ingrese contraseña');
          this.$refs.password.focus();
          return true;
        }

        if (this.user.password){
          if (! this.user.password.match(/^[a-zA-Z0-9\.!@#\$%\^&\*\?_~\/]{6,30}$/)) {
            this.$set( this.errors, 'password', 'Ingrese contraseña de al menos 06 caracteres');
            this.$refs.password.focus();
            return true;
          }
        }

        if (! this.user.password_confirmation && this.user.password){
          this.$set( this.errors, 'password_confirmation', 'Ingrese contraseña nuevamente');
          this.$refs.password_confirmation.focus();
          return true;
        }

        if (this.user.password !== this.user.password_confirmation){
          this.$set( this.errors, 'password_confirmation', 'Contraseñas no coinciden');
          this.$refs.password_confirmation.focus();
          return true;
        }

        if (this.user.uid == this.auth_uid && this.form == 'edit' && this.user.current_password == ''){
          this.$set( this.errors, 'current_password', 'Ingrese la contraseña actual');
          this.$refs.current_password.focus();
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
