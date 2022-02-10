
var vm = new Vue({
  el: '#app',

  /*
  | model data
  |
  */
  data: {

    title: 'Galerías Fotográficas',
    subtitle: 'Listado',

    galleries: [],
    gallery:{
      uid:'',
      title:'',
      slug:'',
      excerpt: '',
      description:'',
      image:'',
      groups: '',
      published_at: new Date(new Date().setHours(0,0,0,0)),
      cover: 1,
      status: 1,
      file:'',
    },

    photos:[],
    photo:{
      uid:'',
      gallery_id: '',
      title:'',
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
    show_album: false,
    deleteModal: false,
    errors:[],

    submit: false,

    UploadPhotoName:'',

    imageSrc:'',
    photoSrc:[],
    photoTotal: 0,
    loadphotos: false,

    groups:[],
    groupsmodel: null,
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

      gallery: {
        handler: function (val, oldVal) {
          this.errors = [];
        },
        deep: true
      },

      'gallery.title': function(value){
        this.gallery.slug = getSlug(value.toLowerCase());
      },

      'gallery.description': function(value){
        this.gallery.excerpt = value;
      },

      imageSrc: function(value){
          this.gallery.file = value.match(/data:image/g) ? value : '';
      },

      photoSrc: function(value){
          this.photoTotal = value.length;
      },

      groupsmodel: function(){
        if(this.groupsmodel != null){
          var values = [];
          for(var i = 0; i < this.groupsmodel.length; i++){
            values.push(this.groupsmodel[i].value)
          }
          this.gallery.groups = values;
        }
      }
  },

  /*
  | Methods
  |
  */
  methods: {

    resetForm: function(){
      for (value in this.gallery) this.gallery[value] = '';
      this.imageSrc = '';
      this.errors = [];
      this.gallery.published_at = new Date(new Date().setHours(0,0,0,0));
      this.gallery.cover = 1;
      this.gallery.status = 1;
      this.groupsmodel = null;
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
        axios.get('/gallery', {
          params: {
            'q': vm.search,
            'page': page != '' ? page : vm.pagination.current_page,
          }
      }).then(function (response) {
            vm.galleries = response.data.data;
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

    displayName: function( name, last_name){
        return capitalize(name.split(" ")[0]) +' '+ capitalize(last_name.split(" ")[0]);
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

              var max_width = 800;
              var max_height = 960;
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

    getGroups: function(){
      var vm = this;
      axios.get('/group-list').then(function (response) {
        for(var i = 0; i < response.data.length; i++){
          vm.groups.push({'value': response.data[i].uid, 'label': response.data[i].name});
        }
      });
    },

    imageData(title, file){
        return { title: title, src: '/storage/photos/'+file }
    },

    imageUrl(file){
        return '/storage/photos/150/'+file;
    },

    onSearch: function(){
        this.pagination.current_page = 1;
        this.getData();
    },

    autocomplete: function(){
        var vm = this;
        if(vm.search.length > 2){
          axios.get('/gallery-autocomplete?q='+ vm.search).then(function (response) {
            vm.autocomplete_data = response.data;
          });
        }
    },

    selected: function(value){
        this.search = value.title;
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
        var groups = [];
        vm.$Progress.start();
        axios.get('/gallery/'+ id)
        .then(function (response){
            vm.gallery = response.data;
            vm.gallery.published_at = new Date(response.data.published_at+' '+'00:00:00');
            vm.$set( vm.gallery, 'file', '');
            vm.imageSrc = '/storage/photos/'+ response.data.image;
            for(var i = 0; i < response.data.groups.length; i++){
              groups.push({'value': response.data.groups[i].uid, 'label': response.data.groups[i].slug});
            }
            vm.groupsmodel = groups;
            vm.subtitle = 'Editar';
            vm.form = 'edit';
            vm.$Progress.finish();
        });
    },

    remove: function(id){
      this.gallery.uid = id;
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
            axios.post('/gallery', vm.gallery)
            .then(function (response) {
                vm.gallery.uid = response.data.uid;
                vm.subtitle = 'Editar'
                vm.form = 'edit';
                vm.submit = false;
                vm.pagination.current_page = 1;
                vm.search = '';
                vm.getData();
                vm.$Progress.finish();
                vm.closeNotification();
                vm.addNotification('Galería registrada', 'success');
            })
            .catch(function (error) {
              vm.procError(error);
            });

          }else if(vm.form === 'edit'){
            axios.put('/gallery/'+ vm.gallery.uid, vm.gallery)
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
      if(!vm.show_album){
        axios.delete('/gallery/'+ vm.gallery.uid)
        .then(function (response){
          vm.$Progress.finish();
          vm.submit = false;
          if(response.data == 'success.true'){
            vm.getData();
            vm.deleteModal = false;
            vm.addNotification('Galería eliminada', 'success');
          }else if(response.data == 'relationship.true'){
            vm.addNotification('Galería no eliminada por tener registros dependientes', 'danger');
          }
        });
      }else{
        axios.delete('/photo/'+ vm.photo.uid)
        .then(function (response){
          vm.submit = false;
          vm.loadphotos = true;
          vm.update_photos();
          vm.deleteModal = false;
          vm.$Progress.finish();
          vm.addNotification('Archivo eliminado', 'success');
        });
      }

    },

    validateFields: function(){

        for (value in this.errors) this.errors[value] = '';

        if (! this.gallery.title){
          this.$set( this.errors, 'title', 'Ingrese el título de la galería');
          this.$refs.title.focus();
          return true;
        }

        if (! this.gallery.description){
          this.$set( this.errors, 'description', 'Ingrese descripción');
          return true;
        }

        if (this.groupsmodel == null){
          this.$set( this.errors, 'groups', 'Seleccione ciudades activas para la galería');
          return true;
        }

        if (this.imageSrc == ''){
          this.$set( this.errors, 'UploadFile', 'Seleccione archivo de imagen');
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
              this.addNotification(value.toString() , 'danger')
              return;
        });
      }
    },

    /*
    | photos methods
    |
    |*/

    display_photos: function(id){
        var vm = this
        vm.closeNotification();
        vm.show_album = true;
        vm.loadphotos = true;
        vm.$Progress.start();
        axios.get('/photo/'+ vm.gallery.uid)
        .then(function (response){
            vm.photos = response.data;
            vm.loadphotos = false;
            vm.$Progress.finish();
          });
    },

    update_photos: function(id){
        var vm = this
        axios.get('/photo/'+ vm.gallery.uid)
        .then(function (response){
            vm.photos = response.data;
            vm.loadphotos = false;
        });
    },

    PhotoSelect: function(){
        for (value in this.errors) this.errors[value] = '';
        this.closeNotification();
        this.$refs.UploadPhoto.click();
    },

    UploadPhotoChange: function(event){
      var vm = this;
      var inputs = event.target;
      var num = inputs.files.length - 1;

      vm.photoSrc = [];

      for(var i = 0; i <= num; i++){

        if (inputs.files[i].size > 10000000){
          vm.addNotification('Tamaño de archivo excede los 10 Mb', 'danger')
          return;
        }

        vm.FileReader(inputs.files[i]);

      }

    },

    FileReader: function(fileData){

      var img = document.createElement("img");

      var reader = new FileReader();

      reader.onload = function(e)
      {
          img.src = e.target.result;

          img.onload = function () {

            var max_width = 800;
            var max_height = 960;
            var width = img.width;
            var height = img.height;

            if(width <= max_width){

                vm.photoSrc.push(e.target.result);

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

                vm.photoSrc.push(canvas.toDataURL("image/jpeg"));

            }

          }
      }

      reader.readAsDataURL(fileData);

    },

    SubmitPhotos: function(index){

      var vm = this
      var num = vm.photoSrc.length - 1;
      var loop = index;

       vm.submit = true;
       vm.$Progress.start()
       vm.addNotification('En proceso', 'info');
       axios.post('/photo', {
         gallery_id: vm.gallery.uid,
         title: vm.gallery.title,
         file: vm.photoSrc[loop]
        }).then(function (response) {

          vm.photoTotal --;

          if(loop == num){
            vm.$Progress.finish();
            vm.closeNotification();
            vm.photoSrc = [];
            vm.loadphotos = true;
            vm.update_photos();
            vm.addNotification('Archivo(s) almacenado', 'success');
            vm.submit = false;
          }

          if(loop < num){
            vm.SubmitPhotos(loop + 1);
          }

        })
        .catch(function (error) {
          vm.procError(error);
        });

    },

    removePhoto: function(id){
      this.photo.uid = id;
      this.deleteModal = true;
    },

  }
})
