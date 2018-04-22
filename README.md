# Lambda function for Image Resizing

## Description

This is an modified version of [Serverless Image Resizing](https://github.com/awslabs/serverless-image-resizing) with some improvements on image resizing url and deployment techique

## Usage

### 1. Build the Lambda function

The Lambda function uses [sharp][sharp] for image resizing which requires native extensions. In order to run on Lambda, it must be packaged on Amazon Linux. You can accomplish this by installing docker on your machine then run the command:

```
docker-compose up
```

### 2. Deploy the CloudFormation stack

Install [serverless](https://serverless.com/framework/docs/providers/aws/guide/installation/) framework, then config your aws credential using this command:

```
serverless config credentials --provider aws --key AKIAIOSFODNN7EXAMPLE --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

Then run this command to deploy:

```
serverless deploy -v
```

Or use this to quickly upload and overwrite your function code, allowing you to develop faster:

```
serverless deploy function -f resize
```

### 3. Test the function

Upload an image to the S3 bucket and try to resize it via your web browser to different sizes, e.g. with an image uploaded in the bucket called image.png:

- http://[BucketWebsiteHost]/rs/prefix/300x300/image.png
- http://[BucketWebsiteHost]/rs/prefix/100x/image.png
- http://[BucketWebsiteHost]/rs/prefix/image.png


### 4. (Optional) Restrict resize dimensions

To restrict the dimensions the function will create, set the environment variable `ALLOWED_DIMENSIONS` to a string in the format *(HEIGHT)x(WIDTH),(HEIGHT)x(WIDTH),...*.

For example: *300x300,90x90,40x40*.
