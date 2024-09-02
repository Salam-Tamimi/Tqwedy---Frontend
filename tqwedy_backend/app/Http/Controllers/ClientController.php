<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Client;
use Illuminate\Support\Facades\Validator;

class ClientController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email',
            'phone_number' => 'required|string|regex:/^(\+966)5[0-9]{8}$/|unique:clients,phone_number',
            'gender' => 'required|in:male,female',
            'national_id' => 'required|string|size:10|unique:clients,national_id|regex:/^\d{10}$/',
            'package' => 'required|string',
            'store_type' => 'required|string',
            'id_image' => 'required|file|mimes:pdf,png',
            'bank_account_info' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            $data = $request->all();
            if ($request->hasFile('id_image')) {
                $data['id_image'] = $request->file('id_image')->store('id_images', 'public');
            }

            $client = Client::create($data);

            return response()->json($client, 201);
        } catch (\Exception $e) {
            \Log::error('Client creation failed: '.$e->getMessage());
            return response()->json(['error' => 'Internal server error'], 500);
        }
    }

    public function checkField(Request $request)
    {
        $request->validate([
            'field' => 'required|string|in:email,phone_number,national_id',
            'value' => 'required|string',
        ]);

        $field = $request->input('field');
        $value = $request->input('value');

        // Check if the field value exists in the clients table
        $exists = Client::where($field, $value)->exists();

        return response()->json([
            'taken' => $exists,
        ]);
    }

}
