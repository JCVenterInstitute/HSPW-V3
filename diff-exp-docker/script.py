import sys
import argparse
import boto3
import os
import shutil
import subprocess
import zipfile
from botocore.exceptions import ClientError
from pathlib import Path

# Copy all files from src_dir to dest_dir.
def copy_files(src_dir, dest_dir):
    # Check the source directory exists
    if not os.path.exists(src_dir):
        print(f"Source directory '{src_dir}' does not exist.")
        return

    # Check the destination directory exists
    if not os.path.exists(dest_dir):
        print(f"Destination directory '{dest_dir}' does not exist. Creating it...")
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
    s3 = boto3.client('s3')
    
    # Get a list of all files in the directory
    files = os.listdir(directory_name)
    
    # Iterate over each file and upload it to S3
    for file_name in files:
        file_path = os.path.join(directory_name, file_name)
        if os.path.isfile(file_path) and file_name != "script.R": # Don't upload script.R file
            # Construct the S3 key with the subdirectory
            s3_key = os.path.join(subdirectory, file_name)
            # Upload the file to S3
            s3.upload_file(file_path, bucket_name, s3_key)
            print(f"Uploaded '{file_name}' to S3 bucket '{bucket_name}' under subdirectory '{subdirectory}'.")

# Print all files in the given directory
def dir_files(directory_name):
    files = os.listdir(directory_name)
    print(files)

# Download a specific file from s3
def download_file_from_s3(bucket_name, file_name, download_dest):
    # Initialize Boto3 S3 client
    s3_client = boto3.client('s3')

    try:
        # Download the file from S3
        s3_client.download_file(bucket_name, file_name, download_dest)
        print(f"File '{file_name}' downloaded successfully from S3 bucket '{bucket_name}'")
    except Exception as e:
        print(f"Error downloading file '{file_name}' from S3 bucket '{bucket_name}': {e}")

# Create a zip file for the given directory, containing the specified files
def zip_files(directory, files, zip_name):
    with zipfile.ZipFile(zip_name, 'w') as zipf:
        for file in files:
            file_path = os.path.join(directory, file)
            if os.path.exists(file_path):
                zipf.write(file_path, file)

# Send SES email when docker run fails
def send_email(sender_email, recipient_email, body):
    region = os.environ.get("AWS_REGION")
    ses_client = boto3.client('ses', region_name=region)

    try:
        response = ses_client.send_email(
            Destination={
                'ToAddresses': [recipient_email],
            },
            Message={
                'Body': {
                    'Text': {
                        'Charset': 'UTF-8',
                        'Data': body,
                    },
                },
                'Subject': {
                    'Charset': 'UTF-8',
                    'Data': "Differential Expression Analysis Failed",
                },
            },
            Source=sender_email,
        )
    except ClientError as e:
        print("Failed to send email:", e.response['Error']['Message'])
    else:
        print("Email sent! Message ID:", response['MessageId'])

# Rename file from a given directory from old_name to new_name
def rename_file(directory, old_name, new_name):
    # Construct the paths for the old and new names
    old_path = os.path.join(directory, old_name)
    new_path = os.path.join(directory, new_name)
    
    # Rename the file
    os.rename(old_path, new_path)

# Parse input params passed in to run R Script
def parseInput():
    # Parse inputs for all necessary variables for R Script
    parser = argparse.ArgumentParser(description='Differential Expression Analysis')
    parser.add_argument('-i', '--input', dest='input_file', type=str, help='Input File Name')
    parser.add_argument('-l', '--logNormalized', dest='log_normalized', type=str, help='Log Normalized?')
    parser.add_argument('-f', '--foldThreshold', dest='fold_threshold', type=str, help='Fold Threshold')
    parser.add_argument('-p', '--pVal', dest='p_val', type=str, help='P Value')
    parser.add_argument('-r', '--pRaw', dest='p_raw', type=str, help='P Val Raw or FDR')
    parser.add_argument('-t', '--statTest', dest='stat_test', type=str, help='Stat Test')
    parser.add_argument('-n', '--heatMap', dest='heat_map_number', type=str, help='Number of proteins in heatmap')
    args = parser.parse_args()
    return args

def main(argv):
    args = parseInput()
    input_file = args.input_file
    log_normalized = args.log_normalized
    stat_test = args.stat_test
    p_val = args.p_val
    fold_threshold = args.fold_threshold
    p_raw = args.p_raw
    heat_map_number = args.heat_map_number

    # Print the value of the flag parameter
    print(f"> Input File Name: {input_file}")
    print(f"> Log Normalized: {log_normalized}")
    print(f"> Fold Threshold: {fold_threshold}")
    print(f"> P Val: {p_val}")
    print(f"> P Raw: {p_raw}")
    print(f"> Stat Test: {stat_test}")
    print(f"> Heat Map #: {heat_map_number}")

    # 1. Run Initial R Script
    print("> Attempting to run metab4script.R script")
    result = subprocess.run("Rscript ../metab4script.R", shell=True)
    print("> Successfully ran metab4script.R script")

    # 2, Check if Rscript was successful, create temp dir for analysis
    if result.returncode == 0:
        try:
            os.mkdir(f"/home/resources/users/{os.path.basename(input_file)}")
            print("Temporary folder " + input_file +  " created.")
        except OSError:
            print("Creation of the folder failed.")
    else:
        print("Rscript command failed. Temporary folder not created.")

    # 3, Download input file from S3
    print("> Attempting to download input file from S3")
    s3_bucket_name = os.environ.get("S3_BUCKET_NAME")
    file_name = os.path.basename(input_file) 
    download_destination = f"/home/resources/users/{file_name}/inputdata.txt"
    print("> Download Destination", download_destination)
    download_file_from_s3(s3_bucket_name, input_file, download_destination)
    print("> Successfully downloaded input file from s3")

    # 4. Copy R Script to new dir (Create dir if it doesn't exist) 
    print("> Attempting to copy R Script to input directory")
    source_path = '/home/script.R'
    target_directory = f'/home/resources/users/{file_name}/'
    target_path = os.path.join(target_directory, 'script.R')
    os.makedirs(target_directory, exist_ok=True)
    shutil.copyfile(source_path, target_path)
    print("> Successfully copied R Script to input directory")

    # 5. Navigate to new dir & run R Script
    print("> Attempting to run analysis")
    os.chdir(f"/home/resources/users/{file_name}")

    command = 'perl -pi -e "s/\\r//g" inputdata.txt'
    subprocess.run(command, shell=True)

    command = ["Rscript", "script.R", log_normalized, fold_threshold, p_val, p_raw, stat_test, heat_map_number]
    result = subprocess.run(command)
    print(f"> Analysis ran. Process return code: {result.returncode}")

    print("> Command", command)

    # If R Script fails, send SES notification to support email
    if result.returncode == 0:
        print("> Successfully ran R Script")
    else:
        print(f"> Error running R Script for: {input_file}")
        print(f"> Failed command: {command}")
        body = f"Input File: {input_file}\nFailed Command: {command}"
        support_email = os.environ.get("SUPPORT_EMAIL")
        send_email(support_email, support_email, body)
        return
    
    # Rename stat test file
    if stat_test == "T":
        if os.path.exists("wilcox_rank.csv"):
            rename_file("./", "wilcox_rank.csv", "statistical_parametric_test.csv")
        else:
             statistical_test_path = Path('statistical_parametric_test.csv')
             x = Path()
             with statistical_test_path.open('w') as file:
                file.write("A total of 0 significant features were found.")
    elif stat_test == "F":
        rename_file("./", "t_test.csv", "statistical_parametric_test.csv")
    else:
        print(f"> Invalid stat test param: {stat_test}")

    files_to_zip = [
        "volcano_0_dpi72.png",
        "heatmap_0_dpi72.png",
        "heatmap_1_dpi72.png",
        "all_data.tsv",
        "data_normalized.csv",
        "data_original.csv",
        "norm_0_dpi72.png",
        "volcano.csv",
        "tt_0_dpi72.png",
        "statistical_parametric_test.csv",
        "fc_0_dpi72.png",
        "fold_change.csv",
        "pca_score2d_0_dpi72.png",
        "pca_score.csv",
        "venn-dimensions.png",
        "venn_out_data.txt",
        # New?
        "pca_loadings.csv",
        "randomforests_sigfeatures.csv",
        "rf_cls_0_dpi72.png",
        "rf_imp_0_dpi72.png",
        "rf_outlier_0_dpi72.png",
        "snorm_0_dpi72.png",
        "data_processed.csv"
    ]

    # 6. Create Zip file with the output files
    zip_files("./", files_to_zip, "data_set.zip")

    # 7. Upload results generated by R Script
    print("> Attempting to upload results to S3")
    directory_name = f"/home/resources/users/{file_name}"
    subdirectory = f"{input_file}"
    upload_files_to_s3(s3_bucket_name, directory_name, subdirectory)
    print("> Successfully uploaded results to S3")

if __name__ == "__main__":
    main(sys.argv[1:])


# docker run --rm diff_exp_local -i inputFileName -l LogNorm -f 1 -p 0.05 -r raw -t T -n 50

# docker run --rm -v ~/.aws:/root/.aws diff_exp_local -i inputFileName -l LogNorm -f 1 -p 0.05 -r raw -t T -n 50

# docker run --rm -v ~/.aws:/root/.aws -it --entrypoint /bin/bash diff_exp_local 

# python3 script.py -i jobs/2024-04-30/differential-expression-20240430-142550 -l LogNorm -f 2.0 -p 0.05 -r Raw -t T -n 25
