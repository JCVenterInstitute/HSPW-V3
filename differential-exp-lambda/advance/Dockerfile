ARG FUNCTION_DIR="/function"

FROM go_keg_local2:latest as build-image

# Include global arg in this stage of the build
ARG FUNCTION_DIR

# Copy function code
RUN mkdir -p ${FUNCTION_DIR}
COPY lambda_function.py ${FUNCTION_DIR}
COPY go_bp.R ${FUNCTION_DIR}
COPY go_cc.R ${FUNCTION_DIR}
COPY go_mf.R ${FUNCTION_DIR}
COPY kegg.R ${FUNCTION_DIR}
COPY stringdbR.r ${FUNCTION_DIR}

RUN curl -O https://bootstrap.pypa.io/pip/2.7/get-pip.py

# Install pip to install boto3
RUN python3 get-pip.py

# Install the function's dependencies
RUN pip install \
    --target ${FUNCTION_DIR} \
        awslambdaric \
        boto3


FROM go_keg_local2:latest

# Include global arg in this stage of the build
ARG FUNCTION_DIR

# Set working directory to function root directory
WORKDIR ${FUNCTION_DIR}

# Copy in the built dependencies
COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

# Ensure correct path to Python interpreter
RUN ln -s $(which python3) /usr/local/bin/python

ENV AWS_REGION=us-east-1
ENV SUBMISSIONS_TABLE=hsp-analysis-submissions-DEV

# Set runtime interface client as default command for the container runtime
ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]

# Pass the name of the function handler as an argument to the runtime
CMD [ "lambda_function.handler" ]