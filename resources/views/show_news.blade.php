@extends('layouts.site')
@section('title', $news->title)
@section('description', $news->excerpt)
@section('url', url('noticia', [$news->slug]))
@section('twitter_user', '@'.$city->twitter_user)
@section('image', url_image($news->image, $news->youtube_video ))
@push('json-ld')
  <script type="application/ld+json">
    {
      "@context": "http://schema.org",
      "@type": "NewsArticle",
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "{{ url('noticia', $news->slug) }}"
      },
      "headline": "{{ $news->title }}",
      "image": [
        "{{ asset('storage/photos').'/'.$news->image }}"
      ],
      "datePublished": "{{ $news->published_at->format('Y-m-d') }}",
      "dateModified": "{{ $news->updated_at }}",
      "author": {
        "@type": "Person",
        "name": "{{ $news->user->display_name }}"
      },
        "publisher": {
        "@type": "Organization",
        "name": "{{ env('APP_NAME').' '.$city->name }}",
        "logo": {
          "@type": "ImageObject",
          "url": "{{ asset('img/logo.png') }}"
        }
      },
      "description": "{{ $news->excerpt }}"
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
          <h1>{{ $news->title }}</h1>
          <hr>
          <p>
            <i class="fa fa-calendar"></i> {{ $news->display_published_at }} &nbsp;
            <i class="fa fa-user"></i> <a href="{{ url('noticias/usuario', $news->user->slug) }}">{{ $news->user->display_name }}</a>
          </p>
          @foreach($news->categories as $category)
          <a href="{{ url('categoria', [$category->slug]) }}" title="{{ $category->name }}" class="badge">{{ $category->name }}</a>
          @endforeach
          <hr>

          @if(! empty($news->youtube_video))
          <!-- video content -->
          <iframe width="100%" height="400" src="https://www.youtube.com/embed/{{ $news->youtube_video }}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>
          </iframe>
          <br>
          @endif

          @if((! empty($news->image)) && (empty($news->youtube_video)))
          <!-- image content -->
          <img src="{{ asset('storage/photos').'/'.$news->image }}" title="{{ $news->title }}" alt="{{ $news->title }}">
          <p>{{ $news->image_text or '' }}</p>
          <br>
          @endif

          @if(isset($news->gallery))
          <!-- gallery content -->
          <div class="row">
            <div class="col-md-12">
                <ul id="lightSlider">
                  <li data-thumb="{{ asset('storage/photos/150').'/'.$news->gallery->image }}">
                    <img src="{{ asset('storage/photos').'/'.$news->gallery->image }}" title="{{ $news->gallery->title }}" alt="{{ $news->gallery->title }}">
                  </li>
                  @if(isset($news->gallery->photos))
                    @foreach($news->gallery->photos as $photo)
                    <li data-thumb="{{ asset('storage/photos/150').'/'.$photo->image }}">
                      <img src="{{ asset('storage/photos').'/'.$photo->image }}" title="{{ $photo->title }}" alt="{{ $photo->title }}">
                    </li>
                    @endforeach
                  @endif
                </ul>
            </div>
          </div>
          <br>
          @endif

          <!-- item content -->
          {!! $news->content !!}
          <br>

          @if(! empty($news->embed))
            {!! $news->embed !!}
            <br><br>
          @endif

          <!-- share buttons -->
          <div class="row">
            <div class="col-xs-5 col-sm-6">
              @foreach($news->categories as $category)
              <a href="{{ url('categoria', [$category->slug]) }}" title="{{ $category->name }}" class="badge">{{ $category->name }}</a>
              @endforeach
            </div>
            <div class="col-xs-7 col-sm-6">
              <div class="pull-left">Compartir</div>
              <ul class="share-buttons pull-left">
                <li><a href="http://www.facebook.com/dialog/feed?app_id={{ $city->facebook_id }}&redirect_uri={{ url('noticia', [$news->slug]) }}&link={{ url('noticia', [$news->slug]) }}" class="facebook-button" title="Facebook"><i class="fa fa-facebook"></i></a></li>
                <li><a href="https://twitter.com/intent/tweet?url={{ url('noticia', [$news->slug]) }}&text={{ $news->title }}&via={{ $city->twitter_user }}" class="twitter-button" title="Twitter"><i class="fa fa-twitter"></i></a></li>
                <li><a href="mailto:?subject={{ urlencode($news->title) }}&body{{ urlencode($news->excerpt).'...' }}" class="envelope-button" title="Correo electrónico"><i class="fa fa-envelope"></i></a></li>
              </ul>
            </div>
          </div>

        </div>
      </article> <!-- end article-->
      <br>

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
                   <a href="{{ url('noticia', [$item_related->slug]) }}" title="{{ $item_related->title }}">
                     <img src="{{ url_image($item_related->image, $item_related->youtube_video ) }}" alt="{{ $item_related->title }}">
                   </a>
                   <h1>
                     <a href="{{ url('noticia', [$item_related->slug]) }}" title="{{ $item_related->title }}">{{ $item_related->title }}</a>
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
     <div class="fb-comments" data-href="{{ url('noticia', [$news->slug]) }}" data-width="100%" data-numposts="5"></div>

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
