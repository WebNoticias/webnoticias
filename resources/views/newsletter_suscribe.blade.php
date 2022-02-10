@extends('layouts.site')
@section('title', "Web Noticias $city->name")
@section('description', "Web Noticias $city->name es una plataforma de comunicaciones independiente sobre noticias locales e hiperlocales en Colombia y Venezuela.")
@section('url', url(''))
@section('twitter_user', '@'.$city->twitter_user)
@section('image', '')
@section('content')
  <div class="row">
    <!-- content body-->
    <div class="col-sm-12 col-md-12 content-body">
      <div class="alert alert-success">
        <strong>Has confirmado tu suscripción</strong> a nuestro boletín de noticias, recibiras un correo
        @if($frequency == 1)
        <strong>diariamente</strong> con lo ultimo de nuestras noticias y contenido.
        @elseif($frequency == 2)
        <strong>semanalmente</strong> con las noticias mas destacadas de la semana.
        @elseif($frequency == 3)
        <strong>diariamente</strong> con lo ultimo de nuestras noticias y <strong>semanalmente</strong> con las noticias mas destacadas de la semana.
        @endif
        <br><br>
        En los correos que te enviaremos, obtendrás enlaces donde puedes modificar el periodo en que deseas recibir nuestro boletín de noticias, así como para cancelar tu suscripción.
      </div>
    </div> <!-- end div -->
  </div>
@endsection
