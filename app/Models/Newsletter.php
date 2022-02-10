<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Newsletter extends Model
{
    /*
    |
    | ** Global vars model **
    |
    */
    protected $table = 'newsletter';

    protected $fillable = ['group_id', 'email', 'frequency', 'status'];




    /*
    |
    | ** Local Scope **
    |
    */
    public function scopeOnGroup($query, $group)
    {
        if(! empty($group))
        {
            return $query->where('group_id', $group);
        }

    }




    public function scopeFrequency($query, $frequency)
    {
        if(! empty($frequency))
        {
            if(is_array($frequency))
            {
              return $query->where(function ($q) use ($frequency){
                        $q->where('frequency', $frequency[0]);
                      })->orWhere(function($q) use ($frequency){
                        $q->where('frequency', $frequency[1]);
                      });
            }

            return $query->where('frequency', $frequency);
        }

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

}
