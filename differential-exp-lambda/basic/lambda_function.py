import boto3
import os
import shutil
import subprocess
import zipfile
from botocore.exceptions import ClientError
from pathlib import Path
import base64
import json
import uuid
from datetime import datetime


# Copy all files from src_dir to dest_dir.
def copy_files(src_dir, dest_dir):
    # Check the source directory exists
    if not os.path.exists(src_dir):
        print(f"> Source directory '{src_dir}' does not exist.")
        return

    # Check the destination directory exists
    if not os.path.exists(dest_dir):
        print(f"> Destination directory '{dest_dir}' does not exist. Creating it...")
        os.makedirs(dest_dir)

    # Iterate over files in the source directory
    for filename in os.listdir(src_dir):
        src_file = os.path.join(src_dir, filename)
        dest_file = os.path.join(dest_dir, filename)

        # Copy the file to the destination directory
        shutil.copy(src_file, dest_file)

        print(f"Copied '{src_file}' to '{dest_file}'.")


# Upload all files in the given directory to s3 except script.R file
def upload_files_to_s3(bucket_name, directory_name, subdirectory):
    # Initialize the S3 client
    s3 = boto3.client("s3")

    # Get a list of all files in the directory
    files = os.listdir(directory_name)

    # Iterate over each file and upload it to S3
    for file_name in files:
        file_path = os.path.join(directory_name, file_name)
        if (
            os.path.isfile(file_path) and file_name != "script.R"
        ):  # Don't upload script.R file
            # Construct the S3 key with the subdirectory
            s3_key = os.path.join(subdirectory, file_name)
            # Upload the file to S3
            s3.upload_file(file_path, bucket_name, s3_key)
            print(
                f"> Uploaded '{file_name}' to S3 bucket '{bucket_name}' under subdirectory '{subdirectory}'."
            )


# Print all files in the given directory
def dir_files(directory_name):
    files = os.listdir(directory_name)
    print(files)


# Download a specific file from s3
def download_file_from_s3(bucket_name, file_name, download_dest):
    # Initialize Boto3 S3 client
    s3_client = boto3.client("s3")

    try:
        # Download the file from S3
        s3_client.download_file(bucket_name, file_name, download_dest)
        print(
            f"> File '{file_name}' downloaded successfully from S3 bucket '{bucket_name}'"
        )
    except Exception as e:
        print(
            f"> Error downloading file '{file_name}' from S3 bucket '{bucket_name}': {e}"
        )


# Create a zip file for the given directory, containing the specified files
def zip_files(directory, files, zip_name):
    with zipfile.ZipFile(zip_name, "w") as zipf:
        for file in files:
            file_path = os.path.join(directory, file)
            if os.path.exists(file_path):
                zipf.write(file_path, file)


# Send SES email when docker run fails
def send_email(sender_email, recipient_email, body):
    region = os.environ.get("REGION")
    ses_client = boto3.client("ses", region_name=region)

    try:
        response = ses_client.send_email(
            Destination={
                "ToAddresses": [recipient_email],
            },
            Message={
                "Body": {
                    "Text": {
                        "Charset": "UTF-8",
                        "Data": body,
                    },
                },
                "Subject": {
                    "Charset": "UTF-8",
                    "Data": f"[{os.getenv("DEPLOY_ENV")}] Differential Expression Analysis Failed",
                },
            },
            Source=sender_email,
        )
    except ClientError as e:
        print("> Failed to send email:", e.response["Error"]["Message"])
    else:
        print("> Email sent! Message ID:", response["MessageId"])


# Rename file from a given directory from old_name to new_name
def rename_file(directory, old_name, new_name):
    # Construct the paths for the old and new names
    old_path = os.path.join(directory, old_name)
    new_path = os.path.join(directory, new_name)

    # Rename the file
    os.rename(old_path, new_path)


# Write the submission record into dynamodb
def record_submission(event, submission_id):
    dynamodb = boto3.resource("dynamodb")
    table_name = os.getenv("SUBMISSIONS_TABLE")
    table = dynamodb.Table(table_name)

    submission_path = os.path.basename(event.get("input_file"))
    log_normalized = event.get("log_normalized")
    stat_test = event.get("stat_test")
    p_val = event.get("pValueThreshold")
    fold_threshold = event.get("foldChangeThreshold")
    p_raw = event.get("p_raw")
    heat_map_number = str(event.get("heat_map_number"))

    submission = {
        "id": submission_id,
        "important": False,
        "link": f"/differential-expression/results/{submission_path}?logNorm={log_normalized}&heatmap={heat_map_number}&foldChange={fold_threshold}&pValue={p_val}&pType={p_raw}&parametricTest={stat_test}",
        "status": "Running",
        "submission_date": str(datetime.now()),
        "type": "Differential Expression Analysis",
        "username": event.get("username"),
    }

    print(f"Submission", submission)

    # Write the record to the DynamoDB table
    try:
        table.put_item(Item=submission)
        print("Record inserted successfully!")
    except Exception as e:
        print(f"Error inserting record: {e}")


def main(event):
    print("> Event", event)

    try:
        submission_id = str(uuid.uuid4())
        print(f"> Submission ID", submission_id)
        input_file = event.get("input_file")
        log_normalized = event.get("log_normalized")
        stat_test = event.get("stat_test")
        p_val = "1.0"
        fold_threshold = "1.0"
        p_raw = event.get("p_raw")
        heat_map_number = str(event.get("heat_map_number"))
        file_name = os.path.basename(input_file)

        record_submission(event, submission_id)

        print(f"> Input File: {input_file}")
        print(f"> Log Norm: {log_normalized}")
        print(f"> Stat Test: {stat_test}")
        print(f"> P Value Raw: {p_raw}")
        print(f"> Heat Map #: {heat_map_number}")

        # Run Initial R Script
        print("> Attempting to run metab4script.R script")
        result = subprocess.run("Rscript ../metab4script.R", shell=True)

        if result.returncode != 0:
            print(
                "> Failed to run metab4script.R script. Script ran previously already."
            )
        else:
            print("> Successfully ran metab4script.R script")

        # Download input file from S3
        print("> Attempting to download input file from S3")
        s3_bucket_name = os.getenv("S3_BUCKET_NAME")

        if not s3_bucket_name:
            print("> S3_BUCKET_NAME environment variable not set")

            return {
                "statusCode": 500,
                "body": json.dumps(
                    {"message": "S3_BUCKET_NAME environment variable not set"}
                ),
                "headers": {"Content-Type": "application/json"},
                "isBase64Encoded": False,
            }

        download_destination = os.path.join("/tmp", file_name, "inputdata.txt")
        os.makedirs(os.path.dirname(download_destination), exist_ok=True)
        print("> Download Destination:", download_destination)
        download_file_from_s3(s3_bucket_name, input_file, download_destination)
        print("> Successfully downloaded input file from S3")

        # Copy R Script to new dir (Create dir if it doesn't exist)
        print("> Attempting to copy R Script to input directory")
        source_path = "/function/home/script.R"
        target_directory = f"/tmp/{file_name}/"
        target_path = os.path.join(target_directory, "script.R")
        os.makedirs(target_directory, exist_ok=True)
        shutil.copyfile(source_path, target_path)
        print("> Successfully copied R Script to input directory")

        # Navigate to new dir & run R Script
        print("> Navigating to the new directory and running the analysis")
        os.chdir(target_directory)

        # Clean up inputdata.txt file
        perl_command = 'perl -pi -e "s/\\r//g" inputdata.txt'
        result = subprocess.run(perl_command, shell=True)
        if result.returncode != 0:
            print(f"> Perl command failed: {result.stderr.decode('utf-8')}")
            return {
                "statusCode": 500,
                "body": json.dumps({"message": "Perl command failed"}),
                "headers": {"Content-Type": "application/json"},
                "isBase64Encoded": False,
            }

        # Run the R script with the required parameters
        r_command = [
            "Rscript",
            "script.R",
            log_normalized,
            fold_threshold,
            p_val,
            p_raw,
            stat_test,
            heat_map_number,
        ]

        print("> Running R script with command:", r_command)

        result = subprocess.run(
            r_command, stdout=subprocess.PIPE, stderr=subprocess.PIPE
        )

        # Log stdout and stderr
        print("R script output (stdout):\n", result.stdout)
        print("R script errors (stderr):\n", result.stderr)

        # If R Script fails, send SES notification to support email
        if result.returncode == 0:
            print("> Successfully ran R Script")
        else:
            print(f"> Error running R Script for: {input_file}")
            print(f"> Failed command: {r_command}")
            body = f"Input File: {input_file}\nFailed Command: {r_command}"
            support_email = os.environ.get("SUPPORT_EMAIL")
            send_email(support_email, support_email, body)
            return {
                "statusCode": 500,
                "body": json.dumps({"message": "R script analysis execution failed"}),
                "headers": {"Content-Type": "application/json"},
                "isBase64Encoded": False,
            }

        # Rename stat test file based on stat_test value
        if stat_test == "T":
            if os.path.exists("wilcox_rank.csv"):
                rename_file("./", "wilcox_rank.csv", "statistical_parametric_test.csv")
            else:
                statistical_test_path = Path("statistical_parametric_test.csv")
                with statistical_test_path.open("w") as file:
                    file.write("A total of 0 significant features were found.")
        elif stat_test == "F":
            rename_file("./", "t_test.csv", "statistical_parametric_test.csv")
        else:
            print(f"> Invalid stat test param: {stat_test}")
            return {
                "statusCode": 400,
                "body": json.dumps({"message": "Invalid stat test parameter"}),
                "headers": {"Content-Type": "application/json"},
                "isBase64Encoded": False,
            }

        # List of files to include in the zip
        files_to_zip = [
            "volcano_0_dpi150.png",
            "heatmap_0_dpi150.png",
            "heatmap_1_dpi150.png",
            "all_data.tsv",
            "data_normalized.csv",
            "data_original.csv",
            "norm_0_dpi150.png",
            "volcano.csv",
            "tt_0_dpi150.png",
            "statistical_parametric_test.csv",
            "fc_0_dpi150.png",
            "fold_change.csv",
            "pca_score2d_0_dpi150.png",
            "pca_score.csv",
            "venn-dimensions.png",
            "venn_out_data.txt",
            "pca_loadings.csv",
            "randomforests_sigfeatures.csv",
            "rf_cls_0_dpi150.png",
            "rf_imp_0_dpi150.png",
            "rf_outlier_0_dpi150.png",
            "snorm_0_dpi150.png",
            "data_processed.csv",
        ]

        # Create Zip file with the output files
        zip_files("./", files_to_zip, "data_set.zip")

        # Upload results generated by R Script
        print("> Attempting to upload results to S3")
        directory_name = target_directory
        subdirectory = f"{input_file}"
        upload_files_to_s3(s3_bucket_name, directory_name, subdirectory)
        print("> Successfully uploaded results to S3")

        return {
            "statusCode": 200,
            "body": json.dumps(
                {
                    "message": "Analysis Complete and Files Uploaded",
                    "submission_id": submission_id,
                }
            ),
            "headers": {"Content-Type": "application/json"},
            "isBase64Encoded": False,
        }

    except Exception as e:
        print(f"> An error occurred: {e}")

        send_email(
            sender_email="mzheng@jcvi.org",
            recipient_email="mzheng@jcvi.org",
            body=f"An error occurred during the process: {e}",
        )

        return {
            "statusCode": 500,
            "body": json.dumps(
                {
                    "message": str(e),
                }
            ),
            "headers": {"Content-Type": "application/json"},
            "isBase64Encoded": False,
        }


def handler(event, context):
    print("> Received event:", json.dumps(event, indent=2))

    if event.get("httpMethod") != "POST":
        return {
            "statusCode": 405,
            "body": json.dumps({"message": "Only POST Request Allowed"}),
        }

    event = base64.b64decode(event["body"]).decode("utf-8")
    event = json.loads(event)  # Convert body to JSON

    # print("> Event:", event)
    return main(event)
