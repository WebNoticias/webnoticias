
var vm = new Vue({
  el: '#app',

  /*
  | model data
  |
  */
  data: {
    form: {
      email: '',
      password: '',
      remember: '',
    },

    errors:[],

    submit : false,
  },

  /*
  | methods
  |
  */
  methods: {

    onSubmit: function(){

      var vm = this

      if (! vm.validateFields()) {

        vm.submit = true;
        vm.$Progress.start()

        axios.post('/login', this.form)
        .then(function (response) {
            vm.$Progress.finish()
            vm.addNotification('Usuario logueado exitosamente', 'success')
            window.location.href = '/';
        })
        .catch(function (error) {
          vm.submit = false;
          vm.$Progress.fail()

          if (error.response && error.response.status === 422) {
            $.each( error.response.data.errors, function( key, value ) {
                  vm.addNotification(value.toString(), 'danger')
                  return;
            });
          }
        });
      }

    },

    validateFields: function(){

        for (value in this.errors) this.errors[value] = '';

        if (! this.form.email){
          this.$set( this.errors, 'email', 'Ingrese correo electrónico');
          this.$refs.email.focus();
          return true;
        }

        if (! this.form.email.match(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)) {
          this.$set( this.errors, 'email', 'Ingrese correo electrónico válido');
          this.$refs.email.focus();
          return true;
        }

        if (! this.form.password){
          this.$set( this.errors, 'password', 'Ingrese la contraseña');
          this.$refs.password.focus();
          return true;
        }
    },

    addNotification: function(Notificationmessage, Notificationtype){
      this.$notify({ message: Notificationmessage, type: Notificationtype})
    }

  },

})
