@extends('layouts.site')
@section('title', $post->title)
@section('description', $post->excerpt)
@section('url', url('opinion', [$post->slug]))
@section('twitter_user', '@'.$city->twitter_user)
@section('image', post_image($post->author->image))
@push('json-ld')
  <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "NewsArticle",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "{{ url('opinion', $post->slug) }}"
      },
      "headline": "{{ $post->title }}",
      "image": [
        "{{ asset('storage/photos').'/'.$post->image }}"
      ],
      "datePublished": "{{ $post->published_at->format('Y-m-d') }}",
      "dateModified": "{{ $post->updated_at }}",
      "author": {
        "@type": "Person",
        "name": "{{ $post->author->display_name }}"
      },
        "publisher": {
        "@type": "Organization",
        "name": "{{ env('APP_NAME').' '.$city->name }}",
        "logo": {
          "@type": "ImageObject",
          "url": "{{ asset('img/logo.png') }}"
        }
      },
      "description": "{{ $post->excerpt }}"
    }
  </script>
@endpush
@section('content')
  <div class="row">
    <!-- content body-->
    <div class="col-sm-8 col-md-8 content-body">
      <!--  main content -->
      <article class="row item-show">
        <div class="col-md-12 col-lg-12">
          <h1>{{ $post->title }}</h1>
          <hr>
          <p>
            <i class="fa fa-calendar"></i> {{ $post->display_published_at }} &nbsp;
            <i class="fa fa-user"></i>  <a href="{{ url('columnas/autor', $post->author->slug) }}">{{ $post->author->display_name }}</a>
          </p>
          <a href="{{ url('opinion') }}" title="Columnas de Opinión" class="badge">Opinión</a>
          <hr>

          @if(! empty($post->youtube_video))
          <!-- video content -->
          <iframe width="100%" height="400" src="https://www.youtube.com/embed/{{ $post->youtube_video }}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
          </iframe>
          <br><br>
          @endif

          @if((! empty($post->image)) && (empty($post->youtube_video)))
          <!-- image content -->
          <img src="{{ asset('storage/photos').'/'.$post->image }}" title="{{ $post->title }}" alt="{{ $post->title }}">
          <br><br>
          @endif

          <!-- item content -->
          {!! $post->content !!}
          <br>

          @if(! empty($post->embed))
            {!! $post->embed !!}
            <br><br>
          @endif


          <!-- share buttons -->
          <div class="row">
            <div class="col-xs-5 col-sm-6">
              <a href="{{ url('opinion') }}" title="Columnas de Opinión" class="badge">Opinión</a>
            </div>
            <div class="col-xs-7 col-sm-6">
              <div class="pull-left">Compartir</div>
              <ul class="share-buttons pull-left">
                <li><a href="http://www.facebook.com/dialog/feed?app_id={{ $city->facebook_id }}&redirect_uri={{ url('opinion', [$post->slug]) }}&link={{ url('opinion', [$post->slug]) }}" class="facebook-button" title="Facebook"><i class="fa fa-facebook"></i></a></li>
                <li><a href="https://twitter.com/intent/tweet?url={{ url('opinion', [$post->slug]) }}&text={{ $post->title }}&via={{ $city->twitter_user }}" class="twitter-button" title="Twitter"><i class="fa fa-twitter"></i></a></li>
                <li><a href="mailto:?subject={{ urlencode($post->title) }}&body{{ urlencode($post->excerpt).'...' }}" class="envelope-button" title="Correo electrónico"><i class="fa fa-envelope"></i></a></li>
              </ul>
            </div>
          </div>
        </div>
      </article>

      <h3>Escrito por</h3>
      <hr>
      <div class="row">
        <div class="col-xs-12 col-sm-4" style="background:#fff;">
          <img src="{{ post_image($post->author->image, 300) }}" style="width:200px;height:210px;" title="{{  $post->author->name.' '.$post->author->last_name }}" alt="{{  $post->author->name.' '.$post->author->last_name }}">
        </div>
        <div class="col-xs-12 col-sm-8">
          <h4>
            <strong>{{ $post->author->name.' '.$post->author->last_name }}</strong>
          </h4>
          @if(! empty($post->author->description) )
          {!! nl2br($post->author->description) !!}<br><br>
          @endif
          <p>
            @if(! empty($post->author->twitter ))
              <a href="https://twitter.com/{{ $post->author->twitter  }}">
                <i class="fa fa-twitter"></i> {{ $post->author->twitter }}
              </a>&nbsp;
            @endif

            @if(! empty($post->author->email ))
              <i class="fa fa-envelope"></i> {{ $post->author->email }}
            @endif
          </p>
        </div>
      </div>
      <br>

      <!--  relate content -->
      @if(count($related) > 0)
      <h2 class="subtitle">
        <span>Últimas publicaciones</span>
      </h2>
      <div class="row">
         <div class="col-sm-12 col-md-12">
           <div class="panel panel-default">
              <div class="panel-heading">
               @foreach ($related as $item_related)
               <h1>
                <a href="{{ url('opinion', [$item_related->slug]) }}" title="{{ $item_related->title }}">{{ $item_related->title }}</a>
              </h1>
              {{ $item_related->display_published_at }}
              @endforeach
            </div>
            <div class="panel-body">
            </div>
          </div>
        </div>
      </div>
     @endif

      <!-- banner main -->
      @if(isset($banners))
        @if(count($banners) > 0)
          @php($banners_main = $banners->where('size', 2))
          @if(count($banners_main) > 0)
          <div class="row banner-main">
            <div class="col-sm-12 col-md-12">
              @php($banner_main = $banners_main->random(1))
              <a href="{{ $banner_main[0]->url }}" title="{{ $banner_main[0]->title }}" target="_blank">
                <img src="{{ asset('storage/banners').'/'.$banner_main[0]->image }}" alt="{{ $banner_main[0]->title }}">
              </a>
            </div>
          </div>
          @endif
        @endif
      @endif

      <!-- advertising main -->
      @if(isset($advertising))
        @if(count($advertising) > 0)
          @php($advertising_main = $advertising->where('size', 2))
          @if(count($advertising_main) > 0)
            @php($advertising_main = $advertising_main->random(1))
            <div class="text-center">
            {!! $advertising_main[0]->code !!}
            </div>
          @endif
        @endif
      @endif

      <!-- facebook comments -->
      <div class="fb-comments" data-href="{{ url('opinion', [$post->slug]) }}" data-width="100%" data-numposts="5"></div>

   </div> <!-- end div -->

    <!-- sidebar-->
    <div class="col-sm-4 col-md-4 sidebar">
      @include('includes.sidebar')
    </div>
  </div>
@endsection
