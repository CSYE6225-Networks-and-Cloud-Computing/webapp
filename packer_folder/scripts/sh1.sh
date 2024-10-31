#!/bin/bash
# echo "-------Updating the system-------"
# sudo apt-get update -y
# sudo apt-get upgrade -y
# sudo apt-get install nginx -y
# sudo apt-get clean

# # Create a group and user for the web application (if not already created)
# echo "-------Creating the csye6225 group and user-------"
# sudo groupadd csye6225 || echo "Group csye6225 already exists"
# sudo useradd -s /sbin/nologin -M -g csye6225 csye6225 || echo "User csye6225 already exists"


echo "-------Updating the system-------"
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y unzip


# Install CloudWatch agent
echo "-------Installing CloudWatch agent-------"
sudo apt-get install -y amazon-cloudwatch-agent

sudo apt-get install -y ca-certificates curl
curl https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb -O
sudo dpkg -i -E ./amazon-cloudwatch-agent.deb

sudo apt-get clean

echo "-------Creating the csye6225 group and user-------"
sudo groupadd csye6225 || echo "Group csye6225 already exists"
sudo useradd -s /sbin/nologin -M -g csye6225 csye6225 || echo "User csye6225 already exists"

# # Start CloudWatch agent
# echo "-------Starting CloudWatch agent-------"
# sudo systemctl enable amazon-cloudwatch-agent
# sudo systemctl start amazon-cloudwatch-agent

echo "-------Creating CloudWatch agent configuration-------"
sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc/
# sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json > /dev/null <<EOT
cat <<EOF | sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
{
  "agent": {
    "metrics_collection_interval": 10,
    "logfile": "/opt/aws/amazon-cloudwatch-agent/logs/amazon-cloudwatch-agent.log",
    "run_as_user": "root"
    "flush_interval": 1 
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/webapp.log",
            "log_group_name": "/csye6225/webapp",
            "log_stream_name": "webappLogStream",
            "timestamp_format": "%Y-%m-%d %H:%M:%S"
          }
        ]
      }
    }
  },
  "metrics": {
    "namespace": "webapp",
    "metrics_collected": {
      "statsd": {
        "service_address": ":8125",
        "metrics_collection_interval": 10,
        "metrics_aggregation_interval": 10
      }
    }
  }
}
EOF

echo "-------Setting permissions for CloudWatch agent configuration-------"
sudo chown root:root /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json
sudo chmod 644 /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json

# Start CloudWatch agent
echo "-------Starting CloudWatch agent-------"
sudo systemctl enable amazon-cloudwatch-agent
sudo systemctl start amazon-cloudwatch-agent