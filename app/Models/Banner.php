<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletes;

class Banner extends Model
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
    | ** Anonymous Global Scopes **
    |
    */

    protected static function boot()
    {
       parent::boot();

       static::addGlobalScope('active', function (Builder $builder) {
           $builder->select('id', 'title','image', 'size', 'url')
                   ->where('status', 1)
                   ->orderby('created_at', 'desc');
       });
   }

   /*
   |
   | ** Relationships model **
   |
   */
   public function groups()
   {
       return $this->belongsToMany('App\Models\Group');
   }

   /*
   |
   | ** Local Scope **
   |
   */

   public function scopeOnGroup($query, $group)
   {
       return $query->whereHas('groups', function($q) use ($group) {
                         $q->where('slug', $group);
                   });
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
