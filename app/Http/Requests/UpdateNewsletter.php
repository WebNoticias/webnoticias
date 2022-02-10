<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateNewsletter extends FormRequest
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
           'id'  => 'required|size:20',
           'group'  => 'required|size:20',
           'token' => 'required|size:40',
           'current_frequency' => 'required|numeric',
           'email' => [
               'required',
               'email',
               'confirmed',
                Rule::exists('newsletter')->where(function ($query){
                    return $query->where('id', decodeid($this->input('id')))
                                  ->where('group_id', decodeid($this->input('group')))
                                 ->where('frequency', $this->input('current_frequency'))
                                 ->where('status', 1);
                }),
           ],
           'frequency' => 'required|numeric|between:1,3',
           'status' => 'required|boolean',
           ];
    }
}
