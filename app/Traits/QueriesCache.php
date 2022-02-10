<?php

namespace App\Traits;

use Illuminate\Support\Facades\Cache;
use App\Models\Group;
use App\Models\Advertising;

trait QueriesCache
{

    public function countries()
    {
          $countries = [
            "Argentina",
            "Bolivia",
            "Brasil",
            "Canadá",
            "Colombia",
            "Costa Rica",
            "Cuba",
            "Ecuador",
            "El Salvador",
            "Estados Unidos",
            "Guatemala",
            "Haití",
            "Honduras",
            "México",
            "Nicaragua",
            "Panamá",
            "Paraguay",
            "Perú",
            "República Dominicana",
            "Uruguay",
            "Venezuela",
          ];

          return $countries;

    }




    public function cities()
    {
          return Cache::remember('_cities', 1440, function (){
                return Group::orderby('name', 'asc')->where('status', 1)->get();
          });
    }




    public function advertising()
    {
          return Cache::remember('_categories', 10080, function (){
                return Advertising::where('status', 1)->get();
          });
    }

}
