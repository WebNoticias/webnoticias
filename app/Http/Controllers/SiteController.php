<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Traits\QueriesCache;
use App\Models\Category;
use App\Models\Banner;
use App\Models\User;
use App\Models\News;
use App\Models\Gallery;
use App\Models\Author;
use App\Models\Post;


class SiteController extends Controller
{

      use QueriesCache;


      public function index($subdomain)
      {

          $cities = $this->cities();
          $city = $cities->where('slug', $subdomain)->values()[0];
          $banners = Banner::Ongroup($subdomain)->get();
          $news = News::listAttr()->Oncover()->Ongroup($subdomain)->take(8)->get();
          $galleries = Gallery::listAttr()->Oncover()->Ongroup($subdomain)->take(4)->get();
          $trends = News::listAttr()->Ongroup($subdomain)->OnCategory(['tendencias'])->take(6)->get();
          $recent = News::listAttr()->Ongroup($subdomain)->OnRecents()->take(5)->get();
          $opinions = Post::listAttr()->Ongroup($subdomain)->WithAuthor()->take(20)->get()->unique('author_id')->take(6);

          return view('index', ['countries'=> $this->countries(), 'cities'=> $cities, 'city' => $city, 'advertising' => $this->advertising(), 'banners' => $banners, 'news' => $news,
                                'galleries' => $galleries, 'trends' => $trends, 'recent' => $recent, 'opinions' => $opinions]);

      }




      public function list_news($subdomain, $category)
      {
          $cities = $this->cities();
          $city = $cities->where('slug', $subdomain)->values()[0];
          $category = Category::where('slug', $category)->first();
          $banners = Banner::Ongroup($subdomain)->get();
          $news = News::listAttr()->Ongroup($subdomain)->OnCategory([$category->slug])->paginate(16, ['*'], 'pagina');
          $breakings = News::listAttr()->Ongroup($subdomain)->take(8)->get();
          $opinions = Post::listAttr()->Ongroup($subdomain)->WithAuthor()->take(20)->get()->unique('author_id')->take(6);

          return view('list_news', ['countries'=> $this->countries(), 'cities'=> $cities, 'city' => $city, 'category' => $category, 'advertising' => $this->advertising(),
                                    'banners' => $banners, 'news' => $news, 'breakings' => $breakings, 'opinions' => $opinions]);

      }




      public function list_galleries($subdomain)
      {
          $cities = $this->cities();
          $city = $cities->where('slug', $subdomain)->values()[0];
          $banners = Banner::Ongroup($subdomain)->get();
          $galleries = Gallery::listAttr()->Ongroup($subdomain)->paginate(16, ['*'], 'pagina');
          $breakings = News::listAttr()->Ongroup($subdomain)->take(8)->get();
          $opinions = Post::listAttr()->Ongroup($subdomain)->WithAuthor()->take(20)->get()->unique('author_id')->take(6);

          return view('list_galleries', ['countries'=> $this->countries(), 'cities'=> $cities, 'city' => $city, 'advertising' => $this->advertising(), 'banners' => $banners,
                                         'galleries' => $galleries, 'breakings' => $breakings, 'opinions' => $opinions]);

      }




      public function list_posts($subdomain)
      {

          $cities = $this->cities();
          $city = $cities->where('slug', $subdomain)->values()[0];
          $banners = Banner::Ongroup($subdomain)->get();
          $posts = Post::listAttr()->Ongroup($subdomain)->WithAuthor()->paginate(16, ['*'], 'pagina');
          $breakings = News::listAttr()->Ongroup($subdomain)->take(12)->get();

          return view('list_posts', ['countries'=> $this->countries(), 'cities'=> $cities, 'city' => $city, 'advertising' => $this->advertising(), 'banners' => $banners,
                                      'posts' => $posts, 'breakings' => $breakings]);

      }




      public function user_news($subdomain, $slug)
      {

          $cities = $this->cities();
          $city = $cities->where('slug', $subdomain)->values()[0];
          $banners = Banner::Ongroup($subdomain)->get();
          $user = User::whereSlug($slug)->first();
          $news = News::listAttr()->Ongroup($subdomain)->where('user_id', $user->id)->paginate(16, ['*'], 'pagina');
          $breakings = News::listAttr()->Ongroup($subdomain)->take(8)->get();
          $opinions = Post::listAttr()->Ongroup($subdomain)->WithAuthor()->take(20)->get()->unique('author_id')->take(6);

          return view('user_news', ['countries'=> $this->countries(), 'cities'=> $cities, 'city' => $city, 'advertising' => $this->advertising(),
                                    'banners' => $banners, 'user' => $user, 'news' => $news, 'breakings' => $breakings, 'opinions' => $opinions]);

      }




      public function user_galleries($subdomain, $slug)
      {
          $cities = $this->cities();
          $city = $cities->where('slug', $subdomain)->values()[0];
          $banners = Banner::Ongroup($subdomain)->get();
          $user = User::whereSlug($slug)->first();
          $galleries = Gallery::listAttr()->Ongroup($subdomain)->where('user_id', $user->id)->paginate(16, ['*'], 'pagina');
          $breakings = News::listAttr()->Ongroup($subdomain)->take(8)->get();
          $opinions = Post::listAttr()->Ongroup($subdomain)->WithAuthor()->take(20)->get()->unique('author_id')->take(6);

          return view('user_galleries', ['countries'=> $this->countries(), 'cities'=> $cities, 'city' => $city, 'advertising' => $this->advertising(), 'banners' => $banners,
                                         'user' => $user, 'galleries' => $galleries, 'breakings' => $breakings, 'opinions' => $opinions]);

      }




      public function author_posts($subdomain, $slug)
      {
          $cities = $this->cities();
          $city = $cities->where('slug', $subdomain)->values()[0];
          $banners = Banner::Ongroup($subdomain)->get();
          $author = Author::whereSlug($slug)->first();
          $posts = Post::listAttr()->Ongroup($subdomain)->WithAuthor()->WhereAuthor($author->id)->paginate(16, ['*'], 'pagina');
          $breakings = News::listAttr()->Ongroup($subdomain)->take(12)->get();

          return view('author_posts', ['countries'=> $this->countries(), 'cities'=> $cities, 'city' => $city, 'advertising' => $this->advertising(), 'banners' => $banners,
                                      'author' => $author, 'posts' => $posts, 'breakings' => $breakings]);

      }




      public function show_news($subdomain, $slug)
      {

          $news = News::slug($slug)->WithCategories()->with('gallery')->first();

          if(empty($news))
          {
            abort(404);
          }

          $cities = $this->cities();
          $city = $cities->where('slug', $subdomain)->values()[0];
          $banners = Banner::Ongroup($subdomain)->get();
          $related = News::distinc($news->id)->listAttr()->Ongroup($subdomain)->OnCategory(categories_slug($news->categories))->take(9)->get();
          $breakings = News::distinc($news->id)->listAttr()->Ongroup($subdomain)->take(8)->get();
          $opinions = Post::listAttr()->Ongroup($subdomain)->WithAuthor()->take(20)->get()->unique('author_id')->take(6);

          return view('show_news', ['countries'=> $this->countries(), 'cities'=> $cities, 'city' => $city, 'advertising' => $this->advertising(), 'banners' => $banners, 'news' => $news, 'related' => $related,
                                     'breakings' => $breakings, 'opinions' => $opinions]);

      }




      public function show_gallery($subdomain, $slug)
      {

          $gallery = Gallery::slug($slug)->first();

          if(empty($gallery))
          {
            abort(404);
          }

          $cities = $this->cities();
          $city = $cities->where('slug', $subdomain)->values()[0];
          $banners = Banner::Ongroup($subdomain)->get();
          $related = Gallery::distinc($gallery->id)->listAttr()->with('photos')->Ongroup($subdomain)->take(9)->get();
          $breakings = News::listAttr()->Ongroup($subdomain)->take(8)->get();
          $opinions = Post::listAttr()->Ongroup($subdomain)->WithAuthor()->take(20)->get()->unique('author_id')->take(6);

          return view('show_gallery', ['countries'=> $this->countries(), 'cities'=> $cities, 'city' => $city, 'advertising' => $this->advertising(), 'banners' => $banners, 'gallery' => $gallery,
                                        'related' => $related, 'breakings' => $breakings, 'opinions' => $opinions]);

      }



      public function show_post($subdomain, $slug)
      {
          $post = Post::slug($slug)->with('author')->first();

          if(empty($post))
          {
            abort(404);
          }

          $cities = $this->cities();
          $city = $cities->where('slug', $subdomain)->values()[0];
          $banners = Banner::Ongroup($subdomain)->get();
          $related = Post::distinc($post->id)->listAttr()->Ongroup($subdomain)->WhereAuthor($post->author->id)->take(9)->get();
          $opinions = Post::listAttr()->Ongroup($subdomain)->WithAuthor()->take(10)->get();

          return view('show_post', ['countries'=> $this->countries(), 'cities'=> $cities, 'city' => $city, 'advertising' => $this->advertising(), 'banners' => $banners,
                                    'post' => $post, 'related' => $related, 'opinions' => $opinions]);
      }




      public function search(Request $request, $subdomain)
      {
          $cities = $this->cities();
          $city = $cities->where('slug', $subdomain)->values()[0];
          $banners = Banner::Ongroup($subdomain)->get();
          $news = News::listAttr()->search($request->q)->Ongroup($subdomain)->take(12)->get();
          $galleries = Gallery::listAttr()->search($request->q)->Ongroup($subdomain)->take(12)->get();
          $posts = Post::listAttr()->search($request->q)->Ongroup($subdomain)->WithAuthor()->take(12)->get();
          $breakings = News::listAttr()->Ongroup($subdomain)->take(8)->get();
          $opinions = Post::listAttr()->Ongroup($subdomain)->WithAuthor()->take(20)->get()->unique('author_id')->take(5);

          return view('search', ['countries'=> $this->countries(), 'cities'=> $cities, 'city' => $city, 'advertising' => $this->advertising(), 'banners' => $banners,
                                  'news' => $news, 'galleries' => $galleries, 'posts' => $posts, 'breakings' => $breakings, 'opinions' => $opinions]);
      }



      public function clear_cache($subdomain)
      {
          \Cache::forget('_cities');
          \Cache::forget('_advertising');

          echo "Archivos de cache eliminados exitosamente, regresar a <a href=".url('').">sitio web</a>";
      }

}
