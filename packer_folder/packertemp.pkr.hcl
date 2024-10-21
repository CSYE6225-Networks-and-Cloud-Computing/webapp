packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

# AWS Region
variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "aws_access_key" {
  type = string
  default = "AWS access key"
}

variable "aws_secret_access_key" {
  type = string
  default = "AWS secret key"
}

variable "demo_user" {
  description = "demo user ID"
  type        = string
  default     = "741448963082"
}

variable "dev_user" {
  description = "dev user ID"
  type        = string
  default     = "522814688724"
}

# Ubuntu 24.04 LTS AMI ID
variable "source_ami" {
  type    = string
  default = "ami-0866a3c8686eaeeba"
}

# SSH username for the EC2 instance
variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

// # Subnet ID
// variable "subnet_id" {
//   type    = string
//   default = "subnet-002a37c327e4150b5"
// }

# Instance Type
variable "instance_type" {
  type    = string
  default = "t2.micro"
}

# Volume Size (for PostgreSQL)
variable "volume_size" {
  type    = number
  default = 25
}

# PostgreSQL Password (can also be stored in an environment variable)
// variable "postgres_password" {
//   type    = string
//   default = "postgres"
// }

// variable "DB_NAME" {
//   type    = string
//   default = "csye6225"
// }

// variable "DB_USER" {
//   type    = string
//   default = "csye6225"
// }

// variable "DB_PASSWORD" {
//   type    = string
//   default = "csye6225"
// }


source "amazon-ebs" "my-ami" {
  region          = var.aws_region
  ami_name        = "ami_a05-{{timestamp}}"
  ami_description = "AMI for A04"
  ami_regions     = ["us-east-1"]
  ami_users = [var.demo_user]

  instance_type   = "t2.micro"
  source_ami      = var.source_ami
  ssh_interface   = "public_ip"  # Ensures SSH via public IP
  ssh_username    = var.ssh_username

  access_key = var.aws_access_key
  secret_key = var.aws_secret_access_key

  // ami_users = [var.dev_user, var.demo_user]

//   source_ami_filter {
//    most_recent = true
//    owners = [var.dev_user]
// }

  // subnet_id       = var.subnet_id

  # EBS volume settings
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

  
//   provisioner "shell" {
//     script = "scripts/sh1.sh"
//   }

//   provisioner "shell" {
//     script = "scripts/sh2.sh"
//   }

//   provisioner "shell" {
//     script = "scripts/sh3.sh"
//     //  script = "./scripts/sh3.sh"
//   }

//   provisioner "file" {
//   source      = "./webapp_t01.zip" 
//   destination = "/tmp/webapp_t01.zip"
// }

//   provisioner "shell" {
//     script = "scripts/sh4.sh"
//   }

provisioner "file" {
      source      = "./webapp.zip"
      destination = "/tmp/webapp.zip"
    }
  

  provisioner "shell" {
    script = "scripts/sh1.sh"
  }

  provisioner "shell" {
    script = "scripts/sh3.sh"
  }
  

  // provisioner "shell" {
  //   script = "scripts/sh2.sh"
  //   environment_vars = [
  //   "DB_NAME=${var.DB_NAME}",
  //   "DB_USER=${var.DB_USERNAME}",
  //   "DB_PASSWORD=${var.DB_PASSWORD}"
  // ]
  // }

  provisioner "shell" {
    script = "scripts/sh4.sh"
  }

  provisioner "shell" {
    script = "scripts/sh5.sh"
  }
  
}
