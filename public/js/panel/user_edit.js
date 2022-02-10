
var vm = new Vue({
  el: '#app',

  /*
  | model data
  |
  */
  data: {

    auth_uid: document.head.querySelector('meta[name="auth-uid"]').content,
    url: document.head.querySelector('meta[name="url"]').content,

    title: 'Usuarios',
    subtitle: 'Editar',

    user:{
      uid:'',
      name:'',
      last_name:'',
      email: '',
      twitter:'',
      image:'',
      groups: '',
      role: 1,
      password:'',
      password_confirmation:'',
      status: 1,
      current_password:'',
      file:'',
    },

    errors:[],

    submit: false,
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
        'fa fa-edit': !this.submit,
        'fa fa-spin fa-refresh': this.submit
      }
    }

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
      }
  },

  /*
  | Methods
  |
  */
  methods: {

    getData: function(page){
        var vm = this;
        var groups = [];
        vm.$Progress.start();
        axios.get('/user/'+ vm.auth_uid)
        .then(function (response) {
          vm.user = response.data;
          vm.$set(vm.user, 'current_password', '');
          for(var i = 0; i < response.data.groups.length; i++){
            groups.push({'value': response.data.groups[i].uid, 'label': response.data.groups[i].slug});
          }
          vm.groupsmodel = groups;
          if(response.data.image){
            vm.imageSrc = vm.url+'/storage/profiles/'+response.data.image;
          }
          vm.$Progress.finish();
      }).catch(function (error) {
            vm.procError(error);
      })

      return false;
    },

    trigger: function(){
        for (value in this.errors) this.errors[value] = '';
        this.$refs.UploadFile.click();
        this.closeNotification();
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

    onSubmit: function(){
        var vm = this
        if (! vm.validateFields()){
          vm.submit = true;
          vm.$Progress.start()
          vm.addNotification('En proceso', 'info');
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

        if (this.user.twitter){
          if (! this.user.twitter.match(/^[a-zA-Z0-9_-]{3,20}$/)) {
            this.$set( this.errors, 'twitter', 'Ingrese usuario de Twitter válido sin @');
            this.$refs.twitter.focus();
            return true;
          }
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

        if(this.user.uid == this.auth_uid && this.user.current_password == ''){
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
