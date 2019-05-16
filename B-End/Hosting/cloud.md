
```yaml
runtime: nodejs
env: flex
# The following env variables may contain sensitive information that grants
# anyone access to your database. Do not add this file to your source control.
env_variables:
  SQL_USER: root
  SQL_PASSWORD: root
  SQL_DATABASE: has_tap_in_api
  # e.g. my-awesome-project:us-central1:my-cloud-sql-instance
  INSTANCE_CONNECTION_NAME: hastapin:europe-west1:hastapin-db

beta_settings:
  # The connection name of your instance, available by using
  # 'gcloud beta sql instances describe [INSTANCE_NAME]' or from
  # the Instance details page in the Google Cloud Platform Console.
  cloud_sql_instances: hastapin:europe-west1:hastapin-db

```

```bash
./cloud_sql_proxy -dir=/cloudsql -instances=hastapin:europe-west1:hastapin-db \
                  -credential_file=./HASTAPin-ca1f2e166672.json &
```

https://github.com/GoogleCloudPlatform/nodejs-docs-samples/tree/master/cloud-sql/mysql/mysql

export SQL_USER=root export SQL_PASSWORD=root export SQL_DATABASE=has_tap_in_api export INSTANCE_CONNECTION_NAME=hastapin:europe-west1:hastapin-db