<?php

namespace App\Models;

use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'email', 'password',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];


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
