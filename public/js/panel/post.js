var vm = new Vue({
  el: '#app',

  /*
  | model data
  |
  */
  data: {

    title: 'Columnas',
    subtitle: 'Listado',

    posts: [],
    post:{
      uid:'',
      author_id:'',
      title:'',
      slug:'',
      excerpt:'',
      youtube_video:'',
      content:'',
      embed:'',
      groups: '',
      published_at: new Date(new Date().setHours(0,0,0,0)),
      status: 1,
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
    deleteModal: false,
    errors:[],
    submit: false,

    imageSrc:'',

    groups:[],
    groupsmodel: null,

    authors:[],
    authormodel: null,

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

      post: {
        handler: function (val, oldVal) {
          this.errors = [];
        },
        deep: true
      },

      'post.title': function(value){
        this.post.slug = getSlug(value.toLowerCase());
      },

      'post.content': function(value){
        this.post.excerpt = value;
      },

      imageSrc: function(value){
        this.post.file = value.match(/data:image/g) ? value : '';
      },

      groupsmodel: function(){
        if(this.groupsmodel != null){
          var values = [];
          for(var i = 0; i < this.groupsmodel.length; i++){
            values.push(this.groupsmodel[i].value)
          }
          this.post.groups = values;
        }
      },

      authormodel: function(value){
        if(value){
          this.post.author_id = this.authormodel.value;
        }else{
          this.post.author_id = '';
        }
      }

    },

  /*
  | Methods
  |
  */
  methods: {

    resetForm: function(){
      for (value in this.post) this.post[value] = '';
      this.post.published_at = new Date(new Date().setHours(0,0,0,0));
      this.post.status = 1;
      this.errors = [];
      this.imageSrc = '';
      this.groupsmodel = null;
      this.authors = [];
      this.authormodel = null;
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
        axios.get('/post', {
          params: {
            'q': vm.search,
            'page': page != '' ? page : vm.pagination.current_page,
          }
      }).then(function (response) {
            vm.posts = response.data.data;
            vm.pagination = response.data;
            vm.$Progress.finish();
        })
        .catch(function (error) {
            vm.procError(error);
        })

        return false;
    },

    displayName: function( name, last_name){
        return capitalize(name.split(" ")[0]) +' '+ capitalize(last_name.split(" ")[0]);
    },

    displayStatus: function(status){
          return status ? 'Publicado' : 'Inactivo';
    },

    getGroups: function(){
      var vm = this;
      axios.get('/group-list').then(function (response) {
        for(var i = 0; i < response.data.length; i++){
          vm.groups.push({'value': response.data[i].uid, 'label': response.data[i].name});
        }
      });
    },

    onSearch: function(){
        this.pagination.current_page = 1;
        this.getData();
    },

    autocomplete: function(){
        var vm = this;
        if(vm.search.length > 2){
          axios.get('/post-autocomplete?q='+ vm.search).then(function (response) {
            vm.autocomplete_data = response.data;
          });
        }
    },

    selected: function(value){
        this.search = value.title;
        this.autocomplete_data = [];
        this.onSearch();
    },

    getAuthors: function(search, loading){
      var vm = this;
      vm.authors = [];
      if(search.length > 1){
        loading(true)
        axios.get('/author-autocomplete?q='+ search).then(function (response) {
          for(var i = 0; i < response.data.length; i++){
          vm.authors.push({'value': response.data[i].uid, 'label': capitalize(response.data[i].name)+' '+capitalize(response.data[i].last_name)});
          }
           loading(false)
        });
      }
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
          vm.addNotification('Tama??o de archivo excede los 10 Mb', 'danger')
          return;
        }

        var reader = new FileReader();

        reader.onload = function(e)
        {
            img.src = e.target.result;

            img.onload = function () {

              vm.$delete(vm.post, 'delete_old_image')

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

    UploadFileDelete(){
      this.imageSrc = '';
      this.$set( this.post, 'delete_old_image', true);
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
        axios.get('/post/'+ id)
        .then(function (response){
            vm.post = response.data;
            vm.post.published_at = new Date(response.data.published_at+' '+'00:00:00');
            vm.$set( vm.post, 'file', '');
            if(response.data.image){
            vm.imageSrc = '/storage/photos/'+ response.data.image;
            }
            for(var i = 0; i < response.data.groups.length; i++){
              groups.push({'value': response.data.groups[i].uid, 'label': response.data.groups[i].name});
            }
            vm.groupsmodel = groups;
            vm.authormodel = {'value': response.data.author.uid, 'label': capitalize(response.data.author.name)+' '+capitalize(response.data.author.last_name) };
            vm.subtitle = 'Editar';
            vm.form = 'edit';
            vm.$Progress.finish();
        });
    },

    remove: function(id){
      this.post.uid = id;
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
            axios.post('/post', vm.post)
            .then(function (response) {
                vm.post.uid = response.data.uid;
                vm.subtitle = 'Editar'
                vm.form = 'edit';
                vm.submit = false;
                vm.search = '';
                vm.getData();
                vm.$Progress.finish();
                vm.closeNotification();
                vm.addNotification('Art??culo registrado', 'success');
            })
            .catch(function (error) {
              vm.procError(error);
            });

          }else if(vm.form === 'edit'){
            axios.put('/post/'+ vm.post.uid, vm.post)
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
      axios.delete('/post/'+ vm.post.uid)
      .then(function (response){
        vm.submit = false;
        vm.getData();
        vm.deleteModal = false;
        vm.$Progress.finish();
        vm.addNotification('Categor??a eliminada', 'success');
      });

    },

    validateFields: function(){

        for (value in this.errors) this.errors[value] = '';

        if (! this.post.title){
          this.$set( this.errors, 'title', 'Ingrese t??tulo de art??culo');
          this.$refs.title.focus();
          return true;
        }

        if (! this.post.content){
          this.$set( this.errors, 'content', 'Ingrese contenido de art??culo');
          return true;
        }

        if (! this.post.excerpt){
          this.$set( this.errors, 'excerpt', 'Ingrese Extracto/Fragmento de art??culo');
          this.$refs.excerpt.focus();
          return true;
        }

        if (! this.post.groups){
          this.$set( this.errors, 'groups', 'Ingrese ciudades de art??culo');
          return true;
        }

        if (! this.post.author_id){
          this.$set( this.errors, 'author', 'Ingrese autor de art??culo');
          return true;
        }

        if (this.post.youtube_video){
          if (! this.post.youtube_video.match(/^[a-zA-Z0-9-_]{11}$/)) {
            this.$set( this.errors, 'youtube_video', 'Ingrese ID de video de YouTube v??lido');
            this.$refs.youtube_video.focus();
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
