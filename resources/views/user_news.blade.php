@extends('layouts.site')
@section('title', "Noticias subidas por: $user->display_name")
@section('description', "Noticias subidas por: $user->display_name")
@section('url', url('noticias/usuario', $user->uid))
@section('twitter_user', '@'.$city->twitter_user)
@section('image', '')
@section('content')

  <div class="row">
    <!-- content body-->
    <div class="col-sm-8 col-md-8 content-body">
      <!--  main content -->
      <h1 class="title">
        <span>Noticias subidas por: {{ $user->display_name }}</span>
      </h1>
      <br>

      @if(count($news) > 0)

      @foreach($news as $entrie)
      <div class="row info-card">
        <div class="col-sm-4">
          <a href="{{ url('noticia', [$entrie->slug]) }}" title="{{ $entrie->title }}">
            <img src="{{ url_image($entrie->image, $entrie->youtube_video ) }}" alt="{{ $entrie->title }}">
          </a>
        </div>
        <div class="col-sm-8">
          <h3>
            <a href="{{ url('noticia', [$entrie->slug]) }}" title="{{ $entrie->title }}">{{ $entrie->title }}</a>
          </h3>
          {{ $entrie->display_published_at }}
          <br>
          {{ $entrie->excerpt.' ...' }}
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
      {{ $news->links() }}

      @else
      <p><strong>No se encontraron resultados para mostrar</strong></p>
      @endif

    </div> <!-- end div -->

    <!-- sidebar-->
    <div class="col-sm-4 col-md-4 sidebar">
      @include('includes.sidebar')
    </div>

  </div>
@endsection
