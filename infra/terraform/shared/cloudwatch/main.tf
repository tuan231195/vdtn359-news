resource "aws_lambda_permission" "cloudwatch" {
    statement_id  = "AllowExecutionFromCloudWatch"
    action        = "lambda:InvokeFunction"
    function_name = var.lambda_function_arn
    principal     = "events.amazonaws.com"
    source_arn    = aws_cloudwatch_event_rule.lambda_rule.arn
}

resource "aws_cloudwatch_event_rule" "lambda_rule" {
    description         = var.description
    event_pattern       = var.event_pattern
    name                = var.rule_name
    schedule_expression = var.schedule_expression
}

resource "aws_cloudwatch_event_target" "lambda_target" {
    rule  = aws_cloudwatch_event_rule.lambda_rule.name
    arn   = var.lambda_function_arn
}
