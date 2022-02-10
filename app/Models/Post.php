<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Scopes\ActiveScope;
use Carbon\Carbon;

class Post extends Model
{
    use SoftDeletes;

    /*
    |
    | ** Global vars model **
    |
    */

    protected $hidden = ['id', 'author_id', 'user_id'];

    protected $dates = ['published_at'];

    /*
    |
    | ** Boot method model **
    |
    */
    protected static function boot()
    {
        parent::boot();

        static::addGlobalScope(new ActiveScope);
    }

    /*
    |
    | ** Relationships model **
    |
    */
    public function user()
    {
        return $this->belongsTo('App\Models\User');
    }




    public function author()
    {
        return $this->belongsTo('App\Models\Author');
    }



    public function groups()
    {
        return $this->belongsToMany('App\Models\Group');
    }

    /*
    |
    | ** Local Scope **
    |
    */
    public function scopeListAttr($query)
    {
        return $query->select('id', 'author_id', 'title', 'slug', 'excerpt', 'image', 'youtube_video', 'published_at');
    }




    public function scopeSearch($query, $q)
    {
        $names = explode(" ", $q);

        return $query->where('title', 'like', "%". urldecode($q) ."%")
                     ->orwhere('excerpt', 'like', "%". urldecode($q) ."%")
                     ->orwhereHas('author', function ($query) use ($names) {
                         foreach($names as $name) {
                          $query->where('name', 'like', "%". urldecode($name) ."%")
                                ->orwhere('last_name', 'like', "%". urldecode($name) ."%");
                          }
                      });
    }




    public function scopeSlug($query, $slug)
    {
        return $query->where('slug', $slug);
    }



    public function scopeDistinc($query, $id)
    {
        return $query->where('id', '!=', $id);
    }



    public function scopeWhereAuthor($query, $author_id)
    {
        return $query->where('author_id', $author_id);
    }




    public function scopeOnGroup($query, $group)
    {
        return $query->whereHas('groups', function($q) use ($group) {
                          $q->where('slug', $group);
                    });
    }




    public function scopeWithAuthor($query)
    {
       return $query->with(['author' => function ($q) {

            $q->select(['id', 'name', 'last_name', 'slug', 'image']);

        }]);
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




    public function getDisplayPublishedAtAttribute()
    {
          $date = Carbon::createFromFormat('Y-m-d', $this->attributes['published_at']);

          return $date->format('d').' '. month_es($date->format('m')).' '.$date->format('Y');
    }

}
