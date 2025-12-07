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
        $this->mail->Host       = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
        $this->mail->SMTPAuth   = true;
        $this->mail->Username   = getenv('SMTP_USERNAME') ?: 'son.trannam.bku@gmail.com';
        $this->mail->Password   = getenv('SMTP_PASSWORD') ?: 'uyaq gzid eeat gutp';
        $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mail->Port       = (int)(getenv('SMTP_PORT') ?: 587);

        $this->mail->CharSet = 'UTF-8';
        $fromEmail = getenv('SMTP_FROM_EMAIL') ?: 'son.trannam.bku@gmail.com';
        $fromName = getenv('SMTP_FROM_NAME') ?: 'Your Website';
        $this->mail->setFrom($fromEmail, $fromName);
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
