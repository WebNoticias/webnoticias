<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Author extends Model
{
    use SoftDeletes;

    /*
    |
    | ** Global vars model **
    |
    */
    protected $hidden = ['id'];

    protected $dates = ['deleted_at'];


    /*
    |
    | ** Relationships model **
    |
    */
    public function posts()
    {
        return $this->hasMany('App\Models\Post');
    }


    /*
    |
    | ** Accesors model **
    |
    */
    public function getUidAttribute()
    {
        return encodeid($this->id);
    }




    public function getDisplayNameAttribute()
    {
        $name      = explode(' ', $this->name);
        $last_name = explode(' ', $this->last_name);

        return title_case($name[0]).' '.title_case($last_name[0]);
    }

}
