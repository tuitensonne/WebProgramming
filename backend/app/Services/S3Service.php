<?php
namespace App\Services;

class S3Service
{
    private static ?S3Service $instance = null;

    private string $bucket;
    private string $region;
    private string $accessKey;
    private string $secretKey;

    private function __construct()
    {
        $this->bucket = getenv('BUCKET_NAME');
        $this->region = getenv('REGION');
        $this->accessKey = getenv('AWS_ACCESS_KEY_ID');
        $this->secretKey = getenv('AWS_SECRET_ACCESS_KEY');
    }

    public static function getInstance(): S3Service
    {
        if (self::$instance === null) {
            self::$instance = new S3Service();
        }
        return self::$instance;
    }

    public function upload($file, $prefix = ''): array
    {
        try {
            $fileTmp = $file['tmp_name'];
            $fileName = basename($file['name']);
            $fileType = mime_content_type($fileTmp);
            $key = $prefix . time() . '-' . $fileName;

            $url = "https://{$this->bucket}.s3.{$this->region}.amazonaws.com/{$key}";
            $host = "{$this->bucket}.s3.{$this->region}.amazonaws.com";

            // === AWS Signature V4 ===
            $date = gmdate('Ymd');
            $timestamp = gmdate('Ymd\THis\Z');
            $service = 's3';
            $requestType = 'aws4_request';

            $canonicalHeaders = "host:{$host}\n" .
                                "x-amz-content-sha256:UNSIGNED-PAYLOAD\n" .
                                "x-amz-date:{$timestamp}\n";
            $signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
            $canonicalRequest = "PUT\n/{$key}\n\n{$canonicalHeaders}\n{$signedHeaders}\nUNSIGNED-PAYLOAD";

            $hashedRequest = hash('sha256', $canonicalRequest);
            $credentialScope = "{$date}/{$this->region}/{$service}/{$requestType}";
            $stringToSign = "AWS4-HMAC-SHA256\n{$timestamp}\n{$credentialScope}\n{$hashedRequest}";

            $signature = $this->getSignature($date, $service, $requestType, $stringToSign);
            $authorization = "AWS4-HMAC-SHA256 Credential={$this->accessKey}/{$credentialScope}, SignedHeaders={$signedHeaders}, Signature={$signature}";

            // === Upload file ===
            $fileData = file_get_contents($fileTmp);
            $ch = curl_init($url);
            curl_setopt_array($ch, [
                CURLOPT_CUSTOMREQUEST => 'PUT',
                CURLOPT_POSTFIELDS => $fileData,
                CURLOPT_HTTPHEADER => [
                    "Authorization: {$authorization}",
                    "x-amz-content-sha256: UNSIGNED-PAYLOAD",
                    "x-amz-date: {$timestamp}",
                    "Content-Type: {$fileType}"
                ],
                CURLOPT_RETURNTRANSFER => true
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200) {
                return ['success' => true, 'url' => $url];
            }

            return ['success' => false, 'error' => "S3 upload failed (code {$httpCode})"];
        } catch (\Exception $e) {
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    public function deleteByUrl(string $fileUrl): bool
    {
        $parsed = parse_url($fileUrl);
        $key = ltrim($parsed['path'], '/');
        $host = "{$this->bucket}.s3.{$this->region}.amazonaws.com";

        $date = gmdate('Ymd');
        $timestamp = gmdate('Ymd\THis\Z');
        $service = 's3';
        $requestType = 'aws4_request';

        $canonicalHeaders = "host:{$host}\n" .
                            "x-amz-content-sha256:UNSIGNED-PAYLOAD\n" .
                            "x-amz-date:{$timestamp}\n";
        $signedHeaders = 'host;x-amz-content-sha256;x-amz-date';
        $canonicalRequest = "DELETE\n/{$key}\n\n{$canonicalHeaders}\n{$signedHeaders}\nUNSIGNED-PAYLOAD";

        $hashedRequest = hash('sha256', $canonicalRequest);
        $credentialScope = "{$date}/{$this->region}/{$service}/{$requestType}";
        $stringToSign = "AWS4-HMAC-SHA256\n{$timestamp}\n{$credentialScope}\n{$hashedRequest}";

        $signature = $this->getSignature($date, $service, $requestType, $stringToSign);
        $authorization = "AWS4-HMAC-SHA256 Credential={$this->accessKey}/{$credentialScope}, SignedHeaders={$signedHeaders}, Signature={$signature}";

        $ch = curl_init("https://{$host}/{$key}");
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => 'DELETE',
            CURLOPT_HTTPHEADER => [
                "Authorization: {$authorization}",
                "x-amz-content-sha256: UNSIGNED-PAYLOAD",
                "x-amz-date: {$timestamp}",
            ],
            CURLOPT_RETURNTRANSFER => true
        ]);

        curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return $httpCode === 204;
    }

    private function getSignature($date, $service, $requestType, $stringToSign)
    {
        $kDate = hash_hmac('sha256', $date, "AWS4{$this->secretKey}", true);
        $kRegion = hash_hmac('sha256', $this->region, $kDate, true);
        $kService = hash_hmac('sha256', $service, $kRegion, true);
        $kSigning = hash_hmac('sha256', $requestType, $kService, true);
        return hash_hmac('sha256', $stringToSign, $kSigning);
    }
}
