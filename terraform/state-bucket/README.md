A manually created bucket to store terraform state in

Policy is like

```json
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "Modify",
			"Principal": {
				"AWS": [
			        "arn:aws:iam::123456789:user/admin.user",
			        "arn:aws:iam::123456789:root"
			        ]
			},
			"Effect": "Allow",
			"Action": [
				"s3:GetObject",
				"s3:PutObject"
			],
			"Resource": [
				"arn:aws:s3:::domain-state/*"
			]
		},
		{
			"Sid": "ListBucket",
			"Principal": {
			    "AWS": [
			        "arn:aws:iam::123456789:user/admin.user",
			        "arn:aws:iam::123456789:root"
			        ]
			},
			"Effect": "Allow",
			"Action": [
			    "s3:ListBucket"
			    ],
			"Resource": [
			    "arn:aws:s3:::domain-state"
			    ]
		}
	]
}
```