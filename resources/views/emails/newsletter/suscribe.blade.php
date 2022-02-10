@component('mail::message', ['city' => $city])
# Boletín de noticias

Has recibido este correo electrónico por que te has suscrito al boletín informativo de **Web Noticias {{ $city->name }}**, utiliza el siguiente enlace para confirmar tu suscripción

@component('mail::button', ['url' => url('newsletter/suscribe').'?group='.$city->uid.'&token='.$token.'&email='.$email.'&frequency='.$frequency])
Confirmar Subscripción
@endcomponent

@component('mail::subcopy')
**No responder a este correo electrónico** Si no has efectuado la acción anterior o deseas no darte de alta al servicio de boletín informativo de Web Noticias {{ $city->name }}, por favor **ignora este correo**.
@endcomponent

@endcomponent
