resource "aws_cloudwatch_metric_alarm" "queue_alarm" {
    alarm_name = "${var.function_name}-alarm"
    alarm_description = "Lamda Errors Metrics"
    comparison_operator = "GreaterThanThreshold"
    threshold = 0
    evaluation_periods = var.num_errors
    alarm_actions = var.alarm_topic_arn != "" ? [var.alarm_topic_arn] : []
    metric_name = "Errors"
    namespace = "AWS/Lambda"
    dimensions = {
        FunctionName = var.function_name
    }
    insufficient_data_actions = []
    statistic = "Sum"
    period = 300
    tags = var.tags
}
