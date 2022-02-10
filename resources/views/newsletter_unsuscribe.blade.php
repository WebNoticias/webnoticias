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
      <h2 class="subtitle">
        <span>Boletín Informativo</span>
      </h2>
      <p>Modificar/Cancelar suscripción al boletín informativo de <strong>Web Noticias {{ $city->name }}</strong></p>
      <br>
      <form id="newsletter-unsuscribe" autocomplete="off">
          <input type="hidden" id="id" value="{{ $newsletter_id }}">
          <input type="hidden" id="group" value="{{ $city->uid }}">
          <input type="hidden" id="email" value="{{ $email }}">
          <input type="hidden" id="current_frequency" value="{{ $frequency }}">
          <input type="hidden" id="token" value="{{ $random = str_random(40) }}">
          <div class="alert alert-success" style="display:none;">
            <strong><i class="fa fa-check-square"></i></strong> <strong>Se ha modificado y/o cancelado tu suscripción</strong> al boletín informativo de Web Noticias {{ $city->name }}
          </div>
          <div class="form-group">
            <label for="frequency">Recibir boletín de noticias</label>
            <select id="frequency" class="form-control">
              @if($frequency == 1)
              <option value="1" selected>Últimas noticias (diario)</option>
              <option value="2">Noticias destacadas (semanal)</option>
              <option value="3">Boletín diario y semanal</option>
              @elseif($frequency == 2)
              <option value="2" selected>Noticias destacadas (semanal)</option>
              <option value="1">Últimas noticias (diario)</option>
              <option value="3">Boletín diario y semanal</option>
              @elseif($frequency == 3)
              <option value="3" selected>Boletín diario y semanal</option>
              <option value="1">Últimas noticias (diario)</option>
              <option value="2">Noticias destacadas (semanal)</option>
              @endif
            </select>
          </div>
          <div class="form-group">
            <label for="status">Cancelar suscripción</label>
            <select id="status" class="form-control">
              <option value="1" selected>Deseo continuar mi suscripción</option>
              <option value="0">Deseo cancelar mi suscripción al boletín</option>
            </select>
            <span class="text-danger" id="unsuscribe_alert"></span>
          </div>
          <br>
          <div class="form-group">
            <label for="email_confirmation">Ingrese correo electrónico suscrito para confirmar los cambios</label>
            <input class="form-control" id="email_confirmation" disabled>
            <span class="missing_alert text-danger" id="email_alert"></span>
            <span class="missing_alert text-danger" id="error_alert"></span>
          </div>
          <button type="submit" id="button-submit" class="btn btn-primary float-right ajax" disabled>
            <i id="ajax-icon" class="fa fa-check-square"></i> Modificar/Cancelar suscripción
          </button>
        </form>
    </div> <!-- end div -->
  </div>
@endsection

@push('scripts')
  <script src="{{ asset('js/newsletter_unsuscribe.js') }}"></script>
@endpush
