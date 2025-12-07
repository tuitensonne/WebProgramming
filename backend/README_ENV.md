# Environment Configuration

## Setup Instructions

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file and update the following values:

### Database Configuration
- `DB_HOST`: Database host (default: localhost)
- `DB_NAME`: Database name (default: webtravel)
- `DB_USER`: Database username (default: root)
- `DB_PASS`: Database password (leave empty if no password)
- `DB_PORT`: Database port (default: 3307)
- `DB_CHARSET`: Database charset (default: utf8mb4)

### JWT Configuration
- `key`: Secret key for JWT tokens (change in production!)
- `issuer`: JWT issuer
- `audience`: JWT audience
- `expire`: Token expiration time in seconds (default: 3600 = 1 hour)

### SMTP Configuration (for email sending)
- `SMTP_HOST`: SMTP server host (default: smtp.gmail.com)
- `SMTP_PORT`: SMTP port (default: 587)
- `SMTP_USERNAME`: Your email address
- `SMTP_PASSWORD`: Your email app password (for Gmail, use App Password)
- `SMTP_FROM_EMAIL`: Email address to send from
- `SMTP_FROM_NAME`: Name to display as sender

### AWS S3 Configuration (optional - for file uploads)
- `BUCKET_NAME`: S3 bucket name
- `REGION`: AWS region
- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key

### Application Configuration
- `APP_ENV`: Application environment (development/production)
- `APP_DEBUG`: Enable debug mode (true/false)

## Notes

- The `.env` file is ignored by git for security reasons
- Never commit your `.env` file to version control
- Use `.env.example` as a template for your configuration

