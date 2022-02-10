<?php

use Vinkla\Hashids\Facades\Hashids;



    function encodeid($id)
    {
        return Hashids::encode($id);
    }




    function decodeid($id)
    {

        if(is_array($id))
        {
            $values = [];

            foreach ($id as $val)
            {
              array_push($values, Hashids::decode($val)[0]);
            }

            return $values;
        }

        return Hashids::decode($id)[0];
    }




    function month_es($month)
    {
        switch ($month)
        {
            case 1:
                $month_year = 'Enero';
            break;
            case 2:
                $month_year = 'Febrero';
            break;
            case 3:
                $month_year = 'Marzo';
            break;
            case 4:
                $month_year = 'Abril';
            break;
            case 5:
                $month_year = 'Mayo';
            break;
            case 6:
                $month_year = 'Junio';
            break;
            case 7:
                $month_year = 'Julio';
            break;
            case 8:
                $month_year = 'Agosto';
            break;
            case 9:
                $month_year = 'Septiembre';
            break;
            case 10:
                $month_year = 'Octubre';
            break;
            case 11:
                $month_year = 'Noviembre';
            break;
            case 12:
                $month_year = 'Diciembre';
            break;
        }

        return $month_year;
    }




    function url_image($image, $youtube_video, $image_size = "300", $thumbnail = 'hqdefault')
    {
        if(empty($image) && (! empty($youtube_video)))
        {
          return "https://i.ytimg.com/vi/$youtube_video/$thumbnail.jpg";
        }

        return asset('storage/photos/'.$image_size).'/'.$image;
    }




    function post_image($image, $size = 150)
    {
        if(! empty($image))
        {
              return asset('storage/profiles/'.$size).'/'.$image;
        }

        return asset('img/profile.jpg');
    }




    function categories_slug($categories)
    {
        $slugs = [];

        foreach($categories as $category)
        {
          array_push($slugs, $category->slug);
        }

        return $slugs;
    }
