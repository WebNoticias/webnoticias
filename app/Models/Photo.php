<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Photo extends Model
{
    use SoftDeletes;

    /*
    |
    | ** Global vars model **
    |
    */
    protected $dates = ['deleted_at'];

}
