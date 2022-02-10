<aside class="row">


  @if($city->slug == 'cali')
  <!-- Begin newsletter Form -->
  <div class="newsletter-container">
    <h3>Newsletter</h3>
	  <p>Suscríbete a nuestra lista de correo electrónico, recibe toda la información de noticias y actividades de Web Noticias {{ $city->name }}.</p>
    <a class="btn btn-primary" href="#" onclick="return false;" data-toggle="modal" data-target="#Newsletter" style="width:100%;"><strong>SUSCRIBIRME</strong></a>
  </div>
  @endif

  <!-- recent news-->
  @if(isset($recent))
    @if(count($recent) > 0)
    <div class="col-md-12 col-lg-12">
      <div class="panel panel-defaul panel-sidebar">
        <div class="panel-heading">
          <h1>Breves</h1>
        </div>
        <div class="panel-body recent_news">
          <ul>
            @foreach($recent as $recent_item)
            <li>
              <a href="{{ url('noticia', [$recent_item->slug]) }}" title="{{ $recent_item->title }}">{{ $recent_item->title }}</a><br>
            </li>
            @endforeach
          </ul>
        </div>
      </div>
    </div>
    @endif
  @endif

  <!-- breaking news-->
  @if(isset($breakings))
    @if(count($breakings) > 0)
    <div class="col-md-12 col-lg-12">
      <div class="panel panel-defaul panel-sidebar">
        <div class="panel-heading">
          <h1>Últimas Noticias</h1>
        </div>
        <div class="panel-body">
          <ul>
            @foreach($breakings as $breaking)
            <li>
                <a href="{{ url('noticia', [$breaking->slug]) }}" title="{{ $breaking->title }}">
                  <img src="{{ url_image($breaking->image, $breaking->youtube_video, 150, 1 ) }}" alt="{{ $breaking->title }}">
                </a>
                <a href="{{ url('noticia', [$breaking->slug]) }}" title="{{ $breaking->title }}">{{ $breaking->title }}</a><br>
                {{ $breaking->display_published_at }}
            </li>
            @endforeach
          </ul>
        </div>
      </div>
    </div>
    @endif
  @endif

  <!-- opinions entries-->
  @if(isset($opinions))
    @if(count($opinions) > 0)
    <div class="col-md-12 col-lg-12">
      <div class="panel panel-defaul panel-sidebar">
        <div class="panel-heading">
          <h1>Columnas de Opinión</h1>
        </div>
        <div class="panel-body">
          <ul>
            @foreach($opinions as $opinion)
            <li>
                <a href="{{ url('opinion', [$opinion->slug]) }}" title="{{ $opinion->title }}">
                  <img src="{{ post_image($opinion->author->image) }}" alt="{{ $opinion->title }}">
                </a>
                <a href="{{ url('opinion', [$opinion->slug]) }}" title="{{ $opinion->title }}">{{ $opinion->title }}</a><br>
                {{ $opinion->author->display_name }}
            </li>
            @endforeach
          </ul>
        </div>
      </div>
    </div>
    @endif
  @endif

  <!-- banner sidebar -->
  @if(isset($banners))
   @if(count($banners) > 0)
     @php($banners_sidebar = $banners->where('size', 3))
     @if(count($banners_sidebar) > 0)
     <div class="row banner-sidebar">
       <div class="col-sm-12 col-md-12">
         @php($banner_sidebar = $banners_sidebar->random(1))
         <a href="{{ $banner_sidebar[0]->url }}" title="{{ $banner_sidebar[0]->title }}" target="_blank">
           <img src="{{ asset('storage/banners').'/'.$banner_sidebar[0]->image }}" alt="{{ $banner_sidebar[0]->title }}">
         </a>
       </div>
     </div>
     @endif
   @endif
  @endif

  <!-- advertising sidebar -->
  @if(isset($advertising))
   @if(count($advertising) > 0)
     @php($advertising_sidebar = $advertising->where('size', 3))
     @if(count($advertising_sidebar) > 0)
        @php($advertising_sidebar = $advertising_sidebar->random(1))
        <div class="text-center" style="margin-bottom:10px;">
        {!! $advertising_sidebar[0]->code !!}
        </div>
     @endif
   @endif
  @endif

  <!-- Twitter timeline embed -->
  <div class="col-sm-12 col-md-12">
    <div class="text-center">
      <a class="twitter-timeline" data-lang="es" data-width="320" data-height="600" href="https://twitter.com/{{ $city->twitter_user }}">
        Tweets by {{ '@'.$city->twitter_user }}
      </a>
    </div>
  </div>

  <!-- Facebook timeline embed -->
  <div class="col-sm-12 col-md-12 text-center">
    <div class="text-center">
      <div class="fb-page" data-href="https://www.facebook.com/{{ $city->facebook_user }}" data-adapt-container-width="true" data-tabs="timeline" data-small-header="false" data-adapt-container-width="true" data-hide-cover="false" data-show-facepile="true">
        <blockquote cite="https://www.facebook.com/{{ $city->facebook_user }}" class="fb-xfbml-parse-ignore">
          <a href="https://www.facebook.com/{{ $city->facebook_user }}">Facebook</a>
        </blockquote>
      </div>
    </div>
  </div>

  <script>
    var bs = '{{ $banner_sidebar[0]->uid or "" }}';
  </script>

</aside><!-- end aside -->
