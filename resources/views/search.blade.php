@extends('layouts.site')
@section('title', "Web Noticias $city->name - Buscar")
@section('description', "Web Noticias $city->name es una plataforma de comunicaciones independiente sobre noticias locales e hiperlocales en Colombia.")
@section('url', url('buscar'))
@section('twitter_user', '@'.$city->twitter_user)
@section('image', '')
@section('content')
  <div class="row">
    <!-- content body-->
    <div class="col-sm-8 col-md-8 content-body">

      <h1 class="title">
        <span>Buscar <b>{{ request()->q }}</span>
      </h1>
      <br>

       <!-- news -->
       @if(count($news) > 0)
       <h3>Noticias</h3>
       <hr>
       @foreach ($news->chunk(3) as $chunk)
       <div class="row">
          @foreach ($chunk as $entry)
              <div class="col-sm-4 col-md-4">
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <a href="{{ url('noticia', [$entry->slug]) }}" title="{{ $entry->title }}">
                      <img src="{{ url_image($entry->image, $entry->youtube_video ) }}" alt="{{ $entry->title }}">
                    </a>
                    <h1>
                      <a href="{{ url('noticia', [$entry->slug]) }}" title="{{ $entry->title }}">{{ $entry->title }}</a>
                    </h1>
                    {{ $entry->display_published_at }}
                  </div>
                  <div class="panel-body">
                  </div>
                </div>
              </div>
          @endforeach
      </div>
      @endforeach
      @endif

      <!-- galleries -->
      @if(count($galleries) > 0)
      <h3>Galerías fotográficas</h3>
      <hr>
      @foreach ($galleries->chunk(3) as $chunk)
      <div class="row">
         @foreach ($chunk as $gallery)
             <div class="col-sm-4 col-md-4">
               <div class="panel panel-default">
                 <div class="panel-heading">
                   <a href="{{ url('galeria', [$gallery->slug]) }}" title="{{ $gallery->title }}">
                     <img src="{{ url_image($gallery->image, $gallery->youtube_video ) }}" alt="{{ $gallery->title }}">
                   </a>
                   <h1>
                     <a href="{{ url('galeria', [$gallery->slug]) }}" title="{{ $gallery->title }}">{{ $gallery->title }}</a>
                   </h1>
                   {{ $gallery->published_at }}
                 </div>
                 <div class="panel-body">
                 </div>
               </div>
             </div>
         @endforeach
      </div>
      @endforeach
      @endif

      <!-- posts -->
      @if(count($posts) > 0)
      <h3>Columnas de Opinión</h3>
      <hr>
      @foreach ($posts->chunk(3) as $chunk)
      <div class="row">
        @foreach ($chunk as $post)
            <div class="col-sm-4 col-md-4">
              <div class="panel panel-default">
                <div class="panel-heading">
                  <a href="{{ url('opinion', [$post->slug]) }}" title="{{ $post->title }}">
                    <img src="{{  post_image($post->author->image) }}" alt="{{ $post->author->name.' '.$post->author->last_name }}">
                  </a>
                  <h1>
                    <a href="{{ url('galeria', [$post->slug]) }}" title="{{ $post->title }}">{{ $post->title }}</a>
                  </h1>
                  {{ $post->published_at }}
                </div>
                <div class="panel-body">
                </div>
              </div>
            </div>
        @endforeach
     </div>
     @endforeach
     @endif

     @if( (count($news) == 0) && (count($galleries) == 0) && (count($posts) == 0))
        <p><strong>No se encontraron resultados para mostrar</strong></p>
     @endif

    </div> <!-- end div -->

    <!-- sidebar-->
    <div class="col-sm-4 col-md-4 sidebar">
      @include('includes.sidebar')
    </div>
  </div>
@endsection
