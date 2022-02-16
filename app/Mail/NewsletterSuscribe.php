<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
use stdClass;
class NewsletterSuscribe extends Mailable
{
    use Queueable, SerializesModels;

    public $city, $token, $email, $frequency;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($_city, $_token, $_email, $_frequency)
    {
        $this->city  = $_city;
        $this->token = $_token;
        $this->email = $_email;
        $this->frequency = $_frequency;

    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {

       

         return  $this->from('webnoticiasdev@gmail.com', 'Web Noticias '.$this->city->name)
                      ->subject('Suscripción - Boletín informativo')
                      ->markdown('emails.newsletter.suscribe');
    }
}
