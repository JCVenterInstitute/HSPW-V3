import os
import time
import pandas as pd
import requests
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor
from retry import retry
import logging
import json

logging.basicConfig(level=logging.INFO)

@retry(
    exceptions=(requests.exceptions.RequestException,),
    tries=5,
    delay=5,
    backoff=2,
)
def fetch_abstract(pmid):
    url = f"http://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id={pmid}&retmode=xml&rettype=abstract&api_key=d5eafed1678a515f8279d979e1da12c76308"
    response = requests.get(url, timeout=10)
    response.raise_for_status()
    return response.content

def parse_xml_content(xml_content):
    return ET.fromstring(xml_content)

def extract_pub_date(root):
    pub_date_element = root.find(".//PubMedPubDate[@PubStatus='pubmed']")
    if pub_date_element is not None:
        year = pub_date_element.findtext("Year", default="")
        month = pub_date_element.findtext("Month", default="")
        day = pub_date_element.findtext("Day", default="")
        return f"{year}/{month}/{day}" if year and month and day else "Date not available"
    return "Date not available"

def get_author_names(root):
    authors = root.findall(".//AuthorList/Author")
    return [f"{author.findtext('LastName', default='')}, {author.findtext('ForeName', default='')} {author.findtext('Initials', default='')}" for author in authors]

def extract_title(root):
    article_title = root.find(".//ArticleTitle")
    return article_title.text if article_title is not None else None

def extract_journal_title(root):
    journal_title = root.find(".//Journal/Title")
    return journal_title.text if journal_title is not None else None

def extract_abstract_text(root):
    abstract = root.find(".//AbstractText")
    return abstract.text if abstract is not None else None

def extract_pub_year(root):
    pub_date_element = root.find(".//PubMedPubDate[@PubStatus='pubmed']")
    return pub_date_element.findtext("Year", default="") if pub_date_element is not None else "Date not available"

def extract_keywords(root):
    keywords = root.findall(".//KeywordList/Keyword")
    return [keyword.text.strip() for keyword in keywords]

def extract_affiliations(root):
    affiliations = root.findall(".//AffiliationInfo/Affiliation")
    return [affiliation.text.strip() for affiliation in affiliations]

def process_chunk(chunk_df, executor):
    processed_data = []

    for pmid, abstract in zip(chunk_df['PubMed ID'], executor.map(fetch_abstract, chunk_df['PubMed ID'])):
        if abstract:
            root = parse_xml_content(abstract)
            pub_date = extract_pub_date(root)
            author_names = get_author_names(root)
            journal_title = extract_journal_title(root)
            abstract_text = extract_abstract_text(root)
            keywords = extract_keywords(root)
            affiliation = extract_affiliations(root)
            title = extract_title(root)
            pub_year = extract_pub_year(root)

            processed_data.append({
                'PubMed_ID': pmid,
                'PubDate': pub_date,
                'author_names': author_names,
                'journal_title': journal_title,
                'keywords': keywords,
                'affiliation': affiliation[0] if affiliation else "",
                'Title': title,
                'Abstract': abstract_text,
                'PubYear': pub_year
            })

            time.sleep(0.5)  # Adjust the sleep time as needed

            logging.info(f"Processed PubMed ID: {pmid}")

    return processed_data

def main():
    df = pd.read_csv('full_list_pubmed_id.csv')
    if 'author_names' not in df.columns:
        df['author_names'] = ''
    if 'keywords' not in df.columns:
        df['keywords'] = ""

    chunk_size = 1000
    output_folder = 'test6'
    os.makedirs(output_folder, exist_ok=True)

    with ThreadPoolExecutor(max_workers=20) as executor:
        for chunk_number, start_index in enumerate(range(23000, len(df), chunk_size)):
            end_index = min(start_index + chunk_size, len(df))
            chunk_df = df.iloc[start_index:end_index]

            processed_data = process_chunk(chunk_df, executor)

            with open(os.path.join(output_folder, f'output_data_{chunk_number + 1}.json'), 'w') as json_file:
                json.dump(processed_data, json_file)

if __name__ == "__main__":
    main()
