// # AWS Region
// variable "aws_region" {
//   type    = string
//   default = "us-east-1"
// }

// # Ubuntu 24.04 LTS AMI ID
// variable "source_ami" {
//   type    = string
//   default = "ami-0866a3c8686eaeeba"
// }

// # SSH username for the EC2 instance
// variable "ssh_username" {
//   type    = string
//   default = "ubuntu"
// }

// # Subnet ID
// variable "subnet_id" {
//   type    = string
//   default = "subnet-002a37c327e4150b5"
// }

// # Instance Type
// variable "instance_type" {
//   type    = string
//   default = "t2.small"
// }

// # Volume Size (for PostgreSQL)
// variable "volume_size" {
//   type    = number
//   default = 25
// }

// # PostgreSQL Password (can also be stored in an environment variable)
// variable "postgres_password" {
//   type    = string
//   default = "postgres"
// }
// aws_region = "us-east-1"
// instance_type = "t2.small"
// subnet_id = "subnet-002a37c327e4150b5"
// source_ami = "ami-0866a3c8686eaeeba"
// ssh_username = "ubuntu"
// // volume_size = 25
// DB_USERNAME = postgres
// DB_PASSWORD = postgres
// DB_NAME = csye6225
// DB_HOST = localhost
// DB_PORT = 5432
