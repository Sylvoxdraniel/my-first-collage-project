<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;

class HomeController extends Controller
{
    function index()
    {

        // $users = [
        //     [
        //         "id" => "Apple",
        //         "name" => "Banana",
        //         "email" => "ghgh"
        //     ],
        //     [
        //         "id" => "Apple",
        //         "name" => "Banana",
        //         "email" => "ghgh"
        //     ]
        // ];



        $users = User::all();

        return view('home', compact('users'));



        // return $users;

        // $fruits = [
        //     "1" => "Apple",
        //     "2" => "Banana"
        // ];
    }
}
