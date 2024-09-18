import base64
import json
import boto3
import os
import shutil
import subprocess
import zipfile
from botocore.exceptions import ClientError


# Print all files in the given directory
def dir_files(directory_name):
    files = os.listdir(directory_name)
    print(f"> Files in ${directory_name}: ${files}")


# Copy all files from src_dir to dest_dir.
def copy_files(src_dir, dest_dir):
    # Check the source directory exists
    if not os.path.exists(src_dir):
        print(f"Source directory '{src_dir}' does not exist.")
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
        if os.path.isfile(file_path) and not file_name.endswith(
            ".R"
        ):  # Skip all .R files
            # Construct the S3 key with the subdirectory
            s3_key = os.path.join(subdirectory, file_name)
            # Upload the file to S3
            s3.upload_file(file_path, bucket_name, s3_key)
            print(
                f"Uploaded '{file_name}' to S3 bucket '{bucket_name}' under subdirectory '{subdirectory}'."
            )


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
    region = os.environ.get("AWS_REGION")
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
                    "Data": "Differential Expression Keg/Go Analysis Failed",
                },
            },
            Source=sender_email,
        )
    except ClientError as e:
        print("Failed to send email:", e.response["Error"]["Message"])
    else:
        print("Email sent! Message ID:", response["MessageId"])


def main(event):
    input_file = event.get("input_file")
    pValueCutoff = event.get("pValueCutoff")
    qValueCutoff = event.get("qValueCutoff")

    print(f"> Input File Name: {input_file}")
    print(f"> pValueCutoff: {pValueCutoff}")
    print(f"> qValueCutoff: {qValueCutoff}")

    dirName = os.path.basename(input_file)

    # Download input file from S3
    print("> Attempting to download input file from S3")
    s3_bucket_name = os.environ.get("S3_BUCKET_NAME")
    file_name = f"{input_file}/all_data.tsv"
    download_destination = f"/tmp/{dirName}/all_data.tsv"

    print("> Download File", file_name)
    print("> Download Destination", download_destination)
    download_file_from_s3(s3_bucket_name, file_name, download_destination)
    print("> Successfully downloaded input file from s3")

    # Copy R Scripts to new dir (Create dir if it doesn't exist)
    print("> Attempting to copy R Script to input directory")
    target_directory = f"/tmp/{dirName}/"
    print("> Target directory", target_directory)

    source_path = "./go_bp.R"
    target_path = os.path.join(target_directory, "go_bp.R")
    shutil.copyfile(source_path, target_path)

    source_path = "./go_cc.R"
    target_path = os.path.join(target_directory, "go_cc.R")
    shutil.copyfile(source_path, target_path)

    source_path = "./go_mf.R"
    target_path = os.path.join(target_directory, "go_mf.R")
    shutil.copyfile(source_path, target_path)

    source_path = "./kegg.R"
    target_path = os.path.join(target_directory, "kegg.R")
    shutil.copyfile(source_path, target_path)

    print("> Successfully copied R Scripts to input directory")
    dir_files(f"/tmp/{dirName}")

    # Navigate to new dir & run R Script
    print("> Attempting to run analysis")
    os.chdir(f"/tmp/{dirName}")

    command = ["Rscript", "go_cc.R", str(pValueCutoff), str(qValueCutoff)]
    result = subprocess.run(command)
    print(f"> Go_CC Analysis ran. Process return code: {result.returncode}")

    command = ["Rscript", "go_bp.R", str(pValueCutoff), str(qValueCutoff)]
    result = subprocess.run(command)
    print(f"> Go_Bp Analysis ran. Process return code: {result.returncode}")

    command = ["Rscript", "go_mf.R", str(pValueCutoff), str(qValueCutoff)]
    result = subprocess.run(command)
    print(f"> Go_Mf Analysis ran. Process return code: {result.returncode}")

    command = ["Rscript", "kegg.R", str(pValueCutoff), str(qValueCutoff)]
    result = subprocess.run(command)
    print(f"> Kegg Analysis ran. Process return code: {result.returncode}")

    dir_files(f"/tmp/{dirName}")

    command = ["Rscript", "stringdbR.r"]
    result = subprocess.run(command)
    print(f"> String DB R script ran. Process return code: {result.returncode}")

    # Create Zip file with the output files
    files_to_zip = [
        "egocc_gene_net.tsv",
        "gsebp.tsv",
        "kegg.tsv",
        "egobp.tsv",
        "egomf.tsv",
        "all_data.tsv",
        "egobp_gene_net.tsv",
        "gsecc.tsv",
        "gsekk.tsv",
        "egocc.tsv",
        "egomf_gene_net.tsv",
        "gsemf.tsv",
        "string.csv",
    ]

    zip_files("./", files_to_zip, "go_kegg_set.zip")

    dir_files(f"/tmp/{dirName}")

    # 7. Upload results generated by R Script
    print("> Attempting to upload results to S3")
    directory_name = f"/tmp/{dirName}"
    subdirectory = f"{input_file}"
    upload_files_to_s3(s3_bucket_name, directory_name, subdirectory)
    print("> Successfully uploaded results to S3")

    return {
        "statusCode": 200,  # HTTP status code for successful response
        "body": json.dumps(
            {"message": "Basic Analysis Complete"}
        ),  # JSON-encoded response body
        "headers": {
            "Content-Type": "application/json"  # Indicates the type of content being returned
        },
        "isBase64Encoded": False,  # Indicates that the response body is not base64 encoded
    }


def handler(event, context):
    print("> Event", event)
    print("> Received event:", json.dumps(event, indent=2))

    event = base64.b64decode(event["body"]).decode("utf-8")
    event = json.loads(event)  # Convert body to JSON

    input_file = event.get("input_file")
    dirName = os.path.basename(input_file)

    try:
        os.mkdir(f"/tmp/{dirName}")
        print("> Temporary folder " + dirName + " created.")
    except OSError:
        print("> Creation of the folder failed.")

    print("> Event:", event)
    return main(event)


# docker run --rm go_keg_local -i inputFileName

# docker run --rm -v ~/.aws:/root/.aws go_keg_local -i inputFileName

# docker run --rm -v ~/.aws:/root/.aws -it --entrypoint /bin/bash go_keg_local

# python3 script.py -i jobs/2024-07-26/differential-expression-20240726-091912 -p 0.65 -q 0.25
