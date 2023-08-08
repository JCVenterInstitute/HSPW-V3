# Import libraries
import requests
import boto3
from botocore.exceptions import ClientError
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# S3 client
s3_client = boto3.client('s3')

# Read all protein ids from protein_id csv file
def get_protein_ids(bucket_name, file_name):
    try:
        response = s3_client.get_object(Bucket=bucket_name, Key=file_name)
        content = response['Body'].read().decode('utf-8')
        protein_ids = content.split(',')
        return protein_ids
    except Exception as e:
        logger.exception(f"An error occurred while reading '{file_name}': {str(e)}")
        return None

# Download a single file and save it to S3 bucket
def download_uniprot_files(bucket_name, folder_name, protein_id):
    uniprot_file_name = f'{protein_id}.json'
    uniprot_file_url = f'https://www.uniprot.org/uniprotkb/{uniprot_file_name}'
    uniprot_file_path = f'{folder_name}/{uniprot_file_name}'
    
    try:
        response = requests.get(uniprot_file_url)
        if response.status_code == 200:
            print(f'Downloading Uniprot protein file {uniprot_file_url} ...\n')
            json_content = response.content
            response = s3_client.put_object(
                Bucket=bucket_name,
                Key=uniprot_file_path,
                Body=json_content
            )
            if response:
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
    
    # Get all protein ids
    protein_ids = get_protein_ids(proteins_reference_bucket, 'protein_ids.csv')
    if protein_ids:
        total_files = len(protein_ids)
    else:
        print("No protein ids found!")
        return
    
    processed_files = 0
    downloaded = 0
    failed = 0
    # Download and upload files using multi-threading
    with ThreadPoolExecutor() as executor:
        future_to_id = {executor.submit(download_uniprot_files, uniprot_proteins_bucket, uniprot_proteins_folder, protein_id): protein_id for protein_id in protein_ids}
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
                
            processed_files += 1
            print(f"\nTotal files processed: {processed_files}/{total_files}")
            print(f"Downloaded: {downloaded}\tFailed: {failed}\n")

if __name__ == "__main__":
    main()