<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Scopes\ActiveScope;
use Carbon\Carbon;

class News extends Model
{
    use SoftDeletes;

    /*
    |
    | ** Global vars model **
    |
    */
    protected $table = 'news';


    protected $hidden = ['id', 'gallery_id'];

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




    public function gallery()
    {
        return $this->belongsTo('App\Models\Gallery');
    }




    public function categories()
    {
        return $this->belongsToMany('App\Models\Category');
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
        return $query->select('id', 'gallery_id', 'title', 'slug', 'excerpt', 'image', 'youtube_video', 'published_at');
    }




    public function scopeSearch($query, $q)
    {
        return $query->where('title', 'like', "%". urldecode($q) ."%")
                     ->orwhere('excerpt', 'like', "%". urldecode($q) ."%");
    }




    public function scopeSlug($query, $slug)
    {
        return $query->where('slug', $slug);
    }



    public function scopeDistinc($query, $id)
    {
        return $query->where('id', '!=', $id);
    }




    public function scopeOnCover($query)
    {
        return $query->where('cover', 1);
    }




    public function scopeOnGroup($query, $group)
    {
        return $query->whereHas('groups', function($q) use ($group) {
                          $q->where('slug', $group);
                    });
    }




    public function scopeOnCategory($query, $category)
    {
        return $query->whereHas('categories', function($q) use ($category) {
                          $q->whereIn('slug', $category);
                    });
    }



    public function scopeOnRecents($query)
    {
        $max_date = \Carbon\Carbon::now()->subDays(2);

        return $query->where('published_at', '>=', $max_date);
    }




    public function scopeWithCategories($query)
    {
       return $query->with(['categories' => function ($q) {

            $q->select(['id', 'name', 'slug']);

        }]);
    }



    public function scopeWithGallery($query)
    {
       return $query->with(['gallery' => function ($q) {

            $q->select(['id', 'title']);

        }]);
    }



    public function scopeWithUser($query)
    {
       return $query->with(['user' => function ($q) {

            $q->select(['id', 'name', 'last_name']);

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
