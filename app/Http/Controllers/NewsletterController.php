<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\NewsletterSuscribe;
use App\Http\Requests\StoreNewsletter;
use App\Http\Requests\UpdateNewsletter;
use Illuminate\Support\Facades\Mail;
use App\Models\Newsletter;
use App\Models\Group;

class NewsletterController extends Controller
{

      public function __construct()
      {
          $this->middleware('ajax', ['only' => ['store', 'update']]);
          $this->middleware('throttle:20,360', ['only' => ['store', 'update']]);
      }




      public function store(StoreNewsletter $request)
      {

          $group =  Group::find(decodeid($request->group));
          $token = $request->token;
          $email = encrypt($request->email);
          $frequency =  $request->frequency;

          if($group->mail_address && $group->mail_user && $group->mail_password)
          {
                config(['mail.username' => $group->mail_user, 'mail.password' => $group->mail_password]);

                Mail::to($request->email)->send(new NewsletterSuscribe($group, $token, $email, $frequency));

                if (Mail::failures()) {
                  return 'mail.error';
                }

                return 'mail.sent';
          }

          return 'mail.error';

      }




      public function suscribe(Request $request, $subdomain)
      {

        $data = [ 'group' => decodeid($request->group),
                  'token' => $request->token,
                  'email' => decrypt($request->email),
                  'frequency' => $request->frequency,
                ];

        $validator = \Validator::make($data, [
          'group' => 'required|numeric',
          'token' => 'required|size:40',
          'email' => 'required|email',
          'frequency' => 'required|numeric|between:1,3',
        ]);

        if ($validator->fails()) {
            abort(403, 'Unauthorized.');

        }else{

          Newsletter::updateOrCreate(
                  ['group_id' => $data['group'], 'email' => $data['email']],
                  ['frequency' => $data['frequency'], 'status' => 1]
              );

          $cities = \Cache::remember('_cities', 60, function (){
              return Group::orderby('name', 'asc')->where('status', 1)->get();
          });

          $city = $cities->where('slug', $subdomain)->values()[0];

          return view('newsletter_suscribe', ['cities'=> $cities, 'city' => $city, 'frequency' => $data['frequency']]);

        }

      }




      public function unsuscribe(Request $request, $subdomain)
      {

        $data = [
                  'id' => decodeid($request->id),
                  'group' => decodeid($request->group),
                  'email' => base64_decode($request->email),
                  'frequency' => $request->frequency,
                  'token' => $request->token,
                ];

        $validator = \Validator::make($data, [
          'id' => 'required|numeric',
          'group' => 'required|numeric',
          'email' => 'required|email',
          'frequency' => 'required|numeric',
          'token' => 'required|size:40',
        ]);

        if ($validator->fails()) {
            abort(403, 'Unauthorized.');

        }else{

          $cities = \Cache::remember('_cities', 60, function (){
              return Group::orderby('name', 'asc')->where('status', 1)->get();
          });

          $city = $cities->where('slug', $subdomain)->values()[0];

          $newsletter = Newsletter::where('id', $data['id'])
                                   ->OnGroup($data['group'])
                                   ->where('email', $data['email'] )
                                   ->frequency([$data['frequency'], 3])
                                   ->where('status', 1)
                                   ->first();

          return view('newsletter_unsuscribe', ['cities'=> $cities, 'city' => $city, 'newsletter_id' => $newsletter->uid, 'email' => $newsletter->email, 'frequency' => $newsletter->frequency]);

        }

      }




      public function update(UpdateNewsletter $request)
      {
           $newsletter = Newsletter::where('id', decodeid($request->id))
                                    ->OnGroup(decodeid($request->group))
                                    ->where('email', $request->email )
                                    ->frequency([$request->current_frequency, 3])
                                    ->where('status', 1)
                                    ->first();

            $newsletter->frequency = $request->status == 0 ? $request->current_frequency : $request->frequency;
            $newsletter->status =  $request->status;
            $newsletter->save();

            return 'newsletter.updated';

      }

}
