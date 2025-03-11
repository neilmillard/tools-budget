resource "aws_route53_zone" "main" {
  name = var.domain_name
  tags = var.common_tags
}

resource "aws_route53_record" "root-a" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.root_s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.root_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "root-aaaa" {
  zone_id = aws_route53_zone.main.zone_id
  name    = var.domain_name
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.root_s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.root_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www-a" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.www_s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.www_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "www-aaaa" {
  zone_id = aws_route53_zone.main.zone_id
  name    = "www.${var.domain_name}"
  type    = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.www_s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.www_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "mx" {
  name    = var.domain_name
  type    = "MX"
  zone_id = aws_route53_zone.main.zone_id
  records = [
    "1 smtp.google.com"
  ]
  ttl     = 900
}

resource "aws_route53_record" "google-site-verify" {
  name    = "deltafamiglia.com"
  type    = "TXT"
  zone_id = aws_route53_zone.main.zone_id
  ttl = 900
  records = [
    "google-site-verification=eA-d1b4SXjPxmz6y-unZZptTfDhJ8rn-qh7QzyX3s-o",
    "v=spf1  include:_spf.google.com -all"]
}

resource "aws_route53_record" "google-dkim" {
  name    = "google._domainkey"
  type    = "TXT"
  zone_id = aws_route53_zone.main.zone_id
  ttl = 900
  records = [
    "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAg8cZHTDO4E8UgDn0FndzLIb4NsyWbkyGcb3bL55J0NjZF4hJaA+kEGSLd2Y2tUYBX7wa0Z0PVDOBm56XSSo/pcei9OnAn1c7S1vVo+sKeFL6EOnVWUEI8aiyyZjCClumiT4x5r7bxx3cC7Lm1sg8402YJG12Cb7/lOBEtNFRhV+ZymQmocBhb6R/WY2ijti55"
  ]
}
