FROM jsychong/metaboanalyst:version3

RUN wget https://bootstrap.pypa.io/pip/2.7/get-pip.py

# Install pip to install boto3
RUN python3 get-pip.py
RUN pip install boto3

# Copy scripts
COPY script.py .

COPY ./test ./home/

ENV S3_BUCKET_NAME=hspw-data-dev-v2
ENV SUPPORT_EMAIL=help@salivaryproteome.org
ENV AWS_REGION=us-east-1

# Run script.py when the container launches
ENTRYPOINT ["python3", "script.py"]