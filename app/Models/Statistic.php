<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;


class Statistic extends Model
{


    /*
    |
    | ** Global vars model **
    |
    */
    protected $table = 'statistic';

    protected $fillable = ['group_id', 'date'];

    public $timestamps = false;

}
