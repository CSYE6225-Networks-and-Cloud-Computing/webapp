packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "source_ami" {
  type    = string
  default = "ami-02b71e4c18caedcb5" # Ubuntu 24.04 LTS AMI ID
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "subnet_id" {
  type    = string
  default = "subnet-002a37c327e4150b5" # Replace with your actual subnet ID
}

source "amazon-ebs" "my-ami" {
  region          = var.aws_region
  ami_name        = "csye6225_f24_app_${formatdate("YYYY_MM_DD", timestamp())}"
  ami_description = "AMI for A04"
  ami_regions     = ["us-east-1"]

  instance_type = "t2.small"
  source_ami    = var.source_ami
  ssh_username  = var.ssh_username
  subnet_id     = var.subnet_id

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 25 # Increase disk size for PostgreSQL
    volume_type           = "gp2"
  }
}

build {
  sources = [
    "source.amazon-ebs.my-ami",
  ]

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]

    inline = [
      # Update and upgrade system
      "sudo apt-get update",
      "sudo apt-get upgrade -y",

      # Install PostgreSQL
      "sudo apt-get install -y postgresql postgresql-contrib",

      # Enable and start PostgreSQL service
      "sudo systemctl enable postgresql",
      "sudo systemctl start postgresql",

      # Clean up the instance
      "sudo apt-get clean"
    ]
  }
}
