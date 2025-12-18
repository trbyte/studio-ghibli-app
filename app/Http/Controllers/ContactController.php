<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name'    => ['required', 'string', 'max:255'],
            'email'   => ['required', 'email', 'max:255'],
            'message' => ['required', 'string', 'max:5000'],
        ]);

        $to = 'studioghiblifilmography@gmail.com';

        Mail::raw(
            "New contact message from Studio Ghibli Explorer:\n\n" .
            "Name: {$validated['name']}\n" .
            "Email: {$validated['email']}\n\n" .
            "Message:\n{$validated['message']}\n",
            function ($mail) use ($validated, $to) {
                $mail->to($to)
                    ->replyTo($validated['email'], $validated['name'])
                    ->subject('New contact form message');
            }
        );

        return back()->with('success', 'Thanks for reaching out! We\'ll get back to you soon.');
    }
}


