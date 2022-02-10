@extends('layouts.site')
@section('title', "Columnas de opinión de $author->display_name" )
@section('description', "Columnas de opinión escritas por ". $author->name." ".$author->last_name)
@section('url', url('columnas/autor').'/'.$author->uid)
@section('twitter_user', '@'.$city->twitter_user)
@section('image', post_image($author->image, 300))
@section('content')
  <div class="row">
    <!-- content body-->
    <div class="col-sm-8 col-sm-8 content-body">
      <!--  main content -->
      <h1 class="title">
        <span>Columnas de opinión de {{ $author->display_name }}</span>
      </h1>
      <br>

      @if(count($posts) > 0)

      @foreach($posts as $post)
      <div class="row info-card">
        <div class="col-sm-3">
          <a href="{{ url('opinion', [$post->slug]) }}" title="{{ $post->author->name.' '.$post->author->last_name }}">
            <img src="{{ post_image($post->author->image) }}" alt="{{ $post->author->name.' '.$post->author->last_name  }}">
          </a>
        </div>
        <div class="col-sm-9">
          <h3>
            <a href="{{ url('opinion', [$post->slug]) }}" title="{{ $post->title }}">{{ $post->title.' por '.$post->author->name.' '.$post->author->last_name  }}</a>
          </h3>
          {{ $post->display_published_at }}
          <br>
          {{ $post->excerpt.' ...' }}
        </div>
      </div>

      @if($loop->iteration == 5)
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
            <div class="text-center" style="margin-bottom:20px;">
            {!! $advertising_main[0]->code !!}
            </div>
          @endif
        @endif
      @endif

      @endif

      @endforeach

      <!-- pagination links -->
      {{ $posts->links() }}

      @else
      <p><strong>No se encontraron resultados para mostrar</strong></p>
      @endif

    </div> <!-- end div -->

    <!-- sidebar-->
    <div class="col-sm-4 col-md-4 sidebar">
      @include('includes.sidebar', ['no-posts' => true])
    </div>

  </div>
@endsection
