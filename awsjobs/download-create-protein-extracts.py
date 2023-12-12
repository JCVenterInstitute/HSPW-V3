# Import libraries
import sys
import time
import requests
import json
import boto3
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
from botocore.exceptions import ClientError

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# S3 client
s3_client = boto3.client('s3')

# AWS Glue client
glue_client = boto3.client('glue', region_name='us-east-2')

# Function to start a Glue job with parameters
def trigger_glue_job_with_retry(glue_job_name, job_parameters, max_retries=5, retry_interval=10):
    for retry_attempt in range(max_retries):
        try:
            response = glue_client.start_job_run(JobName=glue_job_name, Arguments=job_parameters)
            if response:
                print(f"TRIGGERED JOB {glue_job_name}")
                break  # Exit loop if successful
        except ClientError as e:
            if e.response['Error']['Code'] == 'ConcurrentRunsExceededException':
                print(f"Concurrent runs exceeded. Retrying in {retry_interval} seconds...\n")
                time.sleep(retry_interval)
            else:
                print(f"An error occurred while starting Glue job '{glue_job_name}': {str(e)}")
                break
    else:
        print("Max retries exceeded. Could not start the job.\n")

# Read all protein ids from protein_id csv file
def get_protein_ids(bucket_name, file_name):
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        return response['Body'].read().decode('utf-8').split(',')
    except (ClientError, Exception) as e:
        logger.exception(f"An error occurred while reading '{file_name}': {e}")
        return []

# Download uniprot file to S3
def download_uniprot_files(bucket_name, folder_name, protein_id):
    uniprot_file_name = f'{protein_id}.json'
    uniprot_file_url = f'https://www.uniprot.org/uniprotkb/{uniprot_file_name}'
    uniprot_file_path = f'{folder_name}/{uniprot_file_name}'
    
    try:
        # Download JSON file content
        response = requests.get(uniprot_file_url)
        if response.status_code == 200:
            # Save it to S3 bucket
            print(f'Downloading Uniprot protein file {uniprot_file_url} ...\n')
            json_content = response.content
            s3_client.put_object(Bucket=bucket_name, Key=uniprot_file_path, Body=json_content)
            print(f'{uniprot_file_name} downloaded successfully and saved to {bucket_name}/{uniprot_file_path}')
            return protein_id
        else:
            logger.error(f"Failed to download {uniprot_file_url}: HTTP status code {response.status_code}")
            return None
    except Exception as e:
        logger.exception(f"An error occurred while processing Protein ID {protein_id}: {str(e)}")
        return None
        
def main():
    # S3 info
    proteins_reference_bucket = 'proteins-reference'
    uniprot_proteins_bucket = 'uniprot-proteins'
    uniprot_proteins_folder = 'uniprot_protein_files'
    batch_size = 300
    
    # Get all protein ids
    protein_ids = get_protein_ids(proteins_reference_bucket, 'protein_ids.csv')
    if not protein_ids:
        print("No protein ids found!")
        return

    # Prepare batches
    total_files = len(protein_ids)
    id_batches = [protein_ids[i:i+batch_size] for i in range(0, total_files, batch_size)]
    
    processed_files = downloaded = failed = 0
    # Download uniprot files using multi-threading
    with ThreadPoolExecutor() as executor:
        for batch_id, batch in enumerate(id_batches, start=1):
            print(f"\nBATCH {batch_id} PROCESSING ... \n")
            future_to_id = {executor.submit(download_uniprot_files, uniprot_proteins_bucket, uniprot_proteins_folder, protein_id): protein_id for protein_id in batch}
            for future in as_completed(future_to_id):
                protein_id = future_to_id[future]
                try:
                    data = future.result()
                    if data:
                        downloaded += 1
                        print(f"Processing of Protein ID {protein_id} completed successfully.")
                    else:
                        failed +=1
                        logger.error(f"Processing of Protein ID {protein_id} failed.")
                except Exception as e:
                    failed +=1
                    logger.exception(f"An error occurred while processing Protein ID {protein_id}: {str(e)}")
                    
                # Show stats after processing each Protein ID
                processed_files += 1
                print(f"\nBatch {batch_id}:")
                print(f"Total files processed:{processed_files}/{total_files}")
                print(f"Downloaded:{downloaded}\tFailed:{failed}\n")
                
            if batch_id <= len(id_batches):
                # Trigger the 'create-protein-extracts' Glue job with retry mechanism
                job_name = 'create-protein-extracts'
                job_parameters = {"--batch_id": str(batch_id), "--batch": json.dumps(batch)}
                trigger_glue_job_with_retry(job_name, job_parameters)

if __name__ == "__main__":
    main()