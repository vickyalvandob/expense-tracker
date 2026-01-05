<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FormExpenseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'   => ['required', 'string', 'max:255'],
            'amount' => ['required', 'numeric', 'min:0'],
            'date'   => ['required', 'date'],
        ];
    }
}
