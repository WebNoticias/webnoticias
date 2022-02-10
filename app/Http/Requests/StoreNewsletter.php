<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreNewsletter extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
      return [
           'group'  => 'required|size:20',
           'token' => 'required|size:40',
           'email' => [
               'required',
               'email',
                Rule::unique('newsletter')->where(function ($query){
                    return $query->where('group_id', decodeid($this->input('group')))
                                 ->where('status', 1);
                }),
           ],
           'frequency' => 'required|numeric|between:1,3',
          ];
    }
}
