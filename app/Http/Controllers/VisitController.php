<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\Banner;
use App\Models\News;
use App\Models\Gallery;
use App\Models\Post;
use App\Models\Statistic;
use App\Models\Visit;
use Carbon\Carbon;

class VisitController extends Controller
{

      public function __construct()
      {
          $this->middleware('ajax');
      }




      public function register(Request $request, $subdomain)
      {
             $date = Carbon::now();
             $visits = Visit::where('IP', \Request::ip())->whereMonth('created_at', $date->format('m'))->whereYear('created_at', $date->format('Y'))->get();

             // register statistics for general website
             if(! empty($request->group))
             {
                  $group_visit = $visits->where('group_id', decodeid($request->group));
                  
                  $statistics_model = Statistic::firstOrCreate(['group_id' => decodeid($request->group), 'date' => $date->format('Y-m-d')]);
                  $statistics_model->increment('views', 1);

                  if(count($group_visit) == 0)
                  {

                    $statistics_model->increment('unique_visits', 1);

                    Visit::create(['group_id' => decodeid($request->group), 'IP' => \Request::ip()]);
                  }

              }

             // register statistics for banner header
             if(! empty($request->banner_header))
             {
                  $banner_header_visit = $visits->where('banner_id', decodeid($request->banner_header));

                  $banner_header_model = Banner::withoutGlobalScopes()->find(decodeid($request->banner_header));
                  $banner_header_model->timestamps = false;
                  $banner_header_model->increment('views', 1);

                  if(count($banner_header_visit) == 0)
                  {

                    $banner_header_model->increment('unique_visits', 1);

                    Visit::create(['banner_id' => decodeid($request->banner_header), 'IP' => \Request::ip()]);
                  }

              }

              // register statistics for banner main
              if($request->banner_main != '')
              {

                   $banner_main_visit = $visits->where('banner_id', decodeid($request->banner_main));

                   $banner_main_model = Banner::withoutGlobalScopes()->find(decodeid($request->banner_main));
                   $banner_main_model->timestamps = false;
                   $banner_main_model->increment('views', 1);

                   if(count($banner_main_visit) == 0)
                   {

                     $banner_main_model->increment('unique_visits', 1);

                     Visit::create(['banner_id' => decodeid($request->banner_main), 'IP' => \Request::ip()]);
                   }

               }

               // register statistics for banner sidebar
               if(! empty($request->banner_sidebar))
               {
                    $banner_sidebar_visit = $visits->where('banner_id', decodeid($request->banner_sidebar));

                    $banner_sidebar_model = Banner::withoutGlobalScopes()->find(decodeid($request->banner_sidebar));
                    $banner_sidebar_model->timestamps = false;
                    $banner_sidebar_model->increment('views', 1);

                    if(count($banner_sidebar_visit) == 0){

                      $banner_sidebar_model->increment('unique_visits', 1);

                      Visit::create(['banner_id' => decodeid($request->banner_sidebar), 'IP' => \Request::ip()]);
                    }

                }

                // register statistics for news
                if(! empty($request->news))
                {
                     $news_visit = $visits->where('news_id', decodeid($request->news));

                     $news_model = News::withoutGlobalScopes()->find(decodeid($request->news));
                     $news_model->timestamps = false;
                     $news_model->increment('views', 1);

                     if(count($news_visit) == 0)
                     {

                       $news_model->increment('unique_visits', 1);

                       Visit::create(['news_id' => decodeid($request->news), 'IP' => \Request::ip()]);
                     }

                 }

                 // register statistics for post
                 if(! empty($request->post))
                 {
                      $post_visit = $visits->where('post_id', decodeid($request->post));

                      $post_model = Post::withoutGlobalScopes()->find(decodeid($request->post));
                      $post_model->timestamps = false;
                      $post_model->increment('views', 1);

                      if(count($post_visit) == 0)
                      {

                        $post_model->increment('unique_visits', 1);

                        Visit::create(['post_id' => decodeid($request->post), 'IP' => \Request::ip()]);
                      }

                  }


                  // register statistics for gallery
                  if(! empty($request->gallery))
                  {
                       $gallery_visit = $visits->where('gallery_id', decodeid($request->gallery));

                       $gallery_model = Gallery::withoutGlobalScopes()->find(decodeid($request->gallery));
                       $gallery_model->timestamps = false;
                       $gallery_model->increment('views', 1);

                       if(count($gallery_visit) == 0){

                         $gallery_model->increment('unique_visits', 1);

                         Visit::create(['gallery_id' => decodeid($request->gallery), 'IP' => \Request::ip()]);
                       }

                   }

      }

}
