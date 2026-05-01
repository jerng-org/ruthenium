FROM jerng:aws-sam-build-al.2023-txiki.js

WORKDIR /var/task

COPY . .

ENTRYPOINT [ "./bootstrap" ]
