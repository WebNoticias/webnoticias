<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Visit extends Model
{


    /*
    |
    | ** Global vars model **
    |
    */
    protected $fillable = ['group_id', 'news_id', 'post_id', 'gallery_id', 'banner_id', 'IP'];

}
