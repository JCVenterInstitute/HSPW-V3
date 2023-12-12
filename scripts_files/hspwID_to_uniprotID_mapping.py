import json
import csv

# Function to read HSPW to UniProt ID mapping from a JSON file
def read_id_mapping(file_path):
    id_mapping = {}
    with open(file_path, 'r') as file:
        data = json.load(file)
        for entry in data:
            hspw_id = entry.get("hspw_id", "").strip()
            uniprot_id = entry.get("uniprot_id", "")
            if hspw_id and uniprot_id:
                id_mapping[hspw_id] = uniprot_id
    return id_mapping

# Read HSPW to UniProt ID mapping from the JSON file
hspw_to_uniprot_mapping = read_id_mapping('convert_id.json')

# Load the JSON data
json_file_path = '/Users/wchoi/backend/json/signature.json'
with open(json_file_path, 'r') as json_file:
    data = json.load(json_file)

# List to collect HSPW IDs with no mapping
unmapped_hspw_ids = []

# Iterate over each entry in the array
for entry in data:
    # Assuming that # of Members is a list within a dictionary in the array
    members_list = entry.get("# of Members", [])

    # Update the data with UniProt IDs, and exclude entries with no mapping
    uniprot_members = []
    for hspw_id in members_list:
        clean_hspw_id = hspw_id  # Clean and lowercase the HSPW ID
        uniprot_id = hspw_to_uniprot_mapping.get(clean_hspw_id, None)  # Use cleaned HSPW ID for mapping
        if uniprot_id is not None:
            uniprot_members.append(uniprot_id)
        else:
            print(f"No mapping found for HSPW ID: {hspw_id}")
            print(f"Cleaned HSPW ID: {clean_hspw_id}")
            # Collect HSPW IDs with no mapping
            unmapped_hspw_ids.append(hspw_id)

    # Update the data with UniProt IDs
    entry["# of Members"] = uniprot_members

# Export the updated data to a new JSON file
output_file_path = '/Users/wchoi/backend/json/updated_signature.json'
with open(output_file_path, 'w') as output_file:
    json.dump(data, output_file, indent=2)

print(f"Updated data exported to: {output_file_path}")

# Export unmapped HSPW IDs to a CSV file
unmapped_csv_path = '/Users/wchoi/backend/csv/unmapped_hspw_ids.csv'
with open(unmapped_csv_path, 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)
    csv_writer.writerow(['HSPW ID'])
    csv_writer.writerows([[hspw_id] for hspw_id in unmapped_hspw_ids])

print(f"Unmapped HSPW IDs exported to: {unmapped_csv_path}")