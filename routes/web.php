<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::domain('{subdomain}.'.env('APP_DOMAIN'))->group(function () {
  Route::get('/', 'SiteController@index');
  Route::get('noticia/{slug}', 'SiteController@show_news');
  Route::get('galeria/{slug}', 'SiteController@show_gallery');
  Route::get('opinion/{slug}', 'SiteController@show_post');
  Route::get('categoria/{slug}', 'SiteController@list_news');
  Route::get('noticias/usuario/{slug}', 'SiteController@user_news');
  Route::get('galerias/usuario/{slug}', 'SiteController@user_galleries');
  Route::get('columnas/autor/{slug}', 'SiteController@author_posts');
  Route::get('galerias', 'SiteController@list_galleries');
  Route::get('opinion', 'SiteController@list_posts');
  Route::get('buscar', 'SiteController@search');
  Route::get('clear', 'SiteController@clear_cache');
  Route::get('newsletter/suscribe', 'NewsletterController@suscribe');
  Route::get('newsletter/unsuscribe', 'NewsletterController@unsuscribe');
  Route::post('register-visit', 'VisitController@register');
  Route::post('newsletter/unsuscribe', 'NewsletterController@update');
  Route::resource('newsletter', 'NewsletterController');


  Route::resource('testeo', 'Test');
});
