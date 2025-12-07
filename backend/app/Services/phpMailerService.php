<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class phpMailerService
{
    private static ?phpMailerService $instance = null;
    private PHPMailer $mail;

    private function __construct()
    {
        $this->mail = new PHPMailer(true);

        $this->mail->isSMTP();
        $this->mail->Host       = 'smtp.gmail.com';
        $this->mail->SMTPAuth   = true;
        $this->mail->Username   = 'son.trannam.bku@gmail.com';
        $this->mail->Password   = 'uyaq gzid eeat gutp';
        $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mail->Port       = 587;

        $this->mail->CharSet = 'UTF-8';
        $this->mail->setFrom('son.trannam.bku@gmail.com', 'Your Website');
    }

    public static function getInstance(): phpMailerService
    {
        if (self::$instance === null) {
            self::$instance = new phpMailerService();
        }
        return self::$instance;
    }

    public function sendMail(string $to, string $subject, string $body): bool
    {
        try {
            $this->mail->clearAddresses();
            $this->mail->addAddress($to);

            $this->mail->isHTML(true);
            $this->mail->Subject = $subject;
            $this->mail->Body    = $body;

            return $this->mail->send();
        } catch (Exception $e) {
            error_log("Mailer error: " . $this->mail->ErrorInfo);
            return false;
        }
    }
}
