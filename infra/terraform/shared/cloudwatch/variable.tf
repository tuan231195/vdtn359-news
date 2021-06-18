variable "tags" {
    default = {}
}

variable "lambda_function_arn" {}

variable "description" {
    default = ""
}

variable "event_pattern" {
    default = ""
}

variable "rule_name" {
    default = ""
}

variable "schedule_expression" {
    default = ""
}
