@extends('layouts.site')
@section('title', "Web Noticias $city->name")
@section('description', "Web Noticias $city->name es una plataforma de comunicaciones independiente sobre noticias locales e hiperlocales en Colombia y Venezuela.")
@section('url', url(''))
@section('twitter_user', '@'.$city->twitter_user)
@section('image', '')
@section('content')
  <div class="row">
    <!-- content body-->
    <div class="col-sm-8 col-md-8 content-body">

      <!-- news-->
      @if(count($news) > 0)
        @php($primaries_news = $news->splice(0, 2))
        @php($secondaries_news = $news->splice(0, 10))

        <div class="row">
          <div class="col-sm-6 col-md-6 entries-main">
            @foreach($primaries_news as $entrie)
            <div class="panel panel-default">
              <div class="panel-heading">
                <a href="{{ url('noticia', [$entrie->slug]) }}" title="{{ $entrie->title }}">
                  <img src="{{ url_image($entrie->image, $entrie->youtube_video ) }}" alt="{{ $entrie->title }}">
                </a>
                <h1>
                  <a href="{{ url('noticia', [$entrie->slug]) }}" title="{{ $entrie->title }}">{{ $entrie->title }}</a>
                </h1>
                {{ $entrie->display_published_at }}
              </div>
              <div class="panel-body">
                {{ $entrie->excerpt.' ...' }}
              </div>
            </div>
            @endforeach
          </div> <!-- end div -->
          <div class="col-sm-6 col-md-6">
            <ul class="list_news">
              @foreach($secondaries_news as $entrie_list)
              <li>
                <a href="{{ url('noticia', [$entrie_list->slug]) }}" title="{{ $entrie_list->title }}">
                  <img src="{{ url_image($entrie_list->image, $entrie_list->youtube_video, 150, 1 ) }}" alt="{{ $entrie_list->title }}">
                </a>
                <a href="{{ url('noticia', [$entrie_list->slug]) }}" title="{{ $entrie_list->title }}">{{ $entrie_list->title }}</a><br>
                {{ $entrie_list->display_published_at }}
              </li>
              @endforeach
            </ul>
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


     <!-- galleries -->
     @if(count($galleries) > 0)
     <h2 class="subtitle">
       <span>Galerías Fotográficas</span>
     </h2>
     @foreach ($galleries->chunk(2) as $chunk)
     <div class="row">
        @foreach ($chunk as $gallery)
            <div class="col-sm-6 col-md-6">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <a href="{{ url('galeria', [$gallery->slug]) }}" title="{{ $gallery->title }}">
                    <img src="{{ url_image($gallery->image, $gallery->youtube_video ) }}" alt="{{ $gallery->title }}">
                  </a>
                  <h1>
                    <a href="{{ url('galeria', [$gallery->slug]) }}" title="{{ $gallery->title }}">{{ $gallery->title }}</a>
                  </h1>
                  {{ $gallery->display_published_at }}
                </div>
                <div class="panel-body">
                  {{ $gallery->excerpt.' ...' }}
                </div>
              </div>
            </div>
        @endforeach
    </div>
    @endforeach
    @endif


    <!-- trends -->
    @if(count($trends) > 0)
    <h2 class="subtitle">
      <span>Tendencias</span>
    </h2>
    @foreach ($trends->chunk(3) as $chunk)
    <div class="row">
       @foreach ($chunk as $trend)
           <div class="col-sm-4 col-md-4">
             <div class="panel panel-default">
               <div class="panel-heading">
                 <a href="{{ url('noticia', [$trend->slug]) }}" title="{{ $trend->title }}">
                   <img src="{{ url_image($trend->image, $trend->youtube_video ) }}" alt="{{ $trend->title }}">
                 </a>
                 <h1>
                   <a href="{{ url('noticia', [$trend->slug]) }}" title="{{ $trend->title }}">{{ $trend->title }}</a>
                 </h1>
                 {{ $trend->display_published_at }}
               </div>
               <div class="panel-body">
               </div>
             </div>
           </div>
       @endforeach
   </div>
   @endforeach
   @endif

   </div> <!-- end div -->

    <!-- sidebar-->
    <div class="col-sm-4 col-md-4 sidebar">
      @include('includes.sidebar')
    </div>
  </div>

@endsection
