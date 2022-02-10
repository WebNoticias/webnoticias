<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title')</title>
    <meta name="description" content="@yield('description')">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="url" content="{{ url('') }}">
    <meta name="newsletter_modal" content="{{ request()->newsletter }}">
    <link rel="shortcut icon" href="{{ asset('img/icon.png') }}" type="image/png">
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
    <link rel="canonical" href="@yield('url')">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@yield('twitter_user')">
    <meta name="twitter:creator" content="@yield('twitter_user')">
    <meta name="twitter:title" content="@yield('title')">
    <meta name="twitter:description" content="@yield('description')">
    <meta name="twitter:image" content="@yield('image')">
    <meta name="facebook-id" content="{{ $city->facebook_id }}">
    <meta property="og:url" content="@yield('url')">
    <meta property="og:type"  content="website">
    <meta property="og:title" content="@yield('title')">
    <meta property="og:description" content="@yield('description')">
    <meta property="og:image" content="@yield('image')">
    <meta name="google-site-verification" content="{{ $city->google_site_verification or '' }}" />
    @stack('json-ld')
    <!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-QZ2QSRJGL1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-QZ2QSRJGL1');
</script>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-33982942-4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-33982942-4');
</script>

   </head>
  <body>
    <!-- main container -->
    <div class="container" style="background:#fff;">
      <!-- navbar top -->
      <div class="row navbar-top">
        <div class="col-md-12 col-lg-12">
          @if(isset($cities))
          <ul class="nav navbar-nav">
            <li class="dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Ciudad {{ $city->name }} <span class="caret"></span></a>
              <ul class="dropdown-menu">
                @for($i = 0; $i < count($countries); $i++)
                  @php($country_cities = $cities->where('country', $countries[$i]))
                  @if(count($country_cities) > 0)
                  <li class="dropdown-header">{{ $countries[$i] }}</li>
                  @foreach($country_cities as $subdomain)
                  <li><a href="http://{{ $subdomain->slug }}.webnoticias.co/" title="Web Noticias {{ $subdomain->name }}">{{ $subdomain->name }}</a></li>
                  @endforeach
                  @endif
                @endfor


                {{--
                @php($colombia_cities = $cities->where('country', 'Colombia'))
                @if(count($colombia_cities) > 0)
                <li class="dropdown-header">Colombia</li>
                @foreach($colombia_cities as $colombia_subdomain)
                <li><a href="http://{{ $colombia_subdomain->slug }}.webnoticias.co/" title="Web Noticias {{ $colombia_subdomain->name }}">{{ $colombia_subdomain->name }}</a></li>
                @endforeach
                @endif

                @php($ecuador_cities = $cities->where('country', 'Ecuador'))
                @if(count($ecuador_cities) > 0)
                <li class="dropdown-header">Ecuador</li>
                @foreach($ecuador_cities as $ecuador_subdomain)
                <li><a href="http://{{ $ecuador_subdomain->slug }}.webnoticias.co/" title="Web Noticias {{ $ecuador_subdomain->name }}">{{ $ecuador_subdomain->name }}</a></li>
                @endforeach
                @endif

                @php($usa_cities = $cities->where('country', 'Estados Unidos'))
                @if(count($usa_cities) > 0)
                <li class="dropdown-header">Estados Unidos</li>
                @foreach($usa_cities as $usa_subdomain)
                <li><a href="http://{{ $usa_subdomain->slug }}.webnoticias.co/" title="Web Noticias {{ $usa_subdomain->name }}">{{ $usa_subdomain->name }}</a></li>
                @endforeach
                @endif

                @php($venezuela_cities = $cities->where('country', 'Venezuela'))
                @if(count($venezuela_cities) > 0)
                <li class="dropdown-header">Venezuela</li>
                @foreach($venezuela_cities as $venezuela_subdomain)
                <li><a href="http://{{ $venezuela_subdomain->slug }}.webnoticias.co/" title="Web Noticias {{ $venezuela_subdomain->name }}">{{ $venezuela_subdomain->name }}</a></li>
                @endforeach
                @endif
                --}}
              </ul>
            </li>
          </ul>
          @endif
        </div>
      </div>
      <!-- header container -->
      <div class="row header-container">
          <div class="col-md-12 col-lg-12">
            <a href="{{ url('') }}" title="Web Noticias {{ $city->name }}" class="logo"><img src="{{ asset('img/logo.png') }}" alt="Web Noticias"></a>
            <ul class="rrss-buttons">
              <li><a href="https://www.facebook.com/{{ $city->facebook_user }}" target="_blank" title="Web Noticias {{ $city->name }} Facebook"><i class="fa fa-facebook-square"></i></a></li>
              <li><a href="https://twitter.com/{{ $city->twitter_user }}" target="_blank" title="Web Noticias {{ $city->name }} Twitter"><i class="fa fa-twitter"></i></a></li>
              <li><a href="https://www.youtube.com/user/{{ $city->youtube_user }}" target="_blank" title="Web Noticias {{ $city->name }} YouTube"><i class="fa fa-youtube"></i></a></li>
              <li><a href="https://www.instagram.com/{{ $city->instagram_user }}" target="_blank" title="Web Noticias {{ $city->name }} Instagram"><i class="fa fa-instagram"></i></a></li>
            </ul>
            <form role="search" id="search" class="form-search">
             <div class="input-group">
               <input type="hidden" id="_url" value="{{ url('') }}">
               <input type="text" class="form-control" id="search-input" placeholder="Buscar" value="{{ request()->q }}">
               <div class="input-group-btn">
                 <button class="btn btn-default" type="submit"><i class="fa fa-search"></i></button>
               </div>
             </div>
           </form>
          </div>
      </div>
      <!-- main header menu -->
      <nav class="navbar navbar-inverse">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#menu-header">
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="menu-header">
          <ul class="nav navbar-nav">
            <li><a href="{{ url('') }}" title="Portada">Portada</a></li>
            <li class="{{ active_check(['categoria/actualidad']) }}"><a href="{{ url('categoria/actualidad') }}" title="Actualidad">Actualidad</a></li>
            <li class="{{ active_check(['categoria/breves']) }}"><a href="{{ url('categoria/breves') }}" title="Breves">Breves</a></li>
            <li class="{{ active_check(['categoria/cultura']) }}"><a href="{{ url('categoria/cultura') }}" title="Cultura">Cultura</a></li>
            <li class="{{ active_check(['categoria/deportes']) }}"><a href="{{ url('categoria/deportes') }}" title="Cultura">Deportes</a></li>
            <li class="{{ active_check(['galerias']) }}"><a href="{{ url('galerias') }}" title="Galerías">Galerías</a></li>
            <li class="{{ active_check(['opinion']) }}"><a href="{{ url('opinion') }}" title="Opinión">Opinión</a></li>
            <li class="{{ active_check(['categoria/judicial']) }}"><a href="{{ url('categoria/judicial') }}" title="Judicial">Judicial</a></li>
            <li class="{{ active_check(['categoria/tendencias']) }}"><a href="{{ url('categoria/tendencias') }}" title="Tendencias">Tendencias</a></li>
            <li class="{{ active_check(['categoria/webplay']) }}"><a href="{{ url('categoria/webplay') }}" title="Web Play">Web Play</a></li>
          </ul>
        </div>
      </nav>

      <!-- banner header -->
      @if(isset($banners))
        @if(count($banners) > 0)
          @php($banners_header = $banners->where('size', 1))
          @if(count($banners_header) > 0)
          <div class="row banner-header">
            <div class="col-sm-12 col-md-12">
              @php($banner_header = $banners_header->random(1))
              <a href="{{ $banner_header[0]->url }}" title="{{ $banner_header[0]->title }}" target="_blank">
                <img src="{{ asset('storage/banners').'/'.$banner_header[0]->image }}" alt="{{ $banner_header[0]->title }}">
              </a>
            </div>
          </div>
          @endif
        @endif
      @endif

      <!-- advertising header -->
      @if(isset($advertising))
        @if(count($advertising) > 0)
          @php($advertising_header = $advertising->where('size', 1))
          @if(count($advertising_header) > 0)
            @php($advertising_header = $advertising_header->random(1))
            <div class="row" style="margin-bottom:20px;">
              <div class="center-block" style="max-width:960px;">
                {!! $advertising_header[0]->code !!}
              </div>
            </div>
          @endif
        @endif
      @endif

      <!-- Main content -->
      <section class="content">
          @yield('content')
      </section>

      </div> <!-- end container -->

      @if($city->mail_address && $city->mail_user && $city->mail_password)
      <!-- Newsletter Modal -->
      <div id="Newsletter" class="modal fade" role="dialog">
        <form id="newsletter-form" autocomplete="off">
          <input type="hidden" id="group" value="{{ $city->uid }}">
          <input type="hidden" id="token" value="{{ $random = str_random(40) }}">
          <div class="modal-dialog">
            <!-- Modal content-->
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" id="close-modal" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Newsletter</h4>
              </div>
              <div class="modal-body">
                <div class="text-center">
                  <img src="{{ asset('img/logo.png') }}" alt="Web Noticias" style="width:100%;max-width:240px;max-height:240px;">
                </div>
                <br>
                <p class="text-center">Suscribir a boletín informativo de <strong>Web Noticias {{ $city->name }}</strong></p>
                <div class="row">
                  <div class="col-md-12">
                    <div class="alert alert-success" style="display:none;">
                      <strong><i class="fa fa-envelope"></i></strong> <strong>Te hemos enviado un correo electrónico</strong> a la dirección especificada para confirmar tu suscripción a nuestro boletín de noticias,
                      en caso que  el correo de confirmación llegue a tu bandeja de correos no deseados o spam, marcalo como correo seguro/deseado.
                    </div>
                  </div>
                  <div class="col-md-12">
                    <div class="form-group">
                      <label for="email">Correo Electrónico</label>
                      <input class="form-control" id="email" placeholder="Correo Electrónico" maxlength="50">
                      <span class="missing_alert text-danger" id="email_alert"></span>
                    </div>
                    <div class="form-group">
                      <label for="frequency">Recibir boletín de noticias</label>
                      <select id="frequency" class="form-control">
                        <option value="1" selected>Últimas noticias (diario)</option>
                        <option value="2">Noticias destacadas (semanal)</option>
                        <option value="3">Boletín diario y semanal</option>
                      </select>
                      <span class="missing_alert text-danger" id="error_alert"></span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="modal-footer">
                <button type="submit" id="button-submit" class="btn btn-primary float-right ajax" >
                  <i id="ajax-icon" class="fa fa-envelope"></i> Suscribirme
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      @endif

      <!--footer -->
      <footer class="container footer-container">
        <ul class="rrss-buttons">
          <li><a href="https://www.facebook.com/{{ $city->facebook_user }}" target="_blank" title="Web Noticias {{ $city->name }} Facebook"><i class="fa fa-facebook-square"></i></a></li>
          <li><a href="https://twitter.com/{{ $city->twitter_user }}" target="_blank" title="Web Noticias {{ $city->name }} Twitter"><i class="fa fa-twitter"></i></a></li>
          <li><a href="https://www.youtube.com/user/{{ $city->youtube_user }}" target="_blank" title="Web Noticias {{ $city->name }} YouTube"><i class="fa fa-youtube"></i></a></li>
          <li><a href="https://www.instagram.com/{{ $city->instagram_user }}" target="_blank" title="Web Noticias {{ $city->name }} Instagram"><i class="fa fa-instagram"></i></a></li>
        </ul>
        &copy; 2018 Todos los derechos reservados - Web Noticias {{ $city->name }}
        Diseño <a href="https://miwebproes.com" target="_blank" title="Miwebproes"><strong>Miwebproes</strong></a><br>
        <a href="#"><strong>Quiénes somos</strong></a> y <a href="#"><strong>Paute con nosotros</strong></a>
      </footer>

      <script>
        var g = '{{ $city->uid or "" }}';
        var bh = '{{ $banner_header[0]->uid or "" }}';
        var bm = '{{ $banner_main[0]->uid or "" }}';
        var ns = '{{ $news->uid or "" }}';
        var ps = '{{ $post->uid or "" }}';
        var gy = '{{ $gallery->uid or "" }}';
      </script>

    <!-- required js script -->
    <script src="{{ asset('js/scripts.min.js') }}"></script>
    <script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
    @stack('scripts')

  </body>
</html>
