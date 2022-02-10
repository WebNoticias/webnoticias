<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends Model
{
    use SoftDeletes;

    /*
    |
    | ** Global vars model **
    |
    */
    protected $hidden = ['id', 'pivot'];

    protected $dates = ['deleted_at'];




    /*
    |
    | ** Accesors model **
    |
    */
    public function getUidAttribute()
    {
        return encodeid($this->id);
    }

}
