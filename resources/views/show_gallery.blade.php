@extends('layouts.site')
@section('title', $gallery->title)
@section('description', $gallery->excerpt)
@section('url', url('galeria', [$gallery->slug]))
@section('twitter_user', '@'.$city->twitter_user)
@section('image', url_image($gallery->image, $gallery->youtube_video ))
@push('json-ld')
  <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "NewsArticle",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "{{ url('galeria', $gallery->slug) }}"
      },
      "headline": "{{ $gallery->title }}",
      "image": [
        "{{ asset('storage/photos').'/'.$gallery->image }}"
      ],
      "datePublished": "{{ $gallery->published_at->format('Y-m-d') }}",
      "dateModified": "{{ $gallery->updated_at }}",
      "author": {
        "@type": "Person",
        "name": "{{ $gallery->user->display_name }}"
      },
        "publisher": {
        "@type": "Organization",
        "name": "{{ env('APP_NAME').' '.$city->name }}",
        "logo": {
          "@type": "ImageObject",
          "url": "{{ asset('img/logo.png') }}"
        }
      },
      "description": "{{ $gallery->excerpt }}"
    }
  </script>
@endpush
@section('content')
  <div class="row">
    <!-- content body-->
    <div class="col-sm-8 col-md-8 content-body">
      <!--  main content -->
      <article class="row item-show">
        <div class="col-sm-12 col-md-12">
          <h1>{{ $gallery->title }}</h1>
          <hr>
          <p>
            <i class="fa fa-calendar"></i> {{ $gallery->display_published_at }} &nbsp;
            <i class="fa fa-user"></i> <a href="{{ url('galerias/usuario', $gallery->user->slug) }}">{{ $gallery->user->display_name }}</a>
          </p>
          <a href="{{ url('galerias') }}" title="Galerías" class="badge">Galerías</a>
          <hr>

          <div class="row">
            <div class="col-md-12">
                <ul id="lightSlider">
                  <li data-thumb="{{ asset('storage/photos/150').'/'.$gallery->image }}">
                    <img src="{{ asset('storage/photos').'/'.$gallery->image }}" title="{{ $gallery->title }}" alt="{{ $gallery->title }}">
                  </li>
                  @if(isset($gallery->photos))
                    @foreach($gallery->photos as $photo)
                    <li data-thumb="{{ asset('storage/photos/150').'/'.$photo->image }}">
                      <img src="{{ asset('storage/photos').'/'.$photo->image }}" title="{{ $photo->title }}" alt="{{ $photo->title }}">
                    </li>
                    @endforeach
                  @endif
                </ul>
            </div>
          </div>
          <br>

          <!-- gallery description -->
          {!! $gallery->description !!}
          <br>

          <!-- share buttons -->
          <div class="row">
            <div class="col-xs-5 col-sm-6">
              <a href="{{ url('galerias') }}" title="Galerías" class="badge">Galerías</a>
            </div>
            <div class="col-xs-7 col-sm-6">
              <div class="pull-left">Compartir</div>
              <ul class="share-buttons pull-left">
                <li><a href="http://www.facebook.com/dialog/feed?app_id={{ $city->facebook_id }}&redirect_uri={{ url('galeria', [$gallery->slug]) }}&link={{ url('galeria', [$gallery->slug]) }}" class="facebook-button" title="Facebook"><i class="fa fa-facebook"></i></a></li>
                <li><a href="https://twitter.com/intent/tweet?url={{ url('galeria', [$gallery->slug]) }}&text={{ $gallery->title }}&via={{ $city->twitter_user }}" class="twitter-button" title="Twitter"><i class="fa fa-twitter"></i></a></li>
                <li><a href="mailto:?subject={{ urlencode($gallery->title) }}&body{{ urlencode($gallery->excerpt).'...' }}" class="envelope-button" title="Correo electrónico"><i class="fa fa-envelope"></i></a></li>
              </ul>
            </div>
          </div>

        </div>
      </article>

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

      <!--  relate content -->
      @if(count($related) > 0)
      <h2 class="subtitle">
        <span>Artículos relacionados</span>
      </h2>
      @foreach ($related->chunk(3) as $chunk)
      <div class="row">
         @foreach ($chunk as $item_related)
             <div class="col-sm-4 col-md-4">
               <div class="panel panel-default">
                 <div class="panel-heading">
                   <a href="{{ url('galeria', [$item_related->slug]) }}" title="{{ $item_related->title }}">
                     <img src="{{ url_image($item_related->image, null ) }}" alt="{{ $item_related->title }}">
                   </a>
                   <h1>
                     <a href="{{ url('galeria', [$item_related->slug]) }}" title="{{ $item_related->title }}">{{ $item_related->title }}</a>
                   </h1>
                   {{ $item_related->display_published_at }}
                 </div>
                 <div class="panel-body">
                 </div>
               </div>
             </div>
         @endforeach
     </div>
     @endforeach
     @endif

     <!-- facebook comments -->
      <div class="fb-comments" data-href="{{ url('galeria', [$gallery->slug]) }}" data-width="100%" data-numposts="5"></div>

   </div> <!-- end div -->

    <!-- sidebar-->
    <div class="col-sm-4 col-md-4 sidebar">
      @include('includes.sidebar')
    </div>
  </div>
@endsection

@push('scripts')
  <script src="{{ asset('js/lightslider.min.js') }}"></script>
  <script>
    $('#lightSlider').lightSlider({
      gallery: true,
      item:1,
      loop:true
    });
  </script>
@endpush
