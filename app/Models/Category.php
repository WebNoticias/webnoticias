<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use SoftDeletes;

    /*
    |
    | ** Global vars model **
    |
    */
    protected $table = 'categories';

    protected $hidden = ['id', 'pivot'];

    protected $dates = ['deleted_at'];

}
