## Website is available at:
	[E-Lottery System](http://lottery-snehal-jadhav.s3-website-us-east-1.amazonaws.com/ )

## Static Web Hosting with Amazon S3

Configure Amazon Simple Storage Service (S3) to host the static resources for your web application. After this, you can add dynamic functionality to these pages using JavaScript to call remote RESTful APIs built with AWS Lambda and Amazon API Gateway.


## Architecture Overview

 All of the static web content including HTML, CSS, JavaScript, images and other files will be stored in Amazon S3. End users can then access your site using the public website URL exposed by Amazon S3. No need to run any web servers or use other services in order to make your site available.

### Region Selection

This workshop can be deployed in any AWS region that supports the following services:

- Amazon Cognito
- AWS Lambda
- Amazon API Gateway
- Amazon S3
- Amazon DynamoDB

You can refer to the [region table](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/) in the AWS documentation to see which regions have the supported services. Among the supported regions you can choose are N. Virginia, Ohio, Oregon, Ireland, London, Frankfurt, Tokyo, Seol, Mumbai, and Sydney.

Once you've chosen a region, you should deploy all of the resources for this workshop there. Make sure you select your region from the dropdown in the upper right corner of the AWS Console before getting started.

### 1. Create an S3 Bucket

Amazon S3 can be used to host static websites without having to configure or manage any web servers. Create a new S3 bucket that will be used to host all of the static assets (e.g. HTML, CSS, JavaScript, and image files) for your web application.

#### High-Level Instructions

Use the console or AWS CLI to create an Amazon S3 bucket. Bucket's name must be globally unique across all regions and customers. We recommend using a name like `wildrydes-firstname-lastname`. If you get an error that your bucket name already exists, try adding additional numbers or characters until you find an unused name.

<details>
<summary><strong>Step-by-step instructions (expand for details)</strong></summary><p>

1. In the AWS Management Console choose **Services** then select **S3** under Storage.

1. Choose **+Create Bucket**

1. Provide a globally unique name for your bucket such as `lottery-firstname-lastname`.

1. Select the Region you've chosen to use for this workshop from the dropdown.

</p></details>

### 2. Upload Content

Upload the website assets for the folder to your S3 bucket except lambda function. Use the AWS Management Console (requires Google Chrome browser) or AWS CLI.

### 3. Add a Bucket Policy to Allow Public Reads

You can define who can access the content in your S3 buckets using a bucket policy. Bucket policies are JSON documents that specify what principals are allowed to execute various actions against the objects in your bucket.

#### High-Level Instructions

You will need to add a bucket policy to your new Amazon S3 bucket to let anonymous users view your site. By default your bucket will only be accessible by authenticated users with access to your AWS account.

### 4. Enable Website Hosting

By default objects in an S3 bucket are available via URLs with the structure `http://<Regional-S3-prefix>.amazonaws.com/<bucket-name>/<object-key>`. In order to serve assets from the root URL (e.g. /index.html), you'll need to enable website hosting on the bucket.

You can also use a custom domain for your website. For example http://www.wildrydes.com is hosted on S3. Setting up a custom domain is not covered in this workshop, but you can find detailed instructions in our [documentation](http://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html).

#### 5. Create a DynamoDB table with the following properties.

	Table name: ticketsystem

	| Property |  Value          |
	|----------|-----------------|
	| **Primary Key Type** | Hash and Range |
	| **Primary Key Hash Attribute**  | TicketID |


### Creating the Lambda execution Role

In order for the Lambda function to execute with the appropriate permissions you'll need to create an IAM role for it to use.

To create a role through the console navigate to the IAM service, select Roles from the left nav, and click "Create New Role".

Enter **S3IndexFunction** for the role name.

Select **AWS Lambda** as the role type.

Attach the **AWSLambdaBasicExecutionRole** policy to the role.

After creating the role select it and add an inline policy.

Select **Custom Policy**.

Enter **s3-read-ddb-write** for the policy name.

Copy the following document into the Policy Document text area.

```JSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject"
            ],
            "Resource": [
                "*"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "dynamodb:AllAccess"
            ],
            "Resource": [
                "*"
            ]
        }
    ]
}
```

Apply the new policy to your role.

### Creating the Lambda Function

The final step of the deployment is to create the Lambda function that will handle our S3 bucket's creation events.

Create a new function with the following properties:
Name: getticketnumbersystem

Copy code from folder 'Lambda fuctions'

Create another function: postticketnumber

Copy code from folder 'Lambda fuctions'.
	

#### High-Level Instructions

Using the console, enable static website hosting. You can do this on the Properties tab after you've selected the bucket. Set `index.html` as the index document, and leave the error document blank. See the documentation on [configuring a bucket for static website hosting](https://docs.aws.amazon.com/AmazonS3/latest/dev/HowDoIWebsiteConfiguration.html) for more details.
